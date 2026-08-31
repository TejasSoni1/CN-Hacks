import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import type {
  AIAnalysisResponse,
  AIProposal,
  ProposedChange,
  ProjectState,
} from "./types";
import { getExcelSheetNames } from "./store";

const analysisSchema = z.object({
  requirements_created: z.array(z.record(z.unknown())).default([]),
  work_items_created: z.array(z.record(z.unknown())).default([]),
  work_items_updated: z.array(z.record(z.unknown())).default([]),
  dependencies_created: z.array(z.record(z.unknown())).default([]),
  risks_created_or_updated: z.array(z.record(z.unknown())).default([]),
  decisions_detected: z.array(z.record(z.unknown())).default([]),
  recommended_actions: z.array(z.string()).default([]),
  human_review_required: z.boolean().default(true),
  summary: z.string(),
});

function buildContext(state: ProjectState, projectId: string) {
  const project = state.projects.find((p) => p.id === projectId);
  return {
    project,
    organizations: state.organizations,
    meetings: state.meetings.filter((m) => m.project_id === projectId),
    requirements: state.requirements.filter((r) => r.project_id === projectId),
    risks: state.risks.filter((r) => r.project_id === projectId),
    dependencies: state.dependencies.filter((d) => d.project_id === projectId),
    work_items: state.work_items.filter((w) => w.project_id === projectId),
    github_events: state.github_events,
    employees: state.employees,
  };
}

function responseToChanges(
  response: AIAnalysisResponse,
  trigger: string,
  triggerType: AIProposal["trigger_type"]
): ProposedChange[] {
  const changes: ProposedChange[] = [];
  let idx = 0;

  const add = (
    action: ProposedChange["action"],
    title: string,
    description: string,
    reasoning: string,
    confidence: number,
    source: string,
    affected: string[],
    payload: Record<string, unknown>,
    rule?: string
  ) => {
    changes.push({
      id: `CHG-${Date.now()}-${idx++}`,
      action,
      title,
      description,
      reasoning,
      rule,
      confidence,
      source,
      affected_records: affected,
      payload,
      approval: "pending",
    });
  };

  for (const req of response.requirements_created) {
    add(
      "create_requirement",
      String(req.title ?? "New requirement"),
      String(req.description ?? ""),
      String(req.reasoning ?? response.summary),
      Number(req.confidence ?? 0.85),
      String(req.source ?? trigger),
      (req.affected_records as string[]) ?? [],
      req,
      req.rule ? String(req.rule) : undefined
    );
  }

  for (const wi of response.work_items_created) {
    add(
      "create_work_item",
      String(wi.title ?? "New work item"),
      String(wi.description ?? ""),
      String(wi.reasoning ?? response.summary),
      Number(wi.confidence ?? 0.85),
      String(wi.source ?? trigger),
      (wi.affected_records as string[]) ?? [],
      wi,
      wi.rule ? String(wi.rule) : undefined
    );
  }

  for (const wi of response.work_items_updated) {
    add(
      "update_work_item",
      String(wi.title ?? "Update work item"),
      String(wi.description ?? ""),
      String(wi.reasoning ?? response.summary),
      Number(wi.confidence ?? 0.85),
      String(wi.source ?? trigger),
      (wi.affected_records as string[]) ?? [String(wi.id ?? "")],
      wi,
      wi.rule ? String(wi.rule) : undefined
    );
  }

  for (const dep of response.dependencies_created) {
    add(
      "create_dependency",
      String(dep.title ?? "New dependency"),
      String(dep.description ?? ""),
      String(dep.reasoning ?? response.summary),
      Number(dep.confidence ?? 0.85),
      String(dep.source ?? trigger),
      (dep.affected_records as string[]) ?? [],
      dep,
      dep.rule ? String(dep.rule) : undefined
    );
  }

  for (const risk of response.risks_created_or_updated) {
    add(
      "create_or_update_risk",
      String(risk.title ?? "Risk update"),
      String(risk.description ?? ""),
      String(risk.reasoning ?? response.summary),
      Number(risk.confidence ?? 0.85),
      String(risk.source ?? trigger),
      (risk.affected_records as string[]) ?? [],
      risk,
      risk.rule ? String(risk.rule) : undefined
    );
  }

  for (const action of response.recommended_actions) {
    add(
      "recommended_action",
      action,
      action,
      response.summary,
      0.75,
      trigger,
      [],
      { action }
    );
  }

  return changes;
}

