"use client"

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

interface HeroSectionProps {
  totalBusinesses: number
  totalStreets: number
}

export default function HeroSection({ totalBusinesses, totalStreets }: HeroSectionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [headlineVisible, setHeadlineVisible] = useState(false)

  useEffect(() => {
    setHeadlineVisible(true)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined' || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    const width = (canvas.width = canvas.offsetWidth)
    const height = (canvas.height = canvas.offsetHeight)

    // Cap particles at 400 maximum
    const particleCount = Math.min(400, Math.floor((width * height) / 15000))
    const particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      radius: number
    }> = []

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
      })
    }

    // Animation loop with delta-time
    let animationId: number
    let lastTime = performance.now()

    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastTime
      lastTime = currentTime
      const deltaSeconds = Math.min(deltaTime / 16.67, 2) // Cap at 2x normal speed

      ctx.clearRect(0, 0, width, height)

      // Update and draw particles
      particles.forEach((particle) => {
        particle.x += particle.vx * deltaSeconds
        particle.y += particle.vy * deltaSeconds

        // Wrap around edges
        if (particle.x < 0) particle.x = width
        if (particle.x > width) particle.x = 0
        if (particle.y < 0) particle.y = height
        if (particle.y > height) particle.y = 0

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(59, 130, 246, 0.3)'
        ctx.fill()
      })

      // Draw connections (optimized - only check nearby particles)
      const connectionDistance = 100
      for (let i = 0; i < particles.length; i++) {
        const particle = particles[i]
        for (let j = i + 1; j < particles.length; j++) {
          const other = particles[j]
          const dx = particle.x - other.x
          const dy = particle.y - other.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < connectionDistance) {
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(other.x, other.y)
            ctx.strokeStyle = `rgba(59, 130, 246, ${0.2 * (1 - distance / connectionDistance)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [])

  const scrollToNext = () => {
    const nextSection = document.querySelector('.container.max-w-screen-2xl')
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <section className="relative min-h-[min(42vh,22rem)] sm:min-h-[36vh] md:h-[30vh] md:min-h-0 flex flex-col items-center justify-start md:justify-center pt-[7rem] pb-12 sm:pt-28 md:pt-0 sm:pb-10 md:pb-0 overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Particle Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ willChange: 'contents' }}
      />

      {/* Content — extra top inset on mobile so headline clears fixed navbar (z-50) */}
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full md:flex md:items-center md:justify-center md:flex-1">
        <motion.div
          className="text-center w-full"
          initial={{ opacity: 0, y: 30 }}
          animate={headlineVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            Mapping Freetown's
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Informal Economy
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-6 max-w-3xl mx-auto">
            {totalBusinesses.toLocaleString()} businesses across {totalStreets} active business hubs.
            <br />
            Every data point tells a story of resilience and enterprise.
          </p>
        </motion.div>
      </div>

      {/* Scroll Indicator - Fixed at bottom center */}
      <motion.button
        onClick={scrollToNext}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        aria-label="Scroll to next section"
      >
        <ChevronDown className="w-6 h-6 text-white/80 animate-bounce" />
      </motion.button>
    </section>
  )
}
