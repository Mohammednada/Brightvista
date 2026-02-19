"""
Appeal generator — creates appeal strategies and letters.

In prototype mode, generates realistic appeal content without calling the AI API.
Falls back to template-based generation if Anthropic key is not configured.
"""

from app.config import settings
from app.models.case import Case


async def generate_appeal(case: Case, level: int) -> dict:
    """Generate appeal strategy and letter for a denied case."""

    patient_name = case.patient.name if case.patient else "the patient"
    cpt_code = case.procedure.cpt_code if case.procedure else "N/A"
    cpt_desc = case.procedure.cpt_description if case.procedure else "the requested procedure"
    payer_name = case.payer.name if case.payer else "the payer"
    denial_reason = case.denial_reason or "Medical necessity not demonstrated"

    # Try AI generation if API key is available
    if settings.anthropic_api_key and settings.anthropic_api_key != "sk-ant-your-key-here":
        try:
            return await _generate_with_ai(case, level, patient_name, cpt_code, cpt_desc, payer_name, denial_reason)
        except Exception:
            pass  # Fall through to template

    # Template-based generation
    return _generate_from_template(level, patient_name, cpt_code, cpt_desc, payer_name, denial_reason)


async def _generate_with_ai(case, level, patient_name, cpt_code, cpt_desc, payer_name, denial_reason) -> dict:
    import anthropic

    client = anthropic.AsyncAnthropic(api_key=settings.anthropic_api_key)

    strategy_response = await client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=500,
        messages=[{
            "role": "user",
            "content": f"""Generate a brief appeal strategy (3-4 bullet points) for a Level {level} prior authorization appeal.

Patient: {patient_name}
Procedure: {cpt_desc} (CPT {cpt_code})
Payer: {payer_name}
Denial Reason: {denial_reason}

Focus on concrete, actionable steps. Be specific to the procedure and denial reason.""",
        }],
    )

    letter_response = await client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1000,
        messages=[{
            "role": "user",
            "content": f"""Write a professional Level {level} appeal letter for a prior authorization denial.

Patient: {patient_name}
Procedure: {cpt_desc} (CPT {cpt_code})
Payer: {payer_name}
Denial Reason: {denial_reason}

The letter should be formal, cite medical necessity, reference clinical guidelines, and request reconsideration. Keep it under 400 words.""",
        }],
    )

    return {
        "strategy": strategy_response.content[0].text,
        "letter": letter_response.content[0].text,
    }


def _generate_from_template(level: int, patient_name: str, cpt_code: str, cpt_desc: str, payer_name: str, denial_reason: str) -> dict:
    level_name = {1: "First-Level", 2: "Second-Level", 3: "External Review"}.get(level, f"Level {level}")

    strategy = f"""**{level_name} Appeal Strategy**

• **Challenge the denial basis**: The denial states "{denial_reason}" — gather additional clinical documentation that directly addresses this specific criterion, including recent clinical notes, imaging reports, and specialist assessments.

• **Cite clinical guidelines**: Reference relevant medical society guidelines (e.g., ACR Appropriateness Criteria for imaging, AAOS guidelines for orthopedic procedures) that support {cpt_desc} for this patient's condition.

• **Include peer-reviewed evidence**: Attach 2-3 peer-reviewed studies demonstrating the medical necessity of {cpt_desc} for patients with similar clinical presentations.

• **Request peer-to-peer review**: If this is a {"first appeal, request a peer-to-peer review between the treating physician and the payer's medical director" if level == 1 else "second or higher appeal, consider requesting an external independent review organization (IRO) evaluation"}."""

    letter = f"""Dear {payer_name} Medical Review Team,

RE: {level_name} Appeal — Prior Authorization for {cpt_desc}
Patient: {patient_name}
CPT Code: {cpt_code}

I am writing to formally appeal the denial of prior authorization for {cpt_desc} for {patient_name}. The denial rationale states: "{denial_reason}."

After careful review, we respectfully disagree with this determination. The requested procedure is medically necessary based on the following:

**Clinical Justification:**
The patient has undergone appropriate conservative treatment measures over the recommended timeframe without adequate clinical improvement. The treating physician has determined that {cpt_desc} is the appropriate next step in the patient's care plan based on clinical findings and established medical guidelines.

**Supporting Evidence:**
• Current clinical guidelines from relevant medical societies support this procedure for patients meeting the clinical criteria demonstrated by {patient_name}
• The patient's clinical presentation, including documented symptoms and functional limitations, meets the medical necessity criteria for {cpt_desc}
• Conservative treatment alternatives have been appropriately exhausted as documented in the enclosed medical records

**Enclosed Documentation:**
• Updated clinical notes from the treating physician
• Relevant imaging and diagnostic reports
• Conservative treatment history and outcomes
• Supporting clinical guidelines and literature

We request that you reconsider this denial and authorize {cpt_desc} for {patient_name}. The enclosed documentation clearly demonstrates that this procedure meets the criteria for medical necessity under the patient's current benefit plan.

Please contact our office if additional information is needed to process this appeal.

Respectfully,
[Treating Physician Name]
[Practice Name]
[Contact Information]"""

    return {"strategy": strategy, "letter": letter}