export function mockMeetingAnalysis(
  state: ProjectState,
  meetingId: string
): AIProposal {
  const meeting = state.meetings.find((m) => m.id === meetingId);
  const trigger = meeting?.title ?? "Design Review Meeting";

  const response: AIAnalysisResponse = {
    summary:
      "Design review reveals 620mm clearance requirement vs 640mm enclosure. Firmware dependency and immovable pilot date create schedule risk.",
    human_review_required: true,
    requirements_created: [
      {
        title: "Drone maximum width: 620mm",
        description:
          "Northstar requires drone to fit through 620mm Corridor C access hatches.",
        source: meetingId,
        reasoning: "Customer stated hard physical constraint in design review.",
        rule: "if statement contains a measured constraint → requirement",
        confidence: 0.95,
        project_id: "PROJ-001",
        status: "proposed",
      },
    ],
    work_items_created: [
      {
        type: "task",
        title: "Redesign enclosure for 620mm clearance",
        description:
          "Mechanical redesign from 640mm to ≤620mm width before pilot.",
        owner_id: "EMP-002",
        priority: "critical",
        due_date: "2025-09-18",
        source: meetingId,
        reasoning: "Current design exceeds customer clearance by 20mm.",
        rule: "if new requirement conflicts with an open item → flag the item",
        confidence: 0.92,
        project_id: "PROJ-001",
      },
    ],
    work_items_updated: [],
    dependencies_created: [
      {
        title: "VectorNav firmware for navigation testing",
        description: "Field navigation testing blocked until firmware delivery.",
        owner_id: "EMP-003",
        external_org_id: "ORG-003",
        expected_date: "2025-09-06",
        source: meetingId,
        reasoning: "Meeting notes tie corridor testing to VectorNav firmware.",
        rule: "if blocker is owned by an external org → dependency",
        confidence: 0.88,
        project_id: "PROJ-001",
      },
    ],
    risks_created_or_updated: [
      {
        title: "Hardware redesign + firmware dependency compress testing window",
        description:
          "Enclosure redesign and VectorNav dependency reduce time before September 25 safety review demo.",
        severity: "high",
        source: meetingId,
        reasoning: "Pilot date fixed; multiple parallel blockers.",
        rule: "if a slip shortens a window before a fixed customer date → raise severity",
        confidence: 0.9,
        project_id: "PROJ-001",
      },
    ],
    decisions_detected: [
      {
        title: "October 15 pilot date is fixed",
        description: "Northstar confirmed final pilot cannot move.",
        source: meetingId,
      },
    ],
    recommended_actions: [
      "Prioritize enclosure redesign mechanical validation",
      "Prepare integration test plan for post-firmware delivery",
      "Schedule demo rehearsal before September 25 safety review",
    ],
  };

  return {
    id: `PROP-${Date.now()}`,
    trigger,
    trigger_type: "meeting",
    created_at: new Date().toISOString(),
    status: "pending",
    human_review_required: true,
    summary: response.summary,
    changes: responseToChanges(response, trigger, "meeting"),
    raw_response: response,
  };
}

