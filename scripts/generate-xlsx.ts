import * as XLSX from "xlsx";
import path from "path";
import { initialState } from "../src/lib/seed-data";

const outPath = path.join(
  process.cwd(),
  "chimpmanager_ai_hackathon_demo_database.xlsx"
);

const wb = XLSX.utils.book_new();

function addSheet(name: string, rows: Record<string, unknown>[]) {
  const ws = XLSX.utils.json_to_sheet(rows);
  XLSX.utils.book_append_sheet(wb, ws, name);
}

addSheet(
  "organizations",
  initialState.organizations.map((o) => ({
    id: o.id,
    name: o.name,
    type: o.type,
    industry: o.industry ?? "",
    notes: o.notes ?? "",
  }))
);

addSheet(
  "contacts",
  initialState.contacts.map((c) => ({
    id: c.id,
    organization_id: c.organization_id,
    name: c.name,
    role: c.role,
    email: c.email,
  }))
);

addSheet(
  "employees",
  initialState.employees.map((e) => ({
    id: e.id,
    name: e.name,
    role: e.role,
    email: e.email,
    department: e.department,
  }))
);

addSheet(
  "projects",
  initialState.projects.map((p) => ({
    id: p.id,
    name: p.name,
    status: p.status,
    target_date: p.target_date,
    pm_id: p.pm_id,
    customer_org_id: p.customer_org_id,
    description: p.description,
  }))
);

addSheet(
  "meetings",
  initialState.meetings.map((m) => ({
    id: m.id,
    project_id: m.project_id,
    title: m.title,
    date: m.date,
    attendees: m.attendees.join(";"),
    notes: m.notes,
    processed: m.processed ? "yes" : "no",
  }))
);

addSheet(
  "requirements",
  initialState.requirements.map((r) => ({
    id: r.id,
    project_id: r.project_id,
    title: r.title,
    description: r.description,
    source_meeting_id: r.source_meeting_id ?? "",
    status: r.status,
  }))
);

addSheet(
  "risks",
  initialState.risks.map((r) => ({
    id: r.id,
    project_id: r.project_id,
    title: r.title,
    description: r.description,
    severity: r.severity,
    status: r.status,
    source: r.source ?? "",
  }))
);

addSheet(
  "dependencies",
  initialState.dependencies.map((d) => ({
    id: d.id,
    project_id: d.project_id,
    title: d.title,
    description: d.description,
    owner_id: d.owner_id,
    external_org_id: d.external_org_id ?? "",
    expected_date: d.expected_date ?? "",
    status: d.status,
  }))
);

addSheet(
  "work_items",
  initialState.work_items.map((w) => ({
    id: w.id,
    type: w.type,
    title: w.title,
    description: w.description,
    project_id: w.project_id,
    owner_id: w.owner_id,
    status: w.status,
    priority: w.priority,
    due_date: w.due_date ?? "",
    dependencies: w.dependencies.join(";"),
    source: w.source ?? "",
    related_meeting_id: w.related_meeting_id ?? "",
    related_github: w.related_github ?? "",
    acceptance_criteria: w.acceptance_criteria ?? "",
    code_status: w.code_status ?? "",
    ci_status: w.ci_status ?? "",
    physical_validation: w.physical_validation ?? "",
  }))
);

addSheet(
  "project_assignments",
  initialState.employees.map((e) => ({
    employee_id: e.id,
    project_id: "PROJ-001",
    role: e.role,
  }))
);

addSheet(
  "stakeholder_relationships",
  [
    {
      project_id: "PROJ-001",
      contact_id: "CON-001",
      relationship: "customer_sponsor",
    },
    {
      project_id: "PROJ-001",
      contact_id: "CON-002",
      relationship: "vendor_account",
    },
  ]
);

addSheet(
  "actions",
  [
    {
      id: "ACT-001",
      project_id: "PROJ-001",
      meeting_id: "MTG-002",
      description: "Mechanical team to assess 620mm redesign options",
      owner_id: "EMP-002",
      due_date: "2025-09-05",
      status: "open",
    },
  ]
);

addSheet(
  "development_requests",
  [
    {
      id: "DEV-001",
      project_id: "PROJ-001",
      title: "Corridor C navigation module",
      linked_work_item: "TASK-104",
      github_repo: "aerosight/northstar-inspection-drone",
    },
  ]
);

addSheet(
  "milestones",
  initialState.work_items
    .filter((w) => w.type === "milestone")
    .map((m) => ({
      id: m.id,
      project_id: m.project_id,
      title: m.title,
      due_date: m.due_date ?? "",
      status: m.status,
    }))
);

XLSX.writeFile(wb, outPath);
console.log(`Wrote ${outPath}`);
