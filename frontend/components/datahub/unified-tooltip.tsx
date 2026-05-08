"use client"

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface TooltipProps {
  label: string
  count: number
  percentage?: number
  additionalInfo?: string
  icon?: React.ReactNode
  x: number
  y: number
  visible: boolean
}

export default function UnifiedTooltip({
  label,
  count,
  percentage,
  additionalInfo,
  icon,
  x,
  y,
  visible,
}: TooltipProps) {
  const tooltipRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (!tooltipRef.current || !visible) return

    const tooltip = tooltipRef.current
    const rect = tooltip.getBoundingClientRect()
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    let adjustedX = x + 10
    let adjustedY = y + 10

    // Prevent clipping on right edge
    if (adjustedX + rect.width > viewportWidth) {
      adjustedX = x - rect.width - 10
    }

    // Prevent clipping on bottom edge
    if (adjustedY + rect.height > viewportHeight) {
      adjustedY = y - rect.height - 10
    }

    // Prevent clipping on left edge
    if (adjustedX < 0) {
      adjustedX = 10
    }

    // Prevent clipping on top edge
    if (adjustedY < 0) {
      adjustedY = 10
    }

    setPosition({ x: adjustedX, y: adjustedY })
  }, [x, y, visible])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          ref={tooltipRef}
          className="fixed z-[9999] pointer-events-none"
          style={{
            left: position.x,
            top: position.y,
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="bg-white/90 backdrop-blur-md rounded-lg shadow-xl border border-gray-200 p-4 min-w-[200px]">
            <div className="flex items-center gap-2 mb-2">
              {icon && <div className="text-blue-600">{icon}</div>}
              <h4 className="font-semibold text-gray-900 text-sm">{label}</h4>
            </div>
            <div className="border-t border-gray-200 pt-2 space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Count:</span>
                <span className="text-sm font-bold text-gray-900">{count.toLocaleString()}</span>
              </div>
              {percentage !== undefined && (
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">% of Total:</span>
                  <span className="text-sm font-semibold text-blue-600">{percentage.toFixed(1)}%</span>
                </div>
              )}
              {additionalInfo && (
                <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-100">
                  {additionalInfo}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
