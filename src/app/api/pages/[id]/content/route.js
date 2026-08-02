export const maxDuration = 60;

import { NextResponse } from "next/server";
import { getPageContent } from "@/lib/kv";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const content = await getPageContent(id);
    if (content === null) {
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }
    return new NextResponse(content, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } catch (e) {
    console.error("GET /api/pages/[id]/content error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
