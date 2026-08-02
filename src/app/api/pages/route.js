export const maxDuration = 60;
import { NextResponse } from "next/server";
import { listPages, createPage } from "@/lib/kv";

export async function GET() {
  try {
    const pages = await listPages();
    return NextResponse.json(pages);
  } catch (e) {
    console.error("GET /api/pages error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, content, type } = body;
    if (!title || !content) {
      return NextResponse.json(
        { error: "title and content are required" },
        { status: 400 }
      );
    }
    const page = await createPage({ title, content, type: type || "html" });
    return NextResponse.json(page, { status: 201 });
  } catch (e) {
    console.error("POST /api/pages error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
