"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { AIProposal, ProjectState, WorkItemStatus } from "@/lib/types";
import {
  CAPTURE_MODES,
  SAMPLE_TEXT,
  LEARNS_RULE,
  routingSteps,
  type CaptureMode,
  type RouteCard,
} from "@/lib/hermes";
import { COLS, type Role } from "@/lib/demo-content";
import { askChimpy, type ChimpyMessage } from "@/lib/chimpy";

export type Screen =
  | "capture"
  | "overview"
  | "tracker"
  | "review"
  | "modules"
  | "people"
  | "settings";

export type { Role };

export interface UiState {
  screen: Screen;
  role: Role;
  draft: string;
  mode: CaptureMode | null;
  phase: "idle" | "routing" | "done";
  displayRoutes: RouteCard[];
  traces: Record<string, boolean>;
  learned: boolean;
  rulesExtra: { text: string; origin: string; source: "Chimpy" }[];
  filter: "all" | "mine" | "blocked" | "critical";
  viewSaved: boolean;
  editing: string | null;
  drag: string | null;
  dragOver: string | null;
  detail: string | null;
  detailKind: "task" | "person" | null;
  chimpyOpen: boolean;
  paletteOpen: boolean;
  paletteText: string;
  modulesOn: Record<string, boolean>;
  rulesOff: Record<number, boolean>;
  toast: string | null;
  activeProposal: AIProposal | null;
  applied: boolean;
  appliedCount: number;
  chimpyMessages: ChimpyMessage[];
  chimpyInput: string;
  chimpyThinking: boolean;
}

const initialUi: UiState = {
  screen: "capture",
  role: "pm",
  draft: "",
  mode: null,
  phase: "idle",
  displayRoutes: [],
  traces: {},
  learned: false,
  rulesExtra: [],
  filter: "all",
  viewSaved: false,
  editing: null,
  drag: null,
  dragOver: null,
  detail: null,
  detailKind: null,
  chimpyOpen: false,
  paletteOpen: false,
  paletteText: "",
  modulesOn: {
    timeline: true,
    calendar: true,
    docs: false,
    decisions: true,
    budget: false,
    resourcing: true,
    approvals: true,
    vendor: true,
    reports: false,
  },
  rulesOff: {},
  toast: null,
  activeProposal: null,
  applied: false,
  appliedCount: 0,
  chimpyMessages: [],
  chimpyInput: "",
  chimpyThinking: false,
};

