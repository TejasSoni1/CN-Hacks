"use client";

import { PhIcon } from "../PhosphorIcon";
import { COLS, FILTERS, PRIORITY_COLORS, trackerColumnFor } from "@/lib/demo-content";
import { useCM } from "../context";
import type { WorkItem, WorkItemStatus } from "@/lib/types";

function deriveTags(item: WorkItem) {
  const tags: { label: string; color: string; bg: string }[] = [];
  if (item.code_status === "complete") tags.push({ label: "Code complete", color: "#2f6b4f", bg: "#e9f3ee" });
  if (item.ci_status === "passed") tags.push({ label: "CI passed", color: "#2f6b4f", bg: "#e9f3ee" });
  if (item.physical_validation === "blocked") tags.push({ label: "Physical blocked", color: "#a04a3c", bg: "#f7e7e2" });
  return tags;
}

export function TrackerScreen() {
  const {
    ui,
    go,
    projectState,
    setFilter,
    saveView,
    onDragStart,
    onDragEnd,
    onDragOverCol,
    onDrop,
    startEdit,
    stopEdit,
    onTitleChange,
    onTitleKeyDown,
    stop,
    openDetail,
  } = useCM();

  const employeeName = (id: string) => projectState.employees.find((e) => e.id === id)?.name ?? id;

  const project = projectState.projects[0];
  const items = projectState.work_items.filter((w) => w.project_id === project?.id);

  const visible = items.filter((w) => {
    if (ui.filter === "mine") return /Jordan|Alex/.test(employeeName(w.owner_id));
    if (ui.filter === "blocked") return w.status === "blocked";
    if (ui.filter === "critical") return w.priority === "critical" || w.priority === "high";
    return true;
  });

  const columns = COLS.map((col) => {
    const colItems = visible.filter((w) => trackerColumnFor(w.status) === col.key);
    return { ...col, items: colItems };
  });

  const dependencies = projectState.dependencies.filter((d) => d.project_id === project?.id);
  const risks = projectState.risks.filter((r) => r.project_id === project?.id && r.status === "open");

  return (
    <div style={{ padding: "30px 32px 56px" }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 16 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 600, letterSpacing: "-0.02em" }}>Tracker</h1>
          <p style={{ margin: "6px 0 0", fontSize: 12.5, color: "var(--muted)" }}>
            Northstar pilot · drag a card to change its state, click a title to rename it
          </p>
        </div>
        <div
          onClick={go("capture")}
          className="hover-accsoft"
          style={{ display: "flex", alignItems: "center", gap: 7, height: 31, padding: "0 13px", border: "1px solid var(--acc)", borderRadius: 8, fontSize: 12, color: "var(--acc)", cursor: "pointer" }}
        >
          <PhIcon name="Plus" size={13} />
          Add via capture
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 18, flexWrap: "wrap" }}>
        {FILTERS.map((f) => {
          const active = ui.filter === f.key;
          return (
            <div
              key={f.key}
              onClick={setFilter(f.key)}
              style={{
                height: 28,
                padding: "0 11px",
                border: `1px solid ${active ? "#b5abfc" : "#e7e7ee"}`,
                borderRadius: 20,
                fontSize: 11.5,
                display: "flex",
                alignItems: "center",
                gap: 6,
                cursor: "pointer",
                background: active ? "#f2f0fd" : "transparent",
                color: active ? "#5d5294" : "#3f424d",
              }}
            >
              {f.label}
            </div>
          );
        })}
        {ui.filter !== "all" && (
          <div
            onClick={saveView}
            className="hover-accsoft"
            style={{ height: 28, padding: "0 11px", borderRadius: 20, fontSize: 11.5, display: "flex", alignItems: "center", gap: 6, cursor: "pointer", color: "var(--acc)" }}
          >
            <PhIcon name="BookmarkSimple" size={12} />
            {ui.viewSaved ? "View saved" : "Save this view"}
          </div>
        )}
        <div style={{ marginLeft: "auto", fontSize: 11.5, color: "var(--faint)" }}>{visible.length} shown</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,minmax(0,1fr))", gap: 13, alignItems: "start" }}>
        {columns.map((col) => (
          <div
            key={col.key}
            onDragOver={onDragOverCol(col.key as WorkItemStatus)}
            onDrop={onDrop(col.key as WorkItemStatus)}
            style={{
              borderRadius: 12,
              padding: 2,
              background: ui.dragOver === col.key && ui.drag ? "#f2f0fd" : "transparent",
              minHeight: 120,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "2px 4px 10px" }}>
              <span style={{ fontSize: 11.5, fontWeight: 500 }}>{col.label}</span>
              <span style={{ fontSize: 11, color: "var(--faint)" }}>{col.items.length}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {col.items.map((t) => {
                const tags = deriveTags(t);
                const editing = ui.editing === t.id;
                const [pc] = PRIORITY_COLORS[t.priority];
                const priBg = PRIORITY_COLORS[t.priority][1];
                return (
                  <div
                    key={t.id}
                    draggable
                    onDragStart={onDragStart(t.id)}
                    onDragEnd={onDragEnd}
                    onClick={openDetail(t.id, "task")}
                    className="hover-border"
                    style={{
                      border: `1px solid ${t.status === "blocked" ? "#eadcd8" : "#e7e7ee"}`,
                      borderRadius: 11,
                      padding: "12px 13px",
                      background: t.status === "blocked" ? "#fdf7f5" : "#fff",
                      cursor: "grab",
                      opacity: ui.drag === t.id ? 0.4 : 1,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
                      <span style={{ fontFamily: "ui-monospace,Menlo,monospace", fontSize: 10.5, color: t.status === "blocked" ? "#a04a3c" : "#5d5294" }}>
                        {t.id}
                      </span>
                      <span style={{ marginLeft: "auto", fontSize: 9.5, color: pc, background: priBg, borderRadius: 4, padding: "2px 6px", textTransform: "capitalize" }}>
                        {t.priority}
                      </span>
                    </div>
                    {editing ? (
                      <input
                        value={t.title}
                        onChange={onTitleChange(t.id)}
                        onBlur={stopEdit}
                        onKeyDown={onTitleKeyDown}
                        onClick={stop}
                        onMouseDown={stop}
                        autoFocus
                        style={{
                          width: "calc(100% + 8px)",
                          fontSize: 12.5,
                          fontWeight: 500,
                          lineHeight: 1.4,
                          color: "var(--ink)",
                          border: "1px solid #b5abfc",
                          borderRadius: 6,
                          padding: "3px 4px",
                          margin: -4,
                          background: "#fff",
                          outline: "none",
                        }}
                      />
                    ) : (
                      <div
                        onClick={startEdit(t.id)}
                        className="hover-accsoft"
                        style={{ fontSize: 12.5, fontWeight: 500, lineHeight: 1.4, borderRadius: 5, padding: "1px 3px", margin: "0 -3px" }}
                      >
                        {t.title}
                      </div>
                    )}
                    {tags.length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 8 }}>
                        {tags.map((g, i) => (
                          <span key={i} style={{ fontSize: 9.5, color: g.color, background: g.bg, borderRadius: 4, padding: "2px 6px" }}>
                            {g.label}
                          </span>
                        ))}
                      </div>
                    )}
                    <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 8 }}>
                      {employeeName(t.owner_id)}
                      {t.due_date ? ` · due ${t.due_date}` : ""}
                    </div>
                  </div>
                );
              })}
              {col.items.length === 0 && (
                <div
                  style={{
                    border: "1px dashed var(--line)",
                    borderRadius: 11,
                    height: 74,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11.5,
                    color: "var(--faint)",
                  }}
                >
                  {col.empty}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 13, marginTop: 24 }}>
        <section style={{ border: "1px solid var(--line)", borderRadius: 12, padding: "15px 18px" }}>
          <div style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 11 }}>Dependencies</div>
          {dependencies.length === 0 && <div style={{ fontSize: 12, color: "var(--muted)" }}>None open.</div>}
          {dependencies.map((d) => (
            <div key={d.id} style={{ display: "flex", alignItems: "flex-start", gap: 11 }}>
              <PhIcon name="Plugs" size={15} color="var(--faint)" style={{ marginTop: 2 }} />
              <div>
                <div style={{ fontSize: 12.5 }}>{d.title}</div>
                <div style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 4, lineHeight: 1.5 }}>
                  {d.description} · owner {employeeName(d.owner_id)}
                  {d.expected_date ? ` · expected ${d.expected_date}` : ""}
                </div>
              </div>
            </div>
          ))}
        </section>
        <section style={{ border: "1px solid var(--line)", borderRadius: 12, padding: "15px 18px" }}>
          <div style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 11 }}>Risks</div>
          {risks.length === 0 && <div style={{ fontSize: 12, color: "var(--muted)" }}>None open.</div>}
          {risks.map((r) => (
            <div key={r.id} style={{ display: "flex", alignItems: "flex-start", gap: 11 }}>
              <PhIcon name="WarningDiamond" size={15} color="#a04a3c" style={{ marginTop: 2 }} />
              <div>
                <div style={{ fontSize: 12.5 }}>{r.title}</div>
                <div style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 4, lineHeight: 1.5, textTransform: "capitalize" }}>
                  {r.severity} severity
                </div>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
