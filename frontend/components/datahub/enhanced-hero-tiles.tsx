"use client"

import { useEffect, useRef, useState } from 'react'
import { Car, Satellite, Store, Users } from 'lucide-react'
import { motion } from 'framer-motion'
import * as d3 from 'd3'
import { registerChart, unregisterChart } from '@/lib/chart-observer'

interface EnhancedHeroTilesProps {
  data: {
    total_businesses: number
    total_streets: number
    gps_coverage_pct: number
  }
}

interface TileData {
  value: number
  label: string
  icon: React.ReactNode
  suffix?: string
  flipText: string
  progress: number
}

export default function EnhancedHeroTiles({ data }: EnhancedHeroTilesProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [animatedValues, setAnimatedValues] = useState({
    businesses: 0,
    streets: 0,
    gps: 0,
    interviews: 0, // Start at 0 for animation
  })
  const [progress, setProgress] = useState({
    businesses: 0,
    streets: 0,
    gps: 0,
    interviews: 0,
  })
  const [flipped, setFlipped] = useState({
    businesses: false,
    streets: false,
    gps: false,
    interviews: false,
  })

  const animationFrameIdRef = useRef<number | null>(null)
  const isAnimatingRef = useRef(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!containerRef.current) return

    const duration = 2000
    let startTime: number

    const animate = () => {
      if (!isAnimatingRef.current) return
      
      const elapsed = Date.now() - startTime
      const t = Math.min(elapsed / duration, 1)
      const eased = d3.easeElasticOut(t)

      // Animate all values including interviews
      setAnimatedValues({
        businesses: Math.floor(data.total_businesses * eased),
        streets: Math.floor(data.total_streets * eased),
        gps: Math.floor(data.gps_coverage_pct * eased),
        interviews: Math.floor(500 * eased), // Animate to 500
      })

      setProgress({
        businesses: eased,
        streets: eased,
        gps: eased,
        interviews: eased,
      })

      if (t < 1) {
        animationFrameIdRef.current = requestAnimationFrame(animate)
      } else {
        // Ensure final values are exact
        setAnimatedValues({
          businesses: data.total_businesses,
          streets: data.total_streets,
          gps: data.gps_coverage_pct,
          interviews: 500, // Final value
        })
        setProgress({
          businesses: 1,
          streets: 1,
          gps: 1,
          interviews: 1,
        })
        isAnimatingRef.current = false
      }
    }

    const animateFn = () => {
      // Prevent double-triggering
      if (isAnimatingRef.current) return
      
      isAnimatingRef.current = true
      startTime = Date.now()
      
      // Cancel any existing animation
      if (animationFrameIdRef.current !== null) {
        cancelAnimationFrame(animationFrameIdRef.current)
      }
      
      // Reset to initial values
      setAnimatedValues({
        businesses: 0,
        streets: 0,
        gps: 0,
        interviews: 0, // Start at 0
      })
      setProgress({
        businesses: 0,
        streets: 0,
        gps: 0,
        interviews: 0,
      })
      
      // Start animation
      animationFrameIdRef.current = requestAnimationFrame(animate)
    }

    containerRef.current.setAttribute('data-chart-id', 'enhanced-hero-tiles')
    registerChart(containerRef.current, animateFn)

    return () => {
      if (animationFrameIdRef.current !== null) {
        cancelAnimationFrame(animationFrameIdRef.current)
      }
      if (containerRef.current) {
        unregisterChart(containerRef.current)
      }
    }
  }, [data])

  const tiles: TileData[] = [
    {
      value: animatedValues.businesses,
      label: 'Businesses Mapped',
      icon: <Store className="w-6 h-6" />,
      flipText: 'Surveyed across 6 weeks',
      progress: progress.businesses,
    },
    {
      value: animatedValues.streets,
      label: 'Active Business Hubs',
      icon: <Car className="w-6 h-6" />,
      flipText: 'From Kissy to Lumley and Kamayama',
      progress: progress.streets,
    },
    {
      value: animatedValues.gps,
      label: 'GPS-Tagged',
      icon: <Satellite className="w-6 h-6" />,
      suffix: '%',
      flipText: 'Precise location data',
      progress: progress.gps,
    },
    {
      value: animatedValues.interviews,
      label: 'Strategic Interviews',
      icon: <Users className="w-6 h-6" />,
      flipText: 'In-depth conversations with entrepreneurs',
      progress: progress.interviews,
      suffix: progress.interviews >= 1 ? '+' : '', // Show + after animation completes
    },
  ]

  return (
    <div ref={containerRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 mb-8 sm:mb-12">
      {tiles.map((tile, index) => {
        const tileKey = ['businesses', 'streets', 'gps', 'interviews'][index] as keyof typeof flipped
        const isFlipped = flipped[tileKey]

        return (
          <motion.div
            key={index}
            className="relative bg-white rounded-xl shadow-lg p-4 sm:p-5 lg:p-6 overflow-hidden group min-h-[152px] sm:min-h-[168px] touch-manipulation"
            whileHover={{ 
              y: -4, 
              boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
              transition: { duration: 0.2 } 
            }}
            onMouseEnter={() => setFlipped({ ...flipped, [tileKey]: true })}
            onMouseLeave={() => setFlipped({ ...flipped, [tileKey]: false })}
            style={{ willChange: 'transform' }}
          >
            {/* Hover background effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ willChange: 'opacity' }}
            />

            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="text-blue-600">{tile.icon}</div>
                {isFlipped && (
                  <motion.div
                    initial={{ opacity: 0, rotateX: -90 }}
                    animate={{ opacity: 1, rotateX: 0 }}
                    exit={{ opacity: 0, rotateX: 90 }}
                    transition={{ duration: 0.3 }}
                    className="text-xs text-gray-500 italic"
                  >
                    {tile.flipText}
                  </motion.div>
                )}
              </div>

              <motion.div
                key={`${tile.value}-${tile.suffix || ''}`}
                className="text-3xl font-bold text-gray-900 mb-2"
              >
                {tile.value.toLocaleString()}
                {tile.suffix}
              </motion.div>

              <div className="text-sm sm:text-[15px] font-medium text-gray-600 leading-snug">{tile.label}</div>

              {/* Accent underline */}
              <motion.div
                className="h-1 bg-gradient-to-r from-blue-600 to-cyan-400 mt-4 rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: tile.progress }}
                transition={{ duration: 0.5, delay: 0.3 }}
                style={{ transformOrigin: 'left', willChange: 'transform' }}
              />
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
