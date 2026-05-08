"use client"

import { motion } from "framer-motion"

export default function CinematicLoader() {
  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-stone-950"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col items-center gap-6">
        <motion.div
          className="w-16 h-16 rounded-full border-2 border-indigo-500 border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <motion.p
          className="text-stone-400 text-sm font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Loading story...
        </motion.p>
      </div>
    </motion.div>
  )
}
