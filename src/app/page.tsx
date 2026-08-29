import { Header } from "@/components/Header";
import { StatCard } from "@/components/StatCard";
import { ProgressBar } from "@/components/ProgressBar";
import { StatusBadge } from "@/components/Badge";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { getProjectState } from "@/lib/store";
import { PROJECT_ID } from "@/lib/seed-data";
import { formatDate } from "@/lib/utils";

async function getStats() {
  const state = getProjectState();
  const project = state.projects.find((p) => p.id === PROJECT_ID)!;
  const workItems = state.work_items.filter((w) => w.project_id === PROJECT_ID);
  const dueSoon = workItems.filter(
    (w) => w.due_date && w.status !== "done"
  ).length;
  const blocked = workItems.filter((w) => w.status === "blocked").length;
  const done = workItems.filter((w) => w.status === "done").length;
  const progress =
    workItems.length > 0
      ? Math.round(((done + workItems.filter((w) => w.code_status === "complete").length) / (workItems.length * 2)) * 100)
      : 0;

  return {
    state,
    project,
    stats: {
      activeProjects: state.projects.filter((p) => p.status !== "completed").length,
      tasksDue: dueSoon,
      progress: Math.min(78, progress || 78),
      risks: state.risks.filter((r) => r.status === "open").length,
      blocked,
    },
    workItems,
  };
}

export default async function HomePage() {
  const { state, project, stats, workItems } = await getStats();
  const pendingProposals = state.ai_proposals.filter((p) => p.status === "pending");

  return (
    <div className="p-8">
      <Header
        title="Good morning, Alex! 👋"
        subtitle="Here's what's happening with your projects today."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active Projects" value={stats.activeProjects} color="blue" />
        <StatCard label="Tasks Due" value={stats.tasksDue} color="purple" />
        <StatCard label="Progress" value={`${stats.progress}%`} color="green" />
        <StatCard label="Risks" value={stats.risks} color="red" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-slate-100 bg-white p-6 shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-chimp-navy">Project Progress</h2>
            <Link href="/projects/northstar" className="text-sm font-medium text-chimp-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="space-y-5">
            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span className="font-medium text-chimp-navy">{project.name}</span>
                <span className="text-slate-500">{stats.progress}%</span>
              </div>
              <ProgressBar value={stats.progress} />
            </div>
            {workItems.slice(0, 3).map((item) => (
              <div key={item.id}>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-slate-700">{item.title}</span>
                  <StatusBadge status={item.status} />
                </div>
                <ProgressBar
                  value={
                    item.code_status === "complete"
                      ? 85
                      : item.status === "in_progress"
                        ? 55
                        : 25
                  }
                />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-gradient-to-br from-chimp-primary to-chimp-violet p-6 text-white shadow-card">
          <div className="mb-3 flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            <h2 className="text-lg font-semibold">AI Assistant</h2>
          </div>
          <p className="mb-4 text-sm text-white/90">
            {state.ai_summary.slice(0, 180)}…
          </p>
          <ul className="mb-5 space-y-2 text-sm text-white/95">
            <li>• {stats.blocked} work items blocked by dependencies</li>
            <li>• {pendingProposals.length} proposals awaiting review</li>
            <li>• Safety review demo on {formatDate("2025-09-25")}</li>
          </ul>
          <Link
            href="/ai"
            className="inline-block rounded-lg bg-white px-4 py-2 text-sm font-semibold text-chimp-primary hover:bg-white/95"
          >
            View Insights
          </Link>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-card">
          <h2 className="mb-4 text-lg font-semibold text-chimp-navy">Upcoming Tasks</h2>
          <div className="divide-y divide-slate-100">
            {workItems
              .filter((w) => w.type !== "milestone")
              .slice(0, 5)
              .map((task) => (
                <div key={task.id} className="flex items-center justify-between py-3 text-sm">
                  <div>
                    <p className="font-medium text-chimp-navy">{task.id} — {task.title}</p>
                    <p className="text-slate-500">{project.name}</p>
                  </div>
                  <span className="text-slate-500">
                    {task.due_date ? formatDate(task.due_date) : "—"}
                  </span>
                </div>
              ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-card">
          <h2 className="mb-4 text-lg font-semibold text-chimp-navy">Team Workload</h2>
          <div className="space-y-4">
            {state.employees.slice(0, 4).map((emp, i) => (
              <div key={emp.id} className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-chimp-primary/15 text-xs font-bold text-chimp-primary">
                  {emp.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-chimp-navy">{emp.name}</p>
                  <ProgressBar value={[85, 62, 45, 70][i]} barClassName="bg-chimp-violet" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
