import { NextResponse } from "next/server";
import { getProjectState } from "@/lib/store";

export async function GET() {
  return NextResponse.json(getProjectState());
}
