"use client"

import { useScroll } from "framer-motion"
import { useRef, useState } from "react"
import HeroSection from "@/components/hero-section"
import StrategicPillars from "@/components/strategic-pillars"
import FinancialInclusionGallery from "@/components/financial-inclusion-gallery"
import InteractiveAfricaMap, { type ExtendedCountryData } from "@/components/interactive-africa-map"
import PartnersSection from "@/components/partners-section"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })
  const [selectedCountry, setSelectedCountry] = useState<ExtendedCountryData | null>(null)

  return (
    <>
      <Navbar />
      <div ref={containerRef} className="relative">
        <HeroSection />
        <StrategicPillars />
        <FinancialInclusionGallery />
        <InteractiveAfricaMap 
          selectedCountry={selectedCountry}
          onCountrySelect={setSelectedCountry}
        />
        <PartnersSection isCountryModalOpen={selectedCountry !== null} />
      </div>
      <Footer />
    </>
  )
}
