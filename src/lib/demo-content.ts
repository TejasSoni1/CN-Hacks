import type { WorkItemStatus, Priority } from "./types";

export type Role = "pm" | "hw" | "qa" | "exec";

/** Sidebar / command-palette nav entries. Ported from the Chimp Manager v2 design. */
export const NAV: { key: string; label: string; icon: string }[] = [
  { key: "overview", label: "Overview", icon: "SquaresFour" },
  { key: "tracker", label: "Tracker", icon: "Kanban" },
  { key: "review", label: "Review", icon: "SealCheck" },
  { key: "modules", label: "Modules", icon: "SquaresFour" },
  { key: "people", label: "People & orgs", icon: "AddressBook" },
  { key: "settings", label: "Rules", icon: "SlidersHorizontal" },
];

export interface RoleContent {
  short: string;
  label: string;
  icon: string;
  greeting: string;
  sub: string;
  layoutReason: string;
  stats: { label: string; value: string; note: string; noteColor: string }[];
  narrative: string;
  bars: { label: string; meta: string; pct: string }[];
  sideTitle: string;
  side: { icon: string; title: string; meta: string }[];
}

export const ROLES: Record<Role, RoleContent> = {
  pm: {
    short: "PM",
    label: "Project Manager",
    icon: "Compass",
    greeting: "Good morning, Alex",
    sub: "Two things need you today. Everything else is moving.",
    layoutReason:
      "Chimpy built this view from what you opened last week — dates, blockers and the approval queue.",
    stats: [
      { label: "Progress", value: "78%", note: "Up 6 this week", noteColor: "#75798c" },
      { label: "Blocked items", value: "2", note: "Both on one dependency", noteColor: "#75798c" },
      { label: "Open risks", value: "1", note: "High severity", noteColor: "#a04a3c" },
      { label: "Days to review", value: "21", note: "25 September", noteColor: "#75798c" },
    ],
    narrative:
      "VectorNav firmware delivery moved from 6 September to 12 September, reducing the integration-testing window before Northstar's 25 September safety review.",
    bars: [
      { label: "Enclosure mechanical design", meta: "Jordan Lee · 55%", pct: "55%" },
      { label: "Corridor C navigation", meta: "Taylor Kim · 85%", pct: "85%" },
      { label: "Thermal camera validation", meta: "Taylor Kim · 25%", pct: "25%" },
    ],
    sideTitle: "Recently captured",
    side: [
      { icon: "Microphone", title: "VectorNav check-in notes", meta: "Routed to Dependencies, Risks · 3 Sep" },
      { icon: "EnvelopeSimple", title: "Sarah Chen — corridor access", meta: "Routed to Requirements, People · 28 Aug" },
      { icon: "GitPullRequest", title: "PR #148 merged · CI 18/18", meta: "Routed to TASK-104 · 2 Sep" },
    ],
  },
  hw: {
    short: "Hardware",
    label: "Hardware Engineer",
    icon: "Wrench",
    greeting: "Morning, Jordan",
    sub: "One tolerance change and a part that has not shipped.",
    layoutReason:
      "Chimpy noticed you only open mechanical items and vendor parts — it dropped the finance and reporting cards.",
    stats: [
      { label: "Open mech items", value: "3", note: "1 changed spec", noteColor: "#a04a3c" },
      { label: "Clearance margin", value: "−20mm", note: "640 against 620 target", noteColor: "#a04a3c" },
      { label: "Parts in transit", value: "2", note: "1 slipped 6 days", noteColor: "#75798c" },
      { label: "Bench time booked", value: "9h", note: "This week", noteColor: "#75798c" },
    ],
    narrative:
      "Northstar's Corridor C hatches are 620 mm. The current enclosure is 640 mm, so the redesign is on the critical path — nothing downstream can be validated until it closes.",
    bars: [
      { label: "Enclosure redesign", meta: "You · 55%", pct: "55%" },
      { label: "Mount bracket revision", meta: "You · 40%", pct: "40%" },
      { label: "Thermal payload fit check", meta: "Queued · 10%", pct: "10%" },
    ],
    sideTitle: "Parts & vendors",
    side: [
      { icon: "Package", title: "VectorNav IMU v2.4.1", meta: "Firmware slipped to 12 Sep" },
      { icon: "Ruler", title: "Enclosure shell, rev C", meta: "Machining quote pending" },
      { icon: "Thermometer", title: "Thermal camera mount", meta: "In stock" },
    ],
  },
  qa: {
    short: "QA",
    label: "Validation Engineer",
    icon: "CheckSquareOffset",
    greeting: "Morning, Sam",
    sub: "Software passes. Nothing has been validated on hardware yet.",
    layoutReason:
      "Chimpy split code status from physical status here — you flagged that distinction three times.",
    stats: [
      { label: "Sim tests passing", value: "18/18", note: "CI green since 2 Sep", noteColor: "#2f6b4f" },
      { label: "Field tests run", value: "0", note: "Blocked on firmware", noteColor: "#a04a3c" },
      { label: "Validation window", value: "3 days", note: "12 → 15 Sep", noteColor: "#a04a3c" },
      { label: "Open defects", value: "0", note: "None filed", noteColor: "#75798c" },
    ],
    narrative:
      "TASK-104 is code complete with CI at 18/18, but physical validation is blocked until VectorNav firmware v2.4.1 lands on 12 September. Three days remain before the demo.",
    bars: [
      { label: "Simulation coverage", meta: "Corridor C · 100%", pct: "100%" },
      { label: "Bench validation", meta: "Not started · 0%", pct: "2%" },
      { label: "Field validation", meta: "Blocked · 0%", pct: "2%" },
    ],
    sideTitle: "Validation queue",
    side: [
      { icon: "Flask", title: "Corridor routing, bench", meta: "Waiting on firmware" },
      { icon: "Drone", title: "Corridor routing, field", meta: "Window 18–20 Sep" },
      { icon: "Thermometer", title: "Thermal pipeline", meta: "Owner Taylor Kim" },
    ],
  },
  exec: {
    short: "Exec",
    label: "Executive",
    icon: "ChartLineUp",
    greeting: "Good morning",
    sub: "One customer date at risk. No budget movement.",
    layoutReason:
      "Chimpy stripped task detail from this view — you open dates, risk and commitments, nothing below that.",
    stats: [
      { label: "Date confidence", value: "62%", note: "Down from 84%", noteColor: "#a04a3c" },
      { label: "Contract value", value: "$1.4M", note: "Northstar pilot", noteColor: "#75798c" },
      { label: "Burn to date", value: "48%", note: "On plan", noteColor: "#2f6b4f" },
      { label: "Escalations", value: "1", note: "Vendor slip", noteColor: "#75798c" },
    ],
    narrative:
      "The 15 October pilot date holds, but the 25 September safety review demo now depends on a vendor delivery that already slipped once. One more slip moves the customer date.",
    bars: [
      { label: "Northstar pilot", meta: "At risk · 78%", pct: "78%" },
      { label: "Thermal Payload v2", meta: "On track · 41%", pct: "41%" },
    ],
    sideTitle: "Commitments made",
    side: [
      { icon: "Handshake", title: "Live demo before safety board", meta: "25 Sep · Northstar" },
      { icon: "CalendarCheck", title: "Pilot deployment", meta: "15 Oct · contractual" },
      { icon: "WarningDiamond", title: "Vendor firmware", meta: "Single point of failure" },
    ],
  },
};

