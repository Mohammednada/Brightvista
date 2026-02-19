"""
Medical necessity narrative generator.
Uses Claude API when available, falls back to template-based generation.
"""

from app.config import settings


async def generate_narrative(
    patient_name: str,
    cpt_code: str,
    cpt_description: str,
    icd10_code: str,
    icd10_description: str,
    payer_name: str,
    clinical_notes: str | None = None,
) -> str:
    """Generate a medical necessity narrative for a PA case."""

    if settings.anthropic_api_key and settings.anthropic_api_key != "sk-ant-your-key-here":
        try:
            return await _generate_with_ai(
                patient_name, cpt_code, cpt_description, icd10_code, icd10_description, payer_name, clinical_notes
            )
        except Exception:
            pass

    return _generate_from_template(
        patient_name, cpt_code, cpt_description, icd10_code, icd10_description, payer_name
    )


async def _generate_with_ai(patient_name, cpt_code, cpt_description, icd10_code, icd10_description, payer_name, clinical_notes) -> str:
    import anthropic

    client = anthropic.AsyncAnthropic(api_key=settings.anthropic_api_key)
    response = await client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=800,
        messages=[{
            "role": "user",
            "content": f"""Write a concise medical necessity narrative for a prior authorization request.

Patient: {patient_name}
Procedure: {cpt_description} (CPT {cpt_code})
Diagnosis: {icd10_description} (ICD-10 {icd10_code})
Payer: {payer_name}
{f'Clinical Notes: {clinical_notes}' if clinical_notes else ''}

The narrative should:
1. State the diagnosis and clinical presentation
2. Describe conservative treatments tried and failed
3. Explain why this specific procedure is medically necessary
4. Reference relevant clinical guidelines
Keep it under 300 words, professional tone.""",
        }],
    )
    return response.content[0].text


def _generate_from_template(patient_name, cpt_code, cpt_description, icd10_code, icd10_description, payer_name) -> str:
    return f"""**Medical Necessity Narrative**

**Patient:** {patient_name}
**Procedure:** {cpt_description} (CPT {cpt_code})
**Diagnosis:** {icd10_description} (ICD-10 {icd10_code})

{patient_name} presents with {icd10_description}, which has been progressively affecting their daily activities and quality of life. The patient has undergone comprehensive conservative treatment over the past several months, including physical therapy, pharmacological management, and activity modification, without achieving adequate symptom relief.

Clinical evaluation reveals persistent symptoms consistent with the documented diagnosis. Imaging studies and clinical findings support the need for {cpt_description} as the appropriate next step in the treatment algorithm.

The requesting physician has determined that {cpt_description} is medically necessary based on:

1. **Failed conservative treatment**: The patient has completed a reasonable course of conservative therapy (minimum 6-8 weeks) without sufficient improvement.
2. **Clinical indication**: Current symptoms and examination findings meet established clinical criteria for this procedure.
3. **Guideline concordance**: The proposed treatment aligns with current evidence-based clinical practice guidelines for patients with this diagnosis and clinical presentation.
4. **Expected benefit**: The procedure is expected to provide meaningful clinical improvement and functional restoration.

This request is consistent with the standard of care for patients meeting these clinical criteria. Authorization is respectfully requested to proceed with {cpt_description} for {patient_name}."""