export function mockGithubAnalysis(
  state: ProjectState,
  eventId: string
): AIProposal {
  const event = state.github_events.find((e) => e.id === eventId);
  const trigger = event
    ? `PR #${event.pr_number} merged — ${event.title}`
    : "GitHub PR merged";

  const response: AIAnalysisResponse = {
    summary:
      "Software implementation for Corridor C navigation is complete (CI 18/18). Physical validation remains blocked by VectorNav firmware — overall deliverable stays In Progress / Blocked.",
    human_review_required: true,
    requirements_created: [],
    work_items_created: [],
    work_items_updated: [
      {
        id: "TASK-104",
        title: "Corridor C Navigation",
        code_status: "complete",
        ci_status: "passed",
        physical_validation: "blocked",
        status: "blocked",
        reasoning:
          "PR merged and tests pass, but field validation depends on external firmware.",
        rule: "code complete never sets physical validation to complete",
        confidence: 0.93,
        source: eventId,
        related_github: "PR #148",
      },
    ],
    dependencies_created: [],
    risks_created_or_updated: [],
    decisions_detected: [],
    recommended_actions: [
      "Do not mark TASK-104 Done — track software complete separately from validation",
      "Continue enclosure redesign in parallel",
      "Prepare integration test plan for firmware arrival",
    ],
  };

  return {
    id: `PROP-${Date.now()}`,
    trigger,
    trigger_type: "github",
    created_at: new Date().toISOString(),
    status: "pending",
    human_review_required: true,
    summary: response.summary,
    changes: responseToChanges(response, trigger, "github"),
    raw_response: response,
  };
}

export function mockVendorAnalysis(state: ProjectState): AIProposal {
  const trigger = "VectorNav firmware delivery date change (Sep 6 → Sep 12)";

  const response: AIAnalysisResponse = {
    summary:
      "VectorNav firmware moved to September 12. This impacts navigation integration, demo video, and safety-review milestone — project risk elevated.",
    human_review_required: true,
    requirements_created: [],
    work_items_created: [],
    work_items_updated: [
      {
        id: "DEP-001",
        expected_date: "2025-09-12",
        status: "pending",
        reasoning: "Vendor communicated new delivery date.",
        rule: "if a date on a tracked dependency changes → update, do not duplicate",
        confidence: 0.97,
        source: "MTG-003",
      },
      {
        id: "TASK-104",
        status: "blocked",
        physical_validation: "blocked",
        reasoning: "Integration testing window shortened by 6 days.",
        rule: "if a slip shortens a window before a fixed date → raise severity",
        confidence: 0.9,
        source: "MTG-003",
      },
      {
        id: "MS-001",
        status: "blocked",
        reasoning: "Safety review demo depends on firmware and enclosure work.",
        rule: "if an upstream dependency slips → cascade to dependent milestones",
        confidence: 0.88,
        source: "MTG-003",
      },
    ],
    dependencies_created: [],
    risks_created_or_updated: [
      {
        id: "RISK-001",
        title: "Integration window compressed — firmware slip",
        description:
          "6-day firmware delay reduces integration testing before September 25 safety review.",
        severity: "critical",
        status: "open",
        reasoning: "Cascade impact on navigation, demo, and milestone.",
        rule: "if a slip shortens a window before a fixed date → raise severity",
        confidence: 0.94,
        source: "MTG-003",
      },
    ],
    decisions_detected: [],
    recommended_actions: [
      "Complete enclosure redesign while navigation remains blocked",
      "Run mechanical-clearance validation",
      "Advance thermal-camera testing",
      "Prepare integration test plan",
      "Target September 22 for demo video completion",
      "Schedule firmware testing immediately after September 12 delivery",
    ],
  };

  return {
    id: `PROP-${Date.now()}`,
    trigger,
    trigger_type: "vendor",
    created_at: new Date().toISOString(),
    status: "pending",
    human_review_required: true,
    summary: response.summary,
    changes: responseToChanges(response, trigger, "vendor"),
    raw_response: response,
  };
}

