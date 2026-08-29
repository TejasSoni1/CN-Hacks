import { Header } from "@/components/Header";
import { StatusBadge } from "@/components/Badge";
import { getProjectState } from "@/lib/store";
import { PROJECT_ID } from "@/lib/seed-data";
import { formatDate } from "@/lib/utils";

import type { WorkItemStatus } from "@/lib/types";

const columns: { key: string; label: string; statuses: WorkItemStatus[] }[] = [
  { key: "backlog", label: "Backlog", statuses: ["backlog"] },
  { key: "active", label: "Active Work", statuses: ["todo", "in_progress", "review"] },
  { key: "blocked", label: "Blocked", statuses: ["blocked"] },
  { key: "done", label: "Completed", statuses: ["done"] },
];

export default async function TrackerPage() {
  const state = getProjectState();
  const items = state.work_items.filter((w) => w.project_id === PROJECT_ID);

  const getOwner = (id: string) =>
    state.employees.find((e) => e.id === id)?.name ?? id;

  return (
    <div className="p-8">
      <Header
        title="ChimpManager Tracker"
        subtitle="AI-native work tracker — software complete ≠ project complete"
      />

      <div className="grid gap-4 md:grid-cols-4">
        {columns.map((col) => {
          const colItems = items.filter((w) => col.statuses.includes(w.status));
          return (
            <div
              key={col.key}
              className="rounded-xl border border-slate-100 bg-slate-50/50 p-4"
            >
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
                {col.label} ({colItems.length})
              </h2>
              <div className="space-y-3">
                {colItems.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-lg border border-slate-100 bg-white p-3 shadow-sm"
                  >
                    <div className="mb-1 flex items-start justify-between gap-2">
                      <span className="text-xs font-mono text-chimp-primary">
                        {item.id}
                      </span>
                      <StatusBadge status={item.priority} />
                    </div>
                    <p className="text-sm font-medium text-chimp-navy">
                      {item.title}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {getOwner(item.owner_id)}
                    </p>
                    {(item.code_status || item.physical_validation) && (
                      <div className="mt-2 space-y-1 text-xs">
                        {item.code_status && (
                          <p>
                            Code:{" "}
                            <span className="font-medium capitalize">
                              {item.code_status.replace(/_/g, " ")}
                            </span>
                          </p>
                        )}
                        {item.ci_status && item.ci_status !== "unknown" && (
                          <p>
                            CI:{" "}
                            <span className="font-medium capitalize">
                              {item.ci_status}
                            </span>
                          </p>
                        )}
                        {item.physical_validation && (
                          <p>
                            Physical:{" "}
                            <span className="font-medium capitalize">
                              {item.physical_validation.replace(/_/g, " ")}
                            </span>
                          </p>
                        )}
                      </div>
                    )}
                    {item.due_date && (
                      <p className="mt-2 text-xs text-slate-400">
                        Due {formatDate(item.due_date)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-xl border border-slate-100 bg-white p-6 shadow-card">
        <h2 className="mb-4 text-lg font-semibold">Dependencies & Risks</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="text-sm font-medium text-slate-500">Dependencies</h3>
            <ul className="mt-2 space-y-2">
              {state.dependencies
                .filter((d) => d.project_id === PROJECT_ID)
                .map((d) => (
                  <li key={d.id} className="rounded-lg bg-slate-50 p-3 text-sm">
                    <p className="font-medium">{d.title}</p>
                    <p className="text-slate-500">
                      Expected {d.expected_date ? formatDate(d.expected_date) : "TBD"}
                    </p>
                  </li>
                ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-500">Risks</h3>
            <ul className="mt-2 space-y-2">
              {state.risks
                .filter((r) => r.project_id === PROJECT_ID)
                .map((r) => (
                  <li key={r.id} className="rounded-lg bg-red-50/50 p-3 text-sm">
                    <p className="font-medium text-red-900">{r.title}</p>
                    <p className="text-red-700/80">{r.description}</p>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
