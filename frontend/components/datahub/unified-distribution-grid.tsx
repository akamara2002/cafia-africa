"use client"

import { useRef, useEffect } from 'react'
import * as d3 from 'd3'
import DonutCharts from './donut-charts'
import ScrollSection from './scroll-section'
import { createScrollObserver } from '@/lib/chart-observer'
import { showTooltip, hideTooltip } from '@/lib/d3-tooltip'

interface DistributionData {
  setup_type?: string
  activity_type?: string
  gender?: string
  count: number
  percentage: number
}

interface UnifiedDistributionGridProps {
  setupData: DistributionData[]
  activityData: DistributionData[]
  genderData: DistributionData[]
}

// Vertical Bar Chart Render Function for Activity
function renderActivityBarChart(
  svgRef: React.RefObject<SVGSVGElement>,
  containerRef: React.RefObject<HTMLDivElement>,
  data: DistributionData[],
  animate: boolean = true
) {
  if (!svgRef.current || !containerRef.current || data.length === 0) return

  const svg = d3.select(svgRef.current)
  svg.selectAll('*').interrupt()
  svg.selectAll('*').remove()

  const containerWidth = containerRef.current.clientWidth
  const isMobile = containerWidth < 768
  const margin = isMobile ? { top: 18, right: 8, bottom: 52, left: 34 } : { top: 30, right: 20, bottom: 50, left: 50 }
  const width = containerWidth - margin.left - margin.right
  const height = (isMobile ? 220 : 250) - margin.top - margin.bottom

  const g = svg
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .style('will-change', 'transform')
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)

  // Scales - ensure data is properly formatted
  const formattedData = data.map((d) => ({
    activity_type: d.activity_type || '',
    count: d.count || 0,
    percentage: d.percentage || 0,
  }))

  const xScale = d3
    .scaleBand()
    .domain(formattedData.map((d) => d.activity_type))
    .range([0, width])
    .padding(0.2)

  const maxValue = d3.max(formattedData, (d) => d.count) || 0
  const yScale = d3.scaleLinear().domain([0, maxValue]).range([height, 0])

  // Bars
  const bars = g
    .selectAll('.bar')
    .data(formattedData)
    .enter()
    .append('g')
    .attr('class', 'bar')

  const rects = bars
    .append('rect')
    .attr('x', (d) => xScale(d.activity_type) || 0)
    .attr('y', height)
    .attr('width', xScale.bandwidth())
    .attr('height', 0)
    .attr('fill', (d, i) => {
      const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b']
      return colors[i % colors.length]
    })
    .attr('rx', 4)
    .style('will-change', 'transform, height')
    .style('cursor', 'pointer')
    .on('mouseover', function (event, d) {
      const content = `
        <div style="font-weight: 600; margin-bottom: 4px;">${d.activity_type}</div>
        <div>Count: <strong>${d.count.toLocaleString()}</strong></div>
        <div>Percentage: <strong>${d.percentage.toFixed(1)}%</strong></div>
      `
      showTooltip(event as MouseEvent, content)
      
      // Hover effect - only if animation is complete
      d3.select(this)
        .transition('hover-activity')
        .duration(150)
        .attr('opacity', 0.85)
        .attr('filter', 'brightness(1.15)')
    })
    .on('mouseleave', function () {
      hideTooltip()
      d3.select(this)
        .transition('hover-out-activity')
        .duration(150)
        .attr('opacity', 1)
        .attr('filter', 'none')
    })

  // Labels inside bars - softer typography
  const labels = bars
    .append('text')
    .attr('x', (d) => (xScale(d.activity_type) || 0) + xScale.bandwidth() / 2)
    .attr('y', height)
    .attr('dy', '-0.5em')
    .attr('text-anchor', 'middle')
    .attr('font-size', isMobile ? '10px' : '12px')
    .attr('font-weight', '500') // Lighter weight
    .attr('fill', '#f1f5f9') // Softer white
    .attr('stroke', '#475569') // Softer gray stroke
    .attr('stroke-width', '0.5px')
    .attr('paint-order', 'stroke fill')
    .attr('pointer-events', 'none')
    .text((d) => `${d.percentage.toFixed(1)}%`)
    .attr('opacity', animate ? 0 : 1)

  // X-axis
  g.append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(d3.axisBottom(xScale))
    .selectAll('text')
    .attr('font-size', isMobile ? '9px' : '10px')
    .attr('fill', '#64748b')
    .attr('font-weight', 'bold')
    .attr('text-anchor', 'middle')
    .text((d) => {
      // Truncate long labels
      const label = d as string
      return isMobile && label.length > 9 ? label.substring(0, 7) + '...' : label.length > 12 ? label.substring(0, 10) + '...' : label
    })

  // Y-axis
  g.append('g')
    .call(d3.axisLeft(yScale).ticks(5))
    .selectAll('text')
    .attr('font-size', isMobile ? '10px' : '11px')
    .attr('fill', '#64748b')
    .attr('font-weight', 'bold')

  if (animate) {
    rects
      .transition('bar-animate-activity')
      .duration(800)
      .delay((d, i) => i * 100)
      .ease(d3.easeCubicOut)
      .attr('y', (d) => yScale(d.count))
      .attr('height', (d) => height - yScale(d.count))
      .on('end', function (event, d) {
        const label = d3.select(this.parentNode).select('text')
        if (!label.empty()) {
          const barHeight = height - yScale(d.count)
          label.attr('y', yScale(d.count) + (barHeight > 30 ? 20 : barHeight / 2))
        }
      })

    labels
      .transition('label-animate-activity')
      .delay((d, i) => i * 100 + 600)
      .duration(400)
      .ease(d3.easeCubicOut)
      .attr('opacity', 1)
      .attr('y', function (d) {
        const barHeight = height - yScale(d.count)
        return yScale(d.count) + (barHeight > 30 ? 20 : barHeight / 2)
      })
  } else {
    rects
      .attr('y', (d) => yScale(d.count))
      .attr('height', (d) => height - yScale(d.count))
    labels
      .attr('y', function (d) {
        const barHeight = height - yScale(d.count)
        return yScale(d.count) + (barHeight > 30 ? 20 : barHeight / 2)
      })
      .attr('opacity', 1)
  }
}

