"use client"

import { useRef, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"

interface ArticleHeroProps {
  title: string
  subtitle?: string
  /** Image for image articles or fallback */
  image: string
  imageAlt?: string
  /** When provided, hero shows auto-playing video instead of image */
  videoSrc?: string
  isVideo?: boolean
}

export default function ArticleHero({ title, subtitle, image, imageAlt, videoSrc, isVideo }: ArticleHeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video || !isVideo || !videoSrc) return
    video.play().catch(() => {})
  }, [isVideo, videoSrc])

  return (
    <header className="relative w-full aspect-[21/9] min-h-[320px] overflow-hidden">
      <div className="absolute inset-0">
        {isVideo && videoSrc ? (
          <video
            ref={videoRef}
            src={videoSrc}
            className="w-full h-full object-cover"
            muted
            loop
            playsInline
            autoPlay
            preload="auto"
            aria-label={title}
          />
        ) : (
          <Image
            src={image}
            alt={imageAlt ?? title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 lg:p-14">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight max-w-4xl"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mt-4 text-lg md:text-xl text-stone-300 max-w-2xl"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </header>
  )
}
