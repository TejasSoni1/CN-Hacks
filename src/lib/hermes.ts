/**
 * Hermes is the routing layer behind the Capture screen — it decides which
 * skill/analysis to load for a given capture mode and turns the result into
 * a genuine AIProposal (persisted via the same pipeline Review/Tracker use),
 * plus a curated set of display cards for the Capture screen's immediate
 * "filed into N places" preview.
 */

export const CAPTURE_MODES = [
  { key: "meeting", icon: "Notepad", label: "Meeting notes", sample: true },
  { key: "email", icon: "EnvelopeSimple", label: "Email", sample: true },
  { key: "file", icon: "Paperclip", label: "File", sample: true },
  { key: "contact", icon: "UserPlus", label: "Contact", sample: true },
  { key: "task", icon: "CheckSquare", label: "One-line task", sample: true },
  { key: "plan", icon: "TreeStructure", label: "Whole plan", sample: true },
  { key: "voice", icon: "Microphone", label: "Voice memo", sample: false },
  { key: "github", icon: "GitPullRequest", label: "GitHub event", sample: false },
  { key: "photo", icon: "Image", label: "Whiteboard photo", sample: false },
] as const;

export type CaptureMode = (typeof CAPTURE_MODES)[number]["key"];

export const SAMPLE_TEXT: Record<CaptureMode, string> = {
  meeting:
    "Customer design review with Northstar Energy. Northstar requires the drone to fit through a 620mm clearance in Corridor C access hatches. Current AeroSight enclosure width is 640mm — redesign required before pilot deployment. Navigation field testing depends on VectorNav firmware delivery for corridor routing. Northstar requires a live demonstration before their September 25 safety review board.",
  email:
    "VectorNav firmware v2.4.1 was expected September 6. New delivery date communicated: September 12 due to calibration pipeline delay. This impacts navigation integration testing and demo video timeline. — Marcus Webb, Account Manager, VectorNav Components",
  file: "chimpmanager_ai_hackathon_demo_database.xlsx — 14 sheets: organizations, contacts, employees, projects, meetings, requirements, risks, dependencies, work_items, project_assignments, stakeholder_relationships, actions, development_requests, milestones",
  contact:
    "Priya Raman — Safety Board Chair at Northstar Energy, priya.raman@northstar-energy.com. Met at the design review, she signs off the September 25 demo.",
  task: "remind Jordan the enclosure spec is due Thursday",
  plan: "Thermal Payload v2: bench prototype by mid-October, two-week integration with the existing airframe, customer demo in November. Jordan on mechanical, Taylor on firmware, budget roughly 180k, needs a thermal vendor selected first.",
  voice: "",
  github: "",
  photo: "",
};
SAMPLE_TEXT.voice = SAMPLE_TEXT.meeting;
SAMPLE_TEXT.github = SAMPLE_TEXT.email;
SAMPLE_TEXT.photo = SAMPLE_TEXT.file;

const ROUTING_SKILL: Record<CaptureMode, string> = {
  meeting: "hermes:calendar-write to check the safety-review date",
  email: "hermes:github-events to cross-check the dependency",
  file: "hermes:xlsx-reader for the attachment",
  contact: "hermes:crm-match for contact dedup",
  task: "hermes:calendar-write for the reminder",
  plan: "hermes:project-skeleton for the phase breakdown",
  voice: "hermes:calendar-write to check the safety-review date",
  github: "hermes:github-events to cross-check the dependency",
  photo: "hermes:xlsx-reader for the attachment",
};

export function routingSteps(mode: CaptureMode) {
  return [
    { icon: "Check", label: "Matched to Northstar Autonomous Inspection Pilot", color: "#2f6b4f" },
    { icon: "Check", label: "Found 3 existing records to link against", color: "#2f6b4f" },
    { icon: "CircleDashed", label: `Loading ${ROUTING_SKILL[mode]}`, color: "#75798c" },
  ];
}

export interface RouteCard {
  changeId?: string;
  module: string;
  title: string;
  detail: string;
  confidence: "High confidence" | "Needs a look";
  rule: string;
  why: string;
}

type RouteTemplate = Omit<RouteCard, "changeId">;

