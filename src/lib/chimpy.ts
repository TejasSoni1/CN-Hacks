import type { ProjectState } from "./types";

export interface ChimpyMessage {
  role: "user" | "assistant";
  text: string;
}

/**
 * Chimpy's chat brain — deliberately rule-based, not an LLM call. Every
 * answer is composed from the live ProjectState, so it changes as the demo
 * changes (approve a proposal, drag a card) instead of reciting a script.
 * This matches the app's own thesis on the Rules screen: "the routing layer
 * is rules, not vibes."
 */
export function askChimpy(question: string, state: ProjectState): string {
  const q = question.toLowerCase();
  const project = state.projects[0];
  const openRisks = state.risks.filter((r) => r.status === "open");
  const blockedItems = state.work_items.filter((w) => w.status === "blocked");
  const pendingDeps = state.dependencies.filter((d) => d.status !== "resolved");
  const pendingProposals = state.ai_proposals.filter((p) => p.status === "pending");
  const decidedProposals = state.ai_proposals.filter(
    (p) => p.status === "approved" || p.status === "partial"
  );

  const employeeName = (id: string) => state.employees.find((e) => e.id === id)?.name ?? id;

  // Intent: what's blocking / stuck / demo readiness
  if (/(block|stuck|holding up|holds up|demo ready|what.*wrong)/.test(q)) {
    if (blockedItems.length === 0 && pendingDeps.length === 0) {
      return `Nothing is currently blocked on ${project?.name ?? "the project"}.${
        openRisks.length
          ? ` There ${openRisks.length === 1 ? "is" : "are"} still ${openRisks.length} open risk${
              openRisks.length === 1 ? "" : "s"
            } worth watching: ${openRisks.map((r) => r.title).join(", ")}.`
          : ""
      }`;
    }
    const lines: string[] = [];
    if (blockedItems.length) {
      lines.push(
        `${blockedItems.length} tracker item${blockedItems.length === 1 ? " is" : "s are"} blocked: ${blockedItems
          .map((w) => `${w.id} (${w.title})`)
          .join(", ")}.`
      );
    }
    if (pendingDeps.length) {
      lines.push(
        `${pendingDeps.length} dependenc${pendingDeps.length === 1 ? "y is" : "ies are"} still open: ${pendingDeps
          .map((d) => `${d.title}${d.expected_date ? ` (expected ${d.expected_date})` : ""}`)
          .join(", ")}.`
      );
    }
    if (openRisks.length) {
      lines.push(
        `Open risk${openRisks.length === 1 ? "" : "s"}: ${openRisks
          .map((r) => `${r.title} (${r.severity} severity)`)
          .join(", ")}.`
      );
    }
    return lines.join(" ");
  }

  // Intent: status note / draft / summary
  if (/(status|note|draft|summary|update northstar|write.*update)/.test(q)) {
    const parts = [state.ai_summary];
    if (blockedItems.length) {
      parts.push(`${blockedItems.length} tracker item(s) blocked: ${blockedItems.map((w) => w.id).join(", ")}.`);
    }
    if (pendingProposals.length) {
      parts.push(`${pendingProposals.length} AI-proposed change(s) are waiting on your review.`);
    }
    return parts.join(" ");
  }

  // Intent: what changed / while I was out / recent activity
  if (/(chang|while.*out|missed|recent|catch me up|what happened)/.test(q)) {
    if (decidedProposals.length === 0) {
      return pendingProposals.length
        ? `Nothing's been applied yet — ${pendingProposals.length} proposal(s) are sitting in Review waiting on you.`
        : "Nothing's changed since you last looked — the tracker is exactly where you left it.";
    }
    const last = decidedProposals[decidedProposals.length - 1];
    const approvedCount = last.changes.filter((c) => c.approval === "approved").length;
    return `Since you last checked: "${last.trigger}" was reviewed — ${approvedCount} of ${last.changes.length} changes applied. ${last.summary}`;
  }

  // Intent: who / owners
  if (/(who|owner|assign)/.test(q)) {
    const owners = Array.from(new Set(state.work_items.map((w) => w.owner_id))).map(employeeName);
    return `Working the Northstar pilot right now: ${owners.join(", ")}.`;
  }

  // Intent: risk
  if (/risk/.test(q)) {
    if (!openRisks.length) return "No open risks right now.";
    return openRisks.map((r) => `${r.title} — ${r.severity} severity. ${r.description}`).join(" ");
  }

  // Intent: dependency / vendor / firmware
  if (/(depend|vendor|firmware)/.test(q)) {
    if (!pendingDeps.length) return "No open dependencies — nothing external is blocking the team right now.";
    return pendingDeps
      .map(
        (d) =>
          `${d.title}, owned by ${employeeName(d.owner_id)}${
            d.expected_date ? `, expected ${d.expected_date}` : ""
          }.`
      )
      .join(" ");
  }

  // Fallback: ground in the overall summary
  return `Here's what I know about ${project?.name ?? "the project"}: ${state.ai_summary}`;
}
