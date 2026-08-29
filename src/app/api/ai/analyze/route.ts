import { NextResponse } from "next/server";
import { getProjectState, saveProjectState } from "@/lib/store";
import {
  analyzeWithClaude,
  mockGithubAnalysis,
  mockMeetingAnalysis,
  mockVendorAnalysis,
} from "@/lib/ai-service";
import { PROJECT_ID } from "@/lib/seed-data";
import type { AIProposal } from "@/lib/types";

export async function POST(request: Request) {
  const body = await request.json();
  const state = getProjectState();

  let proposal: AIProposal;

  if (body.type === "meeting") {
    const meetingId = body.meeting_id ?? "MTG-002";
    const meeting = state.meetings.find((m) => m.id === meetingId);
    proposal = process.env.ANTHROPIC_API_KEY
      ? await analyzeWithClaude(state, PROJECT_ID, {
          type: "meeting",
          content: meeting?.notes ?? "",
          meeting_id: meetingId,
        })
      : mockMeetingAnalysis(state, meetingId);
  } else if (body.type === "github") {
    proposal = process.env.ANTHROPIC_API_KEY
      ? await analyzeWithClaude(state, PROJECT_ID, {
          type: "github",
          content: JSON.stringify(
            state.github_events.find((e) => e.id === (body.event_id ?? "GH-001"))
          ),
        })
      : mockGithubAnalysis(state, body.event_id ?? "GH-001");
  } else if (body.type === "vendor") {
    proposal = process.env.ANTHROPIC_API_KEY
      ? await analyzeWithClaude(state, PROJECT_ID, {
          type: "vendor",
          content:
            state.meetings.find((m) => m.id === "MTG-003")?.notes ?? "",
        })
      : mockVendorAnalysis(state);
  } else {
    return NextResponse.json({ error: "Unknown trigger type" }, { status: 400 });
  }

  state.ai_proposals.push(proposal);
  saveProjectState(state);

  return NextResponse.json({ proposal, state: getProjectState() });
}
