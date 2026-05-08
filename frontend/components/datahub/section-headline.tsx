"use client"

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

interface SectionHeadlineProps {
  children: React.ReactNode
  className?: string
}

export default function SectionHeadline({ children, className = '' }: SectionHeadlineProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.3, margin: '-100px' })

  const words = typeof children === 'string' ? children.split(' ') : [children]

  return (
    <motion.h2
      ref={ref}
      className={`text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center ${className}`}
      style={{ willChange: 'transform, opacity' }}
    >
      {typeof children === 'string' ? (
        words.map((word, i) => (
          <motion.span
            key={i}
            className="inline-block mr-2"
            initial={{ opacity: 0, clipPath: 'inset(0 100% 0 0)' }}
            animate={
              isInView
                ? {
                    opacity: 1,
                    clipPath: 'inset(0 0% 0 0)',
                  }
                : {}
            }
            transition={{
              duration: 0.8,
              delay: i * 0.05,
              ease: [0.16, 1, 0.3, 1], // easeOutExpo
            }}
          >
            {word}
          </motion.span>
        ))
      ) : (
        children
      )}
    </motion.h2>
  )
}
