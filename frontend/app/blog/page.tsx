"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import BlogCarousel from "@/components/blog/BlogCarousel"
import AnimatedSection from "@/components/blog/AnimatedSection"
import { BLOG_ARTICLES } from "@/lib/blog-data"

export default function BlogPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  const ambientY = useTransform(scrollYProgress, [0, 0.5, 1], [0, 30, 0])
  const opacity = useTransform(scrollYProgress, [0, 0.15], [0.6, 1])

  return (
    <>
      <Navbar />
      <main
        ref={containerRef}
        className="min-h-screen bg-stone-950 text-white overflow-hidden"
      >
        {/* Ambient moving gradient background */}
        <div className="fixed inset-0 pointer-events-none">
          <motion.div
            style={{ y: ambientY }}
            className="absolute inset-0 bg-gradient-to-br from-indigo-950/40 via-stone-950 to-stone-900"
          />
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background: `
                radial-gradient(ellipse 80% 50% at 20% 40%, rgba(99, 102, 241, 0.25), transparent),
                radial-gradient(ellipse 60% 40% at 80% 60%, rgba(139, 92, 246, 0.2), transparent),
                radial-gradient(ellipse 50% 30% at 50% 90%, rgba(59, 130, 246, 0.15), transparent)
              `,
            }}
          />
        </div>

        <div className="relative z-10 pt-28 pb-20">
          {/* Hero headline */}
          <section className="px-4 sm:px-6 lg:px-10 max-w-6xl mx-auto text-center mb-16 md:mb-24">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{ opacity }}
            >
              <p className="text-indigo-400 text-sm font-semibold uppercase tracking-widest mb-4">
                Stories & Research
              </p>
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05]">
                CAFIA Blog
              </h1>
              <p className="mt-6 text-lg md:text-xl text-stone-400 max-w-2xl mx-auto">
                Insights on financial inclusion, digital economy, and the future of finance across Africa.
              </p>
            </motion.div>
          </section>

          {/* Horizontal carousel — one row of 5 cards, auto-scroll */}
          <AnimatedSection className="mb-24" amount={0.1}>
            <div className="w-full overflow-hidden">
              <BlogCarousel articles={BLOG_ARTICLES} />
            </div>
          </AnimatedSection>

          {/* Supporting line */}
          <AnimatedSection delay={0.2} className="px-4 text-center">
            <p className="text-stone-500 text-sm">
              Hover over the carousel to pause • Click a card to read the full story
            </p>
          </AnimatedSection>
        </div>
      </main>
      <Footer />
    </>
  )
}
