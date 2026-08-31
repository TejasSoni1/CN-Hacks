import { NextResponse } from "next/server";
import { getProjectState, saveProjectState } from "@/lib/store";
import { analyzeWithClaude } from "@/lib/ai-service";
import { routeCapture } from "@/lib/hermes-server";
import type { CaptureMode } from "@/lib/hermes";
import { PROJECT_ID } from "@/lib/seed-data";
import type { AIProposal } from "@/lib/types";

const LIVE_TYPES = new Set(["meeting", "github", "email"]);

export async function POST(request: Request) {
  const body = await request.json();
  const mode = body.type as CaptureMode;
  const state = getProjectState();

  let proposal: AIProposal;
  let displayRoutes: ReturnType<typeof routeCapture>["displayRoutes"] = [];

  if (process.env.ANTHROPIC_API_KEY && LIVE_TYPES.has(mode)) {
    if (mode === "meeting") {
      const meetingId = body.meeting_id ?? "MTG-002";
      const meeting = state.meetings.find((m) => m.id === meetingId);
      proposal = await analyzeWithClaude(state, PROJECT_ID, {
        type: "meeting",
        content: meeting?.notes ?? "",
        meeting_id: meetingId,
      });
    } else if (mode === "github") {
      proposal = await analyzeWithClaude(state, PROJECT_ID, {
        type: "github",
        content: JSON.stringify(
          state.github_events.find((e) => e.id === (body.event_id ?? "GH-001"))
        ),
      });
    } else {
      proposal = await analyzeWithClaude(state, PROJECT_ID, {
        type: "vendor",
        content: state.meetings.find((m) => m.id === "MTG-003")?.notes ?? "",
      });
    }
  } else {
    const routed = routeCapture(state, mode);
    proposal = routed.proposal;
    displayRoutes = routed.displayRoutes;
  }

  state.ai_proposals.push(proposal);
  saveProjectState(state);

  return NextResponse.json({ proposal, displayRoutes, state: getProjectState() });
}
