"use client"

import { motion, useScroll } from "framer-motion"

export default function ReadingProgressBar() {
  const { scrollYProgress } = useScroll()

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-indigo-500/90 z-[100] origin-left"
      style={{ scaleX: scrollYProgress }}
    />
  )
}
