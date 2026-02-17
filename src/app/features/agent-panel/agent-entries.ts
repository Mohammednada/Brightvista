// ── Agent response entries for the Right Panel (PA Manager dashboard) ─────────

import type { AgentEntry, ChatMsg } from "@/shared/types";

export type { AgentEntry, ChatMsg };

export const agentEntries: AgentEntry[] = [
  // ── Notification Card 1: Imaging RFIs SLA Breach ──────────────────────────
  {
    match: (q) =>
      q.includes("imaging rfis older than 48 hours") ||
      q.includes("prioritize agent-led follow-up"),
    thinking: [
      "Scanning Imaging PA queue for open RFIs...",
      "Cross-referencing payer SLA deadlines...",
      "Mapping cases to coordinator availability...",
      "Building escalation priority list...",
    ],
    response:
      "I've identified all 7 Imaging RFIs at risk. Here's the escalation plan:\n\n" +
      "\u2022 Case #IMG-4401 (UHC) \u2014 MRI Lumbar, RFI open 52 hrs, SLA breach in 8 hrs \u2192 Assigned to Rubeus Hagrid\n" +
      "\u2022 Case #IMG-4398 (Aetna) \u2014 MRI Cervical, RFI open 49 hrs, SLA breach in 11 hrs \u2192 Assigned to Sirius Black\n" +
      "\u2022 Case #IMG-4392 (BCBS) \u2014 MRI Shoulder, RFI open 47 hrs, SLA breach in 13 hrs \u2192 Assigned to Rubeus Hagrid\n" +
      "\u2022 Cases #IMG-4389, 4385, 4381, 4377 \u2014 RFI open 36\u201344 hrs, breach in 16\u201324 hrs\n\n" +
      "Top 3 have been auto-escalated to the supervisor queue. I've also drafted follow-up fax templates for each payer. Shall I send them?",
    nextAction: {
      label: "Send payer follow-up faxes for the top 3 cases",
      prompt: "Go ahead and send the follow-up fax templates to UHC, Aetna, and BCBS for the 3 most urgent Imaging RFI cases.",
    },
  },
  // ── Notification Card 2: Ortho MRI Denial Spike ───────────────────────────
  {
    match: (q) =>
      q.includes("pre-submit documentation checks for orthopedics mri") ||
      q.includes("stricter pre-submit documentation"),
    thinking: [
      "Auditing recent Ortho MRI submissions...",
      "Identifying missing documentation patterns...",
      "Reviewing payer-specific requirements for UHC, Aetna, BCBS...",
      "Designing pre-submit checklist rules...",
    ],
    response:
      "I've audited all 15 denied Ortho MRI cases. The documentation gaps follow a clear pattern:\n\n" +
      "\u2022 9 cases (60%) \u2014 Missing conservative therapy documentation (physical therapy notes, medication history)\n" +
      "\u2022 4 cases (27%) \u2014 Incomplete clinical rationale (no specialist referral letter attached)\n" +
      "\u2022 2 cases (13%) \u2014 Wrong CPT code used (72148 instead of 72141 for cervical MRI)\n\n" +
      "I can enable a pre-submit validation rule that blocks submission until: 1) PT/medication history is attached, 2) specialist referral letter is present, and 3) CPT code matches anatomy. Based on the data, this would have prevented 13 of 15 denials this month.",
    nextAction: {
      label: "Activate pre-submit validation rules now",
      prompt: "Activate the pre-submit validation rules for Orthopedics MRI \u2014 require conservative therapy docs, specialist referral, and CPT code validation before submission.",
    },
  },
  // ── Notification Card 3: Stalled PAs ──────────────────────────────────────
  {
    match: (q) =>
      q.includes("escalation calls to payer representatives") ||
      q.includes("authorize escalation calls") ||
      (q.includes("stalled") && q.includes("cases")),
    thinking: [
      "Loading PA cases stalled beyond 7 business days...",
      "Checking payer representative contact windows...",
      "Ranking cases by patient impact and urgency...",
      "Preparing escalation call scripts...",
    ],
    response:
      "Here are the 5 stalled prior authorizations with contact details:\n\n" +
      "\u2022 Case #PA-3301 (UHC) \u2014 Cardiac catheterization, stalled 11 days \u2014 Contact: UHC PA Dept (800-555-0142), best window 8\u201310 AM EST\n" +
      "\u2022 Case #PA-3287 (Aetna) \u2014 Spinal fusion, stalled 9 days \u2014 Contact: Aetna Surgical Auth (800-555-0198), ask for Supervisor line\n" +
      "\u2022 Case #PA-3264 (Cigna) \u2014 Chemotherapy regimen, stalled 8 days \u2014 Contact: Cigna Oncology Unit (800-555-0211)\n" +
      "\u2022 Case #PA-3251 (BCBS) \u2014 Knee replacement, stalled 7 days \u2014 Contact: BCBS Ortho Auth (800-555-0175)\n" +
      "\u2022 Case #PA-3248 (Humana) \u2014 MRI Brain, stalled 7 days \u2014 Contact: Humana Imaging (800-555-0163)\n\n" +
      "I've prepared call scripts tailored to each payer's escalation protocol. The cardiac catheterization case is highest priority \u2014 the procedure is scheduled for next week.",
    nextAction: {
      label: "Schedule batch outreach calls for tomorrow 8 AM",
      prompt: "Schedule the 5 payer escalation calls for tomorrow morning at 8 AM EST, starting with the UHC cardiac catheterization case. Assign them to available coordinators.",
    },
  },
  // ── Notification Card 4: Partial Approval Risk ────────────────────────────
  {
    match: (q) =>
      q.includes("clarification requests with payers before procedures") ||
      q.includes("initiate clarification requests"),
    thinking: [
      "Reviewing partial approval details for joint replacements...",
      "Checking implant coverage terms in each payer contract...",
      "Verifying procedure schedule dates...",
      "Drafting payer clarification letters...",
    ],
    response:
      "I've reviewed both partially approved joint replacement cases:\n\n" +
      "\u2022 Case #JR-2201 (UHC) \u2014 Left knee total replacement for patient R. Hagrid, scheduled Feb 24. Procedure approved but Zimmer NexGen implant ($14,200) not explicitly listed. UHC contract requires separate implant authorization for devices over $10K.\n" +
      "\u2022 Case #JR-2198 (BCBS) \u2014 Right hip replacement for patient S. Black, scheduled Feb 27. Procedure approved but Smith & Nephew Polarstem ($16,800) coverage is ambiguous \u2014 BCBS formulary lists it as 'conditionally covered.'\n\n" +
      "I've drafted clarification letters for both payers requesting explicit implant coverage confirmation. If we don't get confirmation within 48 hours, I recommend postponing scheduling to avoid uncovered device costs totaling up to $31,000.",
    nextAction: {
      label: "Send clarification letters to UHC and BCBS now",
      prompt: "Send the drafted implant coverage clarification letters to UHC for case JR-2201 and BCBS for case JR-2198. Flag both for 48-hour follow-up.",
    },
  },
  // ── KPI Card: Total Submissions (1,053) ───────────────────────────────────
  {
    match: (q) =>
      q.includes("1,053 total submissions") ||
      q.includes("breakdown of our 1,053"),
    thinking: [
      "Loading submission data for this month...",
      "Comparing against last month's 1,066 submissions...",
      "Breaking down by department and submission type...",
      "Identifying volume trends...",
    ],
    response:
      "Here's the breakdown of 1,053 submissions this month (down 1.2% from last month's 1,066):\n\n" +
      "By Department:\n" +
      "\u2022 Orthopedics \u2014 312 submissions (29.6%), up 8% \u2014 driven by increased MRI and surgical referrals\n" +
      "\u2022 Oncology \u2014 198 submissions (18.8%), flat \u2014 steady chemotherapy regimen requests\n" +
      "\u2022 Cardiology \u2014 173 submissions (16.4%), down 5% \u2014 seasonal dip in elective procedures\n" +
      "\u2022 Imaging \u2014 156 submissions (14.8%), up 12% \u2014 MRI and CT scan volume rising\n" +
      "\u2022 Neurology \u2014 112 submissions (10.6%), down 3%\n" +
      "\u2022 Dermatology \u2014 102 submissions (9.7%), down 7%\n\n" +
      "The 1.2% overall dip is primarily from Cardiology and Dermatology. Orthopedics and Imaging are actually growing, which is also where we're seeing the denial issues.",
    nextAction: {
      label: "Drill into the Orthopedics volume surge",
      prompt: "Why are Orthopedics submissions up 8% this month? Is this driving the denial spike, and should we adjust staffing?",
    },
  },
  // ── KPI Card: Approval Rate (87%) ─────────────────────────────────────────
  {
    match: (q) =>
      q.includes("87% approval rate") ||
      q.includes("break down our 87%"),
    thinking: [
      "Pulling approval rate data by department...",
      "Comparing week-over-week trends...",
      "Identifying top and bottom performers...",
      "Correlating with documentation compliance...",
    ],
    response:
      "The 87% approval rate breaks down as follows:\n\n" +
      "By Department:\n" +
      "\u2022 Neurology \u2014 94% approval (best, up 6% from last month due to improved clinical notes)\n" +
      "\u2022 Oncology \u2014 92% approval (up 3%, better chemo protocol documentation)\n" +
      "\u2022 Cardiology \u2014 89% approval (stable)\n" +
      "\u2022 Dermatology \u2014 87% approval (stable)\n" +
      "\u2022 Imaging \u2014 83% approval (down 2%, tied to RFI response delays)\n" +
      "\u2022 Orthopedics \u2014 74% approval (down 18% this week \u2014 the main drag)\n\n" +
      "Orthopedics alone is pulling the overall rate down by ~4 points. Without the Ortho MRI denial spike, we'd be at 91% \u2014 which would be a new monthly high. The fix is targeted: address the missing conservative therapy documentation in Ortho MRI submissions.",
    nextAction: {
      label: "Show the Orthopedics denial root cause analysis",
      prompt: "Give me a detailed root cause analysis of the Orthopedics 74% approval rate \u2014 which specific case types and payers are driving it down?",
    },
  },
  // ── KPI Card: Open Inquiries (46) ─────────────────────────────────────────
  {
    match: (q) =>
      q.includes("46 open inquiries") ||
      q.includes("open inquiries") ||
      q.includes("inquiries"),
    thinking: [
      "Pulling all 46 open inquiry records...",
      "Categorizing by type and urgency...",
      "Checking SLA deadlines for each inquiry...",
      "Flagging high-risk items...",
    ],
    response:
      "Here's the full breakdown of 46 open inquiries (up 2.5% from last month's 45):\n\n" +
      "By Status:\n" +
      "\u2022 18 awaiting payer response (avg wait: 3.2 days) \u2014 6 are UHC, 5 Aetna, 4 BCBS, 3 Cigna\n" +
      "\u2022 14 need additional clinical documentation from providers\n" +
      "\u2022 7 Imaging RFIs approaching SLA deadline (< 24 hrs remaining)\n" +
      "\u2022 7 routine follow-ups (on track, no risk)\n\n" +
      "By Department:\n" +
      "\u2022 Imaging \u2014 14 inquiries (7 at SLA risk)\n" +
      "\u2022 Orthopedics \u2014 12 inquiries (mostly doc-related)\n" +
      "\u2022 Cardiology \u2014 8 inquiries\n" +
      "\u2022 Oncology \u2014 6 inquiries\n" +
      "\u2022 Neurology/Derm \u2014 6 inquiries\n\n" +
      "The 7 Imaging RFIs are the immediate fire. The 14 awaiting clinical docs should be addressed today to prevent them from becoming SLA risks by end of week.",
    nextAction: {
      label: "Escalate the 7 Imaging RFIs at SLA risk",
      prompt: "Escalate all 7 Imaging RFIs that are within 24 hours of SLA breach \u2014 assign to available coordinators and send payer follow-ups.",
    },
  },
  // ── KPI Card: PA Denials (15) ─────────────────────────────────────────────
  {
    match: (q) =>
      q.includes("15 pa denials") ||
      q.includes("breakdown of the 15") ||
      (q.includes("denial") && q.includes("detail")),
    thinking: [
      "Loading all 15 denial records for this month...",
      "Grouping by denial reason and department...",
      "Cross-referencing with payer denial codes...",
      "Calculating appeal success probability...",
    ],
    response:
      "Here's the detailed breakdown of 15 PA denials this month (up 4.6% from 14 last month):\n\n" +
      "By Denial Reason:\n" +
      "\u2022 Missing conservative therapy docs \u2014 9 cases (all Orthopedics MRI)\n" +
      "\u2022 Incomplete clinical rationale \u2014 3 cases (2 Imaging, 1 Cardiology)\n" +
      "\u2022 Not medically necessary \u2014 2 cases (1 Dermatology biopsy, 1 Neurology EMG)\n" +
      "\u2022 Wrong CPT code \u2014 1 case (Orthopedics MRI)\n\n" +
      "By Payer:\n" +
      "\u2022 UHC \u2014 6 denials (strictest on conservative therapy docs)\n" +
      "\u2022 Aetna \u2014 4 denials\n" +
      "\u2022 BCBS \u2014 3 denials\n" +
      "\u2022 Cigna \u2014 2 denials\n\n" +
      "Appeal potential: 11 of 15 are appealable if we attach the missing documentation. The 9 Ortho MRI cases are the easiest wins \u2014 the conservative therapy records exist in the EMR, they just weren't attached to the submissions.",
    nextAction: {
      label: "Start appeals for the 11 recoverable denials",
      prompt: "Initiate appeals for the 11 recoverable denials \u2014 pull the missing conservative therapy docs from EMR and resubmit to payers with corrected documentation.",
    },
  },
  // ── KPI Card: Cases Needs PA (16 active) ──────────────────────────────────
  {
    match: (q) =>
      q.includes("16 active cases") ||
      q.includes("currently need prior authorization") ||
      q.includes("most urgent") ||
      q.includes("what's blocking"),
    thinking: [
      "Loading the 16 active PA cases...",
      "Evaluating each case's urgency level...",
      "Checking for blockers and missing items...",
      "Ranking by patient impact and deadline...",
    ],
    response:
      "Here are the 16 active cases needing PA, ranked by urgency:\n\n" +
      "Critical (3 cases):\n" +
      "\u2022 #PA-4501 \u2014 Ortho spinal fusion, surgery in 5 days, blocked by missing PT notes\n" +
      "\u2022 #PA-4498 \u2014 Ortho knee replacement, surgery in 6 days, awaiting peer-to-peer\n" +
      "\u2022 #PA-4495 \u2014 Imaging MRI brain, neurologist flagged urgent, RFI open\n\n" +
      "High (6 cases):\n" +
      "\u2022 3 Imaging MRIs with open RFIs (24\u201348 hrs to SLA)\n" +
      "\u2022 2 Ortho cases awaiting conservative therapy documentation\n" +
      "\u2022 1 Oncology chemo regimen pending formulary review\n\n" +
      "On Track (7 cases):\n" +
      "\u2022 3 Cardiology routine pre-auths (expected approval within 48 hrs)\n" +
      "\u2022 2 Oncology chemo approvals (documentation complete, in payer queue)\n" +
      "\u2022 1 Neurology EMG (clinical notes submitted today)\n" +
      "\u2022 1 Ortho implant coverage confirmation (pending)\n\n" +
      "The 3 critical cases need immediate action \u2014 especially the spinal fusion scheduled in 5 days.",
    nextAction: {
      label: "Resolve the 3 critical PA cases now",
      prompt: "Help me resolve the 3 critical cases: get the PT notes for the spinal fusion, schedule the peer-to-peer for the knee replacement, and follow up on the brain MRI RFI.",
    },
  },
  // ── KPI Card: PA Volume (1,247) ───────────────────────────────────────────
  {
    match: (q) =>
      q.includes("1,247") ||
      q.includes("pa volume") ||
      (q.includes("86") && q.includes("today")),
    thinking: [
      "Aggregating PA volume across all departments...",
      "Analyzing daily intake rate trends...",
      "Comparing against capacity benchmarks...",
      "Identifying workflow bottlenecks...",
    ],
    response:
      "PA volume analysis for the 1,247 total cases (86 new today):\n\n" +
      "Daily Trend:\n" +
      "\u2022 Today: 86 new requests (12% above daily avg of 77)\n" +
      "\u2022 This week avg: 82/day (trending up from 74/day last week)\n" +
      "\u2022 Peak day this month: 94 requests (Feb 10)\n\n" +
      "Today's Intake by Department:\n" +
      "\u2022 Orthopedics \u2014 28 cases (32% of today)\n" +
      "\u2022 Imaging \u2014 18 cases (21%)\n" +
      "\u2022 Oncology \u2014 15 cases (17%)\n" +
      "\u2022 Cardiology \u2014 12 cases (14%)\n" +
      "\u2022 Neurology \u2014 8 cases (9%)\n" +
      "\u2022 Dermatology \u2014 5 cases (6%)\n\n" +
      "Bottleneck: The peer-to-peer review queue has 9 cases waiting 3+ days for payer callbacks. This queue is backed up because we only have 2 coordinators trained for P2P calls. Adding 1 more would cut wait times by ~40%.",
    nextAction: {
      label: "Train a 3rd coordinator for peer-to-peer reviews",
      prompt: "Which coordinator should we train for peer-to-peer calls? Show me who has capacity and the right experience level.",
    },
  },
  // ── Follow-up: Send payer faxes ───────────────────────────────────────────
  {
    match: (q) =>
      q.includes("send the follow-up fax") ||
      q.includes("fax templates"),
    thinking: [
      "Generating fax templates for UHC, Aetna, BCBS...",
      "Attaching case details and clinical documentation...",
      "Routing through secure fax system...",
    ],
    response:
      "Follow-up faxes have been queued for transmission:\n\n" +
      "\u2022 UHC (Case #IMG-4401) \u2014 Fax to 800-555-0143, includes clinical notes + MRI justification letter. Estimated delivery: 15 min.\n" +
      "\u2022 Aetna (Case #IMG-4398) \u2014 Fax to 800-555-0199, includes updated cervical MRI referral. Estimated delivery: 15 min.\n" +
      "\u2022 BCBS (Case #IMG-4392) \u2014 Fax to 800-555-0176, includes shoulder injury documentation. Estimated delivery: 15 min.\n\n" +
      "I'll monitor for payer acknowledgments and notify you when each is confirmed received. If no response within 4 hours, I'll auto-escalate to phone follow-up.",
    nextAction: {
      label: "Set up auto-escalation if no fax response in 4 hrs",
      prompt: "Configure auto-escalation: if payers don't acknowledge faxes within 4 hours, automatically assign phone follow-up to available coordinators.",
    },
  },
  // ── Follow-up: Activate pre-submit rules ──────────────────────────────────
  {
    match: (q) =>
      q.includes("activate the pre-submit validation") ||
      q.includes("require conservative therapy docs"),
    thinking: [
      "Configuring validation rules for Ortho MRI workflow...",
      "Setting required document checklist...",
      "Testing rule against recent submissions...",
    ],
    response:
      "Pre-submit validation rules have been activated for Orthopedics MRI:\n\n" +
      "Rule 1: Conservative therapy documentation required (PT notes, medication history) \u2014 blocks submission if missing\n" +
      "Rule 2: Specialist referral letter required \u2014 warning if missing, blocks after 24 hrs\n" +
      "Rule 3: CPT code validation \u2014 auto-checks anatomy match (72141 cervical, 72146 thoracic, 72148 lumbar)\n\n" +
      "I've tested these rules against the last 30 Ortho MRI submissions. Results: 13 of 15 denied cases would have been caught and flagged before submission. The 2 remaining cases (wrong CPT code) would have been auto-corrected.\n\n" +
      "Coordinators will see a checklist popup when submitting Ortho MRI cases. Would you like to extend these rules to other departments?",
    nextAction: {
      label: "Extend validation rules to Imaging and Cardiology",
      prompt: "Extend the pre-submit documentation validation rules to Imaging MRI and Cardiology cases \u2014 what would the checklist look like for those departments?",
    },
  },
  // ── Follow-up: Schedule batch outreach ────────────────────────────────────
  {
    match: (q) =>
      q.includes("schedule the 5 payer escalation") ||
      q.includes("batch outreach") ||
      (q.includes("schedule") && q.includes("8 am")),
    thinking: [
      "Checking coordinator availability for tomorrow 8 AM...",
      "Assigning cases by payer expertise...",
      "Loading call scripts for each payer...",
    ],
    response:
      "Escalation calls have been scheduled for tomorrow, Feb 16 at 8:00 AM EST:\n\n" +
      "\u2022 8:00 AM \u2014 Sirius Black calls UHC (Case #PA-3301, cardiac cath) \u2014 highest priority, script includes surgical urgency language\n" +
      "\u2022 8:20 AM \u2014 Rubeus Hagrid calls Aetna (Case #PA-3287, spinal fusion) \u2014 request supervisor escalation\n" +
      "\u2022 8:40 AM \u2014 Neville Longbottom calls Cigna (Case #PA-3264, chemo) \u2014 Neville has prior Cigna escalation experience\n" +
      "\u2022 9:00 AM \u2014 Fred Weasley calls BCBS (Case #PA-3251, knee replacement)\n" +
      "\u2022 9:20 AM \u2014 Sirius Black calls Humana (Case #PA-3248, MRI brain)\n\n" +
      "Calendar invites and call scripts have been sent to each coordinator. I'll track call outcomes in real-time and update you as each call completes.",
    nextAction: {
      label: "View the call scripts before they're sent",
      prompt: "Show me the call scripts for tomorrow's payer escalation calls \u2014 I want to review the language before coordinators make the calls.",
    },
  },
  // ── Follow-up: Send clarification letters ─────────────────────────────────
  {
    match: (q) =>
      q.includes("implant coverage clarification") ||
      q.includes("clarification letters") ||
      q.includes("jr-2201") ||
      q.includes("jr-2198"),
    thinking: [
      "Generating implant clarification letter for UHC...",
      "Generating implant clarification letter for BCBS...",
      "Setting up 48-hour follow-up reminders...",
    ],
    response:
      "Clarification letters have been sent:\n\n" +
      "UHC \u2014 Case #JR-2201 (Zimmer NexGen, left knee)\n" +
      "Letter requests explicit coverage confirmation for the $14,200 implant under the patient's plan. Sent via secure portal + fax backup. 48-hour follow-up reminder set for Feb 17, 9 AM.\n\n" +
      "BCBS \u2014 Case #JR-2198 (Smith & Nephew Polarstem, right hip)\n" +
      "Letter references BCBS formulary listing of 'conditionally covered' and requests clarification on coverage terms. Sent via secure portal. 48-hour follow-up reminder set for Feb 17, 9 AM.\n\n" +
      "If UHC doesn't confirm by Feb 17, I recommend postponing the Feb 24 knee surgery scheduling to avoid the $14,200 risk. I'll alert you immediately when payer responses arrive.",
    nextAction: {
      label: "Set up automatic surgery hold if no confirmation",
      prompt: "Configure an automatic surgery scheduling hold for both joint replacement cases if payer implant confirmation isn't received by Feb 17 at 5 PM.",
    },
  },
  // ── Follow-up: Appeals for recoverable denials ────────────────────────────
  {
    match: (q) =>
      q.includes("appeals for the 11 recoverable") ||
      q.includes("resubmit to payers with corrected"),
    thinking: [
      "Pulling EMR records for the 9 Ortho MRI cases...",
      "Locating conservative therapy documentation...",
      "Preparing appeal packages for each payer...",
      "Estimating appeal success rates...",
    ],
    response:
      "Appeal packages are being prepared for 11 recoverable denials:\n\n" +
      "Batch 1 \u2014 Ortho MRI (9 cases, highest recovery value):\n" +
      "\u2022 7 cases: Conservative therapy docs found in EMR, auto-attaching PT notes and medication history\n" +
      "\u2022 2 cases: Docs partially available \u2014 I've flagged coordinators to request missing PT notes from referring physicians (expected within 24 hrs)\n\n" +
      "Batch 2 \u2014 Other departments (2 cases):\n" +
      "\u2022 Imaging case: Clinical rationale letter drafted, needs physician signature\n" +
      "\u2022 Cardiology case: Updated referral letter ready for submission\n\n" +
      "Estimated appeal success rate: 85% (based on historical recovery for documentation-related denials). If all 11 appeals succeed, we recover ~$187,000 in authorized procedure value and our denial rate drops from 15 to 4 this month.",
    nextAction: {
      label: "Submit the 7 ready appeals immediately",
      prompt: "Submit the 7 Ortho MRI appeal packages that have complete documentation right now. Queue the remaining 4 for submission once the missing docs arrive.",
    },
  },
  // ── Follow-up: Resolve 3 critical PA cases ────────────────────────────────
  {
    match: (q) =>
      q.includes("pt notes for the spinal fusion") ||
      q.includes("resolve the 3 critical") ||
      q.includes("peer-to-peer for the knee"),
    thinking: [
      "Locating PT notes in EMR for spinal fusion case...",
      "Checking peer-to-peer availability at UHC...",
      "Following up on brain MRI RFI status...",
    ],
    response:
      "Action plan for the 3 critical cases:\n\n" +
      "Case #PA-4501 (Spinal Fusion, surgery in 5 days):\n" +
      "PT notes found in EMR \u2014 6 sessions documented over 8 weeks. I've attached them to the PA submission and resubmitted to UHC. Expected approval turnaround: 24\u201348 hrs. Assigned to Rubeus Hagrid for tracking.\n\n" +
      "Case #PA-4498 (Knee Replacement, surgery in 6 days):\n" +
      "Peer-to-peer slot available with UHC medical director tomorrow at 10:30 AM. I've scheduled Dr. Thompson (orthopedic surgeon) for the call. Sirius Black will coordinate and have case materials ready.\n\n" +
      "Case #PA-4495 (Brain MRI, urgent neuro referral):\n" +
      "RFI response submitted to Aetna 2 hours ago with updated clinical rationale. Current status: 'Under Review.' I've set an auto-follow-up for 4 PM today if status hasn't changed.\n\n" +
      "I'll notify you as each case progresses.",
    nextAction: {
      label: "Brief Dr. Thompson for tomorrow's peer-to-peer",
      prompt: "Prepare a peer-to-peer briefing document for Dr. Thompson's call with UHC tomorrow at 10:30 AM for the knee replacement case \u2014 include clinical rationale, patient history, and key talking points.",
    },
  },
  // ── Follow-up: Ortho volume surge ─────────────────────────────────────────
  {
    match: (q) =>
      q.includes("orthopedics submissions up 8%") ||
      q.includes("ortho volume surge") ||
      (q.includes("adjust staffing") && q.includes("ortho")),
    thinking: [
      "Analyzing Orthopedics referral sources...",
      "Checking seasonal surgery scheduling patterns...",
      "Evaluating coordinator capacity for Ortho...",
    ],
    response:
      "The 8% Orthopedics volume surge is driven by two factors:\n\n" +
      "1. New referral source: NorthStar added Springfield Orthopedic Associates in January \u2014 they've sent 47 new PA requests this month (15% of total Ortho volume)\n" +
      "2. Seasonal pattern: February typically sees 6\u201310% Ortho increases as patients use new-year insurance benefits for elective procedures\n\n" +
      "Impact on denials: Yes, the volume surge is directly contributing. Springfield cases have a 31% denial rate vs. 12% for established referral sources \u2014 likely because their documentation practices don't match our payer requirements yet.\n\n" +
      "Staffing: Current Ortho coverage is Rubeus Hagrid (12 cases) and Fred Weasley (18 cases). Arthur Weasley (Dermatology, only 2 cases at 50% activity) could be cross-trained to support Ortho within 3\u20135 days.",
    nextAction: {
      label: "Cross-train Arthur Weasley for Orthopedics",
      prompt: "Start cross-training Arthur Weasley for Orthopedics PA processing \u2014 what's the training plan and how quickly can he start handling Ortho cases?",
    },
  },
  // ── Follow-up: Ortho approval root cause ──────────────────────────────────
  {
    match: (q) =>
      q.includes("root cause analysis") ||
      q.includes("orthopedics 74%") ||
      q.includes("ortho root cause"),
    thinking: [
      "Deep-diving into Orthopedics denials by case type...",
      "Cross-referencing payer-specific requirements...",
      "Analyzing coordinator error patterns...",
    ],
    response:
      "Root cause analysis of Orthopedics 74% approval rate:\n\n" +
      "By Case Type:\n" +
      "\u2022 MRI requests \u2014 62% approval (normally 88%) \u2014 main problem\n" +
      "\u2022 Surgical pre-auths \u2014 81% approval (stable)\n" +
      "\u2022 DME/devices \u2014 78% approval (slightly below benchmark)\n\n" +
      "MRI Denial Deep Dive:\n" +
      "\u2022 9 of 12 MRI denials this month are from the Springfield referral group \u2014 their submissions consistently lack conservative therapy documentation\n" +
      "\u2022 UHC is the strictest payer: 5 of 9 denials are UHC, which requires 6+ weeks of documented conservative therapy\n" +
      "\u2022 Coordinator factor: Rubeus Hagrid processes most Springfield cases and hasn't been flagging the missing docs\n\n" +
      "Root cause: New referral source + insufficient documentation checks + no coordinator training on Springfield-specific requirements.",
    nextAction: {
      label: "Create Springfield onboarding documentation guide",
      prompt: "Create a documentation requirements guide specifically for Springfield Orthopedic Associates \u2014 include what each payer needs for MRI approvals and share it with the Springfield team.",
    },
  },
  // ── Follow-up: P2P coordinator training ───────────────────────────────────
  {
    match: (q) =>
      q.includes("train for peer-to-peer") ||
      (q.includes("who has capacity") && q.includes("experience")),
    thinking: [
      "Evaluating coordinator capacity and skills...",
      "Checking P2P call training requirements...",
      "Ranking candidates by readiness...",
    ],
    response:
      "Best candidate for P2P training: Neville Longbottom\n\n" +
      "Here's why:\n" +
      "\u2022 Highest activity rate at 97% \u2014 demonstrates reliability and throughput\n" +
      "\u2022 18 active cases with zero SLA breaches \u2014 strong process discipline\n" +
      "\u2022 Neurology specialty gives him clinical vocabulary for P2P medical discussions\n" +
      "\u2022 Previously shadowed 3 P2P calls in January (noted in training log)\n\n" +
      "Alternative: Fred Weasley (90% activity, Oncology) is a solid backup option.\n\n" +
      "Training plan: 2-day accelerated P2P program (Day 1: payer protocols + mock calls, Day 2: supervised live call). Neville could be handling P2P calls independently by Feb 18.",
    nextAction: {
      label: "Start Neville's P2P training tomorrow",
      prompt: "Enroll Neville Longbottom in the accelerated P2P training program starting tomorrow. Send him the training materials and schedule mock call sessions.",
    },
  },
  // ── Follow-up: Auto-escalation config ─────────────────────────────────────
  {
    match: (q) =>
      q.includes("configure auto") ||
      (q.includes("payers don't acknowledge") && q.includes("4 hours")),
    thinking: [
      "Loading current escalation rule settings...",
      "Configuring time-based triggers...",
      "Assigning fallback coordinators...",
    ],
    response:
      "Auto-escalation rule has been configured:\n\n" +
      "Trigger: If payer fax acknowledgment is not received within 4 hours of transmission\n" +
      "Action: Automatically create a phone follow-up task and assign to the next available coordinator\n\n" +
      "Assignment priority order:\n" +
      "1. Original case coordinator (if available)\n" +
      "2. Sirius Black (90% activity, experienced with payer calls)\n" +
      "3. Neville Longbottom (97% activity, backup)\n\n" +
      "The rule is now active for the 3 faxes sent today (UHC, Aetna, BCBS). If triggered, coordinators will receive a push notification with the case details and payer phone number. I'll also send you a summary alert.",
    nextAction: {
      label: "Apply this rule to all future payer faxes",
      prompt: "Extend the 4-hour auto-escalation rule to apply automatically to all future payer fax communications across all departments.",
    },
  },
  // ── Follow-up: Surgery hold config ────────────────────────────────────────
  {
    match: (q) =>
      q.includes("surgery scheduling hold") ||
      q.includes("automatic surgery hold") ||
      q.includes("implant confirmation isn't received"),
    thinking: [
      "Connecting to surgical scheduling system...",
      "Setting conditional hold rules...",
      "Configuring notification chain...",
    ],
    response:
      "Automatic surgery holds have been configured:\n\n" +
      "Case #JR-2201 (Left knee, Feb 24):\n" +
      "\u2022 Hold trigger: If UHC implant confirmation not received by Feb 17, 5:00 PM EST\n" +
      "\u2022 Action: Flag surgery as 'Pending Financial Clearance,' notify Dr. Peterson and surgical scheduling\n" +
      "\u2022 Estimated cost avoidance: $14,200 (Zimmer NexGen implant)\n\n" +
      "Case #JR-2198 (Right hip, Feb 27):\n" +
      "\u2022 Hold trigger: If BCBS implant confirmation not received by Feb 17, 5:00 PM EST\n" +
      "\u2022 Action: Flag surgery as 'Pending Financial Clearance,' notify Dr. Martinez and surgical scheduling\n" +
      "\u2022 Estimated cost avoidance: $16,800 (Smith & Nephew Polarstem)\n\n" +
      "Both surgeons will receive automated notifications explaining the hold reason. The holds auto-release as soon as payer confirmation is received.",
    nextAction: {
      label: "Notify the surgical team proactively now",
      prompt: "Send a proactive heads-up to both surgical teams (Dr. Peterson and Dr. Martinez) that implant coverage confirmation is pending and there's a possibility of scheduling holds.",
    },
  },
  // ── Follow-up: Submit ready appeals ───────────────────────────────────────
  {
    match: (q) =>
      q.includes("submit the 7 ortho mri appeal") ||
      q.includes("7 ready appeals") ||
      q.includes("queue the remaining 4"),
    thinking: [
      "Packaging 7 Ortho MRI appeal submissions...",
      "Attaching conservative therapy docs from EMR...",
      "Routing to respective payer appeal portals...",
    ],
    response:
      "7 Ortho MRI appeals submitted successfully:\n\n" +
      "\u2022 UHC (4 cases) \u2014 Submitted via UHC Provider Portal, confirmation IDs: UHC-APL-4401 through 4404. Expected response: 5\u20137 business days.\n" +
      "\u2022 Aetna (2 cases) \u2014 Submitted via Availity, confirmation IDs: AET-APL-2201, 2202. Expected response: 3\u20135 business days.\n" +
      "\u2022 BCBS (1 case) \u2014 Submitted via BCBS IL Provider Portal, confirmation ID: BCBS-APL-1101. Expected response: 7\u201310 business days.\n\n" +
      "Remaining 4 cases queued:\n" +
      "\u2022 2 Ortho MRI \u2014 Waiting for PT notes from Springfield Ortho (requested today, ETA tomorrow)\n" +
      "\u2022 1 Imaging \u2014 Needs physician signature on clinical rationale (sent for e-sign)\n" +
      "\u2022 1 Cardiology \u2014 Referral letter update in progress\n\n" +
      "I'll auto-submit each remaining appeal as soon as its documentation is complete. Tracking dashboard updated.",
    nextAction: {
      label: "Set up appeal outcome tracking alerts",
      prompt: "Set up automatic alerts to notify me when each of the 7 submitted appeals receives a payer decision \u2014 include the outcome and any next steps needed.",
    },
  },
  // ── Follow-up: Cross-train Arthur Weasley ─────────────────────────────────
  {
    match: (q) =>
      q.includes("cross-training arthur") ||
      q.includes("arthur weasley") ||
      q.includes("rebalance"),
    thinking: [
      "Reviewing Arthur Weasley's current skillset...",
      "Mapping Orthopedics PA requirements to training gaps...",
      "Building accelerated training plan...",
    ],
    response:
      "Cross-training plan for Arthur Weasley (Dermatology \u2192 Orthopedics):\n\n" +
      "Current State:\n" +
      "\u2022 2 active Dermatology cases, 50% activity \u2014 significant available capacity\n" +
      "\u2022 3+ years PA experience, strong payer knowledge (UHC, BCBS)\n" +
      "\u2022 Gap: No Orthopedics-specific documentation training\n\n" +
      "Training Plan (5 days):\n" +
      "\u2022 Day 1: Orthopedics PA documentation requirements workshop (2 hrs with Fred Weasley)\n" +
      "\u2022 Day 2: Conservative therapy documentation standards + CPT code training\n" +
      "\u2022 Day 3: Shadow Rubeus Hagrid on 5 active Ortho cases\n" +
      "\u2022 Day 4: Handle 3 supervised Ortho submissions with review\n" +
      "\u2022 Day 5: Independent processing with post-submission audit\n\n" +
      "Estimated ready date: Feb 20. Once trained, Arthur can absorb 6\u20138 Ortho cases, reducing Rubeus and Fred's load by ~20% each.",
    nextAction: {
      label: "Start Arthur's training tomorrow morning",
      prompt: "Notify Arthur Weasley, Fred Weasley, and Rubeus Hagrid about the cross-training plan starting tomorrow. Send calendar invites for all training sessions.",
    },
  },
  // ── Follow-up: Peer-to-peer briefing ──────────────────────────────────────
  {
    match: (q) =>
      q.includes("peer-to-peer briefing") ||
      q.includes("dr. thompson") ||
      q.includes("talking points"),
    thinking: [
      "Pulling case history for knee replacement PA...",
      "Gathering clinical evidence and documentation...",
      "Structuring P2P talking points per UHC guidelines...",
    ],
    response:
      "Peer-to-peer briefing document prepared for Dr. Thompson:\n\n" +
      "Call Details:\n" +
      "\u2022 Date: Tomorrow, Feb 16 at 10:30 AM EST\n" +
      "\u2022 Payer: UHC Medical Director\n" +
      "\u2022 Case: #PA-4498, Right knee total replacement\n" +
      "\u2022 Coordinator: Sirius Black (will dial in and manage logistics)\n\n" +
      "Patient Summary:\n" +
      "\u2022 62-year-old male, BMI 28, no surgical contraindications\n" +
      "\u2022 Failed conservative therapy: 12 weeks PT (documented), corticosteroid injections x3, NSAID therapy x6 months\n" +
      "\u2022 Imaging: MRI shows Grade IV cartilage loss, bone-on-bone contact\n\n" +
      "Key Talking Points:\n" +
      "1. Conservative therapy exhausted per UHC's 6-week minimum requirement (patient completed 12 weeks)\n" +
      "2. Functional limitation: patient unable to climb stairs, walk > 200 ft\n" +
      "3. Surgical urgency: delaying increases risk of contralateral knee deterioration\n\n" +
      "Briefing document has been sent to Dr. Thompson's secure inbox and Sirius Black's queue.",
    nextAction: {
      label: "Confirm Dr. Thompson received the briefing",
      prompt: "Check if Dr. Thompson has opened and acknowledged the peer-to-peer briefing document. Send a reminder if not opened by end of day.",
    },
  },
  // ── Follow-up: Call scripts review ────────────────────────────────────────
  {
    match: (q) =>
      q.includes("call scripts") ||
      q.includes("review the language"),
    thinking: [
      "Loading escalation call script templates...",
      "Customizing for each payer's protocol...",
      "Highlighting key talking points...",
    ],
    response:
      "Here are the 5 escalation call scripts for tomorrow:\n\n" +
      "Script 1 \u2014 UHC (Cardiac Cath, Sirius Black, 8:00 AM):\n" +
      "\"I'm calling regarding PA request #PA-3301 for cardiac catheterization, submitted 11 business days ago. This procedure is clinically urgent \u2014 the patient has unstable angina with positive stress test results. I'm requesting immediate supervisor review and same-day determination.\"\n\n" +
      "Script 2 \u2014 Aetna (Spinal Fusion, Rubeus Hagrid, 8:20 AM):\n" +
      "\"Requesting supervisor escalation for PA #PA-3287, spinal fusion stalled 9 days. Patient has completed 12 weeks conservative therapy with no improvement. We need determination within 48 hours to maintain surgical scheduling.\"\n\n" +
      "Scripts 3\u20135 follow similar payer-specific language. All scripts include the reference number, days stalled, clinical urgency summary, and specific ask (supervisor review, expedited determination, or peer-to-peer scheduling).\n\n" +
      "Would you like to modify any of these before I send them to coordinators?",
    nextAction: {
      label: "Approve and send all scripts to coordinators",
      prompt: "Approve all 5 call scripts and send them to the assigned coordinators along with their calendar invites for tomorrow's calls.",
    },
  },
  // ── Generic: Coordinator / team ───────────────────────────────────────────
  {
    match: (q) =>
      q.includes("coordinator") || q.includes("team") || q.includes("staff") || q.includes("who"),
    thinking: [
      "Checking active coordinator sessions...",
      "Comparing activity rates and case loads...",
      "Identifying workload imbalances...",
    ],
    response:
      "There are 5 active coordinators currently logged in. Top performer is Neville Longbottom (Neurology) at 97% activity with 18 cases and zero SLA breaches. Arthur Weasley (Dermatology) has dropped to 50% activity with only 2 active cases \u2014 I'd recommend checking his workload balance or potential system issues.",
    nextAction: {
      label: "Rebalance Arthur Weasley's workload",
      prompt: "Start cross-training Arthur Weasley for Orthopedics PA processing \u2014 what's the training plan and how quickly can he start handling Ortho cases?",
    },
  },
  // ── Generic: SLA / urgent / breach ────────────────────────────────────────
  {
    match: (q) =>
      q.includes("sla") || q.includes("urgent") || q.includes("breach") || q.includes("deadline"),
    thinking: [
      "Scanning open RFIs and payer deadlines...",
      "Evaluating SLA breach risk timelines...",
      "Prioritizing cases by urgency level...",
    ],
    response:
      "There are 3 active SLA risks: 7 Imaging PA cases have open RFIs with less than 24 hours remaining before payer deadlines, 5 PA requests have been stuck in 'In Review' for 7+ business days across multiple payers, and 2 joint replacement authorizations were approved without explicit implant coverage confirmation. I recommend escalating all Imaging RFIs older than 48 hours immediately.",
    nextAction: {
      label: "Auto-escalate RFIs older than 48 hours",
      prompt: "How do I set up automatic escalation for any RFI older than 48 hours to prevent SLA breaches?",
    },
  },
  // ── Generic: Volume / submission / overview ───────────────────────────────
  {
    match: (q) =>
      q.includes("volume") || q.includes("submission") || q.includes("overview") ||
      q.includes("summary") || q.includes("how are we") || q.includes("status"),
    thinking: [
      "Aggregating monthly submission data...",
      "Calculating approval and denial rates...",
      "Summarizing key metrics...",
    ],
    response:
      "Here's today's snapshot: 1,053 total submissions this month with an 87% approval rate (up 4.6%). We have 46 open inquiries, 15 PA denials, and 16 active cases needing PA. Overall flow is healthy, but keep an eye on the Orthopedics MRI denial spike and the 7 Imaging RFIs approaching SLA deadlines.",
    nextAction: {
      label: "Drill into the Ortho MRI denial spike",
      prompt: "Give me a detailed breakdown of the 15 PA denials this month \u2014 what's causing them and which departments are most affected?",
    },
  },
  // ── Generic: Department / allocation ───────────────────────────────────────
  {
    match: (q) =>
      q.includes("department") || q.includes("allocation") || q.includes("ortho") ||
      q.includes("cardio") || q.includes("neuro") || q.includes("oncol") ||
      q.includes("imaging") || q.includes("derma"),
    thinking: [
      "Loading department allocation data...",
      "Comparing case volumes across departments...",
      "Identifying high-load departments...",
    ],
    response:
      "Current allocation across 1,053 total cases: Orthopedics leads with 312 cases (29.6%), followed by Oncology (198), Cardiology (173), Imaging (156), Neurology (112), and Dermatology (102). Orthopedics is carrying the heaviest load and also showing the highest denial rate at 26% this week.",
    nextAction: {
      label: "Review Orthopedics denial rate breakdown",
      prompt: "Give me a detailed root cause analysis of the Orthopedics 74% approval rate \u2014 which specific case types and payers are driving it down?",
    },
  },
  // ── Generic: Denial (general) ─────────────────────────────────────────────
  {
    match: (q) =>
      q.includes("denial") || q.includes("denied") || q.includes("denials"),
    thinking: [
      "Pulling denial records for this month...",
      "Cross-referencing with Orthopedics MRI submissions...",
      "Analyzing documentation compliance gaps...",
    ],
    response:
      "We're currently tracking 15 PA denials this month, up 4.6% from last month. The primary driver is Orthopedics MRI \u2014 approvals dropped 18% this week due to missing conservative therapy documentation in 9 of 15 denied cases. I recommend enabling stricter pre-submit documentation checks for Orthopedics MRI cases.",
    nextAction: {
      label: "Enable pre-submit documentation checks for Ortho MRI",
      prompt: "Activate the pre-submit validation rules for Orthopedics MRI \u2014 require conservative therapy docs, specialist referral, and CPT code validation before submission.",
    },
  },
  // ── Generic: Approval rate ────────────────────────────────────────────────
  {
    match: (q) => q.includes("approv"),
    thinking: [
      "Retrieving approval rate trends...",
      "Comparing against last month's baseline...",
      "Checking department-level breakdowns...",
    ],
    response:
      "The current approval rate is 87%, up 4.6% from last month. This positive trend is driven by improved documentation compliance in Oncology and Neurology. However, Orthopedics is pulling the average down due to the MRI denial spike \u2014 18% drop in approvals this week.",
    nextAction: {
      label: "Fix the Orthopedics approval drop",
      prompt: "What specific steps can we take to fix the 18% approval drop in Orthopedics MRI this week?",
    },
  },
  // ── Generic: Recommendations / improve ────────────────────────────────────
  {
    match: (q) =>
      q.includes("reduce") || q.includes("improv") || q.includes("recommend") ||
      q.includes("suggest") || q.includes("fix") || q.includes("what specific steps"),
    thinking: [
      "Analyzing current workflow bottlenecks...",
      "Evaluating potential intervention points...",
      "Ranking recommendations by impact...",
    ],
    response:
      "My top 3 recommendations: 1) Enable stricter pre-submit documentation checks for Orthopedics MRI cases \u2014 this could prevent ~60% of current denials. 2) Cross-train Arthur Weasley for Orthopedics \u2014 he's at 50% activity with only 2 Dermatology cases while Ortho is overloaded. 3) Set up automatic escalation for any RFI older than 48 hours \u2014 this would have caught 7 of the current at-risk Imaging cases earlier.",
    nextAction: {
      label: "Start with documentation checks for Ortho MRI",
      prompt: "Activate the pre-submit validation rules for Orthopedics MRI \u2014 require conservative therapy docs, specialist referral, and CPT code validation before submission.",
    },
  },
  // ── Generic: Escalation ───────────────────────────────────────────────────
  {
    match: (q) => q.includes("escalat"),
    thinking: [
      "Reviewing escalation protocols...",
      "Checking current escalation queue...",
      "Identifying priority cases...",
    ],
    response:
      "Current escalation status: 7 Imaging RFIs need immediate escalation (< 24 hrs to SLA breach), 5 stalled PAs need payer outreach (7+ days in review), and 2 partial approvals need clarification. I can set up automated escalation rules to catch these earlier in the future \u2014 would you like me to configure that?",
    nextAction: {
      label: "Configure automated escalation rules",
      prompt: "Configure auto-escalation: if payers don't acknowledge faxes within 4 hours, automatically assign phone follow-up to available coordinators.",
    },
  },
  // ── Generic: Greeting ─────────────────────────────────────────────────────
  {
    match: (q) =>
      q.includes("good morning") || q.includes("hello") || q.includes("hi ") ||
      q === "hi" || q === "hey" || q.includes("hey "),
    thinking: [
      "Loading today's dashboard snapshot...",
      "Checking for critical alerts...",
    ],
    response:
      "Good morning! Overall authorization flow is healthy today. We have 1,053 submissions at 87% approval. The main items on my radar are the Imaging RFIs approaching SLA breach and the Orthopedics MRI denial spike. Want me to walk you through the details?",
    nextAction: {
      label: "Show me today's risk areas",
      prompt: "Walk me through the SLA risks and the Imaging RFI situation in detail",
    },
  },
];

// Fallback entry used when no match is found
export const fallbackEntry: Omit<AgentEntry, "match"> = {
  thinking: [
    "Analyzing your request against dashboard data...",
    "Cross-referencing submissions and approval trends...",
    "Preparing insights...",
  ],
  response:
    "I've analyzed your request against current dashboard data. With 1,053 submissions this month at an 87% approval rate, the overall workflow is healthy. The main areas to watch are the Orthopedics MRI denial spike (15 denials, up 4.6%) and 7 Imaging RFIs approaching SLA deadlines. Would you like me to dive deeper into any specific area?",
  nextAction: {
    label: "Show recommendations to improve workflow",
    prompt: "What are your top recommendations to reduce denials and improve our approval rate?",
  },
};

export function findEntry(input: string): Omit<AgentEntry, "match"> {
  const q = input.toLowerCase();
  for (const entry of agentEntries) {
    if (entry.match(q)) return entry;
  }
  return fallbackEntry;
}

export function matchThinkingSteps(input: string): string[] {
  return findEntry(input).thinking;
}

export function matchNextAction(input: string): { label: string; prompt: string } {
  return findEntry(input).nextAction;
}

export function matchResponse(input: string): string {
  return findEntry(input).response;
}
