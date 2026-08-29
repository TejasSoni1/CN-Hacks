export type WorkItemType =
  | "task"
  | "feature"
  | "bug"
  | "risk"
  | "dependency"
  | "decision"
  | "requirement"
  | "milestone";

export type WorkItemStatus =
  | "backlog"
  | "todo"
  | "in_progress"
  | "blocked"
  | "review"
  | "done";

export type Priority = "critical" | "high" | "medium" | "low";

export interface Organization {
  id: string;
  name: string;
  type: "internal" | "customer" | "vendor";
  industry?: string;
  notes?: string;
}

export interface Contact {
  id: string;
  organization_id: string;
  name: string;
  role: string;
  email: string;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  email: string;
  department: string;
}

export interface Project {
  id: string;
  name: string;
  status: "on_track" | "at_risk" | "blocked" | "completed";
  target_date: string;
  pm_id: string;
  customer_org_id: string;
  description: string;
  summary?: string;
}

export interface Meeting {
  id: string;
  project_id: string;
  title: string;
  date: string;
  attendees: string[];
  notes: string;
  processed?: boolean;
}

export interface Requirement {
  id: string;
  project_id: string;
  title: string;
  description: string;
  source_meeting_id?: string;
  status: "proposed" | "approved" | "rejected";
}

export interface Risk {
  id: string;
  project_id: string;
  title: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  status: "open" | "mitigated" | "closed";
  source?: string;
}

export interface Dependency {
  id: string;
  project_id: string;
  title: string;
  description: string;
  owner_id: string;
  external_org_id?: string;
  expected_date?: string;
  status: "pending" | "blocked" | "resolved";
}

export interface WorkItem {
  id: string;
  type: WorkItemType;
  title: string;
  description: string;
  project_id: string;
  owner_id: string;
  status: WorkItemStatus;
  priority: Priority;
  due_date?: string;
  dependencies: string[];
  source?: string;
  related_meeting_id?: string;
  related_github?: string;
  acceptance_criteria?: string;
  code_status?: "not_started" | "in_progress" | "complete";
  ci_status?: "unknown" | "passed" | "failed";
  physical_validation?: "not_started" | "in_progress" | "blocked" | "complete";
  history: { at: string; event: string }[];
}

export interface GitHubEvent {
  id: string;
  type:
    | "commit"
    | "pr_opened"
    | "pr_merged"
    | "ci_passed"
    | "ci_failed"
    | "issue";
  title: string;
  description: string;
  repo: string;
  ref?: string;
  pr_number?: number;
  work_item_id?: string;
  at: string;
  ci_tests_passed?: number;
  ci_tests_total?: number;
}

export interface AIProposal {
  id: string;
  trigger: string;
  trigger_type: "meeting" | "github" | "vendor" | "milestone" | "manual";
  created_at: string;
  status: "pending" | "approved" | "rejected" | "partial";
  human_review_required: boolean;
  summary: string;
  changes: ProposedChange[];
  raw_response?: AIAnalysisResponse;
}

export interface ProposedChange {
  id: string;
  action:
    | "create_requirement"
    | "create_work_item"
    | "update_work_item"
    | "create_dependency"
    | "create_or_update_risk"
    | "create_decision"
    | "recommended_action";
  title: string;
  description: string;
  reasoning: string;
  confidence: number;
  source: string;
  affected_records: string[];
  payload: Record<string, unknown>;
  approval: "pending" | "approved" | "rejected";
}

export interface AIAnalysisResponse {
  requirements_created: Array<Record<string, unknown>>;
  work_items_created: Array<Record<string, unknown>>;
  work_items_updated: Array<Record<string, unknown>>;
  dependencies_created: Array<Record<string, unknown>>;
  risks_created_or_updated: Array<Record<string, unknown>>;
  decisions_detected: Array<Record<string, unknown>>;
  recommended_actions: string[];
  human_review_required: boolean;
  summary: string;
}

export interface ProjectState {
  organizations: Organization[];
  contacts: Contact[];
  employees: Employee[];
  projects: Project[];
  meetings: Meeting[];
  requirements: Requirement[];
  risks: Risk[];
  dependencies: Dependency[];
  work_items: WorkItem[];
  github_events: GitHubEvent[];
  ai_proposals: AIProposal[];
  ai_summary: string;
}
