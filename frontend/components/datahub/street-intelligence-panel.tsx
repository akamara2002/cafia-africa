"use client"

import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { registerChart, unregisterChart } from '@/lib/chart-observer'
import { Search } from 'lucide-react'

interface StreetCard {
  street_name: string
  total: number
  shops: number
  tables: number
  kiosks: number
  female_pct: number
  male_pct: number
  activity_breakdown: Record<string, number>
}

interface StreetIntelligencePanelProps {
  data: StreetCard[]
}

export default function StreetIntelligencePanel({ data }: StreetIntelligencePanelProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'count' | 'female' | 'male' | 'alphabetical'>('count')
  const animationStateRef = useRef<Map<number, boolean>>(new Map())
  const isAnimatingRef = useRef(false)

  const filteredAndSorted = data
    .filter((street) => {
      if (searchQuery && !street.street_name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }
      return true
    })
    .sort((a, b) => {
      if (sortBy === 'count') return b.total - a.total
      if (sortBy === 'female') return b.female_pct - a.female_pct
      if (sortBy === 'male') return b.male_pct - a.male_pct
      return a.street_name.localeCompare(b.street_name)
    })

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!containerRef.current) return

    const chartId = 'street-intelligence-panel'
    containerRef.current.setAttribute('data-chart-id', chartId)

    // Animation function - triggers on every viewport entry
    const animate = () => {
      const cards = containerRef.current?.querySelectorAll('.street-card')
      if (!cards || cards.length === 0) return

      // Reset animation state for fresh animation
      animationStateRef.current.clear()
      isAnimatingRef.current = true

      cards.forEach((card, i) => {
        const cardEl = card as HTMLElement
        const bars = cardEl.querySelectorAll('.mini-bar')

        // Interrupt any ongoing transitions
        d3.select(cardEl).interrupt()
        bars.forEach(bar => d3.select(bar as HTMLElement).interrupt())

        // Reset initial state - GPU-only (transform + opacity)
        cardEl.style.opacity = '0'
        cardEl.style.transform = 'translateY(30px)'
        cardEl.style.willChange = 'transform, opacity'

        // Animate card entrance
        const cardTransition = d3.select(cardEl)
          .transition('card-entrance')
          .delay(i * 30)
          .duration(400)
          .ease(d3.easeCubicOut)
          .style('opacity', '1')
          .style('transform', 'translateY(0)')
          .on('end', function() {
            // Mark card animation complete
            animationStateRef.current.set(i, true)
          })

        // Animate mini bars sequentially after card appears
        bars.forEach((bar, j) => {
          const barEl = bar as HTMLElement
          const width = barEl.getAttribute('data-width') || '0'
          const finalWidth = parseFloat(width)
          
          // Reset bar state
          barEl.style.width = '0'
          barEl.style.opacity = '0'
          barEl.style.willChange = 'width, opacity'

          d3.select(barEl)
            .transition('bar-animate')
            .delay(i * 30 + 250 + j * 50)
            .duration(500)
            .ease(d3.easeCubicOut)
            .style('width', `${finalWidth}%`)
            .style('opacity', '1')
            .on('end', function() {
              // Clean up will-change after animation
              barEl.style.willChange = 'auto'
            })
        })
      })

      // Mark animation complete after all cards should be done
      const totalDelay = (cards.length - 1) * 30 + 250 + 3 * 50 + 500
      setTimeout(() => {
        isAnimatingRef.current = false
        // Clean up will-change on cards
        cards.forEach(card => {
          const cardEl = card as HTMLElement
          cardEl.style.willChange = 'auto'
        })
      }, totalDelay)
    }

    registerChart(containerRef.current, animate)

    return () => {
      if (containerRef.current) {
        unregisterChart(containerRef.current)
      }
    }
  }, [filteredAndSorted])

  return (
    <div ref={containerRef} className="w-full">
      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search areas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          <span className="text-sm font-medium text-gray-700">Sort by:</span>
          <button
            onClick={() => setSortBy('count')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              sortBy === 'count'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Total Count
          </button>
          <button
            onClick={() => setSortBy('female')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              sortBy === 'female'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Female %
          </button>
          <button
            onClick={() => setSortBy('male')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              sortBy === 'male'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Male %
          </button>
          <button
            onClick={() => setSortBy('alphabetical')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              sortBy === 'alphabetical'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            A-Z
          </button>
        </div>
      </div>

      {/* Street Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSorted.map((street, index) => {
          const rank = filteredAndSorted.findIndex((s) => s.street_name === street.street_name) + 1
          const shopsPct = street.total > 0 ? (street.shops / street.total) * 100 : 0
          const tablesPct = street.total > 0 ? (street.tables / street.total) * 100 : 0
          const kiosksPct = street.total > 0 ? (street.kiosks / street.total) * 100 : 0

          return (
            <div
              key={street.street_name}
              className="street-card bg-white rounded-xl shadow-lg p-6 border-l-4 border-transparent hover:border-blue-600 transition-all duration-200"
              style={{ willChange: 'transform', opacity: searchQuery ? (street.street_name.toLowerCase().includes(searchQuery.toLowerCase()) ? 1 : 0.2) : 1 }}
              onMouseEnter={(e) => {
                const card = e.currentTarget
                // Only apply hover effect if animation is complete or not running
                if (!isAnimatingRef.current || animationStateRef.current.get(index)) {
                  // Use CSS transform for hover (GPU-accelerated)
                  card.style.transform = 'translateY(-4px) scale(1.02)'
                  card.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)'
                  card.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease'
                }
              }}
              onMouseLeave={(e) => {
                const card = e.currentTarget
                card.style.transform = 'translateY(0) scale(1)'
                card.style.boxShadow = ''
                card.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease'
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">{street.street_name}</h3>
                <span className="text-sm font-semibold text-blue-600">#{rank}</span>
              </div>

              {/* Total */}
              <div className="text-2xl font-bold text-gray-900 mb-6">
                {street.total.toLocaleString()} businesses
              </div>

              {/* Setup Distribution */}
              <div className="mb-6">
                <div className="text-xs font-medium text-gray-600 mb-2">Setup Distribution</div>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-700">Shops</span>
                      <span className="font-semibold">{shopsPct.toFixed(0)}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="mini-bar h-full bg-blue-600 rounded-full"
                        data-width={shopsPct}
                        style={{ width: '0%', transition: 'width 0.3s ease' }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-700">Tables</span>
                      <span className="font-semibold">{tablesPct.toFixed(0)}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="mini-bar h-full bg-purple-600 rounded-full"
                        data-width={tablesPct}
                        style={{ width: '0%', transition: 'width 0.3s ease' }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-700">Kiosks</span>
                      <span className="font-semibold">{kiosksPct.toFixed(0)}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="mini-bar h-full bg-pink-600 rounded-full"
                        data-width={kiosksPct}
                        style={{ width: '0%', transition: 'width 0.3s ease' }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Gender Distribution */}
              <div className="mb-4">
                <div className="text-xs font-bold text-gray-700 mb-2">Gender Distribution</div>
                <div className="flex items-center gap-4 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-pink-600 font-bold">♀</span>
                    <span className="text-xs font-bold text-gray-700">Female</span>
                    <span className="text-xs font-bold text-pink-600">{street.female_pct.toFixed(0)}%</span>
                  </div>
                  <span className="text-gray-400">|</span>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600 font-bold">♂</span>
                    <span className="text-xs font-bold text-gray-700">Male</span>
                    <span className="text-xs font-bold text-blue-600">{street.male_pct.toFixed(0)}%</span>
                  </div>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden mt-2">
                  <div
                    className="mini-bar h-full bg-pink-500 rounded-l-full"
                    data-width={street.female_pct}
                    style={{ width: '0%', transition: 'width 0.3s ease' }}
                  />
                  <div
                    className="mini-bar h-full bg-blue-500 rounded-r-full"
                    data-width={street.male_pct}
                    style={{ width: '0%', transition: 'width 0.3s ease' }}
                  />
                </div>
              </div>

              {/* Activity */}
              <div className="text-xs text-gray-600">
                <span className="font-medium">Activity:</span>{' '}
                {Object.entries(street.activity_breakdown)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 2)
                  .map(([type]) => type)
                  .join(', ')}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
