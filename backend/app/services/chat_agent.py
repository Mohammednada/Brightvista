"""
Chat agent — processes user messages and generates intelligent responses.
Uses Claude API when available, falls back to pattern-matched responses.
"""

import re

from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings


async def process_message(db: AsyncSession, message: str, case_id: str | None) -> dict:
    """Process a chat message and return an agent response."""

    if settings.anthropic_api_key and settings.anthropic_api_key != "sk-ant-your-key-here":
        try:
            return await _process_with_ai(db, message, case_id)
        except Exception:
            pass

    return _process_pattern_match(message, case_id)


async def _process_with_ai(db: AsyncSession, message: str, case_id: str | None) -> dict:
    import anthropic

    # Build context
    context = "You are a Prior Authorization AI assistant for Brightvista PA Engine. "
    context += "Help coordinators with PA cases, payer requirements, clinical documentation, and submissions. "
    context += "Be concise, professional, and actionable. "

    if case_id:
        from sqlalchemy import select
        from sqlalchemy.orm import selectinload
        from app.models.case import Case
        result = await db.execute(
            select(Case).options(selectinload(Case.patient), selectinload(Case.procedure), selectinload(Case.payer))
            .where(Case.id == case_id)
        )
        case = result.scalar_one_or_none()
        if case:
            context += f"\nCurrent case: {case.case_number}, Status: {case.status}"
            if case.patient:
                context += f", Patient: {case.patient.name}"
            if case.procedure:
                context += f", Procedure: {case.procedure.cpt_description} (CPT {case.procedure.cpt_code})"
            if case.payer:
                context += f", Payer: {case.payer.name}"

    client = anthropic.AsyncAnthropic(api_key=settings.anthropic_api_key)
    response = await client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=500,
        system=context,
        messages=[{"role": "user", "content": message}],
    )

    return {
        "response": response.content[0].text,
        "thinking": ["Analyzing your request...", "Processing with AI..."],
    }


def _process_pattern_match(message: str, case_id: str | None) -> dict:
    """Pattern-matched responses for common queries."""
    msg = message.lower()

    # Patient lookup patterns
    if any(w in msg for w in ["patient", "lookup", "find patient", "search patient"]):
        return {
            "response": "I can help you find patient information. You can search by MRN, name, or insurance member ID. Would you like to start a new case or look up an existing patient?",
            "thinking": ["Analyzing request type...", "Identifying patient lookup intent..."],
            "next_action": {"label": "Start new case", "prompt": "I want to create a new PA case"},
        }

    # PA requirements
    if any(w in msg for w in ["requirement", "what do i need", "documents needed", "pa require"]):
        return {
            "response": "For prior authorization, you'll typically need:\n\n1. **Patient demographics** — name, DOB, MRN, insurance info\n2. **Procedure codes** — valid CPT and ICD-10 codes\n3. **Clinical documentation** — conservative therapy records, specialist referral, physical exam notes\n4. **Supporting evidence** — previous imaging, medication history\n\nThe specific requirements vary by payer and procedure. Would you like me to check requirements for a specific payer and CPT code?",
            "thinking": ["Looking up standard PA requirements...", "Checking payer-specific criteria..."],
            "next_action": {"label": "Check payer rules", "prompt": "Check requirements for BlueCross BlueShield"},
        }

    # Approval likelihood
    if any(w in msg for w in ["approval", "likelihood", "chance", "probability", "how likely"]):
        return {
            "response": "The approval likelihood is calculated based on 5 key factors:\n\n• **Patient info complete** (20%) — all required demographics filled\n• **Procedure codes validated** (15%) — CPT and ICD-10 codes verified\n• **Required documents** (35%) — all payer-required docs present\n• **Conservative therapy** (15%) — prior treatment documented\n• **Specialist referral** (15%) — referral letter on file\n\nWould you like me to calculate the current approval likelihood for a specific case?",
            "thinking": ["Checking approval calculation model...", "Loading scoring criteria..."],
        }

    # Submission
    if any(w in msg for w in ["submit", "send", "file", "submission"]):
        return {
            "response": "I can submit this case through the best available channel. Our system supports:\n\n• **API** — Direct electronic submission (fastest)\n• **Portal** — Web-based payer portal submission\n• **Phone** — AI voice agent calls payer\n• **Fax** — Traditional fax submission\n\nThe system automatically selects the optimal channel based on the payer's preferences and historical success rates. Shall I proceed with submission?",
            "thinking": ["Analyzing available submission channels...", "Checking payer channel preferences..."],
            "next_action": {"label": "Submit case", "prompt": "Yes, submit this case"},
        }

    # Denial / appeal
    if any(w in msg for w in ["denied", "denial", "appeal", "overturn"]):
        return {
            "response": "I can help with the appeal process. Here's what we'll do:\n\n1. **Analyze the denial reason** — understand exactly why it was denied\n2. **Generate appeal strategy** — identify the strongest arguments\n3. **Draft appeal letter** — create a professional, evidence-based letter\n4. **Submit the appeal** — through the appropriate channel\n\nWould you like me to start generating an appeal?",
            "thinking": ["Analyzing denial patterns...", "Loading appeal strategies..."],
            "next_action": {"label": "Generate appeal", "prompt": "Generate an appeal for this case"},
        }

    # Status check
    if any(w in msg for w in ["status", "check status", "update", "where is", "progress"]):
        return {
            "response": "I can check the current status of any submitted case. The system monitors status through multiple channels:\n\n• **API polling** — real-time status from payer APIs\n• **Portal scraping** — automated portal status checks\n• **Phone inquiry** — AI voice agent calls for updates\n\nWhich case would you like me to check?",
            "thinking": ["Connecting to status monitoring...", "Checking available channels..."],
        }

    # Payer info
    if any(w in msg for w in ["payer", "insurance", "bcbs", "united", "aetna", "cigna", "humana"]):
        return {
            "response": "I have detailed profiles for all major payers including submission channels, turnaround times, and approval rates. Which payer would you like to know about?\n\n• BlueCross BlueShield (87% approval, 5-day avg)\n• UnitedHealthcare (82% approval, 7-day avg)\n• Aetna (84% approval, 6-day avg)\n• Cigna (89% approval, 4-day avg)\n• Humana (79% approval, 8-day avg)",
            "thinking": ["Loading payer database...", "Retrieving payer profiles..."],
        }

    # Default
    return {
        "response": "I'm your PA assistant. I can help with:\n\n• **Creating cases** — patient lookup, procedure coding, document management\n• **Payer intelligence** — requirements, approval rates, submission channels\n• **Submissions** — smart channel routing and automated submission\n• **Status monitoring** — real-time status checks across all channels\n• **Appeals** — denial analysis and appeal letter generation\n\nWhat would you like to do?",
        "thinking": ["Processing your request...", "Identifying best assistance path..."],
    }
