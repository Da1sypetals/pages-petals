"use client";

import { motion, AnimatePresence } from "motion/react";
import { Warning } from "@phosphor-icons/react";

export default function ConfirmModal({ open, title, message, onConfirm, onCancel }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4"
          onClick={onCancel}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 4 }}
            transition={{ type: "spring", stiffness: 500, damping: 35 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-zinc-200 p-6"
          >
            <div className="flex items-start gap-4">
              <span className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center shrink-0">
                <Warning weight="fill" className="w-5 h-5 text-rose-500" />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-zinc-900">{title}</h3>
                <p className="text-[13px] text-zinc-500 mt-1 leading-relaxed">{message}</p>
              </div>
            </div>
            <div className="flex gap-2 mt-5 justify-end">
              <button
                onClick={onCancel}
                className="px-4 py-2 rounded-xl text-[13px] font-medium text-zinc-600 bg-zinc-100 hover:bg-zinc-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 rounded-xl text-[13px] font-medium text-white bg-rose-500 hover:bg-rose-600 active:scale-[0.98] transition-all"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
