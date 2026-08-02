"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Lock, X } from "@phosphor-icons/react";

export default function LoginModal({ open, onLogin, onClose }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value === process.env.NEXT_PUBLIC_AUTH_PASSWORD) {
      setError(false);
      onLogin();
    } else {
      setError(true);
      setValue("");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 4 }}
            transition={{ type: "spring", stiffness: 500, damping: 35 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xs bg-white rounded-2xl shadow-xl border border-zinc-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Lock weight="fill" className="w-4 h-4 text-zinc-400" />
                <h3 className="text-sm font-semibold text-zinc-900">Login</h3>
              </div>
              <button onClick={onClose} className="w-7 h-7 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center transition-colors">
                <X weight="bold" className="w-3.5 h-3.5 text-zinc-500" />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <input
                type="password"
                value={value}
                onChange={(e) => { setValue(e.target.value); setError(false); }}
                placeholder="Enter password"
                autoFocus
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm text-zinc-900
                  placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500
                  transition-colors"
              />
              {error && <p className="text-xs text-rose-500 mt-2">Wrong password</p>}
              <button
                type="submit"
                disabled={!value}
                className="mt-3 w-full py-2.5 rounded-xl bg-zinc-900 text-white text-sm font-medium
                  hover:bg-zinc-800 active:scale-[0.98] transition-all
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sign in
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
