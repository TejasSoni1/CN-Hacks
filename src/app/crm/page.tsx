import { Header } from "@/components/Header";
import { StatusBadge } from "@/components/Badge";
import { getProjectState } from "@/lib/store";
import { PROJECT_ID } from "@/lib/seed-data";
import { formatDate } from "@/lib/utils";

export default async function CrmPage() {
  const state = getProjectState();
  const excelSheets = ["organizations", "contacts", "employees", "projects", "meetings", "requirements", "risks", "dependencies"];

  return (
    <div className="p-8">
      <Header
        title="CRM & Project Database"
        subtitle="Structured data source of truth — Excel-backed demo dataset"
      />

      <div className="mb-6 rounded-xl border border-chimp-primary/20 bg-chimp-primary/5 p-4 text-sm text-chimp-navy">
        Database file: <code className="rounded bg-white px-1.5 py-0.5">chimpmanager_ai_hackathon_demo_database.xlsx</code>
        {" · "}
        Sheets: {excelSheets.join(", ")}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-slate-100 bg-white p-6 shadow-card">
          <h2 className="mb-4 text-lg font-semibold">Organizations</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-slate-500">
                <th className="pb-2">ID</th>
                <th className="pb-2">Name</th>
                <th className="pb-2">Type</th>
              </tr>
            </thead>
            <tbody>
              {state.organizations.map((org) => (
                <tr key={org.id} className="border-b border-slate-50">
                  <td className="py-2 font-mono text-xs">{org.id}</td>
                  <td className="py-2 font-medium">{org.name}</td>
                  <td className="py-2 capitalize">{org.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="rounded-xl border border-slate-100 bg-white p-6 shadow-card">
          <h2 className="mb-4 text-lg font-semibold">Contacts</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-slate-500">
                <th className="pb-2">Name</th>
                <th className="pb-2">Role</th>
                <th className="pb-2">Email</th>
              </tr>
            </thead>
            <tbody>
              {state.contacts.map((c) => (
                <tr key={c.id} className="border-b border-slate-50">
                  <td className="py-2 font-medium">{c.name}</td>
                  <td className="py-2">{c.role}</td>
                  <td className="py-2 text-slate-500">{c.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="rounded-xl border border-slate-100 bg-white p-6 shadow-card lg:col-span-2">
          <h2 className="mb-4 text-lg font-semibold">Meetings</h2>
          <div className="space-y-4">
            {state.meetings
              .filter((m) => m.project_id === PROJECT_ID)
              .map((m) => (
                <div
                  key={m.id}
                  className="rounded-lg border border-slate-100 p-4"
                >
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-chimp-navy">{m.title}</span>
                    <span className="text-xs text-slate-500">{formatDate(m.date)}</span>
                    {m.processed ? (
                      <StatusBadge status="approved" />
                    ) : (
                      <span className="rounded-md bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                        Needs AI review
                      </span>
                    )}
                  </div>
                  <pre className="whitespace-pre-wrap text-sm text-slate-600 font-sans">
                    {m.notes}
                  </pre>
                </div>
              ))}
          </div>
        </section>

        <section className="rounded-xl border border-slate-100 bg-white p-6 shadow-card">
          <h2 className="mb-4 text-lg font-semibold">Team</h2>
          <ul className="space-y-3">
            {state.employees.map((e) => (
              <li key={e.id} className="flex justify-between text-sm">
                <span className="font-medium">{e.name}</span>
                <span className="text-slate-500">{e.role}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-slate-100 bg-white p-6 shadow-card">
          <h2 className="mb-4 text-lg font-semibold">Projects</h2>
          {state.projects.map((p) => (
            <div key={p.id} className="text-sm">
              <p className="font-semibold">{p.name}</p>
              <p className="text-slate-500">{p.description}</p>
              <div className="mt-2">
                <StatusBadge status={p.status} />
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
