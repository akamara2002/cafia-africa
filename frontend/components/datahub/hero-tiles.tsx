"use client"

import { useEffect, useRef, useState } from 'react'
import { MapPin, Route, Satellite, Store } from 'lucide-react'
import * as d3 from 'd3'

interface HeroTilesProps {
  data: {
    total_businesses: number
    total_streets: number
    gps_coverage_pct: number
    distinct_setup_types: number
  }
}

interface TileData {
  value: number
  label: string
  icon: React.ReactNode
  suffix?: string
}

export default function HeroTiles({ data }: HeroTilesProps) {
  const [animatedValues, setAnimatedValues] = useState({
    businesses: 0,
    streets: 0,
    gps: 0,
    setups: 0,
  })

  useEffect(() => {
    // Animate counters using requestAnimationFrame for smooth updates
    const duration = 2000
    const startTime = Date.now()
    
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = d3.easeExpOut(progress)
      
      setAnimatedValues({
        businesses: Math.floor(data.total_businesses * eased),
        streets: Math.floor(data.total_streets * eased),
        gps: Math.floor(data.gps_coverage_pct * eased),
        setups: Math.floor(data.distinct_setup_types * eased),
      })
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        // Ensure final values are set
        setAnimatedValues({
          businesses: data.total_businesses,
          streets: data.total_streets,
          gps: data.gps_coverage_pct,
          setups: data.distinct_setup_types,
        })
      }
    }
    
    requestAnimationFrame(animate)
  }, [data])

  const tiles: TileData[] = [
    {
      value: animatedValues.businesses,
      label: 'Businesses Mapped',
      icon: <Store className="w-6 h-6" />,
    },
    {
      value: animatedValues.streets,
      label: 'Streets Covered',
      icon: <Route className="w-6 h-6" />,
    },
    {
      value: animatedValues.gps,
      label: 'GPS-Tagged',
      icon: <Satellite className="w-6 h-6" />,
      suffix: '%',
    },
    {
      value: animatedValues.setups,
      label: 'Business Setups Identified',
      icon: <MapPin className="w-6 h-6" />,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {tiles.map((tile, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-t-4 border-blue-600"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="text-blue-600">{tile.icon}</div>
          </div>
          <div className="text-4xl font-bold text-gray-900 mb-2">
            {tile.value.toLocaleString()}
            {tile.suffix}
          </div>
          <div className="text-sm text-gray-600 font-medium">{tile.label}</div>
          <div className="mt-4 h-1 bg-blue-600 rounded-full" />
        </div>
      ))}
    </div>
  )
}
