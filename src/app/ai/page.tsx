"use client";

import { useCallback, useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Check, X, Play, RefreshCw } from "lucide-react";
import type { AIProposal, ProjectState } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function AIPage() {
  const [state, setState] = useState<ProjectState | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [activeProposal, setActiveProposal] = useState<AIProposal | null>(null);

  const fetchState = useCallback(async () => {
    const res = await fetch("/api/state");
    const data = await res.json();
    setState(data);
    const pending = data.ai_proposals?.find(
      (p: AIProposal) => p.status === "pending"
    );
    if (pending) setActiveProposal(pending);
  }, []);

  useEffect(() => {
    fetchState();
  }, [fetchState]);

  async function runTrigger(type: "meeting" | "github" | "vendor") {
    setLoading(type);
    const body =
      type === "meeting"
        ? { type: "meeting", meeting_id: "MTG-002" }
        : type === "github"
          ? { type: "github", event_id: "GH-001" }
          : { type: "vendor" };

    const res = await fetch("/api/ai/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    setActiveProposal(data.proposal);
    setState(data.state);
    setLoading(null);
  }

  async function setApproval(changeId: string, approval: "approved" | "rejected") {
    if (!activeProposal) return;
    const updated = {
      ...activeProposal,
      changes: activeProposal.changes.map((c) =>
        c.id === changeId ? { ...c, approval } : c
      ),
    };
    setActiveProposal(updated);
  }

  async function submitApproval() {
    if (!activeProposal) return;
    setLoading("approve");
    const res = await fetch("/api/ai/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ proposal_id: activeProposal.id, proposal: activeProposal }),
    });
    const data = await res.json();
    setState(data.state);
    setActiveProposal(null);
    setLoading(null);
    await fetchState();
  }

  async function resetDemo() {
    setLoading("reset");
    await fetch("/api/demo/reset", { method: "POST" });
    setActiveProposal(null);
    await fetchState();
    setLoading(null);
  }

  return (
    <div className="p-8">
      <Header
        title="AI Assistant"
        subtitle="Trigger → Context → AI interpretation → Human approval → Tracker update"
        action={
          <button
            type="button"
            onClick={resetDemo}
            disabled={!!loading}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <RefreshCw className={cn("h-4 w-4", loading === "reset" && "animate-spin")} />
            Reset demo
          </button>
        }
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <DemoTriggerCard
          title="Demo #1 — Meeting"
          description="Northstar design review: 620mm clearance, enclosure redesign, firmware dependency"
          onRun={() => runTrigger("meeting")}
          loading={loading === "meeting"}
        />
        <DemoTriggerCard
          title="Demo #2 — GitHub"
          description="PR #148 merged, CI 18/18 — software complete but validation blocked"
          onRun={() => runTrigger("github")}
          loading={loading === "github"}
        />
        <DemoTriggerCard
          title="Demo #3 — Vendor"
          description="VectorNav firmware Sep 6 → Sep 12 — cascade risk update"
          onRun={() => runTrigger("vendor")}
          loading={loading === "vendor"}
        />
      </div>

      {state && (
        <div className="mb-6 rounded-xl border border-slate-100 bg-white p-5 shadow-card">
          <h2 className="text-sm font-semibold uppercase text-slate-500">
            Current AI Summary
          </h2>
          <p className="mt-2 text-chimp-navy">{state.ai_summary}</p>
        </div>
      )}

      {activeProposal && (
        <div className="rounded-xl border-2 border-chimp-primary/30 bg-white shadow-card">
          <div className="border-b border-slate-100 bg-chimp-primary/5 px-6 py-4">
            <p className="text-sm font-medium text-chimp-primary">
              ChimpManager AI detected {activeProposal.changes.length} changes
            </p>
            <p className="mt-1 text-lg font-semibold text-chimp-navy">
              {activeProposal.trigger}
            </p>
            <p className="mt-2 text-sm text-slate-600">{activeProposal.summary}</p>
          </div>

          <div className="divide-y divide-slate-100">
            {activeProposal.changes.map((change) => (
              <div key={change.id} className="flex gap-4 px-6 py-4">
                <div className="flex-1">
                  <p className="font-medium text-chimp-navy">{change.title}</p>
                  <p className="mt-1 text-sm text-slate-600">{change.description}</p>
                  <p className="mt-2 text-xs text-slate-500">
                    <span className="font-medium">Reasoning:</span> {change.reasoning}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Confidence {(change.confidence * 100).toFixed(0)}% · {change.action}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => setApproval(change.id, "approved")}
                    className={cn(
                      "rounded-lg p-2",
                      change.approval === "approved"
                        ? "bg-green-100 text-green-700"
                        : "bg-slate-100 text-slate-500 hover:bg-green-50"
                    )}
                    aria-label="Approve"
                  >
                    <Check className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setApproval(change.id, "rejected")}
                    className={cn(
                      "rounded-lg p-2",
                      change.approval === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-slate-100 text-slate-500 hover:bg-red-50"
                    )}
                    aria-label="Reject"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4">
            <button
              type="button"
              onClick={() => setActiveProposal(null)}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Dismiss
            </button>
            <button
              type="button"
              onClick={submitApproval}
              disabled={loading === "approve"}
              className="inline-flex items-center gap-2 rounded-lg bg-chimp-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-chimp-violet disabled:opacity-50"
            >
              <Play className="h-4 w-4" />
              Apply approved changes
            </button>
          </div>
        </div>
      )}

      {!activeProposal && state?.ai_proposals?.length ? (
        <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-card">
          <h2 className="mb-4 font-semibold">Proposal history</h2>
          <ul className="space-y-2 text-sm">
            {[...state.ai_proposals].reverse().map((p) => (
              <li key={p.id} className="flex justify-between text-slate-600">
                <span>{p.trigger}</span>
                <span className="capitalize">{p.status}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {!activeProposal && !state?.ai_proposals?.length && (
        <p className="text-center text-slate-500 py-12">
          Run a demo trigger above to see AI-proposed changes for human approval.
        </p>
      )}
    </div>
  );
}

function DemoTriggerCard({
  title,
  description,
  onRun,
  loading,
}: {
  title: string;
  description: string;
  onRun: () => void;
  loading: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onRun}
      disabled={loading}
      className="rounded-xl border border-slate-100 bg-white p-5 text-left shadow-card transition hover:border-chimp-primary/40 hover:shadow-md disabled:opacity-60"
    >
      <h3 className="font-semibold text-chimp-navy">{title}</h3>
      <p className="mt-2 text-sm text-slate-500">{description}</p>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-chimp-primary">
        {loading ? "Analyzing…" : "Run trigger →"}
      </span>
    </button>
  );
}