export const DISPLAY_ROUTES: Record<CaptureMode, RouteTemplate[]> = {
  meeting: [
    {
      module: "Requirements",
      title: "620 mm corridor clearance",
      detail: "New constraint from Northstar, linked to REQ-001.",
      confidence: "High confidence",
      rule: "if statement contains a measured constraint → requirement",
      why: "A number with a unit tied to a customer obligation is a requirement, not a task.",
    },
    {
      module: "Tracker",
      title: "TASK-101 flagged",
      detail: "Enclosure is 640 mm against a 620 mm target. Jordan Lee notified.",
      confidence: "High confidence",
      rule: "if new requirement conflicts with an open item → flag the item",
      why: "The enclosure work item already carries a width; the two disagree.",
    },
    {
      module: "Dependencies",
      title: "VectorNav firmware v2.4.1",
      detail: "External to the team, owner Sam Rivera, expected 12 September.",
      confidence: "High confidence",
      rule: "if blocker is owned by an external org → dependency",
      why: "VectorNav Components is a vendor org in your CRM.",
    },
    {
      module: "Meetings",
      title: "Northstar Design Review",
      detail: "Filed with attendees and four linked decisions.",
      confidence: "High confidence",
      rule: "always retain the source document",
      why: "Every derived record points back here.",
    },
  ],
  email: [
    {
      module: "Dependencies",
      title: "DEP-001 date moved to 12 Sep",
      detail: "Six-day slip on the firmware delivery.",
      confidence: "High confidence",
      rule: "if a date on a tracked dependency changes → update, do not duplicate",
      why: "DEP-001 already exists and matches the vendor and part.",
    },
    {
      module: "Risks",
      title: "Schedule compression raised to high",
      detail: "Testing window before the safety review drops to three days.",
      confidence: "High confidence",
      rule: "if a slip shortens a window before a fixed date → raise severity",
      why: "The 25 September demo cannot move.",
    },
    {
      module: "People",
      title: "Marcus Webb",
      detail: "Confirmed as VectorNav account manager, already in CRM.",
      confidence: "High confidence",
      rule: "match sender against contacts before creating",
      why: "Signature matched CON-002.",
    },
    {
      module: "Calendar",
      title: "Integration test block moved",
      detail: "Proposes shifting the bench window to 12–15 September.",
      confidence: "Needs a look",
      rule: "never move a booked block without approval",
      why: "Two engineers are already assigned to that slot.",
    },
  ],
  file: [
    {
      module: "People & orgs",
      title: "3 orgs, 6 contacts imported",
      detail: "AeroSight, Northstar Energy, VectorNav Components.",
      confidence: "High confidence",
      rule: "load hermes:xlsx-reader when a workbook arrives",
      why: "Sheet headers matched known entity shapes.",
    },
    {
      module: "Tracker",
      title: "4 work items matched",
      detail: "Existing records updated rather than duplicated.",
      confidence: "High confidence",
      rule: "match on id column before insert",
      why: "TASK-101, TASK-104, TASK-105 and MS-001 already exist.",
    },
    {
      module: "Docs & specs",
      title: "Workbook stored as source",
      detail: "Kept as the origin document for 14 derived tables.",
      confidence: "High confidence",
      rule: "always retain the source document",
      why: "Imported records need a provenance link.",
    },
    {
      module: "Reports",
      title: "Baseline snapshot taken",
      detail: "First data point for progress reporting.",
      confidence: "Needs a look",
      rule: "propose a baseline on first bulk import",
      why: "No prior snapshot exists for this project.",
    },
  ],
  contact: [
    {
      module: "People & orgs",
      title: "Priya Raman added",
      detail: "Northstar Energy · Safety Board Chair.",
      confidence: "High confidence",
      rule: "if a name carries an org and a title → contact",
      why: "Email domain matched an existing customer org.",
    },
    {
      module: "Approvals",
      title: "Named as demo approver",
      detail: "Attached to MS-001 as the sign-off authority.",
      confidence: "High confidence",
      rule: "if a contact signs off a milestone → approver",
      why: "“signs off” is an authority phrase in your rule set.",
    },
    {
      module: "Stakeholders",
      title: "Linked to Sarah Chen",
      detail: "Same org, escalation path recorded.",
      confidence: "Needs a look",
      rule: "infer reporting lines cautiously",
      why: "Relationship was implied, not stated.",
    },
    {
      module: "Calendar",
      title: "25 Sep demo attendee",
      detail: "Added, invitation not sent.",
      confidence: "Needs a look",
      rule: "never email an external contact without approval",
      why: "Outbound to customers is always human-sent.",
    },
  ],
  task: [
    {
      module: "Tracker",
      title: "Enclosure spec due Thursday",
      detail: "Assigned to Jordan Lee, due 11 September, linked to TASK-101.",
      confidence: "High confidence",
      rule: "if a sentence has an owner and a date → work item",
      why: "Jordan Lee is the only Jordan on this project.",
    },
    {
      module: "Calendar",
      title: "Reminder set for Wednesday",
      detail: "One day before the deadline.",
      confidence: "High confidence",
      rule: "reminders land one working day before",
      why: "Matches your last eleven reminders.",
    },
    {
      module: "Decisions",
      title: "Nothing filed",
      detail: "No decision content detected.",
      confidence: "High confidence",
      rule: "do not create empty records",
      why: "A one-line task is not a decision.",
    },
    {
      module: "Docs & specs",
      title: "Spec stub created",
      detail: "Empty placeholder linked to the task.",
      confidence: "Needs a look",
      rule: "propose a doc when a deliverable is named",
      why: "“spec” names a deliverable you usually keep.",
    },
  ],
  plan: [
    {
      module: "Projects",
      title: "Thermal Payload v2 drafted",
      detail: "Three phases, two owners, November demo.",
      confidence: "High confidence",
      rule: "if input names phases and owners → project skeleton",
      why: "Structure matched a plan, not a task.",
    },
    {
      module: "Timeline",
      title: "3 milestones placed",
      detail: "Bench prototype, integration, customer demo.",
      confidence: "High confidence",
      rule: "convert relative dates against today",
      why: "“mid-October” resolved to 15 October.",
    },
    {
      module: "Budget",
      title: "$180k provisional",
      detail: "Flagged as an estimate, not a committed figure.",
      confidence: "Needs a look",
      rule: "never commit a budget from prose",
      why: "“roughly” signals an estimate.",
    },
    {
      module: "Vendor",
      title: "Thermal vendor selection",
      detail: "Created as a blocking dependency before phase one.",
      confidence: "High confidence",
      rule: "if a phase is gated on a supplier → dependency",
      why: "“needs … first” marks a gate.",
    },
  ],
  voice: [],
  github: [],
  photo: [],
};
DISPLAY_ROUTES.voice = DISPLAY_ROUTES.meeting;
DISPLAY_ROUTES.github = DISPLAY_ROUTES.email;
DISPLAY_ROUTES.photo = DISPLAY_ROUTES.file;

/** Modes whose second correction teaches Chimpy a new rule (matches the mock's `learned` flag). */
export const LEARNS_RULE: Partial<Record<CaptureMode, string>> = {
  task: "When Alex writes “remind <name>”, assign to that person and set a reminder one working day early — do not create a meeting.",
  contact: "Contacts from customer domains get an approver check before they are attached to a milestone.",
};