export const COLS: { key: WorkItemStatus; label: string; empty: string }[] = [
  { key: "backlog", label: "Backlog", empty: "Nothing waiting" },
  { key: "todo", label: "Active", empty: "Drop work here" },
  { key: "blocked", label: "Blocked", empty: "Nothing blocked" },
  { key: "done", label: "Done", empty: "Nothing shipped yet" },
];

/** Non-column statuses collapse into the "Active" column for the kanban view. */
export function trackerColumnFor(status: WorkItemStatus): WorkItemStatus {
  if (status === "backlog" || status === "blocked" || status === "done") return status;
  return "todo";
}

export const PRIORITY_COLORS: Record<Priority, [string, string]> = {
  critical: ["#a04a3c", "#f7e7e2"],
  high: ["#8a5a2b", "#fbf1e4"],
  medium: ["#75798c", "#f8f8fb"],
  low: ["#75798c", "#f8f8fb"],
};

export const FILTERS: { key: "all" | "mine" | "blocked" | "critical"; label: string }[] = [
  { key: "all", label: "All work" },
  { key: "mine", label: "Mine" },
  { key: "blocked", label: "Blocked" },
  { key: "critical", label: "Critical & high" },
];

export interface ModuleContent {
  key: string;
  name: string;
  icon: string;
  mode: "Built in" | "Connected" | "Connector";
  detail: string;
  off: string;
}

