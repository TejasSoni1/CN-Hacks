"use client";

import { PhIcon } from "../PhosphorIcon";
import { useCM } from "../context";

export function CaptureScreen() {
  const { ui, onDraft, pickSample, runCapture, acceptRule, toggleTrace, go, captureModes, routingSteps } = useCM();

  const samples = captureModes.filter((m) => m.sample);

  return (
    <div style={{ padding: "40px 32px 60px", maxWidth: 860, margin: "0 auto" }}>
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em" }}>What have you got?</h1>
        <p style={{ margin: "7px 0 0", fontSize: 13, color: "var(--muted)" }}>
          Everything starts here — a task, a contact, a meeting, a whole plan. Chimpy files it, you approve it.
        </p>
      </div>

      <div
        style={{
          border: "1px solid var(--line)",
          borderRadius: 14,
          boxShadow: "0 1px 2px rgba(22,24,38,.04),0 10px 30px rgba(22,24,38,.05)",
          overflow: "hidden",
          background: "#fff",
        }}
      >
        <textarea
          value={ui.draft}
          onChange={onDraft}
          placeholder="Paste notes, drop a file, forward an email, or type “remind Jordan the enclosure spec is due Thursday”…"
          style={{
            width: "100%",
            minHeight: 124,
            border: 0,
            padding: "17px 19px 8px",
            fontSize: 13.5,
            lineHeight: 1.65,
            color: "var(--ink)",
            resize: "none",
            outline: "none",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 13px", borderTop: "1px solid var(--line)", background: "var(--wash)" }}>
          {captureModes.map((m) => (
            <div
              key={m.key}
              onClick={pickSample(m.key)}
              title={m.label}
              className="hover-white"
              style={{
                width: 29,
                height: 29,
                borderRadius: 7,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--muted)",
                cursor: "pointer",
                background: ui.mode === m.key ? "#fff" : "transparent",
              }}
            >
              <PhIcon name={m.icon} size={15} />
            </div>
          ))}
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 11.5, color: "var(--faint)" }}>
              {ui.draft ? "Northstar Pilot detected" : "No project selected"}
            </span>
            <div
              onClick={runCapture}
              className="hover-dark-btn"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                height: 31,
                padding: "0 14px",
                borderRadius: 8,
                background: "var(--night)",
                color: "#f3f5fe",
                fontSize: 12.5,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              File it
              <PhIcon name="ArrowRight" size={13} />
            </div>
          </div>
        </div>
      </div>

      {ui.phase === "idle" && (
        <div style={{ marginTop: 16, display: "flex", flexWrap: "wrap", gap: 7 }}>
          <span style={{ fontSize: 11.5, color: "var(--faint)", alignSelf: "center", marginRight: 2 }}>Try:</span>
          {samples.map((m) => (
            <div
              key={m.key}
              onClick={pickSample(m.key)}
              className="hover-accsoft"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 11px",
                border: "1px solid var(--line)",
                borderRadius: 20,
                fontSize: 11.5,
                color: "var(--body)",
                cursor: "pointer",
              }}
            >
              <PhIcon name={m.icon} size={13} color="var(--faint)" />
              {m.label}
            </div>
          ))}
        </div>
      )}

      {ui.phase === "routing" && (
        <div style={{ marginTop: 26, border: "1px solid var(--line)", borderRadius: 12, padding: "18px 20px", animation: "fadeIn .2s both" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 12.5, color: "var(--body)", marginBottom: 14 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#796cbf", animation: "pulseDot 1s infinite" }} />
            Chimpy is reading it
          </div>
          {routingSteps(ui.mode ?? "meeting").map((st, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 11.5, color: st.color, padding: "4px 0" }}>
              <PhIcon name={st.icon} size={13} />
              {st.label}
            </div>
          ))}
        </div>
      )}

      {ui.phase === "done" && (
        <div style={{ marginTop: 26, animation: "riseIn .35s ease both" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Filed into {ui.displayRoutes.length} places</div>
            <div style={{ fontSize: 11.5, color: "var(--muted)" }}>Nothing is live until you approve it</div>
            <div onClick={go("review")} style={{ marginLeft: "auto", fontSize: 12, color: "var(--acc)", cursor: "pointer" }}>
              Open in Review →
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 11 }}>
            {ui.displayRoutes.map((r, i) => (
              <div key={i} style={{ border: "1px solid var(--line)", borderRadius: 11, padding: "13px 15px", background: "#fff" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
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
                    {r.module}
                  </span>
                  <span style={{ marginLeft: "auto", fontSize: 11, color: r.confidence === "Needs a look" ? "#8a5a2b" : "#9397ab" }}>
                    {r.confidence}
                  </span>
                </div>
                <div style={{ fontSize: 12.5, fontWeight: 500, lineHeight: 1.4 }}>{r.title}</div>
                <div style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 5, lineHeight: 1.55 }}>{r.detail}</div>
                <div
                  onClick={toggleTrace(`route-${i}`)}
                  className="hover-acc-text"
                  style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 9, fontSize: 11, color: "var(--faint)", cursor: "pointer" }}
                >
                  <PhIcon name="GitBranch" size={12} />
                  {ui.traces[`route-${i}`] ? "Hide reasoning" : "Rule that fired"}
                </div>
                {ui.traces[`route-${i}`] && (
                  <div style={{ marginTop: 9, borderLeft: "2px solid #e0dcf7", padding: "2px 0 2px 11px", display: "flex", flexDirection: "column", gap: 5 }}>
                    <div style={{ fontSize: 11, color: "var(--body)", fontFamily: "ui-monospace,Menlo,monospace" }}>{r.rule}</div>
                    <div style={{ fontSize: 11, color: "var(--muted)", lineHeight: 1.5 }}>{r.why}</div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {ui.learned && (
            <div
              style={{
                marginTop: 14,
                display: "flex",
                gap: 11,
                alignItems: "flex-start",
                border: "1px solid #d2cefd",
                background: "#faf9ff",
                borderRadius: 11,
                padding: "13px 15px",
                animation: "riseIn .4s .2s both",
              }}
            >
              <PhIcon name="Sparkle" weight="fill" size={14} color="var(--acc)" style={{ marginTop: 2 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12.5, fontWeight: 500 }}>Chimpy wants to write itself a rule</div>
                <div style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 4, lineHeight: 1.55 }}>
                  You&rsquo;ve corrected this routing twice — want it applied automatically next time?
                </div>
              </div>
              <div
                onClick={acceptRule}
                className="hover-accsoft"
                style={{ flex: "none", height: 28, padding: "0 12px", border: "1px solid var(--acc)", borderRadius: 7, color: "var(--acc)", fontSize: 11.5, display: "flex", alignItems: "center", cursor: "pointer" }}
              >
                Teach it
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
