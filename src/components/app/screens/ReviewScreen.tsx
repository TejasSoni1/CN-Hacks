"use client";

import { useEffect } from "react";
import { PhIcon } from "../PhosphorIcon";
import { useCM } from "../context";

export function ReviewScreen() {
  const { ui, patch, go, projectState, toggleTrace, setApproval, applyApproved, dismissAll, resetReview } = useCM();

  useEffect(() => {
    if (!ui.activeProposal && !ui.applied) {
      const pending = [...projectState.ai_proposals].reverse().find((p) => p.status === "pending");
      if (pending) patch({ activeProposal: pending });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const proposal = ui.activeProposal;

  return (
    <div style={{ padding: "30px 32px 56px", maxWidth: 960 }}>
      <h1 style={{ margin: 0, fontSize: 20, fontWeight: 600, letterSpacing: "-0.02em" }}>Review</h1>
      <p style={{ margin: "6px 0 20px", fontSize: 12.5, color: "var(--muted)" }}>
        Structured data is the source of truth. Chimpy interprets. You decide.
      </p>

      {proposal && !ui.applied && (
        <div style={{ border: "1px solid var(--line)", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ padding: "15px 19px", borderBottom: "1px solid var(--line)", background: "var(--wash)" }}>
            <div style={{ fontSize: 10.5, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--muted)" }}>
              {proposal.trigger_type} trigger
            </div>
            <div style={{ fontSize: 13.5, fontWeight: 600, marginTop: 5 }}>{proposal.trigger}</div>
            <p style={{ margin: "8px 0 0", fontSize: 12.5, color: "var(--body)", lineHeight: 1.6, maxWidth: "70ch" }}>{proposal.summary}</p>
          </div>
          {proposal.changes.map((c) => (
            <div key={c.id} style={{ display: "flex", gap: 16, padding: "15px 19px", borderBottom: "1px solid var(--line)", background: c.approval === "rejected" ? "#fdfbfa" : "#fff" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span
                    style={{
                      fontSize: 9.5,
                      letterSpacing: ".08em",
                      textTransform: "uppercase",
                      color: "var(--acc)",
                      background: "var(--acc-soft)",
                      borderRadius: 4,
                      padding: "2px 6px",
                      fontWeight: 500,
                    }}
                  >
                    {c.action.replace(/_/g, " ")}
                  </span>
                  <span style={{ fontSize: 12.5, fontWeight: 500 }}>{c.title}</span>
                </div>
                <div style={{ fontSize: 12, color: "var(--body)", marginTop: 7, lineHeight: 1.6 }}>{c.description}</div>
                <div
                  onClick={toggleTrace(c.id)}
                  className="hover-acc-text"
                  style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8, fontSize: 11, color: "var(--faint)", cursor: "pointer" }}
                >
                  <PhIcon name="GitBranch" size={12} />
                  {ui.traces[c.id] ? "Hide reasoning" : "Why this"}
                </div>
                {ui.traces[c.id] && (
                  <div style={{ marginTop: 8, borderLeft: "2px solid #e0dcf7", padding: "2px 0 2px 11px", display: "flex", flexDirection: "column", gap: 5 }}>
                    {c.rule && <div style={{ fontSize: 11, color: "var(--body)", fontFamily: "ui-monospace,Menlo,monospace" }}>{c.rule}</div>}
                    <div style={{ fontSize: 11, color: "var(--muted)", lineHeight: 1.5 }}>{c.reasoning}</div>
                    <div style={{ fontSize: 11, color: "var(--faint)" }}>
                      Confidence {(c.confidence * 100).toFixed(0)}% · source {c.source}
                    </div>
                  </div>
                )}
              </div>
              <div style={{ flex: "none", display: "flex", alignItems: "flex-start", gap: 6, paddingTop: 2 }}>
                <div
                  onClick={setApproval(c.id, "rejected")}
                  className="hover-border"
                  style={{
                    width: 29,
                    height: 29,
                    borderRadius: 8,
                    border: "1px solid var(--line)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: c.approval === "rejected" ? "#a04a3c" : "#75798c",
                    cursor: "pointer",
                    background: c.approval === "rejected" ? "#f7e7e2" : "transparent",
                  }}
                >
                  <PhIcon name="X" size={14} />
                </div>
                <div
                  onClick={setApproval(c.id, "approved")}
                  className="hover-border"
                  style={{
                    width: 29,
                    height: 29,
                    borderRadius: 8,
                    border: "1px solid var(--line)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: c.approval === "approved" ? "#2f6b4f" : "#75798c",
                    cursor: "pointer",
                    background: c.approval === "approved" ? "#e9f3ee" : "transparent",
                  }}
                >
                  <PhIcon name="Check" size={14} />
                </div>
              </div>
            </div>
          ))}
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 19px" }}>
            <div style={{ fontSize: 11.5, color: "var(--muted)" }}>
              {proposal.changes.filter((c) => c.approval === "approved").length} of {proposal.changes.length} approved
            </div>
            <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
              <div onClick={dismissAll} className="hover-wash" style={{ height: 31, padding: "0 13px", borderRadius: 8, display: "flex", alignItems: "center", fontSize: 12.5, color: "var(--muted)", cursor: "pointer" }}>
                Dismiss
              </div>
              <div
                onClick={applyApproved}
                className="hover-dark-btn"
                style={{ height: 31, padding: "0 14px", borderRadius: 8, background: "var(--night)", color: "#f3f5fe", display: "flex", alignItems: "center", gap: 7, fontSize: 12.5, fontWeight: 500, cursor: "pointer" }}
              >
                Apply approved
                <PhIcon name="ArrowRight" size={13} />
              </div>
            </div>
          </div>
        </div>
      )}

      {ui.applied && (
        <div style={{ border: "1px solid var(--line)", borderRadius: 12, padding: "22px 20px", animation: "riseIn .3s both" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 12 }}>
            <PhIcon name="CheckCircle" weight="fill" size={17} color="#2f6b4f" />
            <div style={{ fontSize: 13.5, fontWeight: 600 }}>{ui.appliedCount} changes applied to the tracker</div>
          </div>
          <div style={{ fontSize: 12.5, color: "var(--body)", lineHeight: 1.6, maxWidth: "70ch" }}>
            Every record keeps its source. Open the tracker to see them, or ask Chimpy why anything changed.
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <div onClick={go("tracker")} className="hover-accsoft" style={{ height: 31, padding: "0 13px", border: "1px solid var(--acc)", borderRadius: 8, color: "var(--acc)", fontSize: 12.5, display: "flex", alignItems: "center", cursor: "pointer" }}>
              Open tracker
            </div>
            <div onClick={resetReview} className="hover-wash" style={{ height: 31, padding: "0 13px", borderRadius: 8, color: "var(--muted)", fontSize: 12.5, display: "flex", alignItems: "center", cursor: "pointer" }}>
              Reset demo
            </div>
          </div>
        </div>
      )}

      {!proposal && !ui.applied && (
        <div style={{ textAlign: "center", color: "var(--muted)", padding: "48px 0", fontSize: 13 }}>
          Nothing pending — capture something and it will land here for approval.
        </div>
      )}
    </div>
  );
}
