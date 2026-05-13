"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { fadeUp, staggerContainer } from "@/lib/motion/variants"

const currencies = ["$", "₵", "€", "₦", "£", "¥"]

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900"
    >
      {/* Background Image with Parallax */}
      <motion.div style={{ y, scale }} className="absolute inset-0 z-0">
        <Image
          src="/images/cafia_home.png"
          alt="CAFIA Africa Background"
          fill
          className="object-cover opacity-70"
          priority
          style={{ objectPosition: 'center 20%' }}
        />
      </motion.div>

      <div className="absolute inset-0 bg-premium-radial z-[1]" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/10 to-slate-900/40 z-[2]" />

      {/* Floating Currency Symbols */}
      <div className="absolute inset-0 z-[3]">
        {currencies.map((symbol, index) => (
          <motion.span
            key={symbol + index}
            className="absolute text-4xl md:text-5xl font-bold text-yellow-400/90"
            style={{
              top: `${[33, 66, 50, 25, 40, 75][index]}%`,
              left: `${[25, 66, 75, 66, 16, 33][index]}%`,
              textShadow: "0 0 20px rgba(251, 191, 36, 0.8), 0 0 40px rgba(251, 191, 36, 0.4)",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: [0.4, 0.9, 0.4],
              y: [0, -30, 0],
              x: [0, 15, 0],
            }}
            transition={{
              duration: 7,
              repeat: Number.POSITIVE_INFINITY,
              delay: index * 0.6,
              ease: "easeInOut",
            }}
          >
            {symbol}
          </motion.span>
        ))}
      </div>

      {/* Hero Content */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 text-center px-6 sm:px-12 max-w-6xl mx-auto"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 variants={fadeUp} className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 text-white">
          <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-blue-500 bg-clip-text text-transparent drop-shadow-2xl">
            CAFIA
          </span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="text-3xl md:text-4xl lg:text-5xl text-white font-bold mb-3 leading-tight tracking-wide"
        >
          Center for Africa
        </motion.p>

        <motion.p
          variants={fadeUp}
          className="text-3xl md:text-4xl lg:text-5xl text-white font-bold mb-10 leading-tight tracking-wide"
        >
          Financial Inclusion and Advancement
        </motion.p>

        <motion.h2
          variants={fadeUp}
          className="text-3xl md:text-5xl font-bold text-yellow-400 mb-10 md:mb-12 tracking-wide drop-shadow-lg"
        >
          From Invisible to Investable
        </motion.h2>

        <motion.div variants={fadeUp} className="mb-10">
          <Link
            href="/research-publications"
            className="group inline-flex items-center justify-center gap-2 rounded-full border-2 border-cyan-300/90 bg-gradient-to-r from-cyan-500/20 to-blue-600/30 px-8 py-3.5 sm:px-10 sm:py-4 text-base sm:text-lg font-bold text-white shadow-[0_8px_30px_rgba(6,182,212,0.35)] transition-all duration-300 hover:border-yellow-300 hover:from-cyan-400/30 hover:to-blue-500/40 hover:scale-[1.02] hover:shadow-[0_12px_40px_rgba(250,204,21,0.25)] focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
          >
            Explore Research
            <ArrowRight className="h-5 w-5 shrink-0 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
          </Link>
          <p className="mt-3 text-sm sm:text-base text-blue-100/90">
            <Link
              href="/research-publications"
              className="font-medium text-cyan-200 underline-offset-4 hover:text-yellow-300 hover:underline"
            >
              View our research report
            </Link>
          </p>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="flex flex-col sm:flex-row gap-6 justify-center backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-[0_20px_50px_rgba(2,6,23,0.55)]"
        >
          <Link
            href="/about"
            className="border-2 border-white/80 text-white px-10 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:bg-white hover:text-blue-900 shadow-lg hover:scale-105 hover:shadow-2xl"
          >
            Learn More
          </Link>
          <Link
            href="/contact"
            className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-10 py-4 rounded-full font-bold text-lg transition-all duration-300 shadow-lg hover:scale-105 hover:shadow-2xl"
          >
            Join the Movement
          </Link>
        </motion.div>
      </motion.div>
    </section>
  )
}
