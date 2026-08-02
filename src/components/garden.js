"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FlowerLotus, Lock, SignOut } from "@phosphor-icons/react";
import DropZone from "./drop-zone";
import PageCard from "./page-card";
import LoginModal from "./login-modal";

const AUTH_KEY = "pages_petals_auth";

export default function Garden() {
  const [authed, setAuthed] = useState(null);
  const [pages, setPages] = useState(null);
  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(() => { setAuthed(localStorage.getItem(AUTH_KEY) === "1"); }, []);

  const refresh = useCallback(async () => {
    const data = await fetch("/api/pages").then(r => r.json());
    setPages(data);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return (
    <div className="min-h-screen">
      <LoginModal open={loginOpen} onLogin={() => { localStorage.setItem(AUTH_KEY, "1"); setAuthed(true); setLoginOpen(false); }} onClose={() => setLoginOpen(false)} />

      <div className="absolute top-4 right-4 z-10">
        {authed === null ? null : authed ? (
          <button onClick={() => { localStorage.removeItem(AUTH_KEY); setAuthed(false); }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium bg-white/80 backdrop-blur border border-zinc-200 shadow-sm text-zinc-400 hover:text-zinc-600 transition-colors"><SignOut className="w-3 h-3" />Sign out</button>
        ) : (
          <button onClick={() => setLoginOpen(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium bg-white/80 backdrop-blur border border-zinc-200 shadow-sm text-zinc-400 hover:text-zinc-600 transition-colors"><Lock className="w-3 h-3" />Sign in</button>
        )}
      </div>

      <header className="relative pt-16 pb-8 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="text-4xl md:text-5xl font-semibold tracking-tight text-zinc-900 leading-[1.1] max-w-md mx-auto">Daisy&apos;s Page Garden</motion.h1>
        </div>
      </header>

      {authed && <section className="px-6 pb-4"><DropZone onPageCreated={(p) => setPages(prev => [{ ...p, isMd: p.filename.endsWith(".md") }, ...(prev || [])])} /></section>}

      <section className="px-6 py-12">
        <div className="max-w-5xl mx-auto">
          {pages === null ? (
            <div className="flex flex-col items-center gap-3 py-16"><span className="w-6 h-6 border-2 border-zinc-200 border-t-zinc-400 rounded-full animate-spin" /><span className="text-xs text-zinc-400">Loading garden…</span></div>
          ) : pages.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-20 text-center">
              <FlowerLotus weight="duotone" className="w-6 h-6 text-zinc-300" />
              <p className="text-sm text-zinc-400">Your garden is empty.</p>
              {!authed && <button onClick={() => setLoginOpen(true)} className="mt-2 px-4 py-2 rounded-full text-xs font-medium bg-zinc-100 hover:bg-zinc-200 text-zinc-600 transition-colors">Sign in to add pages</button>}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Garden</h2>
                <button onClick={refresh} className="text-[11px] text-zinc-400 hover:text-zinc-600 transition-colors">Refresh</button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence mode="popLayout">
                  {pages.map(p => <PageCard key={p.id} page={p} onDelete={authed ? async (id) => { setPages(prev => prev.filter(x => x.id !== id)); await fetch(`/api/pages/${id}`, { method: "DELETE" }); } : undefined} />)}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
