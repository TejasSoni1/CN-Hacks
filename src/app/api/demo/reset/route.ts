import { NextResponse } from "next/server";
import { resetProjectState } from "@/lib/store";

export async function POST() {
  const state = resetProjectState();
  return NextResponse.json({ state });
}
