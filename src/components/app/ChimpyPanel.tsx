"use client";

import { useEffect, useRef } from "react";
import { PhIcon } from "./PhosphorIcon";
import { CHIMPY_LOG, CHIMPY_PROMPTS } from "@/lib/demo-content";
import { useCM } from "./context";

export function ChimpyPanel() {
  const { ui, toggleChimpy, onChimpyInput, onChimpyKey, sendChimpyMessage } = useCM();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [ui.chimpyMessages.length, ui.chimpyThinking]);

  if (!ui.chimpyOpen) return null;

  const hasChat = ui.chimpyMessages.length > 0;

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

      <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "16px 18px", display: "flex", flexDirection: "column", gap: 14 }}>
        {!hasChat && (
          <>
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
                  onClick={() => sendChimpyMessage(q)}
                  className="hover-acc-text"
                  style={{ border: "1px solid rgba(233,233,237,.12)", borderRadius: 8, padding: "8px 11px", fontSize: 11.5, color: "#9397ab", cursor: "pointer" }}
                >
                  {q}
                </div>
              ))}
            </div>
          </>
        )}

        {hasChat &&
          ui.chimpyMessages.map((m, i) =>
            m.role === "user" ? (
              <div key={i} style={{ alignSelf: "flex-end", maxWidth: "85%", background: "rgba(145,132,217,.14)", border: "1px solid rgba(181,171,252,.25)", borderRadius: "10px 10px 2px 10px", padding: "8px 11px" }}>
                <div style={{ fontSize: 12, color: "#e9e9ed", lineHeight: 1.5 }}>{m.text}</div>
              </div>
            ) : (
              <div key={i} style={{ display: "flex", gap: 10, maxWidth: "92%" }}>
                <span
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 5,
                    background: "#2b2741",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#b5abfc",
                    flex: "none",
                    marginTop: 1,
                  }}
                >
                  <PhIcon name="Sparkle" weight="fill" size={10} />
                </span>
                <div style={{ fontSize: 12, color: "#cfd3e5", lineHeight: 1.55 }}>{m.text}</div>
              </div>
            )
          )}

        {ui.chimpyThinking && (
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <span
              style={{
                width: 18,
                height: 18,
                borderRadius: 5,
                background: "#2b2741",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#b5abfc",
                flex: "none",
              }}
            >
              <PhIcon name="Sparkle" weight="fill" size={10} />
            </span>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#b5abfc", animation: "pulseDot 1s infinite" }} />
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#b5abfc", animation: "pulseDot 1s .15s infinite" }} />
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#b5abfc", animation: "pulseDot 1s .3s infinite" }} />
          </div>
        )}
      </div>

      <div style={{ padding: "12px 14px", borderTop: "1px solid rgba(233,233,237,.1)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, height: 34, padding: "0 11px", border: "1px solid rgba(233,233,237,.14)", borderRadius: 9 }}>
          <input
            value={ui.chimpyInput}
            onChange={onChimpyInput}
            onKeyDown={onChimpyKey}
            placeholder="Ask about this project…"
            style={{ flex: 1, background: "transparent", border: 0, outline: "none", fontSize: 12, color: "#e9e9ed" }}
          />
          <span onClick={() => sendChimpyMessage()} className="hover-acc-text" style={{ cursor: "pointer", display: "flex" }}>
            <PhIcon name="ArrowUp" size={13} color="#5c6070" />
          </span>
        </div>
      </div>
    </aside>
  );
}
