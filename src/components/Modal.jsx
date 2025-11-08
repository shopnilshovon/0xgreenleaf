import React from "react";
import { motion } from "framer-motion";

export default function Modal({ open, onClose, children, title }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white rounded-2xl p-6 w-full max-w-3xl z-10">
        {title && <h3 className="text-lg font-semibold">{title}</h3>}
        <div className="mt-3">{children}</div>
      </motion.div>
    </div>
  );
}
