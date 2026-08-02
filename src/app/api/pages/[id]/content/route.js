export const maxDuration = 60;

import { NextResponse } from "next/server";
import { getPage, getContent } from "@/lib/kv";
import { marked } from "marked";

const STYLE = "<style>body{max-width:48rem;margin:5rem auto;padding:0 1.5rem;font-family:system-ui,-apple-system,sans-serif;font-size:15px;line-height:1.7;color:#3f3f46;background:#fafaf9}h1,h2,h3{color:#18181b;font-weight:600;letter-spacing:-0.02em}h1{font-size:1.5rem;margin:2.5rem 0 1rem}h2{font-size:1.25rem;margin:2rem 0 .75rem}h3{font-size:1.125rem;margin:1.5rem 0 .5rem}p{margin:0 0 1rem}a{color:#059669;text-decoration:none}a:hover{text-decoration:underline}strong{color:#18181b}ul,ol{padding-left:1.5rem;margin:0 0 1rem}li{margin-bottom:.25rem}blockquote{border-left:2px solid #059669;background:rgba(5,150,105,.05);padding:.75rem 1rem;border-radius:0 .5rem .5rem 0;margin:0 0 1rem;font-style:normal;color:#52525b}pre{background:#18181b;color:#f4f4f5;border-radius:.75rem;padding:1rem;overflow-x:auto;margin:0 0 1rem}pre code{background:0;color:inherit;padding:0;font-size:13px;line-height:1.6;font-family:ui-monospace,monospace}code{background:#e4e4e7;color:#3f3f46;padding:.125rem .375rem;border-radius:.375rem;font-size:13px;font-family:ui-monospace,monospace}img{max-width:100%;border-radius:.75rem}hr{border:0;border-top:1px solid #e4e4e7;margin:2rem 0}table{width:100%;border-collapse:collapse;margin:0 0 1rem}th{background:#f4f4f5;padding:.5rem 1rem;text-align:left;font-size:12px;font-weight:500;color:#71717a;text-transform:uppercase;letter-spacing:.05em;border:1px solid #e4e4e7}td{padding:.5rem 1rem;font-size:14px;border:1px solid #e4e4e7}</style>";

export async function GET(_req, { params }) {
  const { id } = await params;
  const [page, raw] = await Promise.all([getPage(id), getContent(id)]);
  if (!page || raw === null) return NextResponse.json({ error: "not found" }, { status: 404 });

  const html = page.type === "markdown"
    ? "<!DOCTYPE html><html><head><meta charset=utf-8><meta name=viewport content='width=device-width,initial-scale=1'>" + STYLE + "</head><body>" + marked.parse(raw, { breaks: true, gfm: true }) + "</body></html>"
    : raw;

  return new NextResponse(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}
