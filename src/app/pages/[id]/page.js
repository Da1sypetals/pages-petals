"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CaretLeft, Trash } from "@phosphor-icons/react";
import ConfirmModal from "@/components/confirm-modal";

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
        const html = await contentRes.text();
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
    <>
      <ConfirmModal
        open={confirmOpen}
        title="Remove from garden"
        message="This page will be permanently deleted. This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
      <div className="fixed top-4 left-4 z-50 flex items-center gap-2">
        <Link href="/" className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-white/80 backdrop-blur border border-zinc-200 shadow-sm text-zinc-600 hover:text-zinc-900 hover:bg-white transition-colors"><CaretLeft weight="bold" className="w-3.5 h-3.5" />Garden</Link>
        <button onClick={() => setConfirmOpen(true)} className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/80 backdrop-blur border border-zinc-200 shadow-sm text-zinc-400 hover:text-rose-500 transition-colors"><Trash weight="bold" className="w-3.5 h-3.5 inline mr-1" />Remove</button>
      </div>
      <article
        className="mx-auto max-w-3xl px-6 pt-20 pb-12
          prose prose-zinc
          prose-headings:font-semibold prose-headings:tracking-tight
          prose-h1:text-2xl prose-h1:mt-10 prose-h1:mb-4
          prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-3
          prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-2
          prose-p:text-[15px] prose-p:leading-relaxed prose-p:text-zinc-700
          prose-a:text-emerald-600 prose-a:no-underline hover:prose-a:underline
          prose-code:bg-zinc-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-[13px] prose-code:font-normal prose-code:before:content-none prose-code:after:content-none
          prose-pre:bg-zinc-900 prose-pre:text-zinc-100 prose-pre:rounded-xl prose-pre:text-[13px]
          prose-img:rounded-xl
          prose-blockquote:border-l-emerald-500 prose-blockquote:bg-emerald-50/50 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-blockquote:not-italic
          prose-li:text-[15px] prose-li:text-zinc-700
          prose-strong:text-zinc-900"
        dangerouslySetInnerHTML={{ __html: page.content }}
      />
    </>
  );
}
