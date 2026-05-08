"use client"

import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import ScrollSection from './scroll-section'
import { createScrollObserver } from '@/lib/chart-observer'
import { showTooltip, hideTooltip } from '@/lib/d3-tooltip'

interface TreemapData {
  setup_type: string
  activity_type: string
  count: number
}

interface TreemapChartProps {
  data: TreemapData[]
}

function renderTreemapChart(
  svgRef: React.RefObject<SVGSVGElement>,
  containerRef: React.RefObject<HTMLDivElement>,
  data: TreemapData[],
  animate: boolean = true
) {
  if (!svgRef.current || !containerRef.current || data.length === 0) return

  const svg = d3.select(svgRef.current)
  svg.selectAll('*').interrupt()
  svg.selectAll('*').remove()

  const margin = { top: 60, right: 20, bottom: 20, left: 20 }
  const width = containerRef.current.clientWidth - margin.left - margin.right
  const height = 600 - margin.top - margin.bottom

  const g = svg
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .style('will-change', 'transform')
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)

  // Get unique setup types and activity types
  const setupTypes = Array.from(new Set(data.map((d) => d.setup_type))).filter(Boolean)
  const colorScale = d3.scaleOrdinal().domain(setupTypes).range(['#3b82f6', '#8b5cf6', '#ec4899'])

  // Group data by setup_type, then by activity_type
  const groupedData = setupTypes.map((setupType) => {
    const activities = data
      .filter((d) => d.setup_type === setupType)
      .map((d) => ({
        name: d.activity_type || 'Unknown',
        value: d.count || 0,
        setup_type: setupType,
      }))
      .filter((d) => d.value > 0)

    return {
      name: setupType,
      children: activities,
    }
  }).filter((group) => group.children.length > 0)

  if (groupedData.length === 0) {
    // Show message if no data
    g.append('text')
      .attr('x', width / 2)
      .attr('y', height / 2)
      .attr('text-anchor', 'middle')
      .attr('font-size', '16px')
      .attr('font-weight', 'bold')
      .attr('fill', '#64748b')
      .text('No data available')
    return
  }

  const total = data.reduce((sum, d) => sum + (d.count || 0), 0)

  // Create hierarchy
  const root = d3
    .hierarchy({
      name: 'root',
      children: groupedData,
    })
    .sum((d) => (d as any).value || 0)
    .sort((a, b) => (b.value || 0) - (a.value || 0))

  const treemap = d3.treemap().size([width, height]).padding(4).round(true)
  treemap(root)

  const leaves = (root.leaves() || []).filter((d) => {
    return (
      d &&
      !isNaN(d.x0 || 0) &&
      !isNaN(d.y0 || 0) &&
      !isNaN(d.x1 || 0) &&
      !isNaN(d.y1 || 0) &&
      (d.x1 || 0) > (d.x0 || 0) &&
      (d.y1 || 0) > (d.y0 || 0)
    )
  })

  if (leaves.length === 0) {
    g.append('text')
      .attr('x', width / 2)
      .attr('y', height / 2)
      .attr('text-anchor', 'middle')
      .attr('font-size', '16px')
      .attr('font-weight', 'bold')
      .attr('fill', '#64748b')
      .text('No data available')
    return
  }

  // Center point for animation
  const centerX = width / 2
  const centerY = height / 2

  // Draw rectangles - sorted by size
  const sortedLeaves = leaves.sort((a, b) => (b.value || 0) - (a.value || 0))

  const cells = g
    .selectAll('.cell')
    .data(sortedLeaves)
    .enter()
    .append('g')
    .attr('class', 'cell')
    .attr('transform', animate ? `translate(${centerX}, ${centerY})` : (d) => `translate(${d.x0 || 0}, ${d.y0 || 0})`)
    .style('will-change', 'transform, opacity')

  const rects = cells
    .append('rect')
    .attr('width', animate ? 0 : (d) => Math.max(0, ((d.x1 || 0) - (d.x0 || 0))))
    .attr('height', animate ? 0 : (d) => Math.max(0, ((d.y1 || 0) - (d.y0 || 0))))
    .attr('fill', (d) => {
      const setupType = (d.data as any)?.setup_type || (d.parent?.data as any)?.name
      return (colorScale(setupType) as string) || '#94a3b8'
    })
    .attr('stroke', '#fff')
    .attr('stroke-width', 2)
    .attr('opacity', animate ? 0 : 1)
    .on('mouseover', function (event, d) {
      const pct = total > 0 ? (((d.value || 0) / total) * 100) : 0
      const setupType = (d.data as any)?.setup_type || (d.parent?.data as any)?.name
      const activityName = (d.data as any)?.name || 'Unknown'
      const content = `
        <div style="font-weight: 600; margin-bottom: 4px;">${activityName}</div>
        <div style="color: ${colorScale(setupType)}; margin-bottom: 4px;">Setup: <strong>${setupType}</strong></div>
        <div>Count: <strong>${(d.value || 0).toLocaleString()}</strong></div>
        <div>Percentage: <strong>${pct.toFixed(1)}%</strong></div>
      `
      showTooltip(event as MouseEvent, content)

      d3.select(this)
        .transition()
        .duration(150)
        .attr('opacity', 0.8)
        .attr('stroke', '#1e293b')
        .attr('stroke-width', 3)
    })
    .on('mouseleave', function () {
      hideTooltip()
      d3.select(this)
        .transition()
        .duration(150)
        .attr('opacity', 1)
        .attr('stroke', '#fff')
        .attr('stroke-width', 2)
    })

  // Labels - removed white color, use dark color for visibility
  const labels = cells
    .filter((d) => {
      const w = (d.x1 || 0) - (d.x0 || 0)
      const h = (d.y1 || 0) - (d.y0 || 0)
      return w > 80 && h > 40 && !isNaN(w) && !isNaN(h)
    })
    .append('text')
    .attr('x', 0)
    .attr('y', 0)
    .attr('dy', '0.35em')
    .attr('text-anchor', 'middle')
    .attr('font-size', '12px')
    .attr('font-weight', 'bold')
    .attr('fill', '#1e293b') // Changed from white to dark for visibility
    .text((d) => (d.data as any)?.name || 'Unknown')
    .attr('opacity', animate ? 0 : 1)

  const valueLabels = cells
    .filter((d) => {
      const w = (d.x1 || 0) - (d.x0 || 0)
      const h = (d.y1 || 0) - (d.y0 || 0)
      return w > 80 && h > 50 && !isNaN(w) && !isNaN(h)
    })
    .append('text')
    .attr('x', 0)
    .attr('y', 18)
    .attr('dy', '0.35em')
    .attr('text-anchor', 'middle')
    .attr('font-size', '11px')
    .attr('font-weight', 'bold')
    .attr('fill', '#64748b') // Changed from white to gray for visibility
    .text((d) => (d.value || 0).toLocaleString())
    .attr('opacity', animate ? 0 : 1)

  // Setup type labels for each group
  const setupGroups = root.children || []
  setupGroups.forEach((group) => {
    const groupLeaves = group.leaves() || []
    if (groupLeaves.length === 0) return

    // Find bounding box for this setup type group
    const groupX0 = Math.min(...groupLeaves.map((d) => d.x0 || 0))
    const groupY0 = Math.min(...groupLeaves.map((d) => d.y0 || 0))
    const groupX1 = Math.max(...groupLeaves.map((d) => d.x1 || 0))
    const groupY1 = Math.max(...groupLeaves.map((d) => d.y1 || 0))

    // Add setup type label at top of group
    g.append('text')
      .attr('x', groupX0 + (groupX1 - groupX0) / 2)
      .attr('y', groupY0 - 5)
      .attr('text-anchor', 'middle')
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .attr('fill', colorScale((group.data as any)?.name) as string)
      .text((group.data as any)?.name || 'Unknown')
      .attr('opacity', animate ? 0 : 1)
  })

  // Legend in top-right corner - BOLD labels
  const legend = g.append('g').attr('transform', `translate(${width - 150}, -45)`)

  legend.append('text')
    .attr('x', 0)
    .attr('y', 0)
    .attr('font-size', '13px')
    .attr('font-weight', 'bold')
    .attr('fill', '#1e293b')
    .text('Setup Types:')

  setupTypes.forEach((type, i) => {
    const legendItem = legend.append('g').attr('transform', `translate(0, ${(i + 1) * 20})`)
    legendItem
      .append('rect')
      .attr('width', 14)
      .attr('height', 14)
      .attr('fill', colorScale(type) as string)
      .attr('rx', 2)
      .attr('stroke', '#fff')
      .attr('stroke-width', 1)
    legendItem
      .append('text')
      .attr('x', 20)
      .attr('y', 10)
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .attr('fill', '#64748b')
      .text(type)
  })

  // Description text - BOLD
  g.append('text')
    .attr('x', width / 2)
    .attr('y', -35)
    .attr('text-anchor', 'middle')
    .attr('font-size', '13px')
    .attr('font-weight', 'bold') // BOLD
    .attr('fill', '#64748b')
    .text('Each rectangle represents an activity type. Size = number of businesses.')
    .attr('opacity', animate ? 0 : 1)

  if (animate) {
    cells.each(function (d, i) {
      const cell = d3.select(this)
      const finalX = d.x0 || 0
      const finalY = d.y0 || 0
      const finalWidth = Math.max(0, (d.x1 || 0) - (d.x0 || 0))
      const finalHeight = Math.max(0, (d.y1 || 0) - (d.y0 || 0))

      // Animate transform from center to final position
      cell
        .transition()
        .delay(i * 50)
        .duration(1200)
        .ease(d3.easeExpOut)
        .attr('transform', `translate(${finalX}, ${finalY})`)
        .attr('opacity', 1)

      // Animate rect dimensions
      cell
        .select('rect')
        .transition()
        .delay(i * 50)
        .duration(1200)
        .ease(d3.easeExpOut)
        .attr('width', finalWidth)
        .attr('height', finalHeight)
        .attr('opacity', 1)

      // Animate labels
      const label = cell.select('text').filter(function () {
        return d3.select(this).attr('dy') === '0.35em' && d3.select(this).attr('y') === '0'
      })
      if (!label.empty()) {
        label
          .transition()
          .delay(i * 50 + 1000)
          .duration(300)
          .attr('opacity', 1)
      }

      const valueLabel = cell.select('text').filter(function () {
        return d3.select(this).attr('dy') === '0.35em' && d3.select(this).attr('y') === '18'
      })
      if (!valueLabel.empty()) {
        valueLabel
          .transition()
          .delay(i * 50 + 1100)
          .duration(300)
          .attr('opacity', 1)
      }
    })

    // Animate setup type labels
    g.selectAll('text')
      .filter(function () {
        return d3.select(this).attr('y') === '-5'
      })
      .transition()
      .delay(800)
      .duration(400)
      .attr('opacity', 1)

    // Animate description
    g.selectAll('text')
      .filter(function () {
        return d3.select(this).attr('y') === '-35'
      })
      .transition()
      .delay(600)
      .duration(400)
      .attr('opacity', 1)
  }
}

export default function TreemapChart({ data }: TreemapChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!svgRef.current || !containerRef.current || data.length === 0) return

    // Static render first
    renderTreemapChart(svgRef, containerRef, data, false)

    // Animate every time chart enters viewport
    const cleanup = createScrollObserver(containerRef, () => {
      renderTreemapChart(svgRef, containerRef, data, true)
    })

    return () => {
      if (cleanup) cleanup()
      const svg = d3.select(svgRef.current)
      svg.selectAll('*').interrupt()
      svg.selectAll('*').remove()
    }
  }, [data])

  return (
    <ScrollSection className="bg-white rounded-xl shadow-lg p-6 mb-12" chartId="treemap-chart">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Activity Type Nested in Setup Type</h2>
      <p className="text-sm font-bold text-gray-600 mb-6">
        This visualization shows how different activity types (Retail, Services, etc.) are distributed across setup types (Shop, Table, Kiosk). 
        The size of each rectangle represents the number of businesses.
      </p>
      <div ref={containerRef} className="w-full">
        <svg ref={svgRef} className="w-full" style={{ willChange: 'transform' }} />
      </div>
    </ScrollSection>
  )
}
