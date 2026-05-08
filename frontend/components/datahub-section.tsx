"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Database, LineChart, Map, Download } from "lucide-react"
import Link from "next/link"

const features = [
  {
    icon: Database,
    title: "Real-Time Data",
    description: "Access live SME financial inclusion metrics updated daily",
  },
  {
    icon: LineChart,
    title: "Analytics Dashboard",
    description: "Interactive visualizations and trend analysis tools",
  },
  {
    icon: Map,
    title: "Geographic Insights",
    description: "Country and regional comparisons across Africa",
  },
  {
    icon: Download,
    title: "Open Data",
    description: "Download datasets for research and policy development",
  },
]

export default function DatahubSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })

  return (
    <section
      id="datahub"
      ref={sectionRef}
      className="relative py-24 bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-700 text-white overflow-hidden"
    >
      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            linear-gradient(90deg, white 1px, transparent 1px),
            linear-gradient(white 1px, transparent 1px)
          `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="container max-w-screen-xl mx-auto px-6 relative z-10">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">CAFIA DataHub</h2>
          <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed text-pretty">
            The continent's most comprehensive financial inclusion database. Explore data-driven insights that power
            policy decisions and investment strategies across Africa.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              <feature.icon className="w-12 h-12 text-yellow-300 mb-4" />
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-blue-100 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center"
        >
          <Link
            href="/datahub"
            className="inline-block bg-white text-blue-600 hover:bg-gray-100 px-10 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 shadow-xl"
          >
            Explore the DataHub
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
