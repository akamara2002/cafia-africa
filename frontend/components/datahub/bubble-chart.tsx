"use client"

import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import ScrollSection from './scroll-section'
import UnifiedTooltip from './unified-tooltip'
import { useState } from 'react'

interface BubbleData {
  street_name: string
  total: number
  female_pct: number
  setup_diversity: number
}

interface BubbleChartProps {
  data: BubbleData[]
}

export default function BubbleChart({ data }: BubbleChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [tooltip, setTooltip] = useState<{
    visible: boolean
    x: number
    y: number
    label: string
    count: number
    percentage: number
  }>({
    visible: false,
    x: 0,
    y: 0,
    label: '',
    count: 0,
    percentage: 0,
  })

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || data.length === 0) return

    const margin = { top: 60, right: 60, bottom: 80, left: 80 }
    const width = containerRef.current.clientWidth - margin.left - margin.right
    const height = 500 - margin.top - margin.bottom

    d3.select(svgRef.current).selectAll('*').remove()

    const svg = d3
      .select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)

    // Filter out invalid data
    const validData = data.filter(d => 
      !isNaN(d.total) && !isNaN(d.female_pct) && !isNaN(d.setup_diversity) &&
      d.total >= 0 && d.female_pct >= 0 && d.female_pct <= 100 && d.setup_diversity >= 0
    )
    
    if (validData.length === 0) {
      return
    }

    // Scales
    const maxTotal = d3.max(validData, d => d.total) || 0
    const maxDiversity = d3.max(validData, d => d.setup_diversity) || 0
    
    const xScale = d3
      .scaleLinear()
      .domain([0, maxTotal])
      .range([0, width])
      .nice()

    const yScale = d3
      .scaleLinear()
      .domain([0, 100])
      .range([height, 0])
      .nice()

    const rScale = d3
      .scaleSqrt()
      .domain([0, maxDiversity])
      .range([8, 40])

    // Color scale based on female percentage
    const colorScale = d3
      .scaleSequential(d3.interpolateRdYlBu)
      .domain([100, 0])

    // Create force simulation for physics-based entrance
    const simulation = d3
      .forceSimulation(validData as any)
      .force('x', d3.forceX(d => {
        const x = xScale((d as any).total)
        return isNaN(x) ? width / 2 : x
      }).strength(0.3))
      .force('y', d3.forceY(d => {
        const y = yScale((d as any).female_pct)
        return isNaN(y) ? height / 2 : y
      }).strength(0.3))
      .force('collision', d3.forceCollide().radius(d => {
        const r = rScale((d as any).setup_diversity)
        return isNaN(r) ? 20 : r + 2
      }))
      .stop()

    // Run simulation
    for (let i = 0; i < 100; ++i) simulation.tick()

    // Draw bubbles
    const bubbles = svg
      .selectAll('.bubble')
      .data(validData)
      .enter()
      .append('g')
      .attr('class', 'bubble')

    bubbles
      .append('circle')
      .attr('r', 0)
      .attr('cx', d => {
        const x = xScale(d.total)
        return isNaN(x) ? width / 2 : x
      })
      .attr('cy', d => {
        const y = yScale(d.female_pct)
        return isNaN(y) ? height / 2 : y
      })
      .attr('fill', d => colorScale(d.female_pct) as string)
      .attr('opacity', 0.7)
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .on('mouseover', function (event, d) {
        const [x, y] = d3.pointer(event, containerRef.current)
        setTooltip({
          visible: true,
          x,
          y,
          label: d.street_name,
          count: d.total,
          percentage: d.female_pct,
        })
        d3.select(this)
          .transition()
          .duration(150)
          .attr('opacity', 0.9)
          .attr('r', rScale(d.setup_diversity) * 1.3)
      })
      .on('mouseleave', function (event, d) {
        setTooltip(prev => ({ ...prev, visible: false }))
        d3.select(this)
          .transition()
          .duration(150)
          .attr('opacity', 0.7)
          .attr('r', rScale(d.setup_diversity))
      })
      .transition()
      .delay((d, i) => i * 50)
      .duration(1500)
      .ease(d3.easeElasticOut)
      .attr('r', d => rScale(d.setup_diversity))
      .attr('opacity', 0.7)

    // Labels for large bubbles
    bubbles
      .filter(d => rScale(d.setup_diversity) > 20)
      .append('text')
      .attr('x', d => xScale(d.total))
      .attr('y', d => yScale(d.female_pct))
      .attr('dy', '0.35em')
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .attr('font-weight', '600')
      .attr('fill', '#1e293b')
      .text(d => d.street_name.split(' ')[0])
      .attr('opacity', 0)
      .transition()
      .delay((d, i) => i * 50 + 1200)
      .duration(300)
      .attr('opacity', 1)

    // Axes
    svg
      .append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(xScale).ticks(5))
      .selectAll('text')
      .attr('font-size', '11px')
      .attr('fill', '#64748b')

    svg
      .append('g')
      .call(d3.axisLeft(yScale).ticks(5))
      .selectAll('text')
      .attr('font-size', '11px')
      .attr('fill', '#64748b')

    // Axis labels
    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', height + 50)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('font-weight', '600')
      .attr('fill', '#1e293b')
      .text('Total Business Count')

    svg
      .append('text')
      .attr('x', -height / 2)
      .attr('y', -50)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('font-weight', '600')
      .attr('fill', '#1e293b')
      .attr('transform', 'rotate(-90)')
      .text('% Female Ownership')

    // Quadrant labels (subtle, faded)
    svg
      .append('text')
      .attr('x', width * 0.75)
      .attr('y', height * 0.2)
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .attr('fill', '#94a3b8')
      .attr('opacity', 0.5)
      .text('High density + High female')

    svg
      .append('text')
      .attr('x', width * 0.75)
      .attr('y', height * 0.8)
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .attr('fill', '#94a3b8')
      .attr('opacity', 0.5)
      .text('High density + Male dominated')
  }, [data])

  return (
    <ScrollSection className="bg-white rounded-xl shadow-lg p-6 mb-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Streets by Density vs Gender Diversity
      </h2>
      <div ref={containerRef} className="w-full overflow-x-auto">
        <svg ref={svgRef} className="w-full" />
      </div>
      <UnifiedTooltip
        label={tooltip.label}
        count={tooltip.count}
        percentage={tooltip.percentage}
        x={tooltip.x}
        y={tooltip.y}
        visible={tooltip.visible}
      />
    </ScrollSection>
  )
}