export function mockContactAnalysis(state: ProjectState): AIProposal {
  const trigger = "Contact captured — Priya Raman";
  const alreadyExists = state.contacts.some(
    (c) => c.email === "priya.raman@northstar-energy.com"
  );

  const changes: ProposedChange[] = [
    {
      id: `CHG-${Date.now()}-0`,
      action: "create_contact",
      title: "Priya Raman added",
      description: "Northstar Energy · Safety Board Chair.",
      reasoning: "Email domain matched an existing customer org.",
      rule: "if a name carries an org and a title → contact",
      confidence: 0.93,
      source: "Captured contact",
      affected_records: [],
      payload: {
        id: "CON-003",
        organization_id: "ORG-002",
        name: "Priya Raman",
        role: "Safety Board Chair",
        email: "priya.raman@northstar-energy.com",
      },
      approval: "pending",
    },
  ];

  const summary = alreadyExists
    ? "Priya Raman is already in the CRM as Northstar's Safety Board Chair."
    : "Priya Raman added as Northstar's Safety Board Chair — met at the design review, she signs off the September 25 demo.";

  return {
    id: `PROP-${Date.now()}`,
    trigger,
    trigger_type: "manual",
    created_at: new Date().toISOString(),
    status: "pending",
    human_review_required: true,
    summary,
    changes,
  };
}

export function mockTaskAnalysis(state: ProjectState): AIProposal {
  const trigger = "Task captured — reminder for Jordan";
  const jordan = state.employees.find((e) => e.name === "Jordan Lee");

  const changes: ProposedChange[] = [
    {
      id: `CHG-${Date.now()}-0`,
      action: "create_work_item",
      title: "Enclosure spec due Thursday",
      description: "Assigned to Jordan Lee, due 11 September, linked to TASK-101.",
      reasoning: "Jordan Lee is the only Jordan on this project.",
      rule: "if a sentence has an owner and a date → work item",
      confidence: 0.9,
      source: "Captured task",
      affected_records: ["TASK-101"],
      payload: {
        type: "task",
        title: "Enclosure spec due Thursday",
        description: "Confirm the enclosure spec ahead of the 620mm redesign.",
        owner_id: jordan?.id ?? "EMP-002",
        priority: "high",
        due_date: "2025-09-11",
        project_id: "PROJ-001",
        source: "Captured task",
      },
      approval: "pending",
    },
  ];

  return {
    id: `PROP-${Date.now()}`,
    trigger,
    trigger_type: "manual",
    created_at: new Date().toISOString(),
    status: "pending",
    human_review_required: true,
    summary:
      "Reminder filed: Jordan Lee owns the enclosure spec, due Thursday 11 September.",
    changes,
  };
}

export function mockPlanAnalysis(state: ProjectState): AIProposal {
  const trigger = "Whole plan captured — Thermal Payload v2";
  const alreadyExists = state.projects.some((p) => p.id === "PROJ-002");

  const changes: ProposedChange[] = [
    {
      id: `CHG-${Date.now()}-0`,
      action: "create_project",
      title: "Thermal Payload v2 drafted",
      description: "Three phases, two owners, November demo.",
      reasoning: "Structure matched a plan, not a task.",
      rule: "if input names phases and owners → project skeleton",
      confidence: 0.9,
      source: "Captured plan",
      affected_records: [],
      payload: {
        id: "PROJ-002",
        name: "Thermal Payload v2",
        status: "on_track",
        target_date: "2025-11-15",
        pm_id: "EMP-001",
        customer_org_id: "ORG-001",
        description:
          "Bench prototype by mid-October, two-week integration with the existing airframe, customer demo in November. Jordan on mechanical, Taylor on firmware.",
        accentColor: "#5f9c7c",
        milestones: [
          { id: "MS-002", title: "Bench prototype", due_date: "2025-10-15", owner_id: "EMP-002" },
          { id: "MS-003", title: "Airframe integration", due_date: "2025-10-29", owner_id: "EMP-004" },
          { id: "MS-004", title: "Customer demo", due_date: "2025-11-15", owner_id: "EMP-001" },
        ],
      },
      approval: "pending",
    },
    {
      id: `CHG-${Date.now()}-1`,
      action: "create_dependency",
      title: "Thermal vendor selection",
      description: "Created as a blocking dependency before phase one.",
      reasoning: "“needs … first” marks a gate.",
      rule: "if a phase is gated on a supplier → dependency",
      confidence: 0.88,
      source: "Captured plan",
      affected_records: [],
      payload: {
        title: "Thermal vendor selection",
        description: "Select a thermal vendor before the bench-prototype phase begins.",
        owner_id: "EMP-003",
        project_id: "PROJ-002",
        status: "pending",
      },
      approval: "pending",
    },
  ];

  return {
    id: `PROP-${Date.now()}`,
    trigger,
    trigger_type: "manual",
    created_at: new Date().toISOString(),
    status: "pending",
    human_review_required: true,
    summary: alreadyExists
      ? "Thermal Payload v2 already drafted — no changes needed."
      : "Thermal Payload v2 drafted: bench prototype, airframe integration, and a November customer demo — gated on a thermal vendor selection.",
    changes,
  };
}

