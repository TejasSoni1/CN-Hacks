"use client";

import { PhIcon } from "../PhosphorIcon";
import { MODULES } from "@/lib/demo-content";
import { useCM } from "../context";

export function ModulesScreen() {
  const { ui, toggleModule } = useCM();

  return (
    <div style={{ padding: "30px 32px 56px", maxWidth: 1100 }}>
      <h1 style={{ margin: 0, fontSize: 20, fontWeight: 600, letterSpacing: "-0.02em" }}>Modules</h1>
      <p style={{ margin: "6px 0 22px", fontSize: 12.5, color: "var(--muted)" }}>
        Every module is either built here or connected to a tool you already use. Chimpy routes into whichever is on.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
        {MODULES.map((m) => {
          const on = ui.modulesOn[m.key];
          return (
            <div
              key={m.key}
              style={{
                border: `1px solid ${on ? "#e7e7ee" : "#eeeef3"}`,
                borderRadius: 12,
                padding: "15px 16px",
                background: on ? "#fff" : "#fcfcfd",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 9 }}>
                <PhIcon name={m.icon} size={16} color={on ? "#5d5294" : "#b2b6ca"} />
                <div style={{ fontSize: 12.5, fontWeight: 600 }}>{m.name}</div>
                <span
                  style={{
                    marginLeft: "auto",
                    fontSize: 9.5,
                    letterSpacing: ".06em",
                    textTransform: "uppercase",
                    color: on ? (m.mode === "Connected" ? "#2f6b4f" : "#5d5294") : "#9397ab",
                    background: on ? (m.mode === "Connected" ? "#e9f3ee" : "#f2f0fd") : "#f8f8fb",
                    borderRadius: 4,
                    padding: "2px 6px",
                  }}
                >
                  {on ? m.mode : "Off"}
                </span>
              </div>
              <div style={{ fontSize: 11.5, color: "var(--muted)", lineHeight: 1.55, minHeight: 34 }}>{on ? m.detail : m.off}</div>
              <div onClick={toggleModule(m.key)} className="hover-acc-text" style={{ marginTop: 11, display: "flex", alignItems: "center", gap: 7, fontSize: 11.5, color: "#5d5294", cursor: "pointer" }}>
                {on ? (m.mode === "Connected" ? "Configure connection" : "Edit fields") : "Turn on"}
              </div>
            </div>
          );
        })}
        <div
          className="hover-accsoft"
          style={{
            border: "1px dashed var(--line)",
            borderRadius: 12,
            padding: "15px 16px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 8,
            cursor: "pointer",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 12.5, fontWeight: 500, color: "var(--acc)" }}>
            <PhIcon name="PlusCircle" size={16} />
            Add a module
          </div>
          <div style={{ fontSize: 11.5, color: "var(--muted)", lineHeight: 1.55 }}>
            Describe it in plain words and Chimpy builds the fields, or point it at an external tool.
          </div>
        </div>
      </div>
    </div>
  );
}