export default function UnifiedDistributionGrid({
  setupData,
  activityData,
  genderData,
}: UnifiedDistributionGridProps) {
  const activityContainerRef = useRef<HTMLDivElement>(null)
  const activitySvgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!activityContainerRef.current || !activitySvgRef.current || activityData.length === 0) return

    // Static render first
    renderActivityBarChart(activitySvgRef, activityContainerRef, activityData, false)

    // Animate on scroll
    const cleanup = createScrollObserver(activityContainerRef, () => {
      renderActivityBarChart(activitySvgRef, activityContainerRef, activityData, true)
    })

    return cleanup
  }, [activityData])

  return (
    <ScrollSection className="mb-12" chartId="unified-distribution-grid">
      {/* Main Grid - All cards same height */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
        {/* Business Setup - Donut Chart */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 lg:p-6 flex flex-col h-full">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Business Setup</h3>
          <p className="text-sm text-gray-600 mb-4 font-bold leading-relaxed">
            How traders organize their operations across different setup types.
          </p>
          <div className="flex-1 flex items-center justify-center">
            <DonutCharts setupData={setupData} activityData={[]} genderData={[]} />
          </div>
        </div>

        {/* Activity - Vertical Bar Chart */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 lg:p-6 flex flex-col h-full">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Activity Type</h3>
          <p className="text-sm text-gray-600 mb-4 font-bold leading-relaxed">
            Retail dominates, but services are growing in pockets of the city.
          </p>
          <div className="flex-1 flex flex-col relative">
            <div ref={activityContainerRef} className="w-full flex items-center overflow-hidden">
              <svg ref={activitySvgRef} className="w-full" style={{ willChange: 'transform' }} />
            </div>
            <div className="mt-3 md:mt-0 md:absolute md:top-4 md:right-4 flex flex-col gap-1.5 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-sm border border-slate-100 max-h-44 overflow-y-auto">
              {activityData.map((d, i) => {
                const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b']
                return (
                  <div key={d.activity_type || i} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded flex-shrink-0" style={{ backgroundColor: colors[i % colors.length] }}></div>
                    <span className="text-xs font-bold text-gray-700 whitespace-nowrap">{d.activity_type} ({d.percentage.toFixed(1)}%)</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Gender - Donut Chart */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 lg:p-6 flex flex-col h-full">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Gender Distribution</h3>
          <p className="text-sm text-gray-600 mb-4 font-bold leading-relaxed">
            Female ownership patterns across the informal economy.
          </p>
          <div className="flex-1 flex items-center justify-center">
            <DonutCharts setupData={[]} activityData={[]} genderData={genderData} />
          </div>
        </div>
      </div>
    </ScrollSection>
  )
}
