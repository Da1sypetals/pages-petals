"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CaretLeft, Trash } from "@phosphor-icons/react";
import ConfirmModal from "@/components/confirm-modal";

const MARKDOWN_STYLE = `<style>body{max-width:48rem;margin:5rem auto;padding:0 1.5rem;font-family:system-ui,-apple-system,sans-serif;font-size:15px;line-height:1.7;color:#3f3f46;background:#fafaf9}h1,h2,h3{color:#18181b;font-weight:600;letter-spacing:-0.02em}h1{font-size:1.5rem;margin:2.5rem 0 1rem}h2{font-size:1.25rem;margin:2rem 0 .75rem}h3{font-size:1.125rem;margin:1.5rem 0 .5rem}p{margin:0 0 1rem}a{color:#059669;text-decoration:none}a:hover{text-decoration:underline}strong{color:#18181b}ul,ol{padding-left:1.5rem;margin:0 0 1rem}li{margin-bottom:.25rem}blockquote{border-left:2px solid #059669;background:rgba(5,150,105,.05);padding:.75rem 1rem;border-radius:0 .5rem .5rem 0;margin:0 0 1rem;font-style:normal;color:#52525b}pre{background:#18181b;color:#f4f4f5;border-radius:.75rem;padding:1rem;overflow-x:auto;margin:0 0 1rem}pre code{background:0;color:inherit;padding:0;font-size:13px;line-height:1.6;font-family:"Geist Mono",ui-monospace,monospace}code{background:#e4e4e7;color:#3f3f46;padding:.125rem .375rem;border-radius:.375rem;font-size:13px;font-family:"Geist Mono",ui-monospace,monospace}img{max-width:100%;border-radius:.75rem}hr{border:0;border-top:1px solid #e4e4e7;margin:2rem 0}table{width:100%;border-collapse:collapse;margin:0 0 1rem}th{background:#f4f4f5;padding:.5rem 1rem;text-align:left;font-size:12px;font-weight:500;color:#71717a;text-transform:uppercase;letter-spacing:.05em;border:1px solid #e4e4e7}td{padding:.5rem 1rem;font-size:14px;border:1px solid #e4e4e7}</style>`;

function buildMarkdownDoc(md) {
  const escaped = md.replace(/`/g, "\\`").replace(/\\/g, "\\\\").replace(/<\/script>/gi, "<\\/script>");
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">${MARKDOWN_STYLE}<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"><\\/script></head><body><div id="content"></div><script>document.getElementById('content').innerHTML=marked.parse(\`${escaped}\`,{breaks:true,gfm:true})<\\/script></body></html>`;
}

export default function PageViewer() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    async function load() {
      try {
        const metaRes = await fetch(`/api/pages/${id}`);
        if (!metaRes.ok) throw new Error("Page not found");
        const meta = await metaRes.json();
        document.title = `${meta.title} — Pages Petals`;

        const contentRes = await fetch(`/api/pages/${id}/content`);
        if (!contentRes.ok) throw new Error("Content not found");
        const raw = await contentRes.text();
        const html = meta.type === "markdown" ? buildMarkdownDoc(raw) : raw;
        setPage({ ...meta, content: html });
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleDelete = async () => {
    setConfirmOpen(false);
    await fetch(`/api/pages/${id}`, { method: "DELETE" });
    router.push("/");
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-white"><span className="w-5 h-5 border-2 border-zinc-200 border-t-zinc-400 rounded-full animate-spin" /></div>;
  if (error || !page) return <div className="min-h-screen flex items-center justify-center bg-white"><div className="text-center"><p className="text-sm text-zinc-500 mb-4">{error || "Not found"}</p><Link href="/" className="text-sm text-emerald-600"><CaretLeft weight="bold" className="w-3.5 h-3.5 inline" /> Garden</Link></div></div>;

  return (
    <div className="fixed inset-0 flex flex-col">
      <ConfirmModal open={confirmOpen} title="Remove from garden" message="This page will be permanently deleted." onConfirm={handleDelete} onCancel={() => setConfirmOpen(false)} />
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
        <Link href="/" className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-white/80 backdrop-blur border border-zinc-200 shadow-sm text-zinc-600 hover:text-zinc-900 hover:bg-white transition-colors"><CaretLeft weight="bold" className="w-3.5 h-3.5" />Garden</Link>
        <button onClick={() => setConfirmOpen(true)} className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/80 backdrop-blur border border-zinc-200 shadow-sm text-zinc-400 hover:text-rose-500 transition-colors"><Trash weight="bold" className="w-3.5 h-3.5 inline mr-1" />Remove</button>
      </div>
      <iframe srcDoc={page.content} className="flex-1 w-full border-0" title={page.title} sandbox="allow-scripts allow-same-origin" />
    </div>
  );
}
