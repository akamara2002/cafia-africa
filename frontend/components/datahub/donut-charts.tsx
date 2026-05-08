"use client"

import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { createScrollObserver } from '@/lib/chart-observer'
import { showTooltip, hideTooltip } from '@/lib/d3-tooltip'

interface DonutChartProps {
  data: Array<{ label: string; value: number; percentage: number }>
  title: string
  colors: string[]
  delay?: number
  chartId: string
}

function renderDonutChart(
  svgRef: React.RefObject<SVGSVGElement>,
  data: Array<{ label: string; value: number; percentage: number }>,
  title: string,
  colors: string[],
  delay: number,
  animate: boolean = true
) {
  if (!svgRef.current || data.length === 0) return

  const svg = d3.select(svgRef.current)
  svg.selectAll('*').interrupt()
  svg.selectAll('*').remove()

  const width = 300
  const height = 300
  const radius = Math.min(width, height) / 2 - 20
  const innerRadius = radius * 0.6

  const g = svg
    .attr('width', width)
    .attr('height', height)
    .style('will-change', 'transform')
    .append('g')
    .attr('transform', `translate(${width / 2}, ${height / 2})`)

  const pie = d3
    .pie<{ label: string; value: number; percentage: number }>()
    .value((d) => d.value)
    .sort(null)

  const arc = d3
    .arc<d3.PieArcDatum<{ label: string; value: number; percentage: number }>>()
    .innerRadius(innerRadius)
    .outerRadius(radius)

  // Calculate pie data once
  const pieData = pie(data)
  
  const arcs = g
    .selectAll('.arc')
    .data(pieData)
    .enter()
    .append('g')
    .attr('class', 'arc')
    .attr('data-arc-index', (d, i) => i) // Store index for debugging

  const paths = arcs
    .append('path')
    .attr('fill', (d, i) => {
      // For gender data, map colors by label instead of index
      const label = (d.data as any).label
      if (title === 'Gender') {
        const genderColorMap: Record<string, string> = {
          'Female': '#ec4899',  // Pink
          'Male': '#3b82f6',   // Blue
          'Unknown': '#94a3b8' // Gray
        }
        return genderColorMap[label] || colors[i % colors.length]
      }
      return colors[i % colors.length]
    })
    .attr('stroke', '#fff')
    .attr('stroke-width', 2)
    .each(function (d) {
      // Store initial state
      ;(this as any)._current = { startAngle: 0, endAngle: 0 }
      // Store the original datum for reference
      ;(this as any)._datum = d
    })
    .on('mouseover', function (event, d) {
      const centroid = arc.centroid(d)
      const bisectorAngle = (d.startAngle + d.endAngle) / 2
      const translateX = Math.cos(bisectorAngle) * 10
      const translateY = Math.sin(bisectorAngle) * 10

      const content = `
        <div style="font-weight: 600; margin-bottom: 4px;">${(d.data as any).label}</div>
        <div>Count: <strong>${(d.data as any).value.toLocaleString()}</strong></div>
        <div>Percentage: <strong>${(d.data as any).percentage.toFixed(1)}%</strong></div>
      `
      showTooltip(event as MouseEvent, content)

      // Use named transition for hover - won't interrupt main animation
      d3.select(this)
        .transition('hover-transform')
        .duration(180)
        .ease(d3.easeBackOut)
        .attr('transform', `translate(${translateX}, ${translateY}) scale(1.05)`)
        .attr('opacity', 0.9)
    })
    .on('mouseleave', function () {
      hideTooltip()
      // Use named transition for hover - won't interrupt main animation
      d3.select(this)
        .transition('hover-out-transform')
        .duration(180)
        .attr('transform', 'translate(0, 0) scale(1)')
        .attr('opacity', 1)
    })

  // Add percentage labels INSIDE each slice - each slice gets its own label
  // CRITICAL: Create labels using data join to ensure proper binding
  const labelGroups = arcs.filter((d) => {
    const sliceData = d.data as any
    return sliceData && sliceData.percentage > 0 // Show all labels, even small ones
  })
  
  labelGroups.each(function(d, i) {
    const arcGroup = d3.select(this)
    const sliceData = d.data as any
    
    // CRITICAL: Use arc.centroid() which correctly calculates the centroid of THIS specific slice
    // This is the D3-recommended way to position labels in pie/donut charts
    const centroid = arc.centroid(d)
    const x = centroid[0]
    const y = centroid[1]
    
    // Create label for THIS slice only - bind it to this specific datum
    const label = arcGroup
      .append('text')
      .attr('class', 'slice-percentage-label')
      .datum(d) // Bind the pie datum to the label
      .attr('data-slice-index', i)
      .attr('data-slice-label', sliceData.label) // Store label for debugging
      .attr('text-anchor', 'middle')
      .attr('x', x)
      .attr('y', y)
      .attr('dy', '0.35em')
      .attr('font-size', () => {
        // Adjust font size based on slice size
        const sliceSize = d.endAngle - d.startAngle
        if (sliceSize < 0.3) return '11px'
        if (sliceSize < 0.6) return '12px'
        return '13px'
      })
      .attr('font-weight', '500') // Lighter weight
      .attr('fill', '#f1f5f9') // Softer white
      .attr('stroke', '#475569') // Softer gray stroke
      .attr('stroke-width', '0.5px')
      .attr('paint-order', 'stroke fill')
      .attr('pointer-events', 'none')
      .text(`${sliceData.percentage.toFixed(1)}%`)
      .attr('opacity', 0)
    
    // Store the calculated position on the label element for reference
    const labelNode = label.node()
    if (labelNode) {
      (labelNode as any)._position = { x, y, label: sliceData.label }
    }
  })

  if (animate) {
    // Main animation - use named transition to prevent hover from interrupting
    paths
      .transition('donut-animate')
      .duration(1200)
      .delay((d, i) => delay + i * 120)
      .ease(d3.easeElasticOut)
      .attrTween('d', function (d) {
        const interpolate = d3.interpolate((this as any)._current, d)
        ;(this as any)._current = d
        return (t) => arc(interpolate(t)) || ''
      })
      .attr('opacity', 1)
      .on('end', function (event, d) {
        // Update label position after THIS slice's animation completes
        // CRITICAL: Use arc.centroid() with THIS slice's datum to get correct position
        const arcGroup = d3.select(this.parentNode)
        const label = arcGroup.select('.slice-percentage-label')
        
        if (!label.empty() && d && d.data) {
          const sliceData = d.data as any
          // Use arc.centroid() which correctly calculates THIS slice's centroid
          const centroid = arc.centroid(d)
          const x = centroid[0]
          const y = centroid[1]
          
          // Update THIS label's position to THIS slice's centroid
          label
            .attr('x', x)
            .attr('y', y)
            // Store position for debugging
            .each(function() {
              (this as any)._position = { x, y, label: sliceData.label }
            })
        }
      })
      .on('interrupt', function() {
        // If interrupted, continue from current state
        const current = (this as any)._current
        if (current) {
          d3.select(this)
            .transition('donut-animate-continue')
            .duration(1200 - (d3.select(this).node() as any).__transition?.duration || 0)
            .ease(d3.easeElasticOut)
            .attrTween('d', function() {
              const final = d3.select(this).datum() as any
              const interpolate = d3.interpolate(current, final)
              return (t) => arc(interpolate(t)) || ''
            })
        }
      })
    
    // Animate labels after slices - each label animates independently at its slice's position
    // CRITICAL: Iterate through arcs and animate each label using its own datum
    arcs.each(function(d, i) {
      const arcGroup = d3.select(this)
      const label = arcGroup.select('.slice-percentage-label')
      const sliceData = d.data as any
      
      if (!label.empty() && sliceData) {
        // CRITICAL: Use arc.centroid() with THIS slice's datum to get correct position
        // This ensures each label goes to its own slice's centroid
        const centroid = arc.centroid(d)
        const x = centroid[0]
        const y = centroid[1]
        
        // Animate THIS label to THIS slice's unique position
        label
          .transition('slice-label-animate')
          .delay(delay + i * 120 + 1200)
          .duration(500)
          .ease(d3.easeCubicOut)
          .attr('opacity', 1)
          .attr('x', x) // THIS slice's x position from centroid
          .attr('y', y) // THIS slice's y position from centroid
          .on('end', function() {
            // Ensure opacity stays at 1 and position is correct
            d3.select(this)
              .attr('opacity', 1)
              .attr('x', x)
              .attr('y', y)
          })
      }
    })
  } else {
    paths.attr('d', arc).attr('opacity', 1)
    // For static render, position each label at its slice's centroid
    // CRITICAL: Use arc.centroid() with each arc's own datum
    arcs.each(function(d, i) {
      const arcGroup = d3.select(this)
      const label = arcGroup.select('.slice-percentage-label')
      const sliceData = d.data as any
      
      if (!label.empty() && sliceData) {
        // Use arc.centroid() which correctly calculates THIS slice's centroid
        const centroid = arc.centroid(d)
        const x = centroid[0]
        const y = centroid[1]
        
        // Position THIS label at THIS slice's centroid
        label
          .attr('x', x)
          .attr('y', y)
          .attr('opacity', 1)
      }
    })
  }

  // Center labels - improved spacing to prevent overlap
  const total = data.reduce((sum, d) => sum + d.value, 0)
  const centerLabel = g
    .append('text')
    .attr('text-anchor', 'middle')
    .attr('dy', '-0.8em')
    .attr('font-size', '20px')
    .attr('font-weight', 'bold')
    .attr('fill', '#1e293b')
    .text(title)
    .attr('opacity', 0)

  const countLabel = g
    .append('text')
    .attr('text-anchor', 'middle')
    .attr('dy', '0.5em')
    .attr('font-size', '16px')
    .attr('font-weight', 'bold')
    .attr('fill', '#64748b')
    .text('0')
    .attr('opacity', 0)

  if (animate) {
    centerLabel
      .transition('center-label')
      .delay(delay + 800)
      .duration(500)
      .attr('opacity', 1)

    countLabel
      .transition('count-label')
      .delay(delay + 1000)
      .duration(600)
      .attr('opacity', 1)
      .tween('text', function () {
        const i = d3.interpolateNumber(0, total)
        return function (t) {
          d3.select(this).text(Math.floor(i(t)).toLocaleString())
        }
      })
  } else {
    centerLabel.attr('opacity', 1)
    countLabel.text(total.toLocaleString()).attr('opacity', 1)
  }

  // Percentages are now shown inside slices, center shows total only
}