export function useChimpManager(initialState: ProjectState) {
  const [projectState, setProjectState] = useState(initialState);
  const [ui, setUi] = useState<UiState>(initialUi);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const patch = useCallback(
    (p: Partial<UiState> | ((s: UiState) => Partial<UiState>)) => {
      setUi((s) => ({ ...s, ...(typeof p === "function" ? p(s) : p) }));
    },
    []
  );

  const flash = useCallback(
    (toast: string) => {
      patch({ toast });
      if (toastTimer.current) clearTimeout(toastTimer.current);
      toastTimer.current = setTimeout(() => patch({ toast: null }), 2600);
    },
    [patch]
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        patch((s) => ({ paletteOpen: !s.paletteOpen, paletteText: "" }));
      }
      if (e.key === "Escape") patch({ paletteOpen: false, detail: null });
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [patch]);

  const persistState = useCallback(async (next: ProjectState) => {
    setProjectState(next);
    await fetch("/api/state", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ state: next }),
    });
  }, []);

  const go = (screen: Screen) => () => patch({ screen, paletteOpen: false });

  // ---- Capture ----
  const onDraft = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    patch({ draft: e.target.value, phase: "idle" });

  const pickSample = (mode: CaptureMode) => () =>
    patch({ draft: SAMPLE_TEXT[mode] ?? "", mode, phase: "idle" });

  const runCapture = useCallback(async () => {
    const mode = ui.mode ?? "meeting";
    patch({ phase: "routing", mode });
    const [res] = await Promise.all([
      fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: mode }),
      }),
      new Promise((r) => setTimeout(r, 1400)),
    ]);
    const data = await res.json();
    setProjectState(data.state);
    patch({
      phase: "done",
      displayRoutes: data.displayRoutes ?? [],
      activeProposal: data.proposal,
      learned: mode === "task" || mode === "contact",
      applied: false,
      appliedCount: 0,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ui.mode]);

  const acceptRule = () => {
    const mode = ui.mode ?? "task";
    const text = LEARNS_RULE[mode] ?? LEARNS_RULE.task!;
    patch((s) => ({
      rulesExtra: s.rulesExtra.concat([
        { text, origin: "Learned from two corrections · today", source: "Chimpy" },
      ]),
      learned: false,
    }));
    flash("Rule added. Chimpy will route that way from now on.");
  };

  const toggleTrace = (id: string) => () =>
    patch((s) => ({ traces: { ...s.traces, [id]: !s.traces[id] } }));

  // ---- Tracker ----
  const onDragStart = (id: string) => () => patch({ drag: id });
  const onDragEnd = () => patch({ drag: null, dragOver: null });
  const onDragOverCol = (col: WorkItemStatus) => (e: React.DragEvent) => {
    e.preventDefault();
    patch((s) => (s.dragOver === col ? {} : { dragOver: col }));
  };
  const onDrop = (col: WorkItemStatus) => async (e: React.DragEvent) => {
    e.preventDefault();
    const id = ui.drag;
    patch({ drag: null, dragOver: null });
    if (!id) return;
    const item = projectState.work_items.find((w) => w.id === id);
    if (!item || item.status === col) return;
    const next: ProjectState = {
      ...projectState,
      work_items: projectState.work_items.map((w) =>
        w.id === id
          ? {
              ...w,
              status: col,
              history: [
                ...w.history,
                { at: new Date().toISOString().slice(0, 10), event: `Moved to ${COLS.find((c) => c.key === col)?.label}` },
              ],
            }
          : w
      ),
    };
    await persistState(next);
    flash(`Moved to ${COLS.find((c) => c.key === col)?.label}. Chimpy logged the change.`);
  };

  const startEdit = (id: string) => (e: React.MouseEvent) => {
    e.stopPropagation();
    patch({ editing: id });
  };
  const onTitleChange = (id: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setProjectState((s) => ({
      ...s,
      work_items: s.work_items.map((w) => (w.id === id ? { ...w, title: v } : w)),
    }));
  };
  const stopEdit = async () => {
    patch({ editing: null });
    await persistState(projectState);
  };
  const onTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "Escape") e.currentTarget.blur();
  };
  const stop = (e: React.SyntheticEvent) => e.stopPropagation();

  const setFilter = (filter: UiState["filter"]) => () => patch({ filter, viewSaved: false });
  const saveView = () => {
    patch({ viewSaved: true });
    flash("View saved to the sidebar.");
  };

  // ---- Detail panel ----
  const openDetail = (id: string, kind: "task" | "person") => (e?: React.MouseEvent) => {
    if (e && ui.editing === id) return;
    patch({ detail: id, detailKind: kind });
  };
  const closeDetail = () => patch({ detail: null, detailKind: null });

  // ---- Review ----
  const setApproval = (changeId: string, val: "approved" | "rejected") => () =>
    patch((s) => {
      if (!s.activeProposal) return {};
      return {
        activeProposal: {
          ...s.activeProposal,
          changes: s.activeProposal.changes.map((c) =>
            c.id === changeId ? { ...c, approval: c.approval === val ? "pending" : val } : c
          ),
        },
      };
    });

  const applyApproved = useCallback(async () => {
    if (!ui.activeProposal) return;
    const res = await fetch("/api/ai/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ proposal: ui.activeProposal }),
    });
    const data = await res.json();
    setProjectState(data.state);
    const approvedCount = ui.activeProposal.changes.filter((c) => c.approval === "approved").length;
    patch({ applied: true, appliedCount: approvedCount });
    flash(`${approvedCount} changes applied to the tracker.`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ui.activeProposal]);

  const dismissAll = () => patch({ applied: true, appliedCount: 0 });
  const resetReview = async () => {
    await fetch("/api/demo/reset", { method: "POST" });
    const res = await fetch("/api/state");
    const data = await res.json();
    setProjectState(data);
    patch({ ...initialUi, screen: "review" });
  };

  // ---- Chimpy / palette ----
  const toggleChimpy = () => patch((s) => ({ chimpyOpen: !s.chimpyOpen }));
  const onChimpyInput = (e: React.ChangeEvent<HTMLInputElement>) => patch({ chimpyInput: e.target.value });
  const sendChimpyMessage = useCallback(
    async (presetText?: string) => {
      const text = (presetText ?? ui.chimpyInput).trim();
      if (!text) return;
      patch((s) => ({
        chimpyMessages: [...s.chimpyMessages, { role: "user", text }],
        chimpyInput: "",
        chimpyThinking: true,
      }));
      await new Promise((r) => setTimeout(r, 500 + Math.random() * 400));
      const reply = askChimpy(text, projectState);
      patch((s) => ({
        chimpyMessages: [...s.chimpyMessages, { role: "assistant", text: reply }],
        chimpyThinking: false,
      }));
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [ui.chimpyInput, projectState]
  );
  const onChimpyKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendChimpyMessage();
  };
  const openPalette = () => patch({ paletteOpen: true, paletteText: "" });
  const closePalette = () => patch({ paletteOpen: false });
  const onPalette = (e: React.ChangeEvent<HTMLInputElement>) => patch({ paletteText: e.target.value });
  const onPaletteKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      patch({ paletteOpen: false, screen: "capture", draft: ui.paletteText, phase: "idle" });
    }
  };

  // ---- Modules / rules ----
  const toggleModule = (key: string) => () =>
    patch((s) => ({ modulesOn: { ...s.modulesOn, [key]: !s.modulesOn[key] } }));
  const toggleRule = (idx: number) => () =>
    patch((s) => ({ rulesOff: { ...s.rulesOff, [idx]: !s.rulesOff[idx] } }));

  return {
    projectState,
    ui,
    patch,
    flash,
    persistState,
    go,
    onDraft,
    pickSample,
    runCapture,
    acceptRule,
    toggleTrace,
    onDragStart,
    onDragEnd,
    onDragOverCol,
    onDrop,
    startEdit,
    onTitleChange,
    stopEdit,
    onTitleKeyDown,
    stop,
    setFilter,
    saveView,
    openDetail,
    closeDetail,
    setApproval,
    applyApproved,
    dismissAll,
    resetReview,
    toggleChimpy,
    onChimpyInput,
    sendChimpyMessage,
    onChimpyKey,
    openPalette,
    closePalette,
    onPalette,
    onPaletteKey,
    toggleModule,
    toggleRule,
    captureModes: CAPTURE_MODES,
    routingSteps,
  };
}

export type ChimpManager = ReturnType<typeof useChimpManager>;
