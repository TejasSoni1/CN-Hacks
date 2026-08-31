"use client";

import { PhIcon } from "./PhosphorIcon";
import { NAV } from "@/lib/demo-content";
import { useCM } from "./context";
import type { Screen } from "./useChimpManager";
import type { AIProposal } from "@/lib/types";

function pendingCount(proposals: AIProposal[]) {
  const proposal = [...proposals].reverse().find((p) => p.status === "pending");
  return proposal ? proposal.changes.length : 0;
}

export function Sidebar() {
  const { ui, go, toggleChimpy, projectState } = useCM();

  return (
    <aside
      style={{
        width: 244,
        flex: "none",
        background: "var(--night)",
        display: "flex",
        flexDirection: "column",
        padding: "18px 0 14px",
        overflowY: "auto",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 11, padding: "4px 20px 20px" }}>
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 9,
            background: "linear-gradient(160deg,#796cbf,#4b4280)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#f3f5fe",
          }}
        >
          <PhIcon name="Cube" weight="fill" size={16} />
        </div>
        <div style={{ lineHeight: 1.15 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#f3f5fe", letterSpacing: "-0.01em" }}>
            Chimp Manager
          </div>
          <div style={{ fontSize: 9.5, color: "#75798c", letterSpacing: ".08em", textTransform: "uppercase", marginTop: 2 }}>
            AeroSight Robotics
          </div>
        </div>
      </div>

      <div style={{ padding: "0 12px 14px" }}>
        <div
          onClick={go("capture")}
          className="hover-dark"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 9,
            height: 34,
            padding: "0 11px",
            borderRadius: 9,
            border: "1px solid rgba(181,171,252,.35)",
            background: "rgba(145,132,217,.1)",
            color: "#d2cefd",
            fontSize: 12.5,
            cursor: "pointer",
          }}
        >
          <PhIcon name="PlusCircle" size={15} />
          Capture anything
          <span
            style={{
              marginLeft: "auto",
              fontSize: 10,
              color: "#8b8fa3",
              border: "1px solid rgba(233,233,237,.14)",
              borderRadius: 4,
              padding: "1px 5px",
            }}
          >
            ⌘K
          </span>
        </div>
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: 1, padding: "0 12px", flex: "none" }}>
        {NAV.map((n) => {
          const active = ui.screen === n.key;
          const badge = n.key === "review" && !ui.applied ? pendingCount(projectState.ai_proposals) : null;
          return (
            <div
              key={n.key}
              onClick={go(n.key as Screen)}
              className="hover-row"
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                gap: 11,
                padding: "8px 11px",
                borderRadius: 8,
                fontSize: 12.5,
                color: "#cfd3e5",
                background: active ? "rgba(145,132,217,.16)" : "transparent",
                boxShadow: active ? "inset 2px 0 0 #9184d9" : "none",
              }}
            >
              <PhIcon name={n.icon} size={15.5} color="#b5abfc" />
              {n.label}
              {badge ? (
                <span
                  style={{
                    marginLeft: "auto",
                    fontSize: 10,
                    fontWeight: 500,
                    color: "#161826",
                    background: "#b5abfc",
                    borderRadius: 20,
                    padding: "1px 7px",
                  }}
                >
                  {badge}
                </span>
              ) : null}
            </div>
          );
        })}
      </nav>

      <div style={{ padding: "18px 22px 8px" }}>
        <div style={{ fontSize: 9.5, letterSpacing: ".1em", textTransform: "uppercase", color: "#5c6070" }}>
          Projects
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 1, padding: "0 12px" }}>
        {projectState.projects.map((p) => (
          <div
            key={p.id}
            className="hover-row"
            style={{ display: "flex", alignItems: "center", gap: 9, padding: "7px 11px", borderRadius: 8, fontSize: 12, color: "#cfd3e5" }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: p.accentColor ?? "#c9925f", flex: "none" }} />
            {p.name}
          </div>
        ))}
      </div>

      <div style={{ marginTop: "auto", padding: "12px 12px 0" }}>
        <div
          onClick={toggleChimpy}
          className="hover-dark"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 9,
            padding: "9px 11px",
            borderRadius: 9,
            background: "rgba(233,233,237,.05)",
            cursor: "pointer",
            marginBottom: 10,
          }}
        >
          <span
            style={{
              width: 20,
              height: 20,
              borderRadius: 6,
              background: "#2b2741",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#b5abfc",
              flex: "none",
            }}
          >
            <PhIcon name="Sparkle" weight="fill" size={11} />
          </span>
          <div style={{ fontSize: 12, color: "#cfd3e5" }}>Chimpy</div>
          <span
            style={{
              marginLeft: "auto",
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: "#7fae94",
              animation: "pulseDot 2.4s infinite",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 4px 0",
            borderTop: "1px solid rgba(233,233,237,.08)",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: "50%",
              background: "#3f424d",
              color: "#d2cefd",
              fontSize: 10,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flex: "none",
            }}
          >
            AM
          </div>
          <div style={{ minWidth: 0, lineHeight: 1.25 }}>
            <div style={{ fontSize: 12, color: "#e9e9ed", fontWeight: 500 }}>Alex Morgan</div>
            <div style={{ fontSize: 10, color: "#75798c" }}>Project Manager</div>
          </div>
          <PhIcon name="CaretUpDown" size={13} color="#75798c" style={{ marginLeft: "auto" }} />
        </div>
      </div>
    </aside>
  );
}
