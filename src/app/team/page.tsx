import { Header } from "@/components/Header";
import { getProjectState } from "@/lib/store";

export default function TeamPage() {
  const state = getProjectState();
  return (
    <div className="p-8">
      <Header title="Team" subtitle="AeroSight Robotics program team" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {state.employees.map((emp) => (
          <div
            key={emp.id}
            className="rounded-xl border border-slate-100 bg-white p-5 shadow-card"
          >
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-chimp-primary/15 text-lg font-bold text-chimp-primary">
              {emp.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <p className="font-semibold text-chimp-navy">{emp.name}</p>
            <p className="text-sm text-slate-500">{emp.role}</p>
            <p className="mt-1 text-xs text-slate-400">{emp.department}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
