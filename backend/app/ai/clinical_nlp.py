"""
Clinical NLP — extracts structured data from clinical text using Claude API.
Falls back to rule-based extraction when API key is not configured.
"""

import re

from app.config import settings


# Common CPT codes with descriptions
CPT_LOOKUP = {
    "72141": "MRI Cervical Spine without Contrast",
    "72148": "MRI Lumbar Spine without Contrast",
    "72156": "MRI Cervical Spine with and without Contrast",
    "70553": "MRI Brain with and without Contrast",
    "27447": "Total Knee Replacement (Arthroplasty)",
    "27130": "Total Hip Replacement (Arthroplasty)",
    "22612": "Lumbar Spinal Fusion",
    "22630": "Posterior Lumbar Interbody Fusion (PLIF)",
    "29881": "Knee Arthroscopy with Meniscectomy",
    "63030": "Lumbar Laminotomy/Discectomy",
    "71260": "CT Chest with Contrast",
    "71275": "CT Angiography, Chest",
    "74177": "CT Abdomen and Pelvis with Contrast",
    "78816": "PET Scan (Whole Body)",
    "77386": "IMRT Radiation Therapy",
    "20610": "Joint Injection (Major Joint)",
    "64483": "Epidural Steroid Injection, Lumbar",
    "27446": "Unicompartmental Knee Replacement",
    "23472": "Total Shoulder Replacement",
    "49505": "Inguinal Hernia Repair",
}

ICD10_LOOKUP = {
    "M54.12": "Radiculopathy, cervical region",
    "M54.5": "Low back pain",
    "M17.11": "Primary osteoarthritis, right knee",
    "M17.12": "Primary osteoarthritis, left knee",
    "M16.11": "Primary osteoarthritis, right hip",
    "M51.16": "Intervertebral disc disorders with radiculopathy, lumbar region",
    "G43.909": "Migraine, unspecified",
    "M75.110": "Rotator cuff tear, right shoulder",
    "C34.90": "Malignant neoplasm of lung, unspecified",
    "I25.10": "Atherosclerotic heart disease",
    "M23.21": "Derangement of meniscus, right knee",
    "G89.29": "Other chronic pain",
    "M48.06": "Spinal stenosis, lumbar region",
    "M79.3": "Panniculitis, unspecified",
}


async def extract_clinical_entities(text: str) -> dict:
    """Extract CPT codes, ICD-10 codes, and clinical details from text."""

    if settings.anthropic_api_key and settings.anthropic_api_key != "sk-ant-your-key-here":
        try:
            return await _extract_with_ai(text)
        except Exception:
            pass

    return _extract_rule_based(text)


async def _extract_with_ai(text: str) -> dict:
    import anthropic

    client = anthropic.AsyncAnthropic(api_key=settings.anthropic_api_key)
    response = await client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=500,
        messages=[{
            "role": "user",
            "content": f"""Extract the following from this clinical text. Return ONLY a JSON object:
{{
  "cpt_code": "5-digit CPT code or null",
  "cpt_description": "description or null",
  "icd10_code": "ICD-10 code or null",
  "icd10_description": "description or null",
  "physician": "physician name or null",
  "procedure_type": "brief description of procedure"
}}

Text: {text}""",
        }],
    )

    import json
    return json.loads(response.content[0].text)


def _extract_rule_based(text: str) -> dict:
    """Simple regex-based extraction as fallback."""
    text_upper = text.upper()

    # Find CPT code
    cpt_match = re.search(r'\b(\d{5})\b', text)
    cpt_code = None
    cpt_desc = None
    if cpt_match:
        code = cpt_match.group(1)
        if code in CPT_LOOKUP:
            cpt_code = code
            cpt_desc = CPT_LOOKUP[code]

    # Also try matching by description
    if not cpt_code:
        for code, desc in CPT_LOOKUP.items():
            if any(word in text_upper for word in desc.upper().split()[:2]):
                cpt_code = code
                cpt_desc = desc
                break

    # Find ICD-10 code
    icd_match = re.search(r'\b([A-Z]\d{2}\.?\d{0,4})\b', text)
    icd10_code = None
    icd10_desc = None
    if icd_match:
        code = icd_match.group(1)
        if code in ICD10_LOOKUP:
            icd10_code = code
            icd10_desc = ICD10_LOOKUP[code]

    return {
        "cpt_code": cpt_code,
        "cpt_description": cpt_desc,
        "icd10_code": icd10_code,
        "icd10_description": icd10_desc,
        "physician": None,
        "procedure_type": cpt_desc,
    }


def validate_cpt(code: str) -> dict:
    """Validate a CPT code and return details."""
    desc = CPT_LOOKUP.get(code)
    pa_required = code in CPT_LOOKUP  # In prototype, all known codes require PA
    return {
        "valid": desc is not None,
        "code": code,
        "description": desc,
        "requires_pa": pa_required,
    }


def validate_icd10(code: str) -> dict:
    """Validate an ICD-10 code and return details."""
    desc = ICD10_LOOKUP.get(code)
    return {
        "valid": desc is not None,
        "code": code,
        "description": desc,
    }
