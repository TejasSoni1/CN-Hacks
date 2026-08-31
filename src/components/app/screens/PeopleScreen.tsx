"use client";

import { useCM } from "../context";

const ORG_LABEL: Record<string, string> = {
  internal: "Internal",
  customer: "Customer",
  vendor: "Vendor",
};

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("");
}

export function PeopleScreen() {
  const { projectState, openDetail } = useCM();

  const people = [
    ...projectState.employees.map((e) => ({
      id: e.id,
      name: e.name,
      role: e.role,
      email: e.email,
      org: "AeroSight Robotics",
    })),
    ...projectState.contacts.map((c) => ({
      id: c.id,
      name: c.name,
      role: c.role,
      email: c.email,
      org: projectState.organizations.find((o) => o.id === c.organization_id)?.name ?? "—",
    })),
  ];

  return (
    <div style={{ padding: "30px 32px 56px", maxWidth: 1040 }}>
      <h1 style={{ margin: 0, fontSize: 20, fontWeight: 600, letterSpacing: "-0.02em" }}>People &amp; orgs</h1>
      <p style={{ margin: "6px 0 20px", fontSize: 12.5, color: "var(--muted)" }}>
        Everyone attached to the Northstar pilot, from either side of the contract.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 13, marginBottom: 22 }}>
        {projectState.organizations.map((org) => (
          <div key={org.id} style={{ border: "1px solid var(--line)", borderRadius: 12, padding: "15px 17px" }}>
            <div style={{ fontSize: 9.5, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--faint)" }}>
              {ORG_LABEL[org.type] ?? org.type}
            </div>
            <div style={{ fontSize: 13.5, fontWeight: 600, marginTop: 7 }}>{org.name}</div>
            <div style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 4 }}>{org.industry}</div>
          </div>
        ))}
      </div>

      <div style={{ border: "1px solid var(--line)", borderRadius: 12, overflow: "hidden" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 1.2fr 1.6fr .8fr",
            padding: "10px 18px",
            background: "var(--wash)",
            borderBottom: "1px solid var(--line)",
            fontSize: 10,
            letterSpacing: ".06em",
            textTransform: "uppercase",
            color: "var(--muted)",
          }}
        >
          <div>Name</div>
          <div>Role</div>
          <div>Email</div>
          <div>Org</div>
        </div>
        {people.map((p) => (
          <div
            key={p.id}
            onClick={openDetail(p.id, "person")}
            className="hover-wash"
            style={{
              display: "grid",
              gridTemplateColumns: "1.2fr 1.2fr 1.6fr .8fr",
              padding: "11px 18px",
              borderBottom: "1px solid var(--line)",
              fontSize: 12.5,
              alignItems: "center",
              cursor: "pointer",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <span
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  background: "var(--acc-soft)",
                  color: "var(--acc)",
                  fontSize: 9.5,
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flex: "none",
                }}
              >
                {initials(p.name)}
              </span>
              {p.name}
            </div>
            <div style={{ color: "var(--body)" }}>{p.role}</div>
            <div style={{ color: "var(--muted)" }}>{p.email}</div>
            <div style={{ color: "var(--muted)" }}>{p.org}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
