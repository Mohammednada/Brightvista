"""
Approval likelihood calculator — mirrors the frontend logic in approval-calculator.ts.

Scoring:
  - Patient completeness: +20%
  - Procedure validation: +15%
  - Required documents found: +35%
  - Conservative therapy documented: +15%
  - Specialist referral present: +15%
"""

from app.schemas.case import ApprovalFactor


def calculate_approval(case) -> tuple[int, list[ApprovalFactor]]:
    """Calculate from a Case ORM object with loaded relationships."""
    return calculate_approval_from_data(case.patient, case.procedure, case.documents)


def calculate_approval_from_data(patient, procedure, documents) -> tuple[int, list[ApprovalFactor]]:
    """Calculate approval likelihood from raw data objects."""
    factors: list[ApprovalFactor] = []

    # 1. Patient completeness (20%)
    patient_fields = ["name", "dob", "mrn", "insurance_payer", "member_id", "plan_type", "referring_physician"]
    if patient:
        filled = sum(1 for f in patient_fields if getattr(patient, f, None))
        patient_met = filled >= 5  # at least 5 of 7
    else:
        patient_met = False
    factors.append(ApprovalFactor(label="Patient information complete", weight=20, met=patient_met))

    # 2. Procedure validation (15%)
    if procedure:
        proc_met = bool(getattr(procedure, "cpt_valid", False) and getattr(procedure, "icd10_valid", False))
    else:
        proc_met = False
    factors.append(ApprovalFactor(label="Procedure codes validated", weight=15, met=proc_met))

    # 3. Required documents (35%)
    doc_list = list(documents) if documents else []
    required_docs = [d for d in doc_list if getattr(d, "required", True)]
    if required_docs:
        found = sum(1 for d in required_docs if getattr(d, "status", "missing") == "found")
        docs_met = found == len(required_docs)
    else:
        docs_met = False
    factors.append(ApprovalFactor(label="All required documents present", weight=35, met=docs_met))

    # 4. Conservative therapy (15%)
    conservative_met = any(
        getattr(d, "doc_key", getattr(d, "id", "")) == "conservative-therapy"
        and getattr(d, "status", "missing") == "found"
        for d in doc_list
    )
    factors.append(ApprovalFactor(label="Conservative therapy documented", weight=15, met=conservative_met))

    # 5. Specialist referral (15%)
    referral_met = any(
        getattr(d, "doc_key", getattr(d, "id", "")) == "specialist-referral"
        and getattr(d, "status", "missing") == "found"
        for d in doc_list
    )
    factors.append(ApprovalFactor(label="Specialist referral present", weight=15, met=referral_met))

    likelihood = sum(f.weight for f in factors if f.met)
    return likelihood, factors