export function mockFileAnalysis(state: ProjectState): AIProposal {
  const sheetNames = getExcelSheetNames();
  const trigger = "File captured — chimpmanager_ai_hackathon_demo_database.xlsx";
  const orgCount = state.organizations.length;
  const contactCount = state.contacts.length;
  const matchedIds = ["TASK-101", "TASK-104", "TASK-105", "MS-001"].filter((id) =>
    state.work_items.some((w) => w.id === id)
  );

  const changes: ProposedChange[] = [
    {
      id: `CHG-${Date.now()}-0`,
      action: "recommended_action",
      title: `${orgCount} orgs, ${contactCount} contacts imported`,
      description: "AeroSight, Northstar Energy, VectorNav Components.",
      reasoning: "Sheet headers matched known entity shapes.",
      rule: "load hermes:xlsx-reader when a workbook arrives",
      confidence: 0.95,
      source: "chimpmanager_ai_hackathon_demo_database.xlsx",
      affected_records: [],
      payload: { action: "People & orgs already up to date" },
      approval: "pending",
    },
    {
      id: `CHG-${Date.now()}-1`,
      action: "recommended_action",
      title: `${matchedIds.length} work items matched`,
      description: "Existing records updated rather than duplicated.",
      reasoning: `${matchedIds.join(", ")} already exist.`,
      rule: "match on id column before insert",
      confidence: 0.92,
      source: "chimpmanager_ai_hackathon_demo_database.xlsx",
      affected_records: matchedIds,
      payload: { action: "Tracker already up to date" },
      approval: "pending",
    },
    {
      id: `CHG-${Date.now()}-2`,
      action: "recommended_action",
      title: "Workbook stored as source",
      description: `Kept as the origin document for ${sheetNames.length} sheets.`,
      reasoning: "Imported records need a provenance link.",
      rule: "always retain the source document",
      confidence: 0.9,
      source: "chimpmanager_ai_hackathon_demo_database.xlsx",
      affected_records: [],
      payload: { action: "Docs & specs already up to date" },
      approval: "pending",
    },
  ];

  return {
    id: `PROP-${Date.now()}`,
    trigger,
    trigger_type: "manual",
    created_at: new Date().toISOString(),
    status: "pending",
    human_review_required: true,
    summary: `Workbook loaded — ${sheetNames.length} sheets (${sheetNames.slice(0, 4).join(", ")}${sheetNames.length > 4 ? "…" : ""}). ${orgCount} orgs and ${contactCount} contacts matched against the CRM; ${matchedIds.length} tracker items matched by id.`,
    changes,
  };
}

