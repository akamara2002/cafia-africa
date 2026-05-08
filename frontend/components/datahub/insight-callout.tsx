"use client"

import { motion } from 'framer-motion'
import ScrollSection from './scroll-section'
import { Lightbulb } from 'lucide-react'

interface InsightCalloutProps {
  text: string
}

export default function InsightCallout({ text }: InsightCalloutProps) {
  return (
    <ScrollSection className="mb-8" delay={0.3}>
      <motion.div
        className="bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-600 rounded-lg p-6 shadow-md"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ willChange: 'transform, opacity' }}
      >
        <div className="flex items-start gap-4">
          <div className="text-blue-600 flex-shrink-0 mt-1">
            <Lightbulb className="w-6 h-6" />
          </div>
          <p className="text-gray-800 text-lg font-bold leading-relaxed italic">
            {text}
          </p>
        </div>
      </motion.div>
    </ScrollSection>
  )
}
