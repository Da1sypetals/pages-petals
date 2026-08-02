"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { FileText, Trash, ArrowUpRight } from "@phosphor-icons/react";

export default function PageCard({ page, onDelete }) {
  const snippet = page.snippet || "No preview";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ type: "spring", stiffness: 500, damping: 35 }}
    >
      <div className="group relative rounded-2xl bg-white border border-zinc-200/80
        hover:border-zinc-300 hover:shadow-sm transition-all duration-300">
        <Link
          href={`/pages/${page.id}`}
          className="block p-5 pb-14"
        >
          <div className="flex items-start gap-3">
            <span className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5">
              <FileText
                weight="duotone"
                className="w-4.5 h-4.5 text-emerald-600"
              />
            </span>
            <div className="min-w-0">
              <h3 className="text-[15px] font-medium text-zinc-900 leading-snug truncate">
                {page.title}
              </h3>
              <p className="text-[11px] text-zinc-400 mt-1 uppercase tracking-wider">
                {page.type}
              </p>
              <p className="text-[13px] text-zinc-500 mt-2.5 leading-relaxed line-clamp-2">
                {snippet}
              </p>
            </div>
          </div>
        </Link>

        <div className="absolute bottom-3 right-3 flex items-center gap-1">
          <Link
            href={`/pages/${page.id}`}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[12px]
              text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-all duration-200"
          >
            <span>Open</span>
            <ArrowUpRight weight="bold" className="w-3 h-3" />
          </Link>
          <button
            onClick={() => onDelete?.(page.id)}
            className="w-7 h-7 rounded-full flex items-center justify-center
              text-zinc-400 hover:text-rose-500 hover:bg-rose-50 transition-all duration-200"
          >
            <Trash weight="bold" className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
