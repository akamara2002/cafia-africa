"use client"

import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { ChevronDown, ChevronUp } from 'lucide-react'
import ScrollSection from './scroll-section'
import { createScrollObserver } from '@/lib/chart-observer'
import { showTooltip, hideTooltip } from '@/lib/d3-tooltip'

interface BarChartProps {
  topStreets: Array<{ street_name: string; count: number }>
  allStreets?: Array<{ street_name: string; count: number }>
  onStreetClick?: (street: string) => void
}

function renderBarChart(
  svgRef: React.RefObject<SVGSVGElement>,
  containerRef: React.RefObject<HTMLDivElement>,
  data: Array<{ street_name: string; count: number }>,
  onStreetClick?: (street: string) => void,
  animate: boolean = true
) {
  if (!svgRef.current || !containerRef.current || data.length === 0) return

  const svg = d3.select(svgRef.current)
  svg.selectAll('*').interrupt()
  svg.selectAll('*').remove()

  const margin = { top: 20, right: 40, bottom: 60, left: 80 } // Reduced left margin since we only show rankings
  const width = containerRef.current.clientWidth - margin.left - margin.right
  const height = Math.max(400, data.length * 40) - margin.top - margin.bottom

  const g = svg
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .style('will-change', 'transform')
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)

  // Scales
  const xScale = d3.scaleLinear().domain([0, d3.max(data, (d) => d.count) || 0]).range([0, width])
  const yScale = d3.scaleBand().domain(data.map((d, i) => `#${i + 1}`)).range([0, height]).padding(0.2)

  // Track animation state - shared across the function
  const animationState = { complete: false, inProgress: animate }

  // Gradient
  const gradient = g.append('defs').append('linearGradient').attr('id', 'barGradient').attr('x1', '0%').attr('y1', '0%').attr('x2', '100%').attr('y2', '0%')
  gradient.append('stop').attr('offset', '0%').attr('stop-color', '#3b82f6')
  gradient.append('stop').attr('offset', '100%').attr('stop-color', '#60a5fa')

  // Axes (static)
  g.append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0, ${height})`)
    .call(d3.axisBottom(xScale).ticks(5))
    .selectAll('text')
    .attr('font-size', '12px')
    .attr('fill', '#64748b')

  // Y-axis with only rankings (no street names)
  const yAxis = g.append('g').attr('class', 'y-axis').call(d3.axisLeft(yScale))

  // Customize y-axis labels to show only rankings
  yAxis
    .selectAll('text')
    .attr('font-size', '14px')
    .attr('fill', '#3b82f6')
    .attr('font-weight', 'bold')
    .text((d) => d as string) // Already formatted as #1, #2, etc.

  // Bars
  const bars = g
    .selectAll('.bar')
    .data(data)
    .enter()
    .append('g')
    .attr('class', 'bar')

  const rects = bars
    .append('rect')
    .attr('x', 0)
    .attr('y', (d, i) => yScale(`#${i + 1}`) || 0)
    .attr('width', 0)
    .attr('height', yScale.bandwidth())
    .attr('fill', 'url(#barGradient)')
    .attr('rx', 4)
    .style('cursor', 'pointer')
    .style('will-change', 'transform, opacity')
    .on('click', function (event, d) {
      if (onStreetClick) {
        onStreetClick(d.street_name)
      }
    })
    .on('mouseover', function (event, d) {
      const content = `
        <div style="font-weight: 600; margin-bottom: 4px;">${d.street_name}</div>
        <div>Businesses: <strong>${d.count.toLocaleString()}</strong></div>
      `
      showTooltip(event as MouseEvent, content)

      // Only apply hover effect if initial animation is complete or not in progress
      // Check if this specific bar's animation is done by checking its width
      const currentWidth = parseFloat(d3.select(this).attr('width') || '0')
      const targetWidth = xScale(d.count)
      const widthDiff = Math.abs(currentWidth - targetWidth)
      const isAnimationComplete = !animationState.inProgress || widthDiff < 2 || animationState.complete

      if (isAnimationComplete) {
        const selection = d3.select(this)
        if (selection.node()) {
          // Use a named transition that won't conflict with main animation
          selection
            .transition('hover-effect')
            .duration(200)
            .ease(d3.easeCubicOut)
            .attr('opacity', 0.85)
            .attr('filter', 'brightness(1.2)')

          g.selectAll('.bar rect')
            .filter(function (barData) {
              return barData !== d
            })
            .transition('hover-other')
            .duration(200)
            .ease(d3.easeCubicOut)
            .attr('opacity', 0.5)
        }
      }
    })
    .on('mouseleave', function () {
      hideTooltip()
      const selection = d3.select(this)
      if (selection.node()) {
        selection
          .transition('hover-out')
          .duration(200)
          .ease(d3.easeCubicOut)
          .attr('opacity', 1)
          .attr('filter', 'none')

        g.selectAll('.bar rect')
          .transition('hover-out-other')
          .duration(200)
          .ease(d3.easeCubicOut)
          .attr('opacity', 1)
      }
    })

  // Labels removed - numbers are not displayed on bars
  // Users can see the count in the tooltip on hover
  
  if (animate) {
    // Animate bars - use named transition to prevent hover interruption
    rects
      .transition('bar-animate-top')
      .duration(800)
      .delay((d, i) => i * 60)
      .ease(d3.easeCubicOut)
      .attr('width', (d) => xScale(d.count))
      .on('end', function (event, d, idx) {
        // Mark animation complete when last bar finishes
        if (idx === data.length - 1) {
          animationState.complete = true
          animationState.inProgress = false
        }
      })
      .on('interrupt', function() {
        // Continue animation if interrupted
        const rect = d3.select(this)
        const currentWidth = parseFloat(rect.attr('width') || '0')
        const targetWidth = xScale((rect.datum() as any).count)
        const progress = currentWidth / targetWidth
        const remainingDuration = 800 * (1 - progress)
        rect
          .transition('bar-animate-top-continue')
          .duration(Math.max(remainingDuration, 100))
          .ease(d3.easeCubicOut)
          .attr('width', targetWidth)
      })

    // No labels to animate - completion is tracked in bar animation on('end') callback
  } else {
    rects.attr('width', (d) => xScale(d.count))
    animationState.complete = true
    animationState.inProgress = false
  }
}

