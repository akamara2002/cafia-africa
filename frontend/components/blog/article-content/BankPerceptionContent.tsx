"use client"

import { motion } from "framer-motion"
import Image from "next/image"

const container = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06 } } }
const item = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }

export default function BankPerceptionContent() {
  return (
    <div className="space-y-20 md:space-y-28">
      {/* Section — VIDEO: Bank Account Perception */}
      <motion.section variants={container} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.12 }} className="space-y-8">
        <motion.div variants={item} className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl">
          <video
            src="/images/salaam.mp4"
            className="w-full h-full object-cover"
            controls
            playsInline
            aria-label="Bank account perception interview"
          >
            Your browser does not support the video tag.
          </video>
        </motion.div>
        <motion.h2 variants={item} className="text-2xl md:text-3xl font-bold text-white">
          Bank Account Perception
        </motion.h2>
        <motion.p variants={item} className="text-lg text-stone-400 font-medium">
          Have you opened a bank account?
        </motion.p>
        <motion.div variants={item} className="rounded-xl border-l-4 border-indigo-500 bg-indigo-500/10 px-6 py-5">
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-400 mb-2">Respondent (translated from Krio)</p>
          <blockquote className="text-lg md:text-xl text-stone-200 italic leading-relaxed">
            &ldquo;The money is not enough… then I go and open an account? It is when you have enough money that you open an account.&rdquo;
          </blockquote>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div variants={item} className="rounded-xl border border-white/10 bg-white/5 p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-stone-500 mb-2">Survey Insight</p>
            <p className="text-stone-300">36.4% of businesses surveyed do not have any financial account.</p>
          </motion.div>
          <motion.div variants={item} className="rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-400 mb-2">CAFIA Insight</p>
            <p className="text-stone-300">Many entrepreneurs believe bank accounts are only useful when income becomes large. Expanding low- or zero-balance accounts could help reduce financial exclusion.</p>
          </motion.div>
        </div>
      </motion.section>
    </div>
  )
}
