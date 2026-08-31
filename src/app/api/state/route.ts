import { NextResponse } from "next/server";
import { getProjectState, saveProjectState } from "@/lib/store";
import type { ProjectState } from "@/lib/types";

export async function GET() {
  return NextResponse.json(getProjectState());
}

export async function POST(request: Request) {
  const body = await request.json();
  const state = body.state as ProjectState;
  saveProjectState(state);
  return NextResponse.json({ state: getProjectState() });
}
