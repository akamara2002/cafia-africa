"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

const slides = [
  {
    image: "/images/freetown-street.jpg",
    title: "Freetown Street Markets",
    description: "Where financial inclusion transforms daily commerce",
    objectFit: "cover" as const,
  },
  {
    image: "/images/sierra-leone-mobile-money.png",
    title: "Mobile Money in Action",
    description: "Real transactions at Sierra Leone markets and vendor stalls",
    objectFit: "cover" as const,
  },
  {
    image: "/images/urban-finance.jpg",
    title: "Urban Financial Infrastructure",
    description: "Building services for Sierra Leone's growing urban centers",
    objectFit: "cover" as const,
  },
  {
    image: "/images/mobile-money.png",
    title: "Financial Agents Network",
    description: "Extending mobile banking to every community",
    objectFit: "cover" as const,
  },
  {
    image: "/images/new.png",
    title: "Small Enterprise Development",
    description: "Helping local businesses access formal financial services",
    objectFit: "cover" as const,
    objectPosition: "center top" as const,
  },
]

export default function FinancialInclusionGallery() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)

  return (
    <section ref={sectionRef} className="relative overflow-hidden py-20 bg-gradient-to-b from-gray-50 to-white">
      {/* Top Animated Wave */}
      <div className="absolute inset-x-0 top-0 pointer-events-none z-0">
        <svg className="w-full h-36 md:h-44 lg:h-56" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <defs>
            <linearGradient id="wave-gradient-1" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.18" />
              <stop offset="50%" stopColor="#2563eb" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.08" />
            </linearGradient>
          </defs>
          <motion.path
            fill="url(#wave-gradient-1)"
            d="M0,48 C240,120 480,0 720,48 C960,96 1200,12 1440,64 L1440,0 L0,0 Z"
            animate={{ x: [0, -20, 0] }}
            transition={{ duration: 9, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          />
        </svg>
      </div>

      <div className="max-w-5xl mx-auto px-4 relative z-10">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center px-6 pt-10"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent leading-snug">
              Financial Inclusion in Sierra Leone
            </h2>
            <p className="text-sm md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Empowering SMEs and entrepreneurs with access to financial services and opportunities
            </p>
          </motion.div>

          {/* Image Slider */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative mt-8"
          >
            <div className="relative h-80 overflow-hidden">
              {slides.map((slide, index) => (
                <motion.div
                  key={index}
                  initial={false}
                  animate={{
                    opacity: currentSlide === index ? 1 : 0,
                    scale: currentSlide === index ? 1 : 1.1,
                  }}
                  transition={{ duration: 0.7, ease: "easeInOut" }}
                  className="absolute inset-0"
                  style={{ pointerEvents: currentSlide === index ? "auto" : "none" }}
                >
                  <div className="h-full">
                    <Image
                      src={slide.image || "/placeholder.svg"}
                      alt={slide.title}
                      fill
                      className={`object-${slide.objectFit} ${
                        slide.objectPosition ? `object-center md:object-[${slide.objectPosition}]` : ""
                      }`}
                      style={{
                        objectPosition: slide.objectPosition || "center",
                      }}
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/20 flex items-end">
                    <div className="p-4 md:p-6 text-white">
                      <h3 className="text-lg md:text-xl font-bold mb-1">{slide.title}</h3>
                      <p className="text-xs md:text-sm font-bold opacity-90">{slide.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={prevSlide}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-blue-600 p-2 rounded-full shadow-md transition-all hover:scale-110 z-20"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-blue-600 p-2 rounded-full shadow-md transition-all hover:scale-110 z-20"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Indicators */}
            <div className="flex justify-center mt-4 gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    currentSlide === index ? "bg-blue-600 scale-110" : "bg-gray-300 hover:bg-blue-400"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-10 pb-8 px-6"
          >
            <Link
              href="/about"
              className="inline-block bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-3 rounded-full font-semibold hover:scale-105 transition-all shadow-md mr-3"
            >
              Learn About Our Work
            </Link>
            <Link
              href="/contact"
              className="inline-block bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-full font-semibold hover:scale-105 transition-all shadow-md"
            >
              Partner With Us
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Bottom Animated Wave */}
      <div className="absolute inset-x-0 bottom-0 pointer-events-none z-0">
        <svg className="w-full h-36 md:h-44 lg:h-56" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <defs>
            <linearGradient id="wave-gradient-2" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.08" />
              <stop offset="50%" stopColor="#2563eb" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.16" />
            </linearGradient>
          </defs>
          <motion.path
            fill="url(#wave-gradient-2)"
            d="M0,16 C240,96 480,0 720,48 C960,96 1200,12 1440,40 L1440,120 L0,120 Z"
            animate={{ x: [0, 20, 0] }}
            transition={{ duration: 14, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          />
        </svg>
      </div>
    </section>
  )
}
