import { NextResponse } from "next/server";
import { getPage, deletePage } from "@/lib/kv";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const page = await getPage(id);
    if (!page) {
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }
    return NextResponse.json(page);
  } catch (e) {
    console.error("GET /api/pages/[id] error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await deletePage(id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("DELETE /api/pages/[id] error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