export default function BarChart({ topStreets, allStreets, onStreetClick }: BarChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [showAll, setShowAll] = useState(false)

  const displayStreets = showAll && allStreets ? allStreets : topStreets

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!svgRef.current || !containerRef.current || displayStreets.length === 0) return

    // Static render first
    renderBarChart(svgRef, containerRef, displayStreets, onStreetClick, false)

    // Animate every time chart enters viewport
    const cleanup = createScrollObserver(containerRef, () => {
      renderBarChart(svgRef, containerRef, displayStreets, onStreetClick, true)
    })

    return () => {
      if (cleanup) cleanup()
      const svg = d3.select(svgRef.current)
      svg.selectAll('*').interrupt()
      svg.selectAll('*').remove()
    }
  }, [displayStreets, onStreetClick])

  return (
    <ScrollSection className="bg-white rounded-xl shadow-lg p-6 mb-12" chartId="bar-chart-top-streets">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Top Areas by Business Density</h2>
      <div ref={containerRef} className="w-full overflow-x-auto">
        <svg ref={svgRef} className="w-full" style={{ willChange: 'transform' }} />
      </div>

      {allStreets && allStreets.length > topStreets.length && (
        <div className="mt-6">
          <button
            onClick={() => setShowAll(!showAll)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            {showAll ? (
              <>
                <ChevronUp className="w-5 h-5" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="w-5 h-5" />
                View All {allStreets.length} Areas
              </>
            )}
          </button>
        </div>
      )}
    </ScrollSection>
  )
}
