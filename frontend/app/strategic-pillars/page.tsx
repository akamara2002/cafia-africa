"use client"

import { motion, useScroll, useTransform, useSpring } from "framer-motion"
import { useRef } from "react"
import Image from "next/image"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

function PillarSection({ pillar, index }: { pillar: any; index: number }) {
  const pillarRef = useRef(null)
  const { scrollYProgress: pillarProgress } = useScroll({
    target: pillarRef,
    offset: ["start end", "end start"],
  })

  const imageY = useTransform(pillarProgress, [0, 1], [100, -100])
  const imageScale = useTransform(pillarProgress, [0, 0.5, 1], [0.8, 1, 0.8])
  const contentX = useTransform(
    pillarProgress,
    [0, 0.5, 1],
    [index % 2 === 0 ? -50 : 50, 0, index % 2 === 0 ? 50 : -50],
  )

  return (
    <motion.div
      ref={pillarRef}
      id={pillar.id}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1 }}
      className="relative bg-gradient-to-br from-blue-50 via-white to-yellow-50 rounded-3xl p-10 shadow-xl overflow-hidden"
    >
      <motion.div
        style={{ y: useTransform(pillarProgress, [0, 1], [0, -150]) }}
        className="absolute top-0 -left-10 w-60 h-60 bg-blue-200 rounded-full opacity-20 blur-3xl"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
      <motion.div
        style={{ y: useTransform(pillarProgress, [0, 1], [0, 150]) }}
        className="absolute bottom-0 -right-10 w-72 h-72 bg-yellow-300 rounded-full opacity-10 blur-3xl"
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        <motion.div style={{ y: imageY, scale: imageScale }} className="order-1">
          <motion.div whileHover={{ scale: 1.05, rotateZ: 2 }} transition={{ duration: 0.4 }}>
            <Image
              src={pillar.image || "/placeholder.svg"}
              alt={pillar.title}
              width={500}
              height={400}
              className="w-full max-w-md h-auto object-cover rounded-xl shadow-2xl"
            />
          </motion.div>
        </motion.div>

        <motion.div style={{ x: contentX }} className="order-2 space-y-6">
          <motion.h2
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl font-extrabold text-blue-900"
          >
            {pillar.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg text-gray-700"
          >
            {pillar.description}
          </motion.p>

          <ul className="space-y-2 text-gray-700 list-disc list-inside">
            {pillar.features.map((feature: any, i: number) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
              >
                <span className="font-medium text-yellow-600">{feature.title}</span> {feature.sub}
              </motion.li>
            ))}
          </ul>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {pillar.cards.map((card: any, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50, rotateX: -20 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: 0.5 + i * 0.15,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ scale: 1.1, y: -5, rotateZ: 2 }}
                className="bg-white rounded-xl p-6 shadow-lg transition transform"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="font-semibold text-blue-900 text-lg">{card.title}</div>
                <div className="text-gray-600 text-sm mt-1">{card.sub}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default function StrategicPillarsPage() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  // Parallax for hero
  const heroY = useTransform(smoothProgress, [0, 0.15], [0, -150])
  const heroScale = useTransform(smoothProgress, [0, 0.15], [1, 0.9])

  const pillars = [
    {
      id: "research-policy-academy",
      title: "Research, Policy Advisory & Academy",
      image: "/research-data-analysis-icon.jpg",
      description:
        "Generating evidence, shaping policy, and building capacity across Africa.",
      features: [
        { title: "Applied research", sub: "and financial inclusion diagnostics" },
        { title: "Policy advisory", sub: "to governments, regulators, and institutions" },
        { title: "Financial inclusion indices", sub: "and market intelligence" },
        {
          title: "Executive education",
          sub: "and professional capacity development",
        },
        {
          title: "Research partnerships",
          sub: "with universities and public institutions",
        },
      ],
      cards: [
        { title: "Diagnostics & Indices", sub: "Evidence-led inclusion measurement" },
        { title: "Policy Advisory", sub: "Support for regulators and programmes" },
        { title: "Academy", sub: "Executive education and capacity building" },
      ],
    },
    {
      id: "technology-innovation",
      title: "Technology & Innovation",
      image: "/technology-lab-innovation-icon.jpg",
      description:
        "Building the digital infrastructure that makes inclusion measurable and actionable.",
      features: [
        { title: "Data systems, dashboards,", sub: "and enterprise mapping tools" },
        { title: "Digital platform design", sub: "for low-connectivity environments" },
        { title: "Fintech partnerships", sub: "and innovation programmes" },
        { title: "Credit-readiness", sub: "and digital readiness scoring" },
        {
          title: "Custom solution development",
          sub: "for financial institutions",
        },
      ],
      cards: [
        { title: "Data Platforms", sub: "Mapping, dashboards, and analytics" },
        { title: "Product Design", sub: "Inclusive tools for challenging connectivity" },
        { title: "Innovation programmes", sub: "Partnerships that scale responsibly" },
      ],
    },
    {
      id: "sustainable-inclusive-finance",
      title: "Sustainable & Inclusive Finance",
      image: "/islamic-finance-halal-icon.jpg",
      description:
        "Mobilizing ethical, climate-aligned, and responsible capital for underserved communities.",
      features: [
        { title: "Islamic finance frameworks", sub: "and Shariah-compliant product development" },
        { title: "Climate finance", sub: "and green financial systems" },
        { title: "Ethical banking", sub: "and responsible investment models" },
        { title: "Health and social impact financing", sub: "" },
        { title: "Agricultural", sub: "and community finance solutions" },
      ],
      cards: [
        { title: "Responsible capital", sub: "Ethical, inclusive investment pathways" },
        { title: "Climate & green finance", sub: "Systems aligned with sustainability goals" },
        { title: "Community finance", sub: "Including Islamic, agri & social-impact tools" },
      ],
    },
  ]

  return (
    <main ref={containerRef} className="min-h-screen bg-white overflow-hidden">
      <Navbar />

      <motion.section
        style={{ y: heroY, scale: heroScale }}
        className="relative bg-gradient-to-br from-blue-800 via-blue-700 to-blue-600 text-white overflow-hidden"
      >
        <div className="container mx-auto px-6 py-32 relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl md:text-6xl font-extrabold mb-6"
          >
            Advancing <span className="text-yellow-400">Africa's Economy</span> Through Evidence, Policy and Innovation
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="text-xl md:text-2xl max-w-3xl mb-10"
          >
            Three integrated pillars, research and policy advisory, technology, and sustainable inclusive finance.
          </motion.p>
          <motion.a
            href="#pillars"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: 1.1, boxShadow: "0 20px 40px rgba(251, 191, 36, 0.4)" }}
            className="bg-yellow-400 text-blue-900 px-8 py-4 rounded-full font-semibold shadow-lg transition transform inline-block"
          >
            Explore the Pillars
          </motion.a>
        </div>

        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 25,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          style={{ y: useTransform(smoothProgress, [0, 1], [0, -200]) }}
          className="absolute -top-32 -left-20 w-96 h-96 bg-yellow-400 opacity-20 rounded-full"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 30,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          style={{ y: useTransform(smoothProgress, [0, 1], [0, 200]) }}
          className="absolute -bottom-32 -right-20 w-96 h-96 bg-white opacity-10 rounded-full"
        />
      </motion.section>

      <section id="pillars" className="py-20 bg-gray-50 overflow-x-hidden">
        <div className="container mx-auto px-6 space-y-32">
          {pillars.map((pillar, index) => (
            <PillarSection key={pillar.id} pillar={pillar} index={index} />
          ))}
        </div>
      </section>

      <Footer />
    </main>
  )
}
