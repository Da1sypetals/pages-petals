"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CaretLeft, Trash } from "@phosphor-icons/react";

export default function PageViewer() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;
  const [meta, setMeta] = useState(null);
  const [content, setContent] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    async function load() {
      try {
        const metaRes = await fetch(`/api/pages/${id}`);
        if (!metaRes.ok) throw new Error("Page not found");
        const metaData = await metaRes.json();
        if (cancelled) return;
        setMeta(metaData);
        document.title = `${metaData.title} — Pages Petals`;

        const contentRes = await fetch(`/api/pages/${id}/content`);
        if (!contentRes.ok) throw new Error("Content not found");
        const html = await contentRes.text();
        if (cancelled) return;
        setContent(html);
      } catch (e) {
        if (!cancelled) setError(e.message);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("Remove this page from the garden?")) return;
    await fetch(`/api/pages/${id}`, { method: "DELETE" });
    router.push("/");
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-center">
          <p className="text-sm text-zinc-500 mb-4">{error}</p>
          <Link href="/" className="text-sm text-emerald-600 inline-flex items-center gap-1">
            <CaretLeft weight="bold" className="w-3.5 h-3.5" />Garden
          </Link>
        </div>
      </div>
    );
  }

  const isMarkdown = meta?.type === "markdown";
  const loaded = meta && content;

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Top bar — above content, not floating over it */}
      <div className="sticky top-0 z-20 bg-stone-50/80 backdrop-blur-md border-b border-zinc-200/60">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 transition-colors shrink-0"
            >
              <CaretLeft weight="bold" className="w-4 h-4" />
              Garden
            </Link>
            <span className="text-zinc-300">/</span>
            <h1 className="text-sm font-medium text-zinc-900 truncate">
              {meta?.title || "…"}
            </h1>
            {meta && (
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider shrink-0">
                {meta.type}
              </span>
            )}
          </div>
          <button
            onClick={handleDelete}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px]
              text-zinc-400 hover:text-rose-500 hover:bg-rose-50 transition-all duration-200"
          >
            <Trash weight="bold" className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Remove</span>
          </button>
        </div>
      </div>

      {!loaded ? (
        <div className="flex items-center justify-center py-32">
          <span className="w-5 h-5 border-2 border-zinc-200 border-t-zinc-400 rounded-full animate-spin" />
        </div>
      ) : isMarkdown ? (
        /* Markdown: render inline with typography styles */
        <article
          className="max-w-3xl mx-auto px-6 py-12
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
            prose-strong:text-zinc-900
            [&_table]:w-full [&_table]:border-collapse
            [&_th]:bg-zinc-100 [&_th]:px-4 [&_th]:py-2 [&_th]:text-left [&_th]:text-xs [&_th]:font-medium [&_th]:text-zinc-500 [&_th]:uppercase [&_th]:tracking-wider
            [&_td]:px-4 [&_td]:py-2 [&_td]:text-sm [&_td]:border-t [&_td]:border-zinc-100"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      ) : (
        /* HTML: render in iframe with scripts */
        <iframe
          srcDoc={content}
          className="w-full border-0"
          style={{ height: "calc(100vh - 3.5rem)" }}
          title={meta.title}
          sandbox="allow-scripts allow-same-origin"
        />
      )}
    </div>
  );
}
