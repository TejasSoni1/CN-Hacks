import { Header } from "@/components/Header";
import { StatusBadge } from "@/components/Badge";
import { ProgressBar } from "@/components/ProgressBar";
import ReactMarkdown from "react-markdown";
import { getProjectState } from "@/lib/store";
import { PROJECT_ID } from "@/lib/seed-data";
import { formatDate } from "@/lib/utils";

export default async function ProjectPage() {
  const state = getProjectState();
  const project = state.projects.find((p) => p.id === PROJECT_ID)!;
  const pm = state.employees.find((e) => e.id === project.pm_id);
  const workItems = state.work_items.filter((w) => w.project_id === PROJECT_ID);
  const task104 = workItems.find((w) => w.id === "TASK-104");
  const blockers = state.dependencies.filter(
    (d) => d.project_id === PROJECT_ID && d.status !== "resolved"
  );

  const markdown = `# ${project.name}

**Status:** ${project.status === "at_risk" ? "🟠 At Risk" : project.status}

**Target:** ${formatDate(project.target_date)}

**PM:** ${pm?.name ?? "—"}

## ChimpManager AI Summary

${state.ai_summary}

## Blockers

${blockers.map((b) => `- ${b.title}`).join("\n")}
${workItems.filter((w) => w.status === "blocked").map((w) => `- ${w.title}`).join("\n")}

## Development

**TASK-104 — Navigation Software**

- Code: ${task104?.code_status === "complete" ? "Complete" : "In Progress"}
- CI: ${task104?.ci_status === "passed" ? "Passed" : "Pending"}
- Physical Validation: ${task104?.physical_validation === "blocked" ? "Blocked" : task104?.physical_validation ?? "—"}

## Recommended Next Actions

1. Complete enclosure redesign.
2. Run mechanical testing.
3. Move thermal-camera validation forward.
4. Prepare firmware integration.
5. Target September 22 for demo-video completion.
`;

  return (
    <div className="p-8">
      <Header
        title={project.name}
        subtitle={`Customer: Northstar Energy · Target ${formatDate(project.target_date)}`}
      />

      <div className="mb-6 flex flex-wrap gap-3">
        <StatusBadge status={project.status} />
        {state.risks
          .filter((r) => r.project_id === PROJECT_ID && r.status === "open")
          .map((r) => (
            <span
              key={r.id}
              className="rounded-md bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700"
            >
              {r.title}
            </span>
          ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <article className="lg:col-span-2 rounded-xl border border-slate-100 bg-white p-8 shadow-card prose prose-slate max-w-none prose-headings:text-chimp-navy prose-a:text-chimp-primary">
          <ReactMarkdown>{markdown}</ReactMarkdown>
        </article>

        <div className="space-y-4">
          <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-card">
            <h3 className="font-semibold text-chimp-navy">Milestones</h3>
            <ul className="mt-3 space-y-3">
              {workItems
                .filter((w) => w.type === "milestone")
                .map((m) => (
                  <li key={m.id} className="text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">{m.title}</span>
                      <StatusBadge status={m.status} />
                    </div>
                    <p className="text-slate-500">{formatDate(m.due_date ?? "")}</p>
                  </li>
                ))}
            </ul>
          </div>
          <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-card">
            <h3 className="font-semibold text-chimp-navy">Requirements</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {state.requirements
                .filter((r) => r.project_id === PROJECT_ID)
                .map((r) => (
                  <li key={r.id}>
                    <span className="font-medium">{r.id}</span> — {r.title}
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-slate-100 bg-white p-6 shadow-card">
        <h2 className="mb-4 text-lg font-semibold">Work Items</h2>
        <div className="space-y-4">
          {workItems.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-2 border-b border-slate-50 pb-4 last:border-0 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium text-chimp-navy">
                  {item.id} — {item.title}
                </p>
                <p className="text-sm text-slate-500">{item.description}</p>
              </div>
              <div className="flex items-center gap-3">
                <ProgressBar value={item.code_status === "complete" ? 100 : 40} className="w-24" />
                <StatusBadge status={item.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
