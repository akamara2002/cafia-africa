"use client"

import { motion } from "framer-motion"

export default function PlaceholderArticleContent({ title }: { title: string }) {
  return (
    <div className="space-y-8">
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-prose text-lg text-stone-400 space-y-6"
      >
        <p className="leading-relaxed">
          This story is coming soon. CAFIA is preparing in-depth research and storytelling on financial inclusion, digital economy, and innovation across Africa.
        </p>
        <p className="leading-relaxed">
          Check back later for the full article, or explore our other stories from the blog.
        </p>
      </motion.section>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center"
      >
        <p className="text-stone-500 text-sm">Full article: {title}</p>
      </motion.div>
    </div>
  )
}
