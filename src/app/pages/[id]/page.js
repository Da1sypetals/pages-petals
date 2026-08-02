"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CaretLeft, Trash } from "@phosphor-icons/react";
import ConfirmModal from "@/components/confirm-modal";

const title = (f) => f ? f.replace(/\.(md|html?)$/i, "") : "";

export default function PageViewer() {
  const { id } = useParams();
  const router = useRouter();
  const [html, setHtml] = useState(null);
  const [filename, setFilename] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const meta = await fetch(`/api/pages/${id}`).then(r => r.json());
      document.title = `${title(meta.filename)} — Pages Petals`;
      setFilename(meta.filename);
      const h = await fetch(`/api/pages/${id}/content`).then(r => r.text());
      setHtml(h);
    })();
  }, [id]);

  return (
    <div className="fixed inset-0 flex flex-col">
      <ConfirmModal open={confirmOpen} title="Remove" message="Delete permanently?" onConfirm={async () => { setConfirmOpen(false); await fetch(`/api/pages/${id}`, { method: "DELETE" }); router.push("/"); }} onCancel={() => setConfirmOpen(false)} />
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <Link href="/" className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-white/80 backdrop-blur border border-zinc-200 shadow-sm text-zinc-600 hover:text-zinc-900 hover:bg-white transition-colors"><CaretLeft className="w-3.5 h-3.5" />Garden</Link>
        <button onClick={() => setConfirmOpen(true)} className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-white/80 backdrop-blur border border-zinc-200 shadow-sm text-zinc-400 hover:text-rose-500 transition-colors"><Trash className="w-3.5 h-3.5" />Remove</button>
      </div>
      {html ? <iframe srcDoc={html} className="flex-1 w-full border-0" title={title(filename)} sandbox="allow-scripts allow-same-origin" /> : <div className="flex-1 flex items-center justify-center bg-white"><span className="w-5 h-5 border-2 border-zinc-200 border-t-zinc-400 rounded-full animate-spin" /></div>}
    </div>
  );
}
