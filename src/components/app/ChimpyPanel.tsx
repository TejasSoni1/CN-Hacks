"use client";

import { PhIcon } from "./PhosphorIcon";
import { CHIMPY_LOG, CHIMPY_PROMPTS } from "@/lib/demo-content";
import { useCM } from "./context";

export function ChimpyPanel() {
  const { ui, toggleChimpy } = useCM();
  if (!ui.chimpyOpen) return null;

  return (
    <aside
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        width: 360,
        background: "#161826",
        zIndex: 42,
        display: "flex",
        flexDirection: "column",
        animation: "slideL .22s ease both",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "15px 18px", borderBottom: "1px solid rgba(233,233,237,.1)" }}>
        <span
          style={{
            width: 22,
            height: 22,
            borderRadius: 6,
            background: "#2b2741",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#b5abfc",
          }}
        >
          <PhIcon name="Sparkle" weight="fill" size={12} />
        </span>
        <div style={{ fontSize: 12.5, color: "#e9e9ed", fontWeight: 500 }}>Chimpy</div>
        <span style={{ fontSize: 10.5, color: "#75798c" }}>watching Northstar Pilot</span>
        <span
          onClick={toggleChimpy}
          className="hover-dark"
          style={{ marginLeft: "auto", width: 26, height: 26, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", color: "#75798c", cursor: "pointer" }}
        >
          <PhIcon name="X" size={14} />
        </span>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 18px", display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ fontSize: 9.5, letterSpacing: ".1em", textTransform: "uppercase", color: "#5c6070" }}>Today</div>
        {CHIMPY_LOG.map((l, i) => (
          <div key={i} style={{ display: "flex", gap: 10 }}>
            <PhIcon name={l.icon} size={14} color="#b5abfc" style={{ marginTop: 2 }} />
            <div>
              <div style={{ fontSize: 12, color: "#cfd3e5", lineHeight: 1.5 }}>{l.text}</div>
              <div style={{ fontSize: 10.5, color: "#5c6070", marginTop: 3 }}>{l.meta}</div>
            </div>
          </div>
        ))}
        <div style={{ borderTop: "1px solid rgba(233,233,237,.08)", paddingTop: 14, display: "flex", flexDirection: "column", gap: 7 }}>
          <div style={{ fontSize: 9.5, letterSpacing: ".1em", textTransform: "uppercase", color: "#5c6070", marginBottom: 2 }}>
            Ask
          </div>
          {CHIMPY_PROMPTS.map((q, i) => (
            <div
              key={i}
              className="hover-acc-text"
              style={{ border: "1px solid rgba(233,233,237,.12)", borderRadius: 8, padding: "8px 11px", fontSize: 11.5, color: "#9397ab", cursor: "pointer" }}
            >
              {q}
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: "12px 14px", borderTop: "1px solid rgba(233,233,237,.1)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, height: 34, padding: "0 11px", border: "1px solid rgba(233,233,237,.14)", borderRadius: 9 }}>
          <span style={{ fontSize: 12, color: "#5c6070" }}>Ask about this project…</span>
          <PhIcon name="ArrowUp" size={13} color="#5c6070" style={{ marginLeft: "auto" }} />
        </div>
      </div>
    </aside>
  );
}
