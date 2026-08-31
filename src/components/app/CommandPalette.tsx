"use client";

import { PhIcon } from "./PhosphorIcon";
import { PALETTE_ITEMS } from "@/lib/demo-content";
import { useCM } from "./context";
import type { Screen } from "./useChimpManager";

export function CommandPalette() {
  const { ui, closePalette, onPalette, onPaletteKey, patch, go, toggleChimpy } = useCM();
  if (!ui.paletteOpen) return null;

  const q = ui.paletteText.toLowerCase();
  const filtered = PALETTE_ITEMS.filter((p) => !q || p.label.toLowerCase().includes(q));

  return (
    <div
      onClick={closePalette}
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(22,24,38,.3)",
        zIndex: 50,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: "14vh",
        animation: "fadeIn .14s both",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 600,
          maxWidth: "90%",
          background: "#fff",
          borderRadius: 14,
          boxShadow: "0 24px 60px rgba(22,24,38,.28)",
          overflow: "hidden",
          animation: "riseIn .18s both",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", borderBottom: "1px solid var(--line)" }}>
          <PhIcon name="PlusCircle" size={17} color="var(--acc)" />
          <input
            value={ui.paletteText}
            onChange={onPalette}
            onKeyDown={onPaletteKey}
            autoFocus
            placeholder="Capture anything, or type a command…"
            style={{ flex: 1, border: 0, outline: "none", fontSize: 14, color: "var(--ink)" }}
          />
          <span style={{ fontSize: 10, color: "var(--faint)", border: "1px solid var(--line)", borderRadius: 4, padding: "2px 6px" }}>
            esc
          </span>
        </div>
        <div style={{ padding: 7 }}>
          {q ? (
            <div
              onClick={() => patch({ paletteOpen: false, screen: "capture", draft: ui.paletteText, phase: "idle" })}
              className="hover-wash"
              style={{ display: "flex", alignItems: "center", gap: 11, padding: "9px 11px", borderRadius: 8, cursor: "pointer" }}
            >
              <PhIcon name="PlusCircle" size={15} color="var(--muted)" />
              <div style={{ fontSize: 12.5 }}>Capture &ldquo;{ui.paletteText}&rdquo;</div>
              <div style={{ marginLeft: "auto", fontSize: 11, color: "var(--faint)" }}>Chimpy will route it</div>
            </div>
          ) : null}
          {filtered.map((p, i) => (
            <div
              key={i}
              onClick={() => {
                if (p.screen) go(p.screen as Screen)();
                else {
                  closePalette();
                  toggleChimpy();
                }
              }}
              className="hover-wash"
              style={{ display: "flex", alignItems: "center", gap: 11, padding: "9px 11px", borderRadius: 8, cursor: "pointer" }}
            >
              <PhIcon name={p.icon} size={15} color="var(--muted)" />
              <div style={{ fontSize: 12.5 }}>{p.label}</div>
              <div style={{ marginLeft: "auto", fontSize: 11, color: "var(--faint)" }}>{p.hint}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