export const MODULES: ModuleContent[] = [
  { key: "timeline", name: "Timeline", icon: "ChartBarHorizontal", mode: "Built in", detail: "Milestones and dependencies on one axis, driven by tracker dates.", off: "Turn on to place milestones on a shared axis." },
  { key: "calendar", name: "Calendar", icon: "CalendarBlank", mode: "Connected", detail: "Google Calendar · two-way. Chimpy proposes blocks, never books them.", off: "Connect a calendar or use the built-in one." },
  { key: "docs", name: "Docs & specs", icon: "FileText", mode: "Built in", detail: "Specs, source documents and every file capture has swallowed.", off: "Turn on to keep specs beside the work." },
  { key: "decisions", name: "Decisions log", icon: "Gavel", mode: "Built in", detail: "Every decision with who made it, when, and what it changed.", off: "Turn on to record decisions and their sources." },
  { key: "budget", name: "Budget", icon: "CurrencyCircleDollar", mode: "Connector", detail: "Point at a sheet or an ERP. Chimpy reads, never writes.", off: "Connect a sheet, an ERP, or track it here." },
  { key: "resourcing", name: "Resourcing", icon: "UsersThree", mode: "Built in", detail: "Who is committed to what, and where the week is oversubscribed.", off: "Turn on to see capacity against commitments." },
  { key: "approvals", name: "Approvals", icon: "Stamp", mode: "Built in", detail: "Sign-off chains for milestones and customer deliverables.", off: "Turn on to require sign-off on milestones." },
  { key: "vendor", name: "Vendor & procurement", icon: "Truck", mode: "Built in", detail: "Parts, lead times and the vendor contacts behind them.", off: "Turn on to track parts and lead times." },
  { key: "reports", name: "Reports", icon: "PresentationChart", mode: "Connector", detail: "Weekly status generated from records, exported where you want it.", off: "Turn on to generate status from the record set." },
];

export const RULES: { text: string; origin: string; source: "You" | "Chimpy" }[] = [
  { text: "if blocker is owned by an external org → dependency, not a task", origin: "Set up with the workspace", source: "You" },
  { text: "never move a booked calendar block without approval", origin: "Set up with the workspace", source: "You" },
  { text: "never email an external contact without approval", origin: "Set up with the workspace", source: "You" },
  { text: "if a slip shortens a window before a fixed customer date → raise risk severity", origin: "Learned after you did this manually three times · 2 Sep", source: "Chimpy" },
  { text: "load hermes:xlsx-reader when a workbook arrives, unload after", origin: "Learned from four spreadsheet captures · 28 Aug", source: "Chimpy" },
  { text: "code complete never sets physical validation to complete", origin: "You wrote this after PR #148 · 2 Sep", source: "You" },
];

export const CHIMPY_LOG: { icon: string; text: string; meta: string }[] = [
  { icon: "GitPullRequest", text: "PR #148 merged on navigation/corridor-c. Set TASK-104 code status to complete, left physical validation blocked.", meta: "09:14 · rule: code complete ≠ done" },
  { icon: "EnvelopeSimple", text: "Read the VectorNav email. Moved DEP-001 to 12 September and queued a risk update for you.", meta: "08:41 · awaiting approval" },
  { icon: "Plugs", text: "Loaded hermes:calendar-write to check the bench window, then unloaded it.", meta: "08:41" },
  { icon: "Sparkle", text: "Noticed you always assign corridor work to Taylor. Want me to make that a rule?", meta: "yesterday" },
];

export const CHIMPY_PROMPTS: string[] = [
  "What is actually blocking the 25 September demo?",
  "Draft the status note for Northstar",
  "What did you change while I was out?",
];

export const PALETTE_ITEMS: { icon: string; label: string; hint: string; screen: string | null }[] = [
  { icon: "SquaresFour", label: "Go to Overview", hint: "role view", screen: "overview" },
  { icon: "Kanban", label: "Go to Tracker", hint: "board", screen: "tracker" },
  { icon: "SealCheck", label: "Go to Review", hint: "pending", screen: "review" },
  { icon: "SlidersHorizontal", label: "Edit Chimpy's rules", hint: "settings", screen: "settings" },
  { icon: "Sparkle", label: "Ask Chimpy", hint: "panel", screen: null },
];
