import * as d3 from 'd3'

// Single shared tooltip instance
let tooltipInstance: d3.Selection<HTMLDivElement, unknown, null, undefined> | null = null

function getTooltip() {
  if (typeof window === 'undefined') return null

  if (!tooltipInstance) {
    tooltipInstance = d3
      .select('body')
      .append('div')
      .attr('class', 'cafia-tooltip')
      .style('opacity', 0)
      .style('pointer-events', 'none')
      .style('position', 'fixed')
      .style('z-index', '9999')
      .style('background', 'rgba(15, 20, 35, 0.92)')
      .style('backdrop-filter', 'blur(12px)')
      .style('-webkit-backdrop-filter', 'blur(12px)')
      .style('border', '1px solid rgba(255,255,255,0.08)')
      .style('border-radius', '10px')
      .style('padding', '12px 16px')
      .style('color', '#fff')
      .style('font-size', '13px')
      .style('line-height', '1.6')
      .style('max-width', '220px')
      .style('box-shadow', '0 8px 32px rgba(0,0,0,0.4)')
      .style('pointer-events', 'none')
  }

  return tooltipInstance
}

export function showTooltip(event: MouseEvent, content: string) {
  const tooltip = getTooltip()
  if (!tooltip) return

  tooltip
    .html(content)
    .style('opacity', '0')
    .style('transform', 'scale(0.88)')

  positionTooltip(event, tooltip)

  tooltip
    .transition()
    .duration(180)
    .ease(d3.easeBackOut)
    .style('opacity', '1')
    .style('transform', 'scale(1)')
}

function positionTooltip(
  event: MouseEvent,
  tooltip: d3.Selection<HTMLDivElement, unknown, null, undefined>
) {
  const node = tooltip.node()
  if (!node) return

  const tw = node.offsetWidth
  const th = node.offsetHeight
  const margin = 12

  let x = event.clientX + margin
  let y = event.clientY - th / 2

  // Prevent clipping outside viewport
  if (x + tw > window.innerWidth) {
    x = event.clientX - tw - margin
  }
  if (y < 0) {
    y = margin
  }
  if (y + th > window.innerHeight) {
    y = window.innerHeight - th - margin
  }

  tooltip.style('left', `${x}px`).style('top', `${y}px`)
}

export function hideTooltip() {
  const tooltip = getTooltip()
  if (!tooltip) return

  tooltip.transition().duration(120).style('opacity', '0')
}
