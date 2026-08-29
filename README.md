# ChimpManager AI

AI-native project management platform for the CN Hacks hackathon demo. Connects CRM (Excel), ChimpManager Tracker, GitHub activity, and Claude-powered interpretation with human-in-the-loop approval.

## Demo scenario

**AeroSight Robotics** · Customer **Northstar Energy** · Vendor **VectorNav Components**  
Project: **Northstar Autonomous Inspection Pilot**

## Stack

- **Frontend:** Next.js 15, React, Tailwind CSS, Inter font
- **CRM:** `chimpmanager_ai_hackathon_demo_database.xlsx` (generated from seed data)
- **AI:** Claude API (optional) with built-in mock analysis for offline demos
- **State:** JSON file store (`data/project-state.json`)

## Quick start

```bash
npm install
npm run generate-xlsx   # creates chimpmanager_ai_hackathon_demo_database.xlsx
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Optional: copy `.env.example` to `.env.local` and set `ANTHROPIC_API_KEY` for live Claude analysis.

## Demo flow (AI Assistant page)

1. **Meeting trigger** — Design review → requirement, task, dependency, risk proposals  
2. **GitHub trigger** — PR #148 merged → software complete, validation still blocked  
3. **Vendor trigger** — Firmware date slip → cascade updates and recommendations  

Approve changes on each proposal to update the tracker and project summary.

## Excel database structure

Sheets in `chimpmanager_ai_hackathon_demo_database.xlsx`:

| Sheet | Contents |
|-------|----------|
| organizations | AeroSight, Northstar, VectorNav |
| contacts | Customer & vendor contacts |
| employees | Project team |
| projects | Northstar pilot |
| meetings | Status + design review + vendor notes |
| requirements | Client requirements |
| risks | Schedule / dependency risks |
| dependencies | VectorNav firmware |
| work_items | Tracker items (TASK-104, etc.) |
| project_assignments | Team ↔ project |
| stakeholder_relationships | Sponsor / vendor links |
| actions | Meeting action items |
| development_requests | Dev requests ↔ GitHub |
| milestones | Safety review demo |

## Navigation

- **Overview** — Dashboard matching Chimp Manager brand UI  
- **Projects** — Markdown project view (Northstar pilot)  
- **Tasks** — Kanban-style tracker  
- **CRM** — Organizations, meetings, team  
- **AI Assistant** — Triggers + approval workflow  
- **Development** — GitHub events linked to TASK-104  

## Trust model

Structured data = source of truth · AI = interpretation · Human = authority
