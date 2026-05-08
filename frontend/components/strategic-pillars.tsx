"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"

const pillars = [
  {
    title: "Research, Policy Advisory & Academy",
    description:
      "Generating evidence, shaping policy, and building capacity across Africa.",
    image: "/research-data-analysis-icon.jpg",
  },
  {
    title: "Technology & Innovation",
    description:
      "Building the digital infrastructure that makes inclusion measurable and actionable.",
    image: "/technology-lab-innovation-icon.jpg",
  },
  {
    title: "Sustainable & Inclusive Finance",
    description:
      "Mobilizing ethical, climate-aligned, and responsible capital for underserved communities.",
    image: "/islamic-finance-halal-icon.jpg",
  },
]

const mobileVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
}

const desktopVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } },
}

export default function StrategicPillars() {
  const sectionRef = useRef<HTMLElement>(null)
  const sliderRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [cardsPerView, setCardsPerView] = useState(3)
  const [isMobile, setIsMobile] = useState(false)
  const [cardWidth, setCardWidth] = useState(0)

  const getCardWidth = () => {
    if (!sliderRef.current) return 0
    const card = sliderRef.current.querySelector("div")
    if (!card) return 0
    const gap = 24 // Tailwind gap-6 = 24px
    return card.offsetWidth + gap
  }

  useEffect(() => {
    const updateCardsPerView = () => {
      const w = window.innerWidth
      if (w >= 1024) {
        setCardsPerView(3)
        setIsMobile(false)
      } else if (w >= 640) {
        setCardsPerView(2)
        setIsMobile(false)
      } else {
        setCardsPerView(1)
        setIsMobile(true)
      }
      setTimeout(() => setCardWidth(getCardWidth()), 100)
    }

    updateCardsPerView()
    window.addEventListener("resize", updateCardsPerView)
    return () => window.removeEventListener("resize", updateCardsPerView)
  }, [])

  useEffect(() => {
    setTimeout(() => setCardWidth(getCardWidth()), 200)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = prev + 1
        return next > pillars.length - cardsPerView ? 0 : next
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [cardsPerView])

  const totalDots = Math.ceil(pillars.length / cardsPerView)
  const activeDot = Math.floor(currentIndex / cardsPerView)

  const variants = isMobile ? mobileVariants : desktopVariants

  const cardFlexBasis =
    "w-full sm:w-[calc(50%-12px)] lg:w-[calc((100%-3rem)/3)]"

  return (
    <section
      ref={sectionRef}
      className="relative py-24 bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 overflow-hidden"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl hidden sm:block" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-200/30 rounded-full blur-3xl hidden sm:block" />
      </div>

      <div className="container relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6">
        <motion.div
          variants={variants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center mb-12 sm:mb-20"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 sm:mb-8 text-blue-600 tracking-tight">
            Three Core Pillars
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed px-4">
            Research and policy, technology, and inclusive finance, working together for financial inclusion across Africa.
          </p>
        </motion.div>

        <div className="relative overflow-hidden" role="region" aria-label="Strategic Pillars Carousel">
          <div className="relative overflow-hidden">
            <div
              ref={sliderRef}
              className="flex gap-6 transition-transform duration-700 ease-in-out will-change-transform"
              style={{
                transform: `translateX(-${currentIndex * cardWidth}px)`,
              }}
            >
              {pillars.map((pillar, index) => (
                <div
                  key={index}
                  className={`flex-shrink-0 ${cardFlexBasis} flex flex-col items-center`}
                >
                  <motion.div
                    animate={isMobile ? {} : { y: [0, -8, 0] }}
                    transition={isMobile ? {} : { duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                    className="w-32 h-32 sm:w-40 sm:h-40 relative mb-4"
                  >
                    <Image
                      src={pillar.image || "/placeholder.svg"}
                      alt={`${pillar.title} Icon`}
                      fill
                      className="object-contain drop-shadow-xl"
                    />
                  </motion.div>
                  <div className="bg-white rounded-2xl shadow-lg p-6 w-full text-center hover:shadow-xl hover:scale-105 transition-all duration-300 group min-h-[8rem] sm:min-h-[9rem] flex flex-col justify-center">
                    <h3 className="text-xl font-semibold mb-2 text-gray-800 group-hover:text-blue-600 transition-colors text-balance">
                      {pillar.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{pillar.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: totalDots }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index * cardsPerView)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === activeDot ? "bg-blue-600 scale-125" : "bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="text-center mt-12 sm:mt-16"
        >
          <Link
            href="/strategic-pillars"
            className="inline-block bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-8 sm:px-12 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl"
          >
            Explore Strategic Pillars
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