export async function analyzeWithClaude(
  state: ProjectState,
  projectId: string,
  event: { type: string; content: string; meeting_id?: string }
): Promise<AIProposal> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    if (event.type === "meeting" && event.meeting_id) {
      return mockMeetingAnalysis(state, event.meeting_id);
    }
    if (event.type === "github") {
      return mockGithubAnalysis(state, "GH-001");
    }
    if (event.type === "vendor") {
      return mockVendorAnalysis(state);
    }
    return mockMeetingAnalysis(state, "MTG-002");
  }

  const client = new Anthropic({ apiKey });
  const context = buildContext(state, projectId);

  const systemPrompt = `You are ChimpManager AI, an AI-native project management analyst.
Structured project data is the source of truth. Analyze new events and return ONLY valid JSON matching this schema:
{
  "requirements_created": [{ "title", "description", "source", "reasoning", "confidence", "project_id", "affected_records" }],
  "work_items_created": [{ "type", "title", "description", "owner_id", "priority", "due_date", "source", "reasoning", "confidence", "project_id" }],
  "work_items_updated": [{ "id", "title", "status", "code_status", "ci_status", "physical_validation", "reasoning", "confidence", "source" }],
  "dependencies_created": [{ "title", "description", "owner_id", "external_org_id", "expected_date", "source", "reasoning", "confidence", "project_id" }],
  "risks_created_or_updated": [{ "id", "title", "description", "severity", "status", "source", "reasoning", "confidence", "project_id" }],
  "decisions_detected": [{ "title", "description", "source" }],
  "recommended_actions": ["string"],
  "human_review_required": true,
  "summary": "string"
}
Do not mark work complete when external dependencies block validation. Connect GitHub CI to code_status but keep physical_validation separate.`;

  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    system: systemPrompt,
    messages: [
      {
        role: "user",
        content: JSON.stringify({
          event,
          context,
        }),
      },
    ],
  });

  const text =
    message.content[0].type === "text" ? message.content[0].text : "";
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : {};
  const validated = analysisSchema.parse(parsed);

  const response: AIAnalysisResponse = validated;
  const trigger =
    event.type === "meeting"
      ? "Meeting notes analyzed"
      : event.type === "github"
        ? "GitHub event"
        : "Vendor update";

  return {
    id: `PROP-${Date.now()}`,
    trigger,
    trigger_type: event.type as AIProposal["trigger_type"],
    created_at: new Date().toISOString(),
    status: "pending",
    human_review_required: response.human_review_required,
    summary: response.summary,
    changes: responseToChanges(response, trigger, event.type as AIProposal["trigger_type"]),
    raw_response: response,
  };
}

