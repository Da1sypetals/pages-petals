export const maxDuration = 60;

import { NextResponse } from "next/server";
import { listPages, createPage } from "@/lib/kv";

export async function GET() {
  const pages = await listPages();
  return NextResponse.json(pages);
}

export async function POST(request) {
  const { title, content, type } = await request.json();
  if (!title || !content) return NextResponse.json({ error: "title and content required" }, { status: 400 });
  const page = await createPage({ title, content, type: type || "html" });
  return NextResponse.json(page, { status: 201 });
}
