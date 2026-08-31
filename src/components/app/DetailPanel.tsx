"use client";

import { PhIcon } from "./PhosphorIcon";
import { COLS } from "@/lib/demo-content";
import { useCM } from "./context";
import type { Contact, Employee, Organization } from "@/lib/types";

function findPerson(
  employees: Employee[],
  contacts: Contact[],
  orgs: Organization[],
  id: string
) {
  const emp = employees.find((e) => e.id === id);
  if (emp) return { name: emp.name, role: emp.role, org: "AeroSight Robotics", email: emp.email };
  const con = contacts.find((c) => c.id === id);
  if (con) {
    const org = orgs.find((o) => o.id === con.organization_id);
    return { name: con.name, role: con.role, org: org?.name ?? "—", email: con.email };
  }
  return null;
}

export function DetailPanel() {
  const { ui, closeDetail, projectState } = useCM();
  if (!ui.detail) return null;

  const task = ui.detailKind === "task" ? projectState.work_items.find((w) => w.id === ui.detail) : null;
  const person =
    ui.detailKind === "person"
      ? findPerson(projectState.employees, projectState.contacts, projectState.organizations, ui.detail)
      : null;

  if (!task && !person) return null;

  const fields = task
    ? [
        { label: "Status", value: COLS.find((c) => c.key === task.status)?.label ?? task.status, color: "#161826" },
        { label: "Priority", value: task.priority, color: "#161826" },
        { label: "Owner", value: projectState.employees.find((e) => e.id === task.owner_id)?.name ?? task.owner_id, color: "#161826" },
        { label: "Due", value: task.due_date ?? "—", color: "#161826" },
        { label: "Source", value: task.source ?? "Initial project plan", color: "#75798c" },
      ]
    : person
      ? [
          { label: "Role", value: person.role, color: "#161826" },
          { label: "Organisation", value: person.org, color: "#161826" },
          { label: "Email", value: person.email, color: "#75798c" },
          { label: "Added by", value: "Chimpy, from a captured email", color: "#75798c" },
        ]
      : [];

  const history = task
    ? task.history.slice().reverse().map((h) => ({ event: h.event, at: h.at }))
    : [
        { event: "Attached to Northstar design review", at: "28 Aug" },
        { event: "Captured from a forwarded thread", at: "26 Aug" },
      ];

  return (
    <>
      <div
        onClick={closeDetail}
        style={{ position: "absolute", inset: 0, background: "rgba(22,24,38,.14)", zIndex: 40, animation: "fadeIn .16s both" }}
      />
      <aside
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          width: 400,
          background: "#fff",
          borderLeft: "1px solid var(--line)",
          zIndex: 41,
          boxShadow: "-12px 0 32px rgba(22,24,38,.08)",
          display: "flex",
          flexDirection: "column",
          animation: "slideL .22s ease both",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "15px 18px", borderBottom: "1px solid var(--line)" }}>
          <span style={{ fontFamily: "ui-monospace,Menlo,monospace", fontSize: 11, color: "var(--acc)" }}>{ui.detail}</span>
          <span
            onClick={closeDetail}
            className="hover-wash"
            style={{ marginLeft: "auto", width: 28, height: 28, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted)", cursor: "pointer" }}
          >
            <PhIcon name="X" size={14} />
          </span>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: 18 }}>
          <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.01em", lineHeight: 1.35 }}>
            {task ? task.title : person?.name}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 1, marginTop: 16, border: "1px solid var(--line)", borderRadius: 10, overflow: "hidden" }}>
            {fields.map((f) => (
              <div
                key={f.label}
                style={{ display: "grid", gridTemplateColumns: "104px 1fr", gap: 10, padding: "9px 13px", borderBottom: "1px solid var(--line)", fontSize: 12, alignItems: "center" }}
              >
                <div style={{ color: "var(--muted)" }}>{f.label}</div>
                <div style={{ color: f.color, textTransform: "capitalize" }}>{String(f.value)}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 11.5, fontWeight: 600, margin: "20px 0 10px", letterSpacing: ".02em" }}>History</div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {history.map((h, i) => (
              <div key={i} style={{ display: "flex", gap: 11, paddingBottom: 12 }}>
                <div style={{ flex: "none", display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#b5abfc", marginTop: 4 }} />
                  <span style={{ flex: 1, width: 1, background: "var(--line)", marginTop: 3 }} />
                </div>
                <div>
                  <div style={{ fontSize: 11.5, color: "var(--body)", lineHeight: 1.5 }}>{h.event}</div>
                  <div style={{ fontSize: 10.5, color: "var(--faint)", marginTop: 2 }}>{h.at}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}
