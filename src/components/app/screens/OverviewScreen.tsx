"use client";

import { PhIcon } from "../PhosphorIcon";
import { ROLES } from "@/lib/demo-content";
import { useCM } from "../context";

export function OverviewScreen() {
  const { ui, go, projectState } = useCM();
  const role = ROLES[ui.role];

  const pendingProposal = [...projectState.ai_proposals].reverse().find((p) => p.status === "pending");
  const pendingCount = ui.applied ? 0 : (pendingProposal?.changes.length ?? 0);
  const pendingPreview = (pendingProposal?.changes ?? []).slice(0, 2);
  const project = projectState.projects[0];

  return (
    <div style={{ padding: "32px 32px 56px", maxWidth: 1240 }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, marginBottom: 18 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em" }}>{role.greeting}</h1>
          <p style={{ margin: "6px 0 0", fontSize: 13, color: "var(--muted)" }}>{role.sub}</p>
        </div>
        <div style={{ fontSize: 12, color: "var(--faint)" }}>Northstar Autonomous Inspection Pilot</div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 11,
          border: "1px solid #d2cefd",
          background: "#faf9ff",
          borderRadius: 10,
          padding: "10px 14px",
          marginBottom: 22,
        }}
      >
        <PhIcon name="Sparkle" weight="fill" size={14} color="var(--acc)" />
        <div style={{ fontSize: 12, color: "var(--body)" }}>{role.layoutReason}</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", border: "1px solid var(--line)", borderRadius: 12, overflow: "hidden", marginBottom: 22 }}>
        {role.stats.map((s, i) => (
          <div key={i} style={{ padding: "15px 18px", borderRight: i < role.stats.length - 1 ? "1px solid var(--line)" : "none" }}>
            <div style={{ fontSize: 11.5, color: "var(--muted)" }}>{s.label}</div>
            <div style={{ fontSize: 23, fontWeight: 600, marginTop: 5, letterSpacing: "-0.02em" }}>{s.value}</div>
            <div style={{ fontSize: 11, color: s.noteColor, marginTop: 8 }}>{s.note}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.5fr) minmax(0,1fr)", gap: 20 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <section style={{ border: "1px solid var(--line)", borderRadius: 12, overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "15px 19px", borderBottom: "1px solid var(--line)" }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#c9925f", flex: "none" }} />
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 600, letterSpacing: "-0.01em" }}>{project?.name}</div>
                <div style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 3 }}>Northstar Energy · target 15 October · at risk</div>
              </div>
              <span onClick={go("tracker")} className="hover-acc-text" style={{ marginLeft: "auto", fontSize: 11.5, color: "var(--acc)", cursor: "pointer" }}>
                Open tracker
              </span>
            </div>
            <div style={{ padding: "17px 19px 19px" }}>
              <p style={{ margin: "0 0 17px", fontSize: 12.5, lineHeight: 1.6, color: "var(--body)" }}>{role.narrative}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
                {role.bars.map((b, i) => (
                  <div key={i}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 6 }}>
                      <span>{b.label}</span>
                      <span style={{ color: "var(--muted)" }}>{b.meta}</span>
                    </div>
                    <div style={{ height: 4, borderRadius: 2, background: "var(--line)", overflow: "hidden" }}>
                      <div style={{ height: "100%", background: "#796cbf", width: b.pct }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section style={{ border: "1px solid var(--line)", borderRadius: 12, overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", padding: "14px 19px", borderBottom: "1px solid var(--line)" }}>
              <div style={{ fontSize: 12.5, fontWeight: 600 }}>Critical path to the safety review</div>
              <span style={{ marginLeft: "auto", fontSize: 11.5, color: "var(--muted)" }}>4 → 25 September</span>
            </div>
            <div style={{ padding: "22px 19px 22px" }}>
              <div style={{ position: "relative", height: 2, background: "var(--line)", margin: "0 6px" }}>
                <div style={{ position: "absolute", left: 0, top: 0, height: 2, width: "26%", background: "#796cbf" }} />
                <div style={{ position: "absolute", left: 0, top: -4, width: 10, height: 10, borderRadius: "50%", background: "#796cbf" }} />
                <div style={{ position: "absolute", left: "34%", top: -4, width: 10, height: 10, borderRadius: "50%", background: "#fff", border: "2px solid #c9925f" }} />
                <div style={{ position: "absolute", left: "62%", top: -4, width: 10, height: 10, borderRadius: "50%", background: "#fff", border: "2px solid #cfd3e5" }} />
                <div style={{ position: "absolute", right: 0, top: -5, width: 12, height: 12, borderRadius: "50%", background: "#161826" }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginTop: 14, fontSize: 11.5 }}>
                <div>
                  <div style={{ fontWeight: 500 }}>Today</div>
                  <div style={{ color: "var(--muted)", marginTop: 3 }}>Integration prep</div>
                </div>
                <div>
                  <div style={{ fontWeight: 500, color: "#a04a3c" }}>12 Sep</div>
                  <div style={{ color: "var(--muted)", marginTop: 3 }}>Firmware v2.4.1 arrives</div>
                </div>
                <div>
                  <div style={{ fontWeight: 500 }}>18–20 Sep</div>
                  <div style={{ color: "var(--muted)", marginTop: 3 }}>Field validation window</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 500 }}>25 Sep</div>
                  <div style={{ color: "var(--muted)", marginTop: 3 }}>Safety review demo</div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <section style={{ border: "1px solid #d2cefd", background: "linear-gradient(180deg,#faf9ff,#fff)", borderRadius: 12, overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 17px 11px" }}>
              <PhIcon name="SealCheck" size={16} color="var(--acc)" />
              <div style={{ fontSize: 12.5, fontWeight: 600 }}>Waiting on you</div>
              <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--acc)", background: "#efecfd", borderRadius: 20, padding: "2px 8px", fontWeight: 500 }}>
                {pendingCount}
              </span>
            </div>
            <div style={{ padding: "0 17px 15px", display: "flex", flexDirection: "column", gap: 9 }}>
              {pendingPreview.map((p) => (
                <div key={p.id} style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 9, padding: "11px 12px" }}>
                  <div style={{ fontSize: 12.5, fontWeight: 500 }}>{p.title}</div>
                  <div style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 4, lineHeight: 1.5 }}>{p.description}</div>
                </div>
              ))}
              <div
                onClick={go("review")}
                className="hover-accsoft"
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, height: 32, border: "1px solid var(--acc)", borderRadius: 8, color: "var(--acc)", fontSize: 12.5, fontWeight: 500, cursor: "pointer" }}
              >
                Go to Review
                <PhIcon name="ArrowRight" size={13} />
              </div>
            </div>
          </section>

          <section style={{ border: "1px solid var(--line)", borderRadius: 12, overflow: "hidden" }}>
            <div style={{ padding: "14px 17px 2px", fontSize: 12.5, fontWeight: 600 }}>{role.sideTitle}</div>
            <div style={{ padding: "6px 17px 14px", display: "flex", flexDirection: "column" }}>
              {role.side.map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 11, padding: "9px 0", borderBottom: "1px solid var(--line)" }}>
                  <PhIcon name={item.icon} size={15} color="var(--faint)" style={{ marginTop: 1 }} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 12.5 }}>{item.title}</div>
                    <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 3 }}>{item.meta}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
