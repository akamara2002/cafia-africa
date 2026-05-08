"use client"

import { motion } from 'framer-motion'
import ScrollSection from './scroll-section'
import { FileText, BookOpen, Users } from 'lucide-react'

interface ClosingPanelProps {
  totalBusinesses: number
  femaleOwnedPct: number
  topStreetDensity: number
  topStreetName: string
}

export default function ClosingPanel({
  totalBusinesses,
  femaleOwnedPct,
  topStreetDensity,
  topStreetName,
}: ClosingPanelProps) {
  const femaleCount = Math.round((totalBusinesses * femaleOwnedPct) / 100)

  const insights = [
    {
      title: 'Scale',
      content: `At ${topStreetDensity} businesses per street in the densest corridor, Freetown's trading zones rival formal commercial districts in comparable African cities.`,
      icon: <FileText className="w-6 h-6" />,
    },
    {
      title: 'Diversity',
      content: `With 3 distinct setup types and 2 primary activity categories, the informal economy shows clear internal segmentation — the foundation for targeted policy.`,
      icon: <BookOpen className="w-6 h-6" />,
    },
    {
      title: 'Inclusion',
      content: `${femaleOwnedPct.toFixed(1)}% female ownership is not a statistic. It's ${femaleCount.toLocaleString()} women running businesses in Freetown's streets, most without formal recognition.`,
      icon: <Users className="w-6 h-6" />,
    },
  ]

  return (
    <ScrollSection className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-24 mb-12">
      <div className="container max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Headline */}
        <motion.h2
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-12 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {totalBusinesses.toLocaleString()} data points. One clear signal: Freetown's informal economy is structured, scalable, and ready for investment.
        </motion.h2>

        {/* Insight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {insights.map((insight, index) => (
            <motion.div
              key={index}
              className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.7,
                delay: index * 0.2,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="text-blue-400">{insight.icon}</div>
                <h3 className="text-xl font-bold">{insight.title}</h3>
              </div>
              <p className="text-gray-200 leading-relaxed">{insight.content}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <motion.a
            href="/contact"
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FileText className="w-5 h-5" />
            Request Custom Analysis
          </motion.a>
          <motion.a
            href="#"
            className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-lg font-semibold transition-colors flex items-center gap-2 border border-white/20"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <BookOpen className="w-5 h-5" />
            View Methodology
          </motion.a>
        </motion.div>
      </div>
    </ScrollSection>
  )
}
