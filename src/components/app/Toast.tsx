"use client";

import { PhIcon } from "./PhosphorIcon";
import { useCM } from "./context";

export function Toast() {
  const { ui } = useCM();
  if (!ui.toast) return null;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 22,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 60,
        background: "#161826",
        color: "#e9e9ed",
        fontSize: 12.5,
        padding: "10px 16px",
        borderRadius: 9,
        boxShadow: "0 12px 30px rgba(22,24,38,.24)",
        display: "flex",
        alignItems: "center",
        gap: 9,
        animation: "riseIn .2s both",
      }}
    >
      <PhIcon name="CheckCircle" weight="fill" size={14} color="#7fae94" />
      {ui.toast}
    </div>
  );
}
