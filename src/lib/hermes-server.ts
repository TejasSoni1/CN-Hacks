import type { AIProposal, ProjectState } from "./types";
import {
  mockMeetingAnalysis,
  mockGithubAnalysis,
  mockVendorAnalysis,
  mockContactAnalysis,
  mockTaskAnalysis,
  mockPlanAnalysis,
  mockFileAnalysis,
} from "./ai-service";
import { DISPLAY_ROUTES, type CaptureMode, type RouteCard } from "./hermes";

/**
 * Server-only half of Hermes: dispatches a capture mode to the right mock
 * analysis (touching the JSON store / xlsx reader) and produces a real
 * AIProposal. Kept out of hermes.ts so client components can import the
 * pure display constants there without pulling `fs`/`xlsx` into the bundle.
 */
function runAnalysis(state: ProjectState, mode: CaptureMode): AIProposal {
  switch (mode) {
    case "meeting":
    case "voice":
      return mockMeetingAnalysis(state, "MTG-002");
    case "email":
      return mockVendorAnalysis(state);
    case "github":
      return mockGithubAnalysis(state, "GH-001");
    case "file":
    case "photo":
      return mockFileAnalysis(state);
    case "contact":
      return mockContactAnalysis(state);
    case "task":
      return mockTaskAnalysis(state);
    case "plan":
      return mockPlanAnalysis(state);
    default:
      return mockMeetingAnalysis(state, "MTG-002");
  }
}

export function routeCapture(
  state: ProjectState,
  mode: CaptureMode
): { proposal: AIProposal; displayRoutes: RouteCard[] } {
  const proposal = runAnalysis(state, mode);
  const templates = DISPLAY_ROUTES[mode] ?? [];

  const displayRoutes: RouteCard[] = templates.map((t, i) => ({
    ...t,
    changeId: proposal.changes[i]?.id,
  }));

  return { proposal, displayRoutes };
}
