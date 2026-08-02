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
    <div className="fixed inset-0 flex flex-col">
      <ConfirmModal
        open={confirmOpen}
        title="Remove from garden"
        message="This page will be permanently deleted."
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
        <Link href="/" className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-white/80 backdrop-blur border border-zinc-200 shadow-sm text-zinc-600 hover:text-zinc-900 hover:bg-white transition-colors"><CaretLeft weight="bold" className="w-3.5 h-3.5" />Garden</Link>
        <button onClick={() => setConfirmOpen(true)} className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/80 backdrop-blur border border-zinc-200 shadow-sm text-zinc-400 hover:text-rose-500 transition-colors"><Trash weight="bold" className="w-3.5 h-3.5 inline mr-1" />Remove</button>
      </div>
      <iframe
        srcDoc={page.content}
        className="flex-1 w-full border-0"
        title={page.title}
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
}
