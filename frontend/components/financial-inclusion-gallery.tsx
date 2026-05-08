"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"

const LOOP_END_SECONDS = 5

const CARD_VARIANTS = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

const TEXT_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

function PreviewVideo({
  src,
  ariaLabel,
  className = "",
}: {
  src: string
  ariaLabel: string
  className?: string
}) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const onTimeUpdate = () => {
      if (video.currentTime >= LOOP_END_SECONDS) {
        video.currentTime = 0
      }
    }
    video.addEventListener("timeupdate", onTimeUpdate)
    return () => video.removeEventListener("timeupdate", onTimeUpdate)
  }, [])

  return (
    <motion.div
      className={`relative w-full aspect-video rounded-2xl overflow-hidden shadow-xl bg-stone-100/90 ${className}`}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-cover"
        autoPlay
        muted
        playsInline
        loop={false}
        aria-label={ariaLabel}
      >
        Your browser does not support the video tag.
      </video>
    </motion.div>
  )
}

const BLOG_LINK = "/blog"

const PREVIEW_CARDS = [
  {
    image: "/images/bilal.jpeg",
    title: "Cash and Digital Payments",
    preview: "Many businesses still rely primarily on cash despite the rise of mobile money.",
    href: "/blog",
  },
  {
    image: "/images/amanda.jpeg",
    title: "Record Keeping",
    preview: "Some entrepreneurs track profits mentally rather than keeping written records.",
    href: "/blog",
  },
  {
    image: "/images/edwrad.jpeg",
    title: "Trust in Digital Payments",
    preview: "Concerns about fraud and unreliable networks limit digital adoption.",
    href: "/blog",
  },
]

export default function FinancialInclusionGallery() {
  const sectionRef = useRef<HTMLElement>(null)
  const ref1 = useRef<HTMLDivElement>(null)
  const ref2 = useRef<HTMLDivElement>(null)
  const ref3 = useRef<HTMLDivElement>(null)
  const headerInView = useInView(sectionRef, { once: true, amount: 0.2 })
  const inView1 = useInView(ref1, { once: true, amount: 0.12 })
  const inView2 = useInView(ref2, { once: true, amount: 0.08 })
  const inView3 = useInView(ref3, { once: true, amount: 0.12 })

  return (
    <section
      ref={sectionRef}
      id="financial-inclusion-sierra-leone"
      className="relative overflow-hidden section-gold-bg"
      aria-labelledby="financial-inclusion-heading"
    >
      {/* Hero-style section header */}
      <div className="relative z-10 pt-16 md:pt-20 pb-12 md:pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <motion.h2
            id="financial-inclusion-heading"
            initial={{ opacity: 0, y: 28 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-[64px] font-bold text-stone-900 leading-tight tracking-tight"
          >
            Financial Inclusion in Sierra Leone
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-4 md:mt-6 text-lg md:text-xl text-stone-700 max-w-2xl mx-auto"
          >
            Field interviews and survey insights on how entrepreneurs perceive bank accounts, credit, and digital tools.
          </motion.p>
        </div>
      </div>

      {/* Card 1 — First video block (soft cream / light champagne) */}
      <div ref={ref1} className="relative z-10 px-4 sm:px-6 pb-8 md:pb-12">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            animate={inView1 ? "visible" : "hidden"}
            variants={CARD_VARIANTS}
            className="rounded-2xl md:rounded-3xl shadow-xl p-6 md:p-10 bg-[#faf8f5] border border-amber-100/60"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
              <div className="order-2 lg:order-1 space-y-6">
                <motion.p
                  variants={TEXT_VARIANTS}
                  className="text-sm font-medium uppercase tracking-wide text-amber-800/80"
                >
                  Bank Account Perception
                </motion.p>
                <motion.h3
                  variants={TEXT_VARIANTS}
                  className="text-2xl md:text-3xl font-bold text-stone-900 leading-tight"
                >
                  Many entrepreneurs believe bank accounts are only useful once income becomes large.
                </motion.h3>
                <motion.div variants={TEXT_VARIANTS}>
                  <Link
                    href={BLOG_LINK}
                    className="inline-flex items-center justify-center rounded-xl border-2 border-stone-300 bg-white px-6 py-3 font-semibold text-stone-800 shadow-sm hover:bg-stone-50 hover:border-stone-400 transition-all duration-300"
                  >
                    Read More
                  </Link>
                </motion.div>
              </div>
              <motion.div
                variants={TEXT_VARIANTS}
                className="order-1 lg:order-2"
              >
                <PreviewVideo
                  src="/images/salaam.mp4"
                  ariaLabel="Bank account perception interview preview"
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Card 2 — Image grid (pale gold / warm ivory) */}
      <div ref={ref2} className="relative z-10 px-4 sm:px-6 pb-8 md:pb-12">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            animate={inView2 ? "visible" : "hidden"}
            variants={CARD_VARIANTS}
            className="rounded-2xl md:rounded-3xl shadow-xl p-6 md:p-10 bg-[#fef9eb] border border-amber-200/50"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {PREVIEW_CARDS.map((card, index) => (
                <motion.article
                  key={card.title}
                  variants={TEXT_VARIANTS}
                  transition={{ delay: index * 0.1 }}
                  className="rounded-2xl overflow-hidden border border-amber-100/70 bg-white/90 shadow-md hover:shadow-xl transition-all duration-300"
                >
                  <motion.div
                    className="relative aspect-[4/3] bg-stone-100 overflow-hidden"
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                  >
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </motion.div>
                  <div className="p-6 space-y-3">
                    <h3 className="text-xl font-bold text-stone-900">
                      {card.title}
                    </h3>
                    <p className="text-stone-600 leading-relaxed">
                      {card.preview}
                    </p>
                    <Link
                      href={card.href}
                      className="inline-block font-semibold text-amber-700 hover:text-amber-800 hover:underline transition-colors duration-300"
                    >
                      Read More
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Card 3 — Second video block (light sand / warm beige) */}
      <div ref={ref3} className="relative z-10 px-4 sm:px-6 pb-20 md:pb-28">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            animate={inView3 ? "visible" : "hidden"}
            variants={CARD_VARIANTS}
            className="rounded-2xl md:rounded-3xl shadow-xl p-6 md:p-10 bg-[#f5f0e6] border border-amber-100/70"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
              <div className="order-2 lg:order-1 space-y-6">
                <motion.h3
                  variants={TEXT_VARIANTS}
                  className="text-2xl md:text-3xl font-bold text-stone-900 leading-tight"
                >
                  Digital Records for Credit
                </motion.h3>
                <motion.p
                  variants={TEXT_VARIANTS}
                  className="text-lg text-stone-600 leading-relaxed"
                >
                  Many small businesses would share digital transaction records if it helped them access credit.
                </motion.p>
                <motion.div variants={TEXT_VARIANTS}>
                  <Link
                    href={BLOG_LINK}
                    className="inline-flex items-center justify-center rounded-xl border-2 border-stone-300 bg-white px-6 py-3 font-semibold text-stone-800 shadow-sm hover:bg-stone-50 hover:border-stone-400 transition-all duration-300"
                  >
                    Read More
                  </Link>
                </motion.div>
              </div>
              <motion.div
                variants={TEXT_VARIANTS}
                className="order-1 lg:order-2"
              >
                <PreviewVideo
                  src="/images/abdul.mp4"
                  ariaLabel="Digital records for credit interview preview"
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