export function applyApprovedChanges(
  state: ProjectState,
  proposal: AIProposal
): ProjectState {
  const next = structuredClone(state);
  const approved = proposal.changes.filter((c) => c.approval === "approved");

  for (const change of approved) {
    const p = change.payload;

    switch (change.action) {
      case "create_requirement": {
        const id = `REQ-${Date.now().toString(36)}`;
        next.requirements.push({
          id,
          project_id: String(p.project_id ?? "PROJ-001"),
          title: String(p.title ?? change.title),
          description: String(p.description ?? change.description),
          source_meeting_id: String(p.source ?? "").startsWith("MTG")
            ? String(p.source)
            : undefined,
          status: "approved",
        });
        break;
      }
      case "create_work_item": {
        const id = `TASK-${Date.now().toString(36).slice(-4)}`;
        next.work_items.push({
          id,
          type: (p.type as "task") ?? "task",
          title: String(p.title ?? change.title),
          description: String(p.description ?? change.description),
          project_id: String(p.project_id ?? "PROJ-001"),
          owner_id: String(p.owner_id ?? "EMP-001"),
          status: "todo",
          priority: (p.priority as "high") ?? "medium",
          due_date: p.due_date ? String(p.due_date) : undefined,
          dependencies: [],
          source: String(p.source ?? change.source),
          history: [
            {
              at: new Date().toISOString().slice(0, 10),
              event: `Created via AI proposal ${proposal.id}`,
            },
          ],
        });
        break;
      }
      case "update_work_item": {
        const wi = next.work_items.find((w) => w.id === p.id);
        if (wi) {
          if (p.status) wi.status = p.status as typeof wi.status;
          if (p.code_status) wi.code_status = p.code_status as typeof wi.code_status;
          if (p.ci_status) wi.ci_status = p.ci_status as typeof wi.ci_status;
          if (p.physical_validation)
            wi.physical_validation = p.physical_validation as typeof wi.physical_validation;
          if (p.related_github) wi.related_github = String(p.related_github);
          wi.history.push({
            at: new Date().toISOString().slice(0, 10),
            event: change.title,
          });
        }
        break;
      }
      case "create_dependency": {
        const exists = next.dependencies.some(
          (d) => d.title === String(p.title)
        );
        if (!exists) {
          next.dependencies.push({
            id: `DEP-${Date.now().toString(36).slice(-4)}`,
            project_id: String(p.project_id ?? "PROJ-001"),
            title: String(p.title ?? change.title),
            description: String(p.description ?? change.description),
            owner_id: String(p.owner_id ?? "EMP-003"),
            external_org_id: p.external_org_id
              ? String(p.external_org_id)
              : undefined,
            expected_date: p.expected_date ? String(p.expected_date) : undefined,
            status: "pending",
          });
        }
        break;
      }
      case "create_or_update_risk": {
        const existing = p.id
          ? next.risks.find((r) => r.id === p.id)
          : undefined;
        if (existing) {
          if (p.title) existing.title = String(p.title);
          if (p.description) existing.description = String(p.description);
          if (p.severity) existing.severity = p.severity as typeof existing.severity;
        } else {
          next.risks.push({
            id: `RISK-${Date.now().toString(36).slice(-4)}`,
            project_id: String(p.project_id ?? "PROJ-001"),
            title: String(p.title ?? change.title),
            description: String(p.description ?? change.description),
            severity: (p.severity as "high") ?? "high",
            status: "open",
            source: String(p.source ?? change.source),
          });
        }
        break;
      }
      case "create_contact": {
        const exists = next.contacts.some((c) => c.email === String(p.email));
        if (!exists) {
          next.contacts.push({
            id: String(p.id ?? `CON-${Date.now().toString(36).slice(-4)}`),
            organization_id: String(p.organization_id ?? "ORG-002"),
            name: String(p.name ?? change.title),
            role: String(p.role ?? ""),
            email: String(p.email ?? ""),
          });
        }
        break;
      }
      case "create_project": {
        const id = String(p.id ?? `PROJ-${Date.now().toString(36).slice(-4)}`);
        const exists = next.projects.some((proj) => proj.id === id);
        if (!exists) {
          next.projects.push({
            id,
            name: String(p.name ?? change.title),
            status: (p.status as "on_track") ?? "on_track",
            target_date: String(p.target_date ?? ""),
            pm_id: String(p.pm_id ?? "EMP-001"),
            customer_org_id: String(p.customer_org_id ?? "ORG-001"),
            description: String(p.description ?? change.description),
            accentColor: p.accentColor ? String(p.accentColor) : undefined,
          });

          const milestones = Array.isArray(p.milestones)
            ? (p.milestones as Array<Record<string, unknown>>)
            : [];
          for (const m of milestones) {
            next.work_items.push({
              id: String(m.id ?? `MS-${Date.now().toString(36).slice(-4)}`),
              type: "milestone",
              title: String(m.title ?? "Milestone"),
              description: String(m.title ?? ""),
              project_id: id,
              owner_id: String(m.owner_id ?? "EMP-001"),
              status: "backlog",
              priority: "medium",
              due_date: m.due_date ? String(m.due_date) : undefined,
              dependencies: [],
              source: `Applied from AI proposal ${proposal.id}`,
              history: [
                {
                  at: new Date().toISOString().slice(0, 10),
                  event: `Created via AI proposal ${proposal.id}`,
                },
              ],
            });
          }
        }
        break;
      }
      default:
        break;
    }
  }

  if (proposal.raw_response?.summary) {
    next.ai_summary = proposal.raw_response.summary;
  }

  const meetingId = proposal.raw_response?.requirements_created?.[0]?.source;
  if (typeof meetingId === "string" && meetingId.startsWith("MTG")) {
    const meeting = next.meetings.find((m) => m.id === meetingId);
    if (meeting) meeting.processed = true;
  }

  proposal.status =
    approved.length === proposal.changes.length
      ? "approved"
      : approved.length > 0
        ? "partial"
        : proposal.status;

  next.ai_proposals = [...next.ai_proposals.filter((p) => p.id !== proposal.id), proposal];

  const proj = next.projects.find((p) => p.id === "PROJ-001");
  if (proj && next.risks.some((r) => r.severity === "critical" || r.severity === "high")) {
    proj.status = "at_risk";
  }

  return next;
}
