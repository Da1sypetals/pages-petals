"use client";

import { useCallback, useState, useRef } from "react";
import { motion } from "motion/react";
import { Upload, FileText, X, Spinner } from "@phosphor-icons/react";

export default function DropZone({ onPageCreated }) {
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const readFile = useCallback((file) => {
    const ext = file.name.split(".").pop().toLowerCase();
    if (!["md", "html", "htm"].includes(ext)) { setError("Only .md and .html"); return; }
    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const snippet = text.replace(/<[^>]+>/g, "").slice(0, 200);
      setPreview({ filename: file.name, content: text, snippet });
    };
    reader.onerror = () => setError("Failed to read");
    reader.readAsText(file);
  }, []);

  const handleUpload = async () => {
    if (!preview) return;
    setUploading(true);
    const res = await fetch("/api/pages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(preview) });
    if (!res.ok) { setError("Upload failed"); setUploading(false); return; }
    onPageCreated?.(await res.json());
    setPreview(null);
    setUploading(false);
  };

  if (preview) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-xl mx-auto">
        <div className="rounded-2xl bg-white border border-zinc-200 p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3 min-w-0">
              <span className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0"><FileText weight="duotone" className="w-4.5 h-4.5 text-emerald-600" /></span>
              <div className="min-w-0"><p className="text-sm font-medium text-zinc-900 truncate">{preview.filename}</p><p className="text-[11px] text-zinc-400 uppercase tracking-wider mt-0.5">{preview.filename.endsWith(".md") ? "markdown" : "html"}</p></div>
            </div>
            <button onClick={() => setPreview(null)} disabled={uploading} className="w-7 h-7 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center transition-colors shrink-0"><X weight="bold" className="w-3.5 h-3.5 text-zinc-500" /></button>
          </div>
          <div className="rounded-xl bg-zinc-50 border border-zinc-100 p-3 mb-4 max-h-32 overflow-y-auto"><p className="text-[13px] text-zinc-500 leading-relaxed line-clamp-4">{preview.snippet || "No preview"}</p></div>
          <div className="flex gap-2">
            <button onClick={handleUpload} disabled={uploading} className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2">{uploading ? <><Spinner weight="bold" className="w-4 h-4 animate-spin" />Uploading…</> : "Add to Garden"}</button>
            <button onClick={() => setPreview(null)} disabled={uploading} className="px-4 py-2.5 rounded-xl bg-zinc-100 text-zinc-600 text-sm font-medium hover:bg-zinc-200 transition-colors disabled:opacity-50">Cancel</button>
          </div>
          {error && <p className="mt-3 text-xs text-rose-500 text-center">{error}</p>}
        </div>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) readFile(f); }}
        onClick={() => inputRef.current?.click()}
        className={`relative w-full max-w-2xl mx-auto rounded-2xl border-2 border-dashed transition-all duration-500 cursor-pointer overflow-hidden ${dragOver ? "border-emerald-400 bg-emerald-50/80 scale-[1.01]" : "border-zinc-200 bg-zinc-50/50 hover:border-zinc-300 hover:bg-zinc-50"}`}
      >
        <div className="relative flex flex-col items-center justify-center py-16 px-8 gap-4">
          <motion.div animate={dragOver ? { scale: 1.1, y: -2 } : { scale: 1, y: 0 }} transition={{ type: "spring", stiffness: 400, damping: 25 }} className="w-14 h-14 rounded-2xl bg-white border border-zinc-200 shadow-sm flex items-center justify-center">
            <Upload weight="duotone" className={`w-6 h-6 transition-colors duration-300 ${dragOver ? "text-emerald-500" : "text-zinc-400"}`} />
          </motion.div>
          <div className="text-center"><p className="text-sm font-medium text-zinc-700">Drop a Markdown or HTML file here</p><p className="text-xs text-zinc-400 mt-1">or click — .md, .html</p></div>
        </div>
        <input ref={inputRef} type="file" accept=".md,.html,.htm" onChange={(e) => { const f = e.target.files[0]; if (f) readFile(f); e.target.value = ""; }} className="hidden" />
      </motion.div>
      {error && <p className="mt-4 text-xs text-rose-500 text-center">{error}</p>}
    </>
  );
}