function DonutChart({ data, title, colors, delay = 0, chartId }: DonutChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!svgRef.current || !containerRef.current || data.length === 0) return

    // Static render first
    renderDonutChart(svgRef, data, title, colors, delay, false)

    // Animate every time chart enters viewport
    const cleanup = createScrollObserver(containerRef, () => {
      renderDonutChart(svgRef, data, title, colors, delay, true)
    })

    return () => {
      if (cleanup) cleanup()
      const svg = d3.select(svgRef.current)
      svg.selectAll('*').interrupt()
      svg.selectAll('*').remove()
    }
  }, [data, title, colors, delay, chartId])

  return (
    <div ref={containerRef} className="flex flex-col items-center relative">
      <svg ref={svgRef} className="mb-4" style={{ willChange: 'transform' }} />
      {/* Legend in empty space - positioned absolutely in card */}
      <div className="absolute top-4 right-4 flex flex-col gap-1.5 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-sm">
        {data.map((d, i) => {
          // For gender, map colors by label instead of index
          let color = colors[i % colors.length]
          if (title === 'Gender') {
            const genderColorMap: Record<string, string> = {
              'Female': '#ec4899',  // Pink
              'Male': '#3b82f6',   // Blue
              'Unknown': '#94a3b8' // Gray
            }
            color = genderColorMap[d.label] || color
          }
          return (
            <div key={d.label} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded flex-shrink-0" style={{ backgroundColor: color }}></div>
              <span className="text-xs font-bold text-gray-700 whitespace-nowrap">{d.label} ({d.percentage.toFixed(1)}%)</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

interface DonutChartsProps {
  setupData: Array<{ setup_type: string; count: number; percentage: number }>
  activityData: Array<{ activity_type: string; count: number; percentage: number }>
  genderData: Array<{ gender: string; count: number; percentage: number }>
}

export default function DonutCharts({ setupData, activityData, genderData }: DonutChartsProps) {
  const setupColors = ['#3b82f6', '#8b5cf6', '#ec4899']
  const activityColors = ['#10b981', '#f59e0b', '#ef4444']
  const genderColors = ['#3b82f6', '#ec4899', '#94a3b8']

  const setupChartData = setupData.length > 0 ? setupData.map((d) => ({
    label: d.setup_type,
    value: d.count,
    percentage: d.percentage,
  })) : []

  const activityChartData = activityData.length > 0 ? activityData.map((d) => ({
    label: d.activity_type,
    value: d.count,
    percentage: d.percentage,
  })) : []

  const genderChartData = genderData.length > 0 ? genderData.map((d) => ({
    label: d.gender,
    value: d.count,
    percentage: d.percentage,
  })) : []

  const charts = []
  if (setupChartData.length > 0) {
    charts.push({ data: setupChartData, title: 'Setup', colors: setupColors, delay: 0, id: 'donut-setup' })
  }
  if (activityChartData.length > 0) {
    charts.push({ data: activityChartData, title: 'Activity', colors: activityColors, delay: 150, id: 'donut-activity' })
  }
  if (genderChartData.length > 0) {
    charts.push({ data: genderChartData, title: 'Gender', colors: genderColors, delay: 300, id: 'donut-gender' })
  }

  if (charts.length === 0) return null

  return (
    <div className={`grid grid-cols-1 ${charts.length > 1 ? 'md:grid-cols-2' : ''} ${charts.length === 3 ? 'lg:grid-cols-3' : ''} gap-8 mb-12`}>
      {charts.map((chart) => (
        <div key={chart.id} className="bg-white rounded-xl shadow-lg p-6 relative">
          <DonutChart data={chart.data} title={chart.title} colors={chart.colors} delay={chart.delay} chartId={chart.id} />
        </div>
      ))}
    </div>
  )
}
