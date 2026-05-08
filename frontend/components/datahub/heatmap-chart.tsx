"use client"

import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import ScrollSection from './scroll-section'
import { createScrollObserver } from '@/lib/chart-observer'
import { showTooltip, hideTooltip } from '@/lib/d3-tooltip'

interface HeatmapData {
  data: Record<string, Record<string, { count: number; pct: number }>>
  total: number
}

interface HeatmapChartProps {
  data: HeatmapData
}

function renderHeatmapChart(
  svgRef: React.RefObject<SVGSVGElement>,
  containerRef: React.RefObject<HTMLDivElement>,
  heatmapData: HeatmapData,
  animate: boolean = true
) {
  if (!svgRef.current || !containerRef.current || !heatmapData.data) return

  const svg = d3.select(svgRef.current)
  svg.selectAll('*').interrupt()
  svg.selectAll('*').remove()

  const margin = { top: 80, right: 40, bottom: 80, left: 140 } // Increased margins for labels
  const width = containerRef.current.clientWidth - margin.left - margin.right
  const height = 400 - margin.top - margin.bottom

  const g = svg
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .style('will-change', 'transform')
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)

  const setupTypes = Object.keys(heatmapData.data)
  const genders = ['Female', 'Male', 'Unknown']

  const cellWidth = width / setupTypes.length
  const cellHeight = height / genders.length

  // Color scale - use gender-specific colors (pink for Female, blue for Male, gray for Unknown)
  const maxValue = Math.max(
    ...Object.values(heatmapData.data).flatMap((row) => Object.values(row).map((cell) => cell.count))
  )
  
  // Gender-specific color scales - DEEP vibrant colors matching other sections
  const genderColorScales: Record<string, (t: number) => string> = {
    'Female': d3.scaleSequential((t) => {
      // Pink scale: deep pink-500 to very deep pink-700
      return d3.interpolateRgb('#ec4899', '#be185d')(t)
    }).domain([0, maxValue]),
    'Male': d3.scaleSequential((t) => {
      // Blue scale: deep blue-500 to very deep blue-800
      return d3.interpolateRgb('#3b82f6', '#1e40af')(t)
    }).domain([0, maxValue]),
    'Unknown': d3.scaleSequential((t) => {
      // Gray scale: medium gray to dark gray
      return d3.interpolateRgb('#94a3b8', '#64748b')(t)
    }).domain([0, maxValue])
  }
  
  // Ensure minimum color depth - even low values get deep colors
  const colorScale = (count: number, gender: string) => {
    const scale = genderColorScales[gender] || genderColorScales['Unknown']
    // Use at least 0.4 (40%) of the scale to ensure deep, vibrant colors even for low values
    const normalizedValue = Math.max(0.4, count / maxValue)
    return scale(normalizedValue)
  }

  // Create cells
  const cells: Array<{
    setup: string
    gender: string
    count: number
    pct: number
    x: number
    y: number
  }> = []

  setupTypes.forEach((setup, i) => {
    genders.forEach((gender, j) => {
      const cellData = heatmapData.data[setup]?.[gender]
      if (cellData) {
        cells.push({
          setup,
          gender,
          count: cellData.count,
          pct: cellData.pct,
          x: i * cellWidth,
          y: j * cellHeight,
        })
      }
    })
  })

  // X-axis (static) - positioned with proper spacing
  const xScale = d3.scaleBand().domain(setupTypes).range([0, width]).padding(0.1)

  g.append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0, ${height})`)
    .call(d3.axisBottom(xScale))
    .selectAll('text')
    .attr('font-size', '11px')
    .attr('fill', '#64748b')
    .attr('font-weight', 'bold')
    .style('text-anchor', 'middle')

  // Y-axis (static) - positioned with proper spacing
  const yScale = d3.scaleBand().domain(genders).range([0, height]).padding(0.1)

  g.append('g')
    .attr('class', 'y-axis')
    .call(d3.axisLeft(yScale))
    .selectAll('text')
    .attr('font-size', '11px')
    .attr('fill', '#64748b')
    .attr('font-weight', 'bold')

  // Column label (static) - positioned above chart
  g.append('text')
    .attr('x', width / 2)
    .attr('y', -50)
    .attr('text-anchor', 'middle')
    .attr('font-size', '12px')
    .attr('font-weight', 'bold')
    .attr('fill', '#64748b')
    .text('Setup Type')

  // Row label (static) - positioned to the left
  g.append('text')
    .attr('x', -70)
    .attr('y', height / 2)
    .attr('text-anchor', 'middle')
    .attr('font-size', '12px')
    .attr('font-weight', 'bold')
    .attr('fill', '#64748b')
    .attr('transform', `rotate(-90, -70, ${height / 2})`)
    .text('Gender')

  // Legend in top-right corner - BOLD labels
  const legend = g.append('g').attr('transform', `translate(${width - 120}, -70)`)

  // Gender legend
  legend.append('text')
    .attr('x', 0)
    .attr('y', 0)
    .attr('font-size', '12px')
    .attr('font-weight', 'bold')
    .attr('fill', '#64748b')
    .text('Gender:')

  const genderColors = ['#ec4899', '#3b82f6', '#94a3b8'] // Female, Male, Unknown
  genders.forEach((gender, i) => {
    const legendItem = legend.append('g').attr('transform', `translate(0, ${(i + 1) * 20})`)
    legendItem
      .append('rect')
      .attr('width', 12)
      .attr('height', 12)
      .attr('fill', genderColors[i])
      .attr('rx', 2)
    legendItem
      .append('text')
      .attr('x', 18)
      .attr('y', 9)
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .attr('fill', '#64748b')
      .text(gender)
  })

  // Draw cells - using band scales for proper spacing
  const cellRects = g
    .selectAll('.cell')
    .data(cells)
    .enter()
    .append('rect')
    .attr('class', 'cell')
    .attr('x', (d) => xScale(d.setup) || 0)
    .attr('y', (d) => yScale(d.gender) || 0)
    .attr('width', xScale.bandwidth())
    .attr('height', yScale.bandwidth())
    .attr('fill', (d) => colorScale(d.count, d.gender))
    .attr('stroke', '#fff')
    .attr('stroke-width', 2)
    .attr('opacity', animate ? 0 : 1)
    .style('will-change', 'transform, opacity')
    .on('mouseover', function (event, d) {
      const content = `
        <div style="font-weight: 500; margin-bottom: 4px;">${d.gender} × ${d.setup}</div>
        <div>Count: <strong>${d.count.toLocaleString()}</strong></div>
        <div>Percentage: <strong>${d.pct.toFixed(1)}%</strong></div>
      `
      showTooltip(event as MouseEvent, content)
      // Use named transition for hover - won't interrupt main animation
      d3.select(this)
        .transition('hover-heatmap')
        .duration(150)
        .attr('stroke', '#3b82f6')
        .attr('stroke-width', 3)
        .attr('filter', 'brightness(1.1) drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))')
    })
    .on('mouseleave', function () {
      hideTooltip()
      // Use named transition for hover - won't interrupt main animation
      d3.select(this)
        .transition('hover-out-heatmap')
        .duration(150)
        .attr('stroke', '#fff')
        .attr('stroke-width', 2)
        .attr('filter', 'none')
    })

  // Cell labels - positioned in center, BOLD, show count and percentage
  const cellLabels = g
    .selectAll('.cell-label')
    .data(cells)
    .enter()
    .append('g')
    .attr('class', 'cell-label')
    .attr('transform', (d) => {
      const x = (xScale(d.setup) || 0) + xScale.bandwidth() / 2
      const y = (yScale(d.gender) || 0) + yScale.bandwidth() / 2
      return `translate(${x}, ${y})`
    })
    .attr('pointer-events', 'none') // Prevent labels from interfering with hover
  
  // Count label (top line)
  cellLabels
    .append('text')
    .attr('dy', '-0.3em')
    .attr('text-anchor', 'middle')
    .attr('font-size', '12px')
    .attr('font-weight', '600')
    .attr('fill', '#f8fafc')
    .attr('stroke', '#334155')
    .attr('stroke-width', '0.6px')
    .attr('stroke-width', '1px')
    .attr('paint-order', 'stroke fill')
    .text((d) => {
      if (!d || d.count === 0) return ''
      return d.count.toLocaleString()
    })
    .attr('opacity', animate ? 0 : (d) => (d && d.count > 0) ? 1 : 0)
  
  // Percentage label (bottom line)
  cellLabels
    .append('text')
    .attr('dy', '0.9em')
    .attr('text-anchor', 'middle')
    .attr('font-size', '12px')
    .attr('font-weight', '600')
    .attr('fill', '#f8fafc')
    .attr('stroke', '#334155')
    .attr('stroke-width', '0.6px')
    .attr('stroke-width', '0.8px')
    .attr('paint-order', 'stroke fill')
    .text((d) => {
      if (!d || d.count === 0) return ''
      return `${d.pct.toFixed(1)}%`
    })
    .attr('opacity', animate ? 0 : (d) => (d && d.count > 0) ? 1 : 0)

  if (animate) {
    cellRects.each(function(d, index) {
      // Find the matching cell in the cells array
      const cellIndex = cells.findIndex(cell => 
        cell.setup === d.setup && cell.gender === d.gender
      )
      if (cellIndex === -1) return
      
      const row = Math.floor(cellIndex / setupTypes.length)
      const col = cellIndex % setupTypes.length
      const cellRect = d3.select(this)
      const cellLabelGroup = cellLabels.filter((labelData, i) => i === cellIndex)

      // Main animation - smooth fade in with scale effect
      cellRect
        .transition('heatmap-animate')
        .delay(row * 100 + col * 40)
        .duration(500)
        .ease(d3.easeBackOut.overshoot(0.5))
        .attr('opacity', 1)
        .on('interrupt', function() {
          // Continue animation if interrupted
          const cell = d3.select(this)
          const currentOpacity = parseFloat(cell.attr('opacity') || '0')
          const progress = currentOpacity
          const remainingDuration = 500 * (1 - progress)
          cell
            .transition('heatmap-animate-continue')
            .duration(Math.max(remainingDuration, 50))
            .ease(d3.easeBackOut.overshoot(0.5))
            .attr('opacity', 1)
        })

      // Animate label group after cell - use named transition
      if (!cellLabelGroup.empty()) {
        const labelTexts = cellLabelGroup.selectAll('text')
        if (!labelTexts.empty()) {
          labelTexts
            .transition('heatmap-label-animate')
            .delay(row * 100 + col * 40 + 400)
            .duration(400)
            .ease(d3.easeCubicOut)
            .attr('opacity', 1)
            .on('end', function() {
              // Ensure opacity stays at 1
              d3.select(this).attr('opacity', 1)
            })
        }
      }
    })
  } else {
    // Static render - ensure labels are visible
    cellLabels.selectAll('text').each(function(d) {
      if (d && d.count > 0) {
        d3.select(this).attr('opacity', 1)
      }
    })
  }
}

export default function HeatmapChart({ data: heatmapData }: HeatmapChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!svgRef.current || !containerRef.current || !heatmapData.data) return

    // Static render first
    renderHeatmapChart(svgRef, containerRef, heatmapData, false)

    // Animate every time chart enters viewport
    const cleanup = createScrollObserver(containerRef, () => {
      renderHeatmapChart(svgRef, containerRef, heatmapData, true)
    })

    return () => {
      if (cleanup) cleanup()
      const svg = d3.select(svgRef.current)
      svg.selectAll('*').interrupt()
      svg.selectAll('*').remove()
    }
  }, [heatmapData])

  return (
    <ScrollSection className="bg-white rounded-xl shadow-lg p-6 mb-12" chartId="heatmap-chart">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Gender × Setup Type Concentration</h2>
      <div ref={containerRef} className="w-full overflow-x-auto">
        <svg ref={svgRef} className="w-full" style={{ willChange: 'transform' }} />
      </div>
    </ScrollSection>
  )
}
