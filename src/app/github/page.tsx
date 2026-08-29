import { Header } from "@/components/Header";
import { StatusBadge } from "@/components/Badge";
import { getProjectState } from "@/lib/store";
import { formatDate } from "@/lib/utils";
import { GitBranch, GitPullRequest, CheckCircle2 } from "lucide-react";

export default async function GitHubPage() {
  const state = getProjectState();
  const repo = "aerosight/northstar-inspection-drone";

  return (
    <div className="p-8">
      <Header
        title="Development Activity"
        subtitle={`GitHub integration — ${repo}`}
      />

      <div className="mb-6 rounded-xl border border-slate-100 bg-white p-5 shadow-card">
        <div className="flex items-center gap-3">
          <GitBranch className="h-5 w-5 text-chimp-primary" />
          <div>
            <p className="font-semibold text-chimp-navy">{repo}</p>
            <p className="text-sm text-slate-500">
              Sample hackathon repo — PRs, commits, and CI linked to tracker items
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {state.github_events.map((event) => {
          const workItem = state.work_items.find(
            (w) => w.id === event.work_item_id
          );
          return (
            <div
              key={event.id}
              className="rounded-xl border border-slate-100 bg-white p-6 shadow-card"
            >
              <div className="flex flex-wrap items-start gap-3">
                {event.type === "pr_merged" ? (
                  <GitPullRequest className="h-5 w-5 text-purple-600" />
                ) : (
                  <CheckCircle2 className="h-5 w-5 text-chimp-success" />
                )}
                <div className="flex-1">
                  <p className="font-semibold text-chimp-navy">
                    {event.type === "pr_merged" && event.pr_number
                      ? `PR #${event.pr_number} merged — `
                      : ""}
                    {event.title}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">{event.description}</p>
                  <p className="mt-2 text-xs text-slate-400">
                    {formatDate(event.at)} · branch {event.ref ?? "main"}
                  </p>
                </div>
                {event.ci_tests_total && (
                  <div className="rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-800">
                    CI {event.ci_tests_passed}/{event.ci_tests_total} passed
                  </div>
                )}
              </div>

              {workItem && (
                <div className="mt-4 rounded-lg border border-dashed border-chimp-primary/30 bg-chimp-primary/5 p-4">
                  <p className="text-xs font-semibold uppercase text-chimp-primary">
                    Linked tracker item
                  </p>
                  <p className="mt-1 font-medium">
                    {workItem.id} — {workItem.title}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <StatusBadge status={workItem.code_status ?? "in_progress"} />
                    <StatusBadge status={workItem.ci_status ?? "unknown"} />
                    {workItem.physical_validation && (
                      <StatusBadge status={workItem.physical_validation} />
                    )}
                  </div>
                  <p className="mt-3 text-sm text-slate-600">
                    ChimpManager AI reasoning: PR merged means{" "}
                    <strong>software implementation complete</strong>, not overall
                    done — physical validation may remain blocked by vendor dependencies.
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-xl border border-slate-100 bg-slate-50 p-6 text-sm text-slate-600">
        <h3 className="font-semibold text-chimp-navy">Repository structure (demo)</h3>
        <pre className="mt-3 font-mono text-xs leading-relaxed">
{`northstar-inspection-drone/
├── README.md
├── src/navigation/corridor_c.rs
├── tests/simulation/
├── .github/workflows/ci.yml
└── docs/pilot-requirements.md`}
        </pre>
      </div>
    </div>
  );
}
