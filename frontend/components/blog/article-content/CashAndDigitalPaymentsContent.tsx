"use client"

import { motion } from "framer-motion"
import Image from "next/image"

const container = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06 } } }
const item = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }

export default function CashAndDigitalPaymentsContent() {
  return (
    <div className="space-y-20 md:space-y-28">
      <motion.section variants={container} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.08 }} className="space-y-6">
        <motion.figure variants={item} className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image src="/images/bilal.jpeg" alt="Cash and Digital Payments" fill className="object-cover" sizes="(max-width: 768px) 100vw, 900px" />
          </div>
          <figcaption className="px-4 py-3 text-sm text-stone-500 bg-white/5 border-t border-white/10">Cash and Digital Payments</figcaption>
        </motion.figure>
        <motion.h2 variants={item} className="text-2xl md:text-3xl font-bold text-white">Cash and Digital Payments</motion.h2>
        <motion.div variants={item} className="rounded-xl border-l-4 border-white/20 bg-white/5 px-5 py-4">
          <p className="text-sm font-semibold uppercase tracking-wide text-stone-500 mb-2">Entrepreneur Voice (translated from Krio)</p>
          <blockquote className="text-lg text-stone-200 italic leading-relaxed">
            &ldquo;Most of my business is cash, though sometimes I accept payment on my personal mobile money wallet.&rdquo;
          </blockquote>
        </motion.div>
        <motion.div variants={item} className="rounded-xl border border-indigo-500/20 bg-indigo-500/10 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-400 mb-2">CAFIA Insight</p>
          <p className="text-stone-300">Digital payments are growing, but many businesses still rely mainly on cash and often use personal wallets for business transactions.</p>
        </motion.div>
      </motion.section>
    </div>
  )
}
