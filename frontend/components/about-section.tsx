"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Target, Users, Globe, TrendingUp } from "lucide-react"

const features = [
  {
    icon: Target,
    title: "Our Mission",
    description:
      "To empower African SMEs and micro-enterprises by making them visible, investable, and integrated into the formal economy.",
  },
  {
    icon: Users,
    title: "Community Focus",
    description:
      "Building inclusive financial ecosystems that serve millions of underserved entrepreneurs across the continent.",
  },
  {
    icon: Globe,
    title: "Pan-African Reach",
    description:
      "Operating across multiple African nations, creating pathways to financial access and economic prosperity.",
  },
  {
    icon: TrendingUp,
    title: "Data-Driven Impact",
    description:
      "Leveraging research, technology, and partnerships to deliver measurable, sustainable financial inclusion.",
  },
]

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative py-24 bg-gradient-to-br from-white via-blue-50 to-cyan-50 overflow-hidden"
    >
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-30" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-100 rounded-full blur-3xl opacity-20" />

      <div className="container max-w-screen-xl mx-auto px-6 relative z-10">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent text-balance">
            About CAFIA
          </h2>
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed text-pretty">
            The Center for Africa Financial Inclusion and Advancement is a policy think tank and innovation hub
            dedicated to transforming Africa's informal sector into a catalyst for inclusive economic growth.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{ scale: 1.03, y: -5 }}
              className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : {}}
                transition={{ delay: index * 0.15 + 0.3, type: "spring", stiffness: 200 }}
                className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center mb-6"
              >
                <feature.icon className="w-8 h-8 text-white" />
              </motion.div>
              <h3 className="text-2xl font-bold mb-3 text-gray-800">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
