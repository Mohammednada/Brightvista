"""
Step status deriver — mirrors the frontend logic in step-deriver.ts.

Steps: patient → procedure → documentation → review → submit → check-status → decision
"""


def derive_steps(patient, procedure, documents, case_status: str) -> list[dict]:
    """Derive step statuses based on data completion."""

    # Check patient completeness
    required_patient = ["name", "dob", "mrn", "insurance_payer", "member_id"]
    if patient:
        patient_filled = sum(1 for f in required_patient if getattr(patient, f, None))
        patient_complete = patient_filled == len(required_patient)
        patient_started = patient_filled > 0
    else:
        patient_complete = False
        patient_started = False

    # Check procedure completeness
    if procedure:
        proc_complete = bool(getattr(procedure, "cpt_valid", False) and getattr(procedure, "icd10_valid", False))
        proc_started = bool(getattr(procedure, "cpt_code", None))
    else:
        proc_complete = False
        proc_started = False

    # Check documentation completeness
    doc_list = list(documents) if documents else []
    required_docs = [d for d in doc_list if getattr(d, "required", True)]
    if required_docs:
        found_count = sum(1 for d in required_docs if getattr(d, "status", "missing") == "found")
        docs_complete = found_count == len(required_docs)
        docs_started = found_count > 0
        docs_needs_attention = not docs_complete and docs_started
    else:
        docs_complete = False
        docs_started = False
        docs_needs_attention = False

    review_ready = patient_complete and proc_complete and docs_complete
    is_submitted = case_status == "submitted"

    steps = []

    # Patient
    if is_submitted:
        steps.append({"id": "patient", "label": "Patient Info", "status": "complete"})
    elif patient_complete:
        steps.append({"id": "patient", "label": "Patient Info", "status": "complete"})
    elif patient_started:
        steps.append({"id": "patient", "label": "Patient Info", "status": "active"})
    else:
        steps.append({"id": "patient", "label": "Patient Info", "status": "active"})

    # Procedure
    if is_submitted:
        steps.append({"id": "procedure", "label": "Procedure", "status": "complete"})
    elif proc_complete:
        steps.append({"id": "procedure", "label": "Procedure", "status": "complete"})
    elif patient_complete and proc_started:
        steps.append({"id": "procedure", "label": "Procedure", "status": "active"})
    elif patient_complete:
        steps.append({"id": "procedure", "label": "Procedure", "status": "active"})
    else:
        steps.append({"id": "procedure", "label": "Procedure", "status": "pending"})

    # Documentation
    if is_submitted:
        steps.append({"id": "documentation", "label": "Documentation", "status": "complete"})
    elif docs_complete:
        steps.append({"id": "documentation", "label": "Documentation", "status": "complete"})
    elif docs_needs_attention:
        steps.append({"id": "documentation", "label": "Documentation", "status": "needs-attention", "sublabel": f"{found_count}/{len(required_docs)} docs"})
    elif proc_complete:
        steps.append({"id": "documentation", "label": "Documentation", "status": "active"})
    else:
        steps.append({"id": "documentation", "label": "Documentation", "status": "pending"})

    # Review
    if is_submitted:
        steps.append({"id": "review", "label": "Review", "status": "complete"})
    elif review_ready:
        steps.append({"id": "review", "label": "Review", "status": "active"})
    else:
        steps.append({"id": "review", "label": "Review", "status": "pending"})

    # Submit
    if is_submitted:
        steps.append({"id": "submit", "label": "Submit", "status": "complete"})
    elif review_ready:
        steps.append({"id": "submit", "label": "Submit", "status": "active"})
    else:
        steps.append({"id": "submit", "label": "Submit", "status": "pending"})

    # Check Status
    if is_submitted:
        steps.append({"id": "check-status", "label": "Check Status", "status": "active"})
    else:
        steps.append({"id": "check-status", "label": "Check Status", "status": "pending"})

    # Decision
    steps.append({"id": "decision", "label": "Decision", "status": "pending"})

    return steps
