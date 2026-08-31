"use client";

import { PhIcon } from "../PhosphorIcon";
import { RULES } from "@/lib/demo-content";
import { useCM } from "../context";

export function RulesScreen() {
  const { ui, toggleRule } = useCM();

  const allRules = [...RULES, ...ui.rulesExtra];

  return (
    <div style={{ padding: "30px 32px 56px", maxWidth: 900 }}>
      <h1 style={{ margin: 0, fontSize: 20, fontWeight: 600, letterSpacing: "-0.02em" }}>Chimpy&rsquo;s rules</h1>
      <p style={{ margin: "6px 0 20px", fontSize: 12.5, color: "var(--muted)" }}>
        The routing layer is rules, not vibes. Chimpy writes its own as it learns you — every one is readable, editable and switchable off.
      </p>

      <div style={{ border: "1px solid var(--line)", borderRadius: 12, overflow: "hidden" }}>
        {allRules.map((r, i) => {
          const off = !!ui.rulesOff[i];
          return (
            <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: "14px 18px", borderBottom: "1px solid var(--line)", opacity: off ? 0.45 : 1 }}>
              <div
                onClick={toggleRule(i)}
                style={{
                  flex: "none",
                  width: 32,
                  height: 19,
                  borderRadius: 20,
                  background: off ? "#dcdce6" : "#5d5294",
                  position: "relative",
                  cursor: "pointer",
                  marginTop: 2,
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: 2,
                    left: off ? 2 : 15,
                    width: 15,
                    height: 15,
                    borderRadius: "50%",
                    background: "#fff",
                    boxShadow: "0 1px 2px rgba(22,24,38,.2)",
                    transition: "left .16s",
                  }}
                />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12.5, color: "var(--ink)", fontFamily: "ui-monospace,Menlo,monospace", lineHeight: 1.5 }}>{r.text}</div>
                <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 5 }}>{r.origin}</div>
              </div>
              <span
                style={{
                  flex: "none",
                  fontSize: 9.5,
                  letterSpacing: ".06em",
                  textTransform: "uppercase",
                  color: r.source === "Chimpy" ? "#5d5294" : "#75798c",
                  background: r.source === "Chimpy" ? "#f2f0fd" : "#f8f8fb",
                  borderRadius: 4,
                  padding: "2px 6px",
                  marginTop: 2,
                }}
              >
                {r.source}
              </span>
            </div>
          );
        })}
        <div className="hover-accsoft" style={{ display: "flex", alignItems: "center", gap: 9, padding: "13px 18px", fontSize: 12, color: "var(--acc)", cursor: "pointer" }}>
          <PhIcon name="Plus" size={13} />
          Write a rule in plain words
        </div>
      </div>

      <div style={{ marginTop: 20, border: "1px solid var(--line)", borderRadius: 12, padding: "16px 18px" }}>
        <div style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 10 }}>Capability loading</div>
        <div style={{ fontSize: 11.5, color: "var(--muted)", lineHeight: 1.6, maxWidth: "72ch" }}>
          Chimpy pulls in Hermes skills on demand — a spreadsheet parser when a workbook lands, a repo reader when a PR does — and unloads them after. Loaded this week:{" "}
          <span style={{ color: "var(--body)" }}>xlsx-reader, github-events, calendar-write, pdf-extract</span>.
        </div>
      </div>
    </div>
  );
}
