"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FlowerLotus, Lock, SignOut } from "@phosphor-icons/react";
import DropZone from "@/components/drop-zone";
import PageCard from "@/components/page-card";
import LoginModal from "@/components/login-modal";

const STORAGE_KEY = "pages_petals_auth";

export default function Garden() {
  const [authed, setAuthed] = useState(null); // null = loading
  const [pages, setPages] = useState(null);
  const [fetchError, setFetchError] = useState(null);
  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
    setAuthed(localStorage.getItem(STORAGE_KEY) === "1");
  }, []);

  const handleLogin = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setAuthed(true);
    setLoginOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setAuthed(false);
  };

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/pages");
      if (!res.ok) throw new Error(`Server responded ${res.status}`);
      const data = await res.json();
      setPages(data);
      setFetchError(null);
    } catch (e) {
      setFetchError("Could not reach the garden. Check your connection.");
      console.error("Refresh failed:", e);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleDelete = useCallback(
    async (id) => {
      setPages((prev) => (prev ? prev.filter((p) => p.id !== id) : prev));
      try {
        const res = await fetch(`/api/pages/${id}`, { method: "DELETE" });
        if (!res.ok) await refresh();
      } catch (e) {
        console.error("Delete failed:", e);
        await refresh();
      }
    },
    [refresh]
  );

  const handlePageCreated = useCallback((page) => {
    const text = (page.content || "").replace(/<[^>]+>/g, "").slice(0, 160);
    setPages((prev) => [{ ...page, snippet: text }, ...(prev || [])]);
  }, []);

  return (
    <div className="min-h-screen">
      <LoginModal
        open={loginOpen}
        onLogin={handleLogin}
        onClose={() => setLoginOpen(false)}
      />

      {/* Auth bar */}
      <div className="absolute top-4 right-4 z-10">
        {authed === null ? null : authed ? (
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium
              bg-white/80 backdrop-blur border border-zinc-200 shadow-sm
              text-zinc-400 hover:text-zinc-600 transition-colors"
          >
            <SignOut weight="bold" className="w-3 h-3" />
            Sign out
          </button>
        ) : (
          <button
            onClick={() => setLoginOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium
              bg-white/80 backdrop-blur border border-zinc-200 shadow-sm
              text-zinc-400 hover:text-zinc-600 transition-colors"
          >
            <Lock weight="bold" className="w-3 h-3" />
            Sign in
          </button>
        )}
      </div>

      <header className="relative pt-16 pb-8 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full
              bg-emerald-500/10 text-[11px] font-medium text-emerald-700
              uppercase tracking-wider mb-5"
            >
              <FlowerLotus weight="duotone" className="w-3.5 h-3.5" />
              Pages Petals
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl font-semibold tracking-tight text-zinc-900
              leading-[1.1] max-w-md mx-auto"
          >
            Daisy&apos;s Page Garden
          </motion.h1>

        </div>
      </header>

      {authed && (
        <section className="px-6 pb-4">
          <DropZone onPageCreated={handlePageCreated} />
        </section>
      )}

      <section className="px-6 py-12">
        <div className="max-w-5xl mx-auto">
          {fetchError && (
            <div className="mb-6 flex items-center justify-between px-4 py-3 rounded-xl bg-rose-50 border border-rose-100">
              <p className="text-xs text-rose-600">{fetchError}</p>
              <button
                onClick={refresh}
                className="px-3 py-1.5 rounded-full text-[11px] font-medium bg-white text-rose-600 hover:bg-rose-50 transition-colors border border-rose-200"
              >
                Retry
              </button>
            </div>
          )}

          {pages === null ? (
            <div className="flex flex-col items-center gap-3 py-16">
              <span className="w-6 h-6 border-2 border-zinc-200 border-t-zinc-400 rounded-full animate-spin" />
              <span className="text-xs text-zinc-400">Loading garden…</span>
            </div>
          ) : pages.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-20 text-center">
              <span className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center">
                <FlowerLotus weight="duotone" className="w-6 h-6 text-zinc-300" />
              </span>
              <p className="text-sm text-zinc-400">Your garden is empty.</p>
              {!authed && (
                <button
                  onClick={() => setLoginOpen(true)}
                  className="mt-2 px-4 py-2 rounded-full text-xs font-medium bg-zinc-100 hover:bg-zinc-200 text-zinc-600 transition-colors"
                >
                  Sign in to add pages
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Garden</h2>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    {pages.length} page{pages.length !== 1 && "s"}
                  </p>
                </div>
                <button
                  onClick={refresh}
                  className="text-[11px] text-zinc-400 hover:text-zinc-600 transition-colors"
                >
                  Refresh
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence mode="popLayout">
                  {pages.map((page) => (
                    <PageCard key={page.id} page={page} onDelete={authed ? handleDelete : undefined} />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      </section>

      <footer className="border-t border-zinc-100 mt-16 py-8 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <p className="text-[11px] text-zinc-300">🌸 page petals</p>
          <span className="text-[11px] text-zinc-300">Built with taste</span>
        </div>
      </footer>
    </div>
  );
}
