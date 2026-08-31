"use client";

import { PhIcon } from "./PhosphorIcon";
import { ROLES, type Role } from "@/lib/demo-content";
import { useCM } from "./context";

const ROLE_KEYS = Object.keys(ROLES) as Role[];

export function TopBar() {
  const { ui, patch, openPalette } = useCM();

  return (
    <header
      style={{
        flex: "none",
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "0 28px",
        height: 56,
        borderBottom: "1px solid var(--line)",
      }}
    >
      <div
        onClick={openPalette}
        className="hover-border"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          flex: 1,
          maxWidth: 360,
          height: 32,
          padding: "0 11px",
          border: "1px solid var(--line)",
          borderRadius: 8,
          background: "var(--wash)",
          cursor: "pointer",
        }}
      >
        <PhIcon name="MagnifyingGlass" size={14} color="var(--faint)" />
        <span style={{ fontSize: 12.5, color: "var(--faint)" }}>Search or capture…</span>
        <span
          style={{
            marginLeft: "auto",
            fontSize: 10,
            color: "var(--faint)",
            border: "1px solid var(--line)",
            background: "#fff",
            borderRadius: 4,
            padding: "1px 5px",
          }}
        >
          ⌘K
        </span>
      </div>

      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            padding: 3,
            border: "1px solid var(--line)",
            borderRadius: 9,
            background: "var(--wash)",
          }}
        >
          {ROLE_KEYS.map((key) => {
            const r = ROLES[key];
            const active = ui.role === key;
            return (
              <div
                key={key}
                onClick={() => patch({ role: key })}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  height: 26,
                  padding: "0 10px",
                  borderRadius: 6,
                  fontSize: 11.5,
                  cursor: "pointer",
                  background: active ? "#fff" : "transparent",
                  color: active ? "#161826" : "#75798c",
                  boxShadow: active ? "0 1px 2px rgba(22,24,38,.1)" : "none",
                }}
              >
                <PhIcon name={r.icon} size={13} />
                {r.short}
              </div>
            );
          })}
        </div>
        <div
          className="hover-wash"
          style={{
            position: "relative",
            width: 32,
            height: 32,
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--muted)",
            cursor: "pointer",
          }}
        >
          <PhIcon name="Bell" size={16} />
          <span
            style={{
              position: "absolute",
              top: 7,
              right: 8,
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: "#a04a3c",
            }}
          />
        </div>
      </div>
    </header>
  );
}
