import type { CaseBuilderState, ApprovalFactor } from "./case-builder-state";

/**
 * Pure function: CaseBuilderState → { score, factors }
 *
 * Scoring breakdown:
 *   Patient completeness   → +20%
 *   Procedure validation   → +15%
 *   Required docs found    → +35%
 *   Conservative therapy   → +15%
 *   Specialist referral    → +15%
 */
export function calculateApprovalLikelihood(
  state: CaseBuilderState
): { score: number; factors: ApprovalFactor[] } {
  const factors: ApprovalFactor[] = [];

  // 1. Patient completeness (+20%)
  const patientFields: (keyof typeof state.patient)[] = [
    "name", "dob", "mrn", "insurancePayer", "memberId", "planType", "referringPhysician",
  ];
  const filledPatient = patientFields.filter((f) => !!state.patient[f]).length;
  const patientComplete = filledPatient === patientFields.length;
  factors.push({
    label: "Patient information complete",
    weight: 20,
    met: patientComplete,
  });

  // 2. Procedure validation (+15%)
  const procedureValid =
    !!state.procedure.cptCode &&
    !!state.procedure.icd10Code &&
    state.procedure.cptValid === true &&
    state.procedure.icd10Valid === true;
  factors.push({
    label: "Procedure codes validated",
    weight: 15,
    met: procedureValid,
  });

  // 3. Required docs found (+35%)
  const requiredDocs = state.documents.filter((d) => d.required);
  const foundDocs = requiredDocs.filter((d) => d.status === "found");
  const docsComplete = requiredDocs.length > 0 && foundDocs.length === requiredDocs.length;
  factors.push({
    label: "Required documentation attached",
    weight: 35,
    met: docsComplete,
  });

  // 4. Conservative therapy documented (+15%)
  const conservativeTherapy = state.documents.some(
    (d) => d.id === "conservative-therapy" && d.status === "found"
  );
  factors.push({
    label: "Conservative therapy documented",
    weight: 15,
    met: conservativeTherapy,
  });

  // 5. Specialist referral (+15%)
  const specialistReferral = state.documents.some(
    (d) => d.id === "specialist-referral" && d.status === "found"
  );
  factors.push({
    label: "Specialist referral present",
    weight: 15,
    met: specialistReferral,
  });

  const score = factors.reduce((sum, f) => sum + (f.met ? f.weight : 0), 0);

  return { score, factors };
}
