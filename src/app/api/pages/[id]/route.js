import { NextResponse } from "next/server";
import { getPage, deletePage, pageTitle } from "@/lib/kv";

export async function GET(_req, { params }) {
  const meta = await getPage((await params).id);
  if (!meta) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ ...meta, title: pageTitle(meta.filename), isMd: meta.filename.endsWith(".md") });
}

export async function DELETE(_req, { params }) {
  await deletePage((await params).id);
  return NextResponse.json({ ok: true });
}
