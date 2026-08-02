import { NextResponse } from "next/server";
import { getPage, deletePage } from "@/lib/kv";

export async function GET(_req, { params }) {
  const page = await getPage((await params).id);
  if (!page) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(page);
}

export async function DELETE(_req, { params }) {
  await deletePage((await params).id);
  return NextResponse.json({ ok: true });
}
