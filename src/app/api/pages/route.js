import { NextResponse } from "next/server";
import { listPages, createPage } from "@/lib/kv";

export async function GET() {
  const pages = await listPages();
  return NextResponse.json(pages);
}

export async function POST(request) {
  const { filename, content } = await request.json();
  if (!filename || !content) return NextResponse.json({ error: "filename and content required" }, { status: 400 });
  const page = await createPage(filename, content);
  return NextResponse.json(page, { status: 201 });
}
