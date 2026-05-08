"use client"

import { useState, useRef, useEffect } from "react"
import { motion, useMotionTemplate, useMotionValue, useReducedMotion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import type { BlogArticleMeta } from "@/lib/blog-data"

interface BlogCardProps {
  article: BlogArticleMeta
  index: number
  isVisible?: boolean
}

export default function BlogCard({ article, index, isVisible = true }: BlogCardProps) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const glow = useMotionTemplate`radial-gradient(500px circle at ${x}px ${y}px, rgba(99, 102, 241, 0.18), transparent 80%)`
  const [isHovered, setIsHovered] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const isVideo = article.media === "video" && article.videoSrc

  function handleMouseMove(e: React.MouseEvent<HTMLAnchorElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    x.set(e.clientX - rect.left)
    y.set(e.clientY - rect.top)
  }

  // Video: auto-play immediately (no hover), loop, muted
  useEffect(() => {
    const video = videoRef.current
    if (!video || !isVideo) return
    video.play().catch(() => {})
  }, [isVideo])

  const reduceMotion = useReducedMotion()
  const hoverScale = reduceMotion ? 1 : (isHovered ? 1.02 : 1)
  const hoverRotateX = reduceMotion ? 0 : (isHovered ? -2 : 0)
  const mediaZoom = reduceMotion ? 1 : (isHovered ? 1.08 : 1)

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.6,
        delay: index * 0.08,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="shrink-0 w-[90vw] sm:w-[66vw] md:w-[48vw] lg:w-[48vw] px-4 md:px-5"
      style={{ willChange: "transform" }}
    >
      <Link
        href={`/blog/${article.slug}`}
        className="group block relative rounded-2xl overflow-hidden bg-stone-900/90 border border-white/10 shadow-xl hover:shadow-2xl transition-shadow duration-300"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false)
          x.set(0)
          y.set(0)
        }}
      >
        {/* Radial glow following cursor */}
        <motion.div
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"
          style={{ background: glow }}
          aria-hidden
        />

        <motion.div
          className="relative origin-center"
          style={{
            transformStyle: "preserve-3d",
            perspective: 1000,
            willChange: "transform",
          }}
          initial={false}
          animate={{
            scale: hoverScale,
            rotateX: hoverRotateX,
            rotateY: 0,
          }}
          transition={{
            duration: 0.35,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <div className="relative aspect-[4/3] overflow-hidden">
            {/* Video: auto-play immediately, no thumbnail placeholder */}
            {isVideo && (
              <motion.div
                className="absolute inset-0"
                initial={false}
                animate={{ scale: mediaZoom }}
                transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{ willChange: "transform" }}
              >
                <video
                  ref={videoRef}
                  src={article.videoSrc}
                  className="w-full h-full object-cover"
                  muted
                  loop
                  playsInline
                  autoPlay
                  preload="auto"
                  aria-label={`${article.title} preview`}
                />
              </motion.div>
            )}

            {/* Image: static preview, zoom on hover */}
            {!isVideo && (
              <motion.div
                className="absolute inset-0"
                initial={false}
                animate={{ scale: mediaZoom }}
                transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{ willChange: "transform" }}
              >
                <Image
                  src={article.image ?? article.thumbnail}
                  alt={article.imageAlt ?? article.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 90vw, (max-width: 768px) 66vw, 48vw"
                  style={{ transform: "translateZ(0)" }}
                />
              </motion.div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <h3 className="text-xl md:text-2xl font-bold text-white leading-tight line-clamp-2 drop-shadow-lg">
                {article.title}
              </h3>
              <p className="mt-2 text-sm text-white/80 line-clamp-2">
                {article.description}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between px-5 py-4 bg-stone-900/95 border-t border-white/5">
            <span className="text-sm font-medium text-indigo-400 group-hover:text-indigo-300 transition-colors duration-300 flex items-center gap-2">
              Read Story
              <motion.span
                className="inline-block"
                initial={false}
                whileHover={{ x: reduceMotion ? 0 : 4 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                →
              </motion.span>
            </span>
            <span className="text-xs text-stone-500">{article.readTimeMinutes} min read</span>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  )
}
