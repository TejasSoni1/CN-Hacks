import { NextResponse } from "next/server";
import { getProjectState, saveProjectState } from "@/lib/store";
import { applyApprovedChanges } from "@/lib/ai-service";
import type { AIProposal } from "@/lib/types";

export async function POST(request: Request) {
  const body = await request.json();
  const state = getProjectState();

  let proposal: AIProposal | undefined = body.proposal as AIProposal | undefined;

  if (!proposal && body.proposal_id) {
    proposal = state.ai_proposals.find((p) => p.id === body.proposal_id);
  }

  if (!proposal) {
    return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
  }

  const next = applyApprovedChanges(state, proposal);
  saveProjectState(next);

  return NextResponse.json({ state: getProjectState() });
}
