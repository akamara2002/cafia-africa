"use client"

import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import ScrollSection from './scroll-section'
import { createScrollObserver } from '@/lib/chart-observer'
import { showTooltip, hideTooltip } from '@/lib/d3-tooltip'

interface StackedBarData {
  street_name: string
  total: number
  breakdown: Record<string, number>
}

interface StackedBarChartProps {
  data: StackedBarData[]
  onStreetClick?: (street: string) => void
}

function renderStackedBarChart(
  svgRef: React.RefObject<SVGSVGElement>,
  containerRef: React.RefObject<HTMLDivElement>,
  data: StackedBarData[],
  onStreetClick?: (street: string) => void,
  animate: boolean = true
) {
  if (!svgRef.current || !containerRef.current || data.length === 0) return

  const svg = d3.select(svgRef.current)
  svg.selectAll('*').interrupt()
  svg.selectAll('*').remove()

  const containerWidth = containerRef.current.clientWidth
  const isMobile = containerWidth < 768
  const margin = isMobile ? { top: 36, right: 16, bottom: 52, left: 112 } : { top: 50, right: 50, bottom: 80, left: 220 }
  const width = containerWidth - margin.left - margin.right
  const height = Math.max(isMobile ? 420 : 500, data.length * (isMobile ? 36 : 45)) - margin.top - margin.bottom

  const g = svg
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .style('will-change', 'transform')
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)

  // Prepare stacked data
  const setupTypes = ['Shop', 'Table', 'Kiosk']
  const stack = d3.stack().keys(setupTypes)
  const stackedData = stack(
    data.map((d) => ({
      street: d.street_name,
      ...setupTypes.reduce((acc, key) => ({ ...acc, [key]: d.breakdown[key] || 0 }), {}),
    }))
  )

  // Scales
  const xScale = d3.scaleLinear().domain([0, d3.max(data, (d) => d.total) || 0]).range([0, width])
  const yScale = d3.scaleBand().domain(data.map((d) => d.street_name)).range([0, height]).padding(0.2)

  // Color scale
  const colors = ['#3b82f6', '#8b5cf6', '#ec4899']

  // Axes (static) - BOLD labels
  g.append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0, ${height})`)
    .call(d3.axisBottom(xScale).ticks(5))
    .selectAll('text')
    .attr('font-size', isMobile ? '10px' : '12px')
    .attr('font-weight', 'bold') // BOLD
    .attr('fill', '#64748b')

  g.append('g')
    .attr('class', 'y-axis')
    .call(d3.axisLeft(yScale))
    .selectAll('text')
    .attr('font-size', isMobile ? '9px' : '11px')
    .attr('font-weight', 'bold')
    .attr('fill', '#64748b')
    .attr('x', -10)
    .each(function(d) {
      // Truncate long street names to prevent overlap
      const text = d3.select(this)
      const textContent = text.text() as string
      const truncateAt = isMobile ? 10 : 18
      const trimTo = isMobile ? 8 : 15
      if (textContent && textContent.length > truncateAt) {
        text.text(textContent.substring(0, trimTo) + '...')
      }
    })

  // Legend removed from SVG - will be placed in card container

  // Create groups for each street
  const streetGroups = g
    .selectAll('.street-group')
    .data(data)
    .enter()
    .append('g')
    .attr('class', 'street-group')
    .attr('transform', (d) => `translate(0, ${yScale(d.street_name)})`)

  // Draw stacked bars
  const layers = streetGroups
    .selectAll('.layer')
    .data((d, i) =>
      stackedData.map((layer) => ({
        key: layer.key,
        values: layer[i],
        street: d.street_name,
        total: d.total,
      }))
    )
    .enter()
    .append('g')
    .attr('class', 'layer')

  const rects = layers
    .append('rect')
    .attr('x', (d) => xScale(d.values[0]))
    .attr('y', 0)
    .attr('width', 0)
    .attr('height', yScale.bandwidth())
    .attr('fill', (d, i) => colors[i % colors.length])
    .attr('rx', 4)
    .style('will-change', 'transform, opacity')
    .on('mouseover', function (event, d) {
      const segmentTotal = d.values[1] - d.values[0]
      const pct = d.total > 0 ? (segmentTotal / d.total) * 100 : 0
      const content = `
        <div style="font-weight: 600; margin-bottom: 4px;">${d.key} - ${d.street}</div>
        <div>Count: <strong>${segmentTotal.toLocaleString()}</strong></div>
        <div>Percentage: <strong>${pct.toFixed(1)}%</strong></div>
      `
      showTooltip(event as MouseEvent, content)

      // Use named transition for hover - won't interrupt main animation
      const selection = d3.select(this)
      if (selection.node()) {
        selection
          .transition('hover-effect-stacked')
          .duration(150)
          .ease(d3.easeCubicOut)
          .attr('opacity', 0.8)
          .attr('filter', 'brightness(1.2)')
      }
    })
    .on('mouseleave', function () {
      hideTooltip()
      // Use named transition for hover - won't interrupt main animation
      const selection = d3.select(this)
      if (selection.node()) {
        selection
          .transition('hover-out-stacked')
          .duration(150)
          .ease(d3.easeCubicOut)
          .attr('opacity', 1)
          .attr('filter', 'none')
      }
    })
    .on('click', (event, d) => {
      if (onStreetClick) {
        onStreetClick(d.street)
      }
    })

  // Add percentage labels INSIDE segments - show for all segments with enough space
  const labels = layers
    .filter((d) => {
      // Add null checks to prevent errors
      if (!d || !d.values || !Array.isArray(d.values) || d.values.length < 2) {
        return false
      }
      const segmentWidth = xScale(d.values[1]) - xScale(d.values[0])
      const segmentValue = d.values[1] - d.values[0]
      // Only show if segment is wide enough (at least 40px) and has value
      return segmentWidth > 40 && segmentValue > 0
    })
    .append('text')
    .attr('x', (d) => {
      if (!d || !d.values || !Array.isArray(d.values) || d.values.length < 2) {
        return 0
      }
      return xScale(d.values[0]) + (xScale(d.values[1]) - xScale(d.values[0])) / 2
    })
    .attr('y', yScale.bandwidth() / 2)
    .attr('dy', '0.35em')
    .attr('text-anchor', 'middle')
    .attr('font-size', '12px')
    .attr('font-weight', '600') // Softer than bold
    .attr('fill', '#f8fafc') // Softer white
    .attr('stroke', '#334155') // Softer dark gray
    .attr('stroke-width', '0.6px')
    .attr('paint-order', 'stroke fill')
    .text((d) => {
      // Add null checks to prevent errors
      if (!d || !d.values || !Array.isArray(d.values) || d.values.length < 2) {
        return ''
      }
      const val = d.values[1] - d.values[0]
      if (val <= 0) return ''
      const pct = d.total > 0 ? (val / d.total) * 100 : 0
      // Show percentage if > 3%, otherwise show count for small segments
      if (pct > 3) {
        return `${pct.toFixed(0)}%`
      } else if (val > 0) {
        return val.toString()
      }
      return ''
    })
    .attr('opacity', animate ? 0 : 1)

  if (animate) {
    rects.each(function (d, segmentIndex) {
      const rect = d3.select(this)
      const finalWidth = xScale(d.values[1]) - xScale(d.values[0])
      const startX = xScale(d.values[0])
      const barIndex = Math.floor(segmentIndex / setupTypes.length)
      const segmentInBar = segmentIndex % setupTypes.length

      // Main animation - use named transition to prevent hover interruption
      rect
        .transition('bar-animate-stacked')
        .duration(900)
        .delay(barIndex * 80 + segmentInBar * 60)
        .ease(d3.easeCubicOut)
        .attr('width', finalWidth)
        .on('end', function (event, d) {
          // Update label position after segment animation completes
          const label = d3.select(this.parentNode).select('text')
          if (!label.empty() && d && d.values && Array.isArray(d.values) && d.values.length >= 2) {
            const segmentWidth = xScale(d.values[1]) - xScale(d.values[0])
            const segmentValue = d.values[1] - d.values[0]
            // Only update if segment is wide enough
            if (segmentWidth > 40 && segmentValue > 0) {
              label.attr('x', xScale(d.values[0]) + segmentWidth / 2)
            }
          }
        })
        .on('interrupt', function () {
          // Continue animation if interrupted - calculate remaining duration
          const rect = d3.select(this)
          const currentWidth = parseFloat(rect.attr('width') || '0')
          const progress = currentWidth / finalWidth
          const remainingDuration = 900 * (1 - progress)
          rect
            .transition('bar-animate-stacked-continue')
            .duration(Math.max(remainingDuration, 100))
            .ease(d3.easeCubicOut)
            .attr('width', finalWidth)
        })
    })

    // Animate labels after bars complete - use named transition
    labels
      .transition('label-animate-stacked')
      .delay((d, i) => {
        const barIndex = Math.floor(i / setupTypes.length)
        const segmentInBar = i % setupTypes.length
        return barIndex * 80 + segmentInBar * 60 + 700
      })
      .duration(300)
      .attr('opacity', 1)
  } else {
    rects.attr('width', (d) => xScale(d.values[1]) - xScale(d.values[0]))
  }
}

export default function StackedBarChart({ data, onStreetClick }: StackedBarChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!svgRef.current || !containerRef.current || data.length === 0) return

    // Static render first
    renderStackedBarChart(svgRef, containerRef, data, onStreetClick, false)

    // Animate every time chart enters viewport
    const cleanup = createScrollObserver(containerRef, () => {
      renderStackedBarChart(svgRef, containerRef, data, onStreetClick, true)
    })

    return () => {
      if (cleanup) cleanup()
      const svg = d3.select(svgRef.current)
      svg.selectAll('*').interrupt()
      svg.selectAll('*').remove()
    }
  }, [data, onStreetClick])

  return (
    <ScrollSection className="bg-white rounded-xl shadow-lg p-4 sm:p-5 lg:p-6 mb-8 sm:mb-12" chartId="stacked-bar-chart">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-5 sm:mb-6">
        <h2 className="text-lg sm:text-2xl font-bold text-gray-900">Setup Type Distribution by Street</h2>
        {/* Legend in empty space - top right of card */}
        <div className="grid grid-cols-3 sm:flex sm:flex-col gap-2 sm:ml-4">
          <div className="text-xs font-bold text-gray-700 mb-1">Setup Type:</div>
          {['Shop', 'Table', 'Kiosk'].map((type, i) => {
            const colors = ['#3b82f6', '#8b5cf6', '#ec4899']
            return (
              <div key={type} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: colors[i] }}></div>
                <span className="text-xs font-bold text-gray-700">{type}</span>
              </div>
            )
          })}
        </div>
      </div>
      <div ref={containerRef} className="w-full overflow-x-auto overscroll-x-contain">
        <svg ref={svgRef} className="w-full min-w-[560px] md:min-w-0" style={{ willChange: 'transform' }} />
      </div>
    </ScrollSection>
  )
}
