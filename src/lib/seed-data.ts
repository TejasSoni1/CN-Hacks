import type { ProjectState } from "./types";

export const PROJECT_ID = "PROJ-001";

export const initialState: ProjectState = {
  ai_summary:
    "Northstar Autonomous Inspection Pilot is at risk. VectorNav firmware delivery moved from September 6 to September 12, reducing integration-testing window before Northstar's September 25 safety review.",
  organizations: [
    {
      id: "ORG-001",
      name: "AeroSight Robotics",
      type: "internal",
      industry: "Robotics / Autonomous Systems",
    },
    {
      id: "ORG-002",
      name: "Northstar Energy",
      type: "customer",
      industry: "Energy / Utilities",
    },
    {
      id: "ORG-003",
      name: "VectorNav Components",
      type: "vendor",
      industry: "Navigation / IMU Hardware",
    },
  ],
  contacts: [
    {
      id: "CON-001",
      organization_id: "ORG-002",
      name: "Sarah Chen",
      role: "Director of Operations",
      email: "sarah.chen@northstar-energy.com",
    },
    {
      id: "CON-002",
      organization_id: "ORG-003",
      name: "Marcus Webb",
      role: "Account Manager",
      email: "marcus.webb@vectornav.com",
    },
  ],
  employees: [
    {
      id: "EMP-001",
      name: "Alex Morgan",
      role: "Project Manager",
      email: "alex.morgan@aerosight.io",
      department: "Program Management",
    },
    {
      id: "EMP-002",
      name: "Jordan Lee",
      role: "Mechanical Engineer",
      email: "jordan.lee@aerosight.io",
      department: "Hardware",
    },
    {
      id: "EMP-003",
      name: "Sam Rivera",
      role: "Engineering Lead",
      email: "sam.rivera@aerosight.io",
      department: "Software",
    },
    {
      id: "EMP-004",
      name: "Taylor Kim",
      role: "Software Engineer",
      email: "taylor.kim@aerosight.io",
      department: "Software",
    },
  ],
  projects: [
    {
      id: PROJECT_ID,
      name: "Northstar Autonomous Inspection Pilot",
      status: "at_risk",
      target_date: "2025-10-15",
      pm_id: "EMP-001",
      customer_org_id: "ORG-002",
      description:
        "Autonomous inspection-drone system for Northstar Energy facility corridors.",
      summary:
        "VectorNav firmware delivery moved from September 6 to September 12. Enclosure redesign required for 620mm clearance. Safety review demo on September 25.",
    },
  ],
  meetings: [
    {
      id: "MTG-001",
      project_id: PROJECT_ID,
      title: "Weekly Status — AeroSight / Northstar",
      date: "2025-08-20",
      attendees: ["EMP-001", "EMP-003", "CON-001"],
      notes: "Reviewed software milestones. Navigation prototype on track.",
      processed: true,
    },
    {
      id: "MTG-002",
      project_id: PROJECT_ID,
      title: "Northstar Design Review",
      date: "2025-08-28",
      attendees: ["EMP-001", "EMP-002", "EMP-003", "CON-001"],
      notes: `Customer design review with Northstar Energy.

Northstar requires the drone to fit through a 620mm clearance in Corridor C access hatches.
Current AeroSight enclosure width is 640mm — redesign required before pilot deployment.

Navigation field testing depends on VectorNav firmware delivery for corridor routing.
Northstar confirmed the final pilot date of October 15 cannot move.

Northstar requires a live demonstration before their September 25 safety review board.`,
      processed: false,
    },
    {
      id: "MTG-003",
      project_id: PROJECT_ID,
      title: "VectorNav Vendor Check-in",
      date: "2025-09-03",
      attendees: ["EMP-003", "CON-002"],
      notes: `VectorNav firmware v2.4.1 was expected September 6.
New delivery date communicated: September 12 due to calibration pipeline delay.
This impacts navigation integration testing and demo video timeline.`,
      processed: false,
    },
  ],
  requirements: [
    {
      id: "REQ-001",
      project_id: PROJECT_ID,
      title: "Autonomous corridor navigation",
      description: "Drone must navigate Corridor C autonomously with sub-meter accuracy.",
      status: "approved",
    },
    {
      id: "REQ-002",
      project_id: PROJECT_ID,
      title: "Thermal imaging inspection",
      description: "Capture thermal anomalies along inspection path for safety reporting.",
      status: "approved",
    },
  ],
  risks: [
    {
      id: "RISK-001",
      project_id: PROJECT_ID,
      title: "Schedule compression before safety review",
      description:
        "Hardware redesign and firmware dependency reduce available testing time before client safety review.",
      severity: "high",
      status: "open",
      source: "MTG-002",
    },
  ],
  dependencies: [
    {
      id: "DEP-001",
      project_id: PROJECT_ID,
      title: "VectorNav firmware v2.4.1",
      description: "Firmware required for corridor navigation integration tests.",
      owner_id: "EMP-003",
      external_org_id: "ORG-003",
      expected_date: "2025-09-06",
      status: "pending",
    },
  ],
  work_items: [
    {
      id: "TASK-101",
      type: "task",
      title: "Enclosure mechanical design",
      description: "Current enclosure 640mm wide; target 620mm max width.",
      project_id: PROJECT_ID,
      owner_id: "EMP-002",
      status: "in_progress",
      priority: "high",
      due_date: "2025-09-18",
      dependencies: [],
      source: "Initial project plan",
      code_status: "not_started",
      physical_validation: "not_started",
      history: [
        { at: "2025-08-01", event: "Work item created" },
        { at: "2025-08-28", event: "Design review flagged 640mm vs 620mm conflict" },
      ],
    },
    {
      id: "TASK-104",
      type: "feature",
      title: "Corridor C Navigation",
      description: "Autonomous routing through Corridor C with obstacle avoidance.",
      project_id: PROJECT_ID,
      owner_id: "EMP-004",
      status: "in_progress",
      priority: "high",
      due_date: "2025-09-20",
      dependencies: ["DEP-001"],
      source: "REQ-001",
      related_github: "PR #148",
      acceptance_criteria: "18/18 simulation tests pass; field validation after firmware delivery",
      code_status: "complete",
      ci_status: "passed",
      physical_validation: "blocked",
      history: [
        { at: "2025-08-15", event: "Development started" },
        { at: "2025-09-01", event: "PR #148 opened — navigation/corridor-c" },
        { at: "2025-09-02", event: "PR #148 merged — CI 18/18 passed" },
      ],
    },
    {
      id: "TASK-105",
      type: "task",
      title: "Thermal camera validation",
      description: "Validate thermal imaging pipeline for safety reporting.",
      project_id: PROJECT_ID,
      owner_id: "EMP-004",
      status: "todo",
      priority: "medium",
      due_date: "2025-09-22",
      dependencies: [],
      source: "REQ-002",
      code_status: "in_progress",
      physical_validation: "not_started",
      history: [{ at: "2025-08-10", event: "Work item created" }],
    },
    {
      id: "MS-001",
      type: "milestone",
      title: "Northstar Safety Review Demo",
      description: "Live demonstration before Northstar safety review board.",
      project_id: PROJECT_ID,
      owner_id: "EMP-001",
      status: "blocked",
      priority: "critical",
      due_date: "2025-09-25",
      dependencies: ["DEP-001", "TASK-101", "TASK-104"],
      source: "Customer contract",
      history: [{ at: "2025-07-01", event: "Milestone scheduled" }],
    },
  ],
  github_events: [
    {
      id: "GH-001",
      type: "pr_merged",
      title: "Corridor C autonomous routing",
      description: "Implements corridor-c navigation module with simulation harness.",
      repo: "aerosight/northstar-inspection-drone",
      ref: "navigation/corridor-c",
      pr_number: 148,
      work_item_id: "TASK-104",
      at: "2025-09-02T14:30:00Z",
      ci_tests_passed: 18,
      ci_tests_total: 18,
    },
    {
      id: "GH-002",
      type: "ci_passed",
      title: "CI pipeline — main",
      description: "All simulation tests passed after merge.",
      repo: "aerosight/northstar-inspection-drone",
      at: "2025-09-02T14:35:00Z",
      ci_tests_passed: 18,
      ci_tests_total: 18,
      work_item_id: "TASK-104",
    },
  ],
  ai_proposals: [],
};
