"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { ClipboardList, BarChart3, Users, Award } from "lucide-react"
import Link from "next/link"

export default function SurveySection() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })

  const stats = [
    { icon: Users, value: "10,000+", label: "SMEs Surveyed" },
    { icon: BarChart3, value: "15", label: "African Countries" },
    { icon: Award, value: "95%", label: "Data Accuracy" },
  ]

  return (
    <section
      id="survey"
      ref={sectionRef}
      className="relative py-24 bg-gradient-to-b from-gray-900 to-blue-900 text-white overflow-hidden"
    >
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="container max-w-screen-xl mx-auto px-6 relative z-10">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-yellow-400 rounded-2xl flex items-center justify-center mx-auto mb-6"
          >
            <ClipboardList className="w-10 h-10 text-gray-900" />
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">National SME Readiness Survey</h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed text-pretty">
            Join thousands of African entrepreneurs in sharing your story. Help us build the most comprehensive database
            of SME financial inclusion metrics across the continent.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid sm:grid-cols-3 gap-8 mb-12 max-w-4xl mx-auto"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.4 + index * 0.1, type: "spring" }}
              className="text-center"
            >
              <stat.icon className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
              <div className="text-4xl font-bold mb-2">{stat.value}</div>
              <div className="text-gray-300">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center"
        >
          <Link
            href="/survey"
            className="inline-block bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-10 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 shadow-xl"
          >
            Take the Survey Now
          </Link>
          <p className="mt-4 text-gray-400 text-sm">Takes only 5-7 minutes • Your data is secure</p>
        </motion.div>
      </div>
    </section>
  )
}
