"use client"

import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import ScrollSection from './scroll-section'
import { createScrollObserver } from '@/lib/chart-observer'
import { showTooltip, hideTooltip } from '@/lib/d3-tooltip'

interface DivergingBarData {
  street_name: string
  total: number
  female: number
  male: number
  female_pct: number
  male_pct: number
}

interface DivergingBarChartProps {
  data: DivergingBarData[]
}

function renderDivergingBarChart(
  svgRef: React.RefObject<SVGSVGElement>,
  containerRef: React.RefObject<HTMLDivElement>,
  data: DivergingBarData[],
  animate: boolean = true
) {
  if (!svgRef.current || !containerRef.current || data.length === 0) return

  const svg = d3.select(svgRef.current)
  svg.selectAll('*').interrupt()
  svg.selectAll('*').remove()

  const margin = { top: 80, right: 60, bottom: 40, left: 240 }
  const width = containerRef.current.clientWidth - margin.left - margin.right
  const height = Math.max(600, data.length * 45) - margin.top - margin.bottom
  const centerX = width / 2

  const g = svg
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .style('will-change', 'transform')
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)

  // Scales
  const maxPct = Math.max(...data.map((d) => Math.max(d.female_pct, d.male_pct)))
  const xScale = d3.scaleLinear().domain([-maxPct, maxPct]).range([0, width])
  const yScale = d3.scaleBand().domain(data.map((d) => d.street_name)).range([0, height]).padding(0.2)

  // Center line (static)
  g.append('line')
    .attr('x1', centerX)
    .attr('x2', centerX)
    .attr('y1', 0)
    .attr('y2', height)
    .attr('stroke', '#cbd5e1')
    .attr('stroke-width', 1)
    .attr('stroke-dasharray', '4,4')

  // Center label (static) - BOLD
  g.append('text')
    .attr('x', centerX)
    .attr('y', -10)
    .attr('text-anchor', 'middle')
    .attr('font-size', '12px')
    .attr('font-weight', 'bold') // BOLD
    .attr('fill', '#64748b')
    .text('50%')

  // Axes (static) - BOLD labels
  g.append('g')
    .attr('class', 'y-axis')
    .call(d3.axisLeft(yScale))
    .selectAll('text')
    .attr('font-size', '11px')
    .attr('font-weight', 'bold')
    .attr('fill', '#64748b')
    .attr('x', -10) // Add spacing to prevent overlap
    .each(function(d) {
      // Truncate long street names to prevent overlap
      const text = d3.select(this)
      const textContent = text.text() as string
      if (textContent && textContent.length > 20) {
        text.text(textContent.substring(0, 17) + '...')
      }
    })

  const xAxis = d3.axisBottom(xScale).tickFormat((d) => `${Math.abs(d as number)}%`).ticks(5)

  g.append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0, ${height})`)
    .call(xAxis)
    .selectAll('text')
    .attr('font-size', '11px')
    .attr('font-weight', 'bold') // BOLD
    .attr('fill', '#64748b')

  // Legend removed from SVG - will be placed in card container

  // Bars
  const bars = g
    .selectAll('.bar-group')
    .data(data)
    .enter()
    .append('g')
    .attr('class', 'bar-group')
    .attr('transform', (d) => `translate(0, ${yScale(d.street_name)})`)

  // Female bars (left side)
  const femaleBars = bars
    .append('rect')
    .attr('x', centerX)
    .attr('y', 0)
    .attr('width', 0)
    .attr('height', yScale.bandwidth())
    .attr('fill', (d) => (d.female_pct > 50 ? '#ec4899' : '#f472b6'))
    .attr('rx', 4)
    .style('will-change', 'transform, opacity')
    .on('mouseover', function (event, d) {
      const content = `
        <div style="font-weight: 600; margin-bottom: 4px;">Female - ${d.street_name}</div>
        <div>Count: <strong>${d.female.toLocaleString()}</strong></div>
        <div>Percentage: <strong>${d.female_pct.toFixed(1)}%</strong></div>
      `
      showTooltip(event as MouseEvent, content)
      // Use named transition for hover - won't interrupt main animation
      d3.select(this)
        .transition('hover-opacity-female')
        .duration(150)
        .attr('opacity', 0.8)
    })
    .on('mouseleave', function () {
      hideTooltip()
      // Use named transition for hover - won't interrupt main animation
      d3.select(this)
        .transition('hover-out-opacity-female')
        .duration(150)
        .attr('opacity', 1)
    })

  // Male bars (right side)
  const maleBars = bars
    .append('rect')
    .attr('x', centerX)
    .attr('y', 0)
    .attr('width', 0)
    .attr('height', yScale.bandwidth())
    .attr('fill', (d) => (d.male_pct > 50 ? '#3b82f6' : '#60a5fa'))
    .attr('rx', 4)
    .style('will-change', 'transform, opacity')
    .on('mouseover', function (event, d) {
      const content = `
        <div style="font-weight: 600; margin-bottom: 4px;">Male - ${d.street_name}</div>
        <div>Count: <strong>${d.male.toLocaleString()}</strong></div>
        <div>Percentage: <strong>${d.male_pct.toFixed(1)}%</strong></div>
      `
      showTooltip(event as MouseEvent, content)
      // Use named transition for hover - won't interrupt main animation
      d3.select(this)
        .transition('hover-opacity-male')
        .duration(150)
        .attr('opacity', 0.8)
    })
    .on('mouseleave', function () {
      hideTooltip()
      // Use named transition for hover - won't interrupt main animation
      d3.select(this)
        .transition('hover-out-opacity-male')
        .duration(150)
        .attr('opacity', 1)
    })

  // Add percentage labels INSIDE bars
  const femaleLabels = bars
    .append('text')
    .attr('x', (d) => {
      const barLeft = xScale(-d.female_pct)
      const barWidth = centerX - barLeft
      // Position label inside bar, 10px from right edge (center)
      return Math.max(centerX - 10, barLeft + 10)
    })
    .attr('y', yScale.bandwidth() / 2)
    .attr('dy', '0.35em')
    .attr('text-anchor', 'end')
    .attr('font-size', '12px')
    .attr('font-weight', '600') // Softer than bold
    .attr('fill', '#f8fafc') // Softer white
    .attr('stroke', '#334155') // Softer dark gray
    .attr('stroke-width', '0.6px')
    .attr('paint-order', 'stroke fill')
    .text((d) => {
      // Only show if bar is wide enough
      const barWidth = centerX - xScale(-d.female_pct)
      return barWidth > 35 && d.female_pct > 1 ? `${d.female_pct.toFixed(0)}%` : ''
    })
    .attr('opacity', animate ? 0 : 1)

  const maleLabels = bars
    .append('text')
    .attr('x', (d) => {
      const barRight = xScale(d.male_pct)
      const barWidth = barRight - centerX
      // Position label inside bar, 10px from left edge (center)
      return Math.min(centerX + 10, barRight - 10)
    })
    .attr('y', yScale.bandwidth() / 2)
    .attr('dy', '0.35em')
    .attr('text-anchor', 'start')
    .attr('font-size', '12px')
    .attr('font-weight', '600') // Softer than bold
    .attr('fill', '#f8fafc') // Softer white
    .attr('stroke', '#334155') // Softer dark gray
    .attr('stroke-width', '0.6px')
    .attr('paint-order', 'stroke fill')
    .text((d) => {
      // Only show if bar is wide enough
      const barWidth = xScale(d.male_pct) - centerX
      return barWidth > 35 && d.male_pct > 1 ? `${d.male_pct.toFixed(0)}%` : ''
    })
    .attr('opacity', animate ? 0 : 1)

  if (animate) {
    // Animate female bars (left side) - use named transition to prevent hover interruption
    femaleBars.each(function (d, i) {
      const bar = d3.select(this)
      const finalWidth = centerX - xScale(-d.female_pct)
      bar
        .transition('bar-animate-female')
        .duration(900)
        .delay(i * 80)
        .ease(d3.easeCubicOut)
        .attr('width', finalWidth)
        .attr('x', xScale(-d.female_pct))
        .on('end', function () {
          // Update label position after bar animation completes
          const label = d3.select(this.parentNode).select('text').filter(function() {
            return d3.select(this).attr('text-anchor') === 'end'
          })
          if (!label.empty()) {
            const barLeft = xScale(-d.female_pct)
            const barWidth = centerX - barLeft
            label.attr('x', Math.max(centerX - 10, barLeft + 10))
          }
        })
        .on('interrupt', function() {
          // Continue animation if interrupted
          const currentWidth = parseFloat(bar.attr('width') || '0')
          const progress = currentWidth / finalWidth
          const remainingDuration = 900 * (1 - progress)
          bar
            .transition('bar-animate-female-continue')
            .duration(remainingDuration)
            .ease(d3.easeCubicOut)
            .attr('width', finalWidth)
            .attr('x', xScale(-d.female_pct))
        })
    })

    // Animate male bars (right side) - use named transition to prevent hover interruption
    maleBars.each(function (d, i) {
      const bar = d3.select(this)
      const finalWidth = xScale(d.male_pct) - centerX
      bar
        .transition('bar-animate-male')
        .duration(900)
        .delay(i * 80)
        .ease(d3.easeCubicOut)
        .attr('width', finalWidth)
        .on('end', function () {
          // Update label position after bar animation completes
          const label = d3.select(this.parentNode).select('text').filter(function() {
            return d3.select(this).attr('text-anchor') === 'start'
          })
          if (!label.empty()) {
            const barRight = xScale(d.male_pct)
            const barWidth = barRight - centerX
            label.attr('x', Math.min(centerX + 10, barRight - 10))
          }
        })
        .on('interrupt', function() {
          // Continue animation if interrupted
          const currentWidth = parseFloat(bar.attr('width') || '0')
          const progress = currentWidth / finalWidth
          const remainingDuration = 900 * (1 - progress)
          bar
            .transition('bar-animate-male-continue')
            .duration(remainingDuration)
            .ease(d3.easeCubicOut)
            .attr('width', finalWidth)
        })
    })

    // Animate labels after bars complete - use named transition
    femaleLabels
      .transition('label-animate-female')
      .delay((d, i) => i * 80 + 700)
      .duration(300)
      .attr('opacity', 1)

    maleLabels
      .transition('label-animate-male')
      .delay((d, i) => i * 80 + 700)
      .duration(300)
      .attr('opacity', 1)
  } else {
    femaleBars
      .attr('width', (d) => centerX - xScale(-d.female_pct))
      .attr('x', (d) => xScale(-d.female_pct))
    maleBars.attr('width', (d) => xScale(d.male_pct) - centerX)
  }
}

export default function DivergingBarChart({ data }: DivergingBarChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!svgRef.current || !containerRef.current || data.length === 0) return

    // Static render first
    renderDivergingBarChart(svgRef, containerRef, data, false)

    // Animate every time chart enters viewport
    const cleanup = createScrollObserver(containerRef, () => {
      renderDivergingBarChart(svgRef, containerRef, data, true)
    })

    return () => {
      if (cleanup) cleanup()
      const svg = d3.select(svgRef.current)
      svg.selectAll('*').interrupt()
      svg.selectAll('*').remove()
    }
  }, [data])

  return (
    <ScrollSection className="bg-white rounded-xl shadow-lg p-6 mb-12" chartId="diverging-bar-chart">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Gender Distribution by Street</h2>
        {/* Legend in empty space - top right of card */}
        <div className="flex flex-col gap-2 ml-4">
          <div className="text-xs font-bold text-gray-700 mb-1">Gender:</div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-pink-500"></div>
            <span className="text-xs font-bold text-gray-700">Female</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-blue-500"></div>
            <span className="text-xs font-bold text-gray-700">Male</span>
          </div>
        </div>
      </div>
      <div ref={containerRef} className="w-full overflow-x-auto">
        <svg ref={svgRef} className="w-full" style={{ willChange: 'transform' }} />
      </div>
    </ScrollSection>
  )
}
