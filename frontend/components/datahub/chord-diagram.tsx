"use client"

import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import ScrollSection from './scroll-section'
import UnifiedTooltip from './unified-tooltip'
import { useState } from 'react'

interface ChordData {
  street_name: string
  setup_type: string
  count: number
}

interface ChordDiagramProps {
  data: ChordData[]
}

function ChordDiagram({ data }: ChordDiagramProps) {
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
    // Only run on client side
    if (typeof window === 'undefined') return
    if (!svgRef.current || !containerRef.current || data.length === 0) return
    
    // Validate data has required fields
    const validData = data.filter(d => 
      d.street_name && d.setup_type && typeof d.count === 'number' && d.count > 0
    )
    if (validData.length === 0) return

    const margin = { top: 40, right: 40, bottom: 40, left: 40 }
    const width = containerRef.current.clientWidth - margin.left - margin.right
    const height = Math.min(width, 600) - margin.top - margin.bottom
    const radius = Math.min(width, height) / 2 - 40

    d3.select(svgRef.current).selectAll('*').remove()

    const svg = d3
      .select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${(width + margin.left + margin.right) / 2}, ${(height + margin.top + margin.bottom) / 2})`)

    // Prepare matrix data
    const streets = Array.from(new Set(validData.map(d => d.street_name))).slice(0, 10)
    const setupTypes = Array.from(new Set(validData.map(d => d.setup_type)))
    
    // Validate we have data
    if (streets.length === 0 || setupTypes.length === 0) {
      return
    }
    
    const matrix: number[][] = []
    streets.forEach(() => {
      matrix.push(new Array(setupTypes.length).fill(0))
    })
    
    validData.forEach(d => {
      const streetIdx = streets.indexOf(d.street_name)
      const setupIdx = setupTypes.indexOf(d.setup_type)
      if (streetIdx >= 0 && setupIdx >= 0 && d.count > 0) {
        matrix[streetIdx][setupIdx] += d.count
      }
    })

    // Validate matrix has non-zero values
    const totalSum = matrix.flat().reduce((sum, val) => sum + val, 0)
    if (totalSum === 0) {
      return
    }

    // Create chord layout
    const chord = d3.chord()
      .padAngle(0.05)
      .sortSubgroups(d3.descending)

    const chords = chord(matrix)
    
    // Validate chord data
    if (!chords || chords.length === 0 || !chords.groups || chords.groups.length === 0) {
      return
    }

    // Color scales
    const streetColors = d3.scaleOrdinal(d3.schemeCategory10)
    const setupColors = d3.scaleOrdinal(['#3b82f6', '#8b5cf6', '#ec4899'])

    // Group arcs (outer)
    const group = svg
      .append('g')
      .selectAll('.group')
      .data(chords.groups)
      .enter()
      .append('g')
      .attr('class', 'group')

    const arc = d3.arc()
      .innerRadius(radius)
      .outerRadius(radius + 20)

    const paths = group
      .append('path')
      .attr('fill', (d, i) => {
        if (i < streets.length) {
          return streetColors(i.toString()) as string
        }
        return setupColors((i - streets.length).toString()) as string
      })
      .attr('d', (d) => {
        // Validate arc data to prevent NaN
        if (isNaN(d.startAngle) || isNaN(d.endAngle) || isNaN(radius)) {
          return ''
        }
        const path = arc(d)
        return path || ''
      })
      .attr('opacity', 0)
      .on('mouseover', function (event, d) {
        d3.select(this).transition().duration(150).attr('opacity', 1)
        // Highlight related chords
        svg.selectAll('.chord').transition().duration(150).attr('opacity', (cd: any) => {
          return cd.source.index === d.index || cd.target.index === d.index ? 0.9 : 0.1
        })
      })
      .on('mouseleave', function () {
        d3.select(this).transition().duration(150).attr('opacity', 0.7)
        svg.selectAll('.chord').transition().duration(150).attr('opacity', 0.6)
      })

    // Apply transition after event handlers are attached
    paths
      .transition()
      .delay((d, i) => i * 100)
      .duration(800)
      .ease(d3.easeCubicInOut)
      .attr('opacity', 0.7)

    // Group labels
    group
      .append('text')
      .each(function (d) {
        d.angle = (d.startAngle + d.endAngle) / 2
      })
      .attr('dy', '.35em')
      .attr('transform', d => `
        rotate(${(d.angle * 180) / Math.PI - 90})
        translate(${radius + 30})
        ${d.angle > Math.PI ? 'rotate(180)' : ''}
      `)
      .attr('text-anchor', d => (d.angle > Math.PI ? 'end' : null))
      .attr('font-size', '10px')
      .attr('font-weight', '600')
      .attr('fill', '#64748b')
      .text((d, i) => {
        if (i < streets.length) {
          return streets[i].split(' ')[0]
        }
        return setupTypes[i - streets.length]
      })
      .attr('opacity', 0)
      .transition()
      .delay((d, i) => i * 100 + 600)
      .duration(300)
      .attr('opacity', 1)

    // Chords (connections)
    const ribbon = d3.ribbon()
      .radius(radius)

    const chordPaths = svg
      .append('g')
      .attr('class', 'chords')
      .selectAll('.chord')
      .data(chords)
      .enter()
      .append('path')
      .attr('class', 'chord')
      .attr('d', (d) => {
        // Validate ribbon data to prevent NaN
        if (!d || !d.source || !d.target) return ''
        if (isNaN(d.source.startAngle) || isNaN(d.source.endAngle) || 
            isNaN(d.target.startAngle) || isNaN(d.target.endAngle) || 
            isNaN(radius)) {
          return ''
        }
        const path = ribbon(d)
        return path || ''
      })
      .attr('fill', d => {
        if (d.source.index < streets.length) {
          return streetColors(d.source.index.toString()) as string
        }
        return setupColors((d.source.index - streets.length).toString()) as string
      })
      .attr('opacity', 0)
      .on('mouseover', function (event, d) {
        if (!d || !d.source || !d.target) return
        try {
          const [x, y] = d3.pointer(event, containerRef.current)
          const sourceLabel = d.source.index < streets.length 
            ? streets[d.source.index] 
            : setupTypes[d.source.index - streets.length]
          const targetLabel = d.target.index < streets.length 
            ? streets[d.target.index] 
            : setupTypes[d.target.index - streets.length]
          
          setTooltip({
            visible: true,
            x,
            y,
            label: `${sourceLabel} → ${targetLabel}`,
            count: d.source.value || 0,
            percentage: 0,
          })
          
          d3.select(this).transition().duration(150).attr('opacity', 1).attr('stroke', '#1e293b').attr('stroke-width', 2)
          svg.selectAll('.chord').filter((cd: any) => cd !== d).transition().duration(150).attr('opacity', 0.1)
        } catch (e) {
          console.error('Error in chord mouseover:', e)
        }
      })
      .on('mouseleave', function () {
        setTooltip(prev => ({ ...prev, visible: false }))
        d3.select(this).transition().duration(150).attr('opacity', 0.6).attr('stroke', 'none')
        svg.selectAll('.chord').transition().duration(150).attr('opacity', 0.6)
      })

    // Apply transition after event handlers are attached
    chordPaths
      .transition()
      .delay((d, i) => i * 30)
      .duration(1800)
      .ease(d3.easeCubicInOut)
      .attr('opacity', 0.6)
  }, [data])
  
  // Early return if no valid data
  if (!data || data.length === 0) {
    return (
      <ScrollSection className="bg-white rounded-xl shadow-lg p-6 mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Street ↔ Setup Type Relationships
        </h2>
        <div className="text-center text-gray-500 py-12">
          No relationship data available
        </div>
      </ScrollSection>
    )
  }

  return (
    <ScrollSection className="bg-white rounded-xl shadow-lg p-6 mb-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Street ↔ Setup Type Relationships
      </h2>
      <div ref={containerRef} className="w-full">
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

export default ChordDiagram
