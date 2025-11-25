"use client"

import { useScroll } from "framer-motion"
import { useRef } from "react"
import HeroSection from "@/components/hero-section"
import StrategicPillars from "@/components/strategic-pillars"
import FinancialInclusionGallery from "@/components/financial-inclusion-gallery"
import InteractiveAfricaMap from "@/components/interactive-africa-map"
import PartnersSection from "@/components/partners-section"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  return (
    <>
      <Navbar />
      <div ref={containerRef} className="relative">
        <HeroSection />
        <StrategicPillars />
        <FinancialInclusionGallery />
        <InteractiveAfricaMap />
        <PartnersSection />
      </div>
      <Footer />
    </>
  )
}
