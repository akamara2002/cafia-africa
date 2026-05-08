"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import BlogCard from "./BlogCard"
import type { BlogArticleMeta } from "@/lib/blog-data"

interface BlogCarouselProps {
  articles: BlogArticleMeta[]
}

export default function BlogCarousel({ articles }: BlogCarouselProps) {
  const [isPaused, setIsPaused] = useState(false)
  const [hasMounted, setHasMounted] = useState(false)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  return (
    <div
      className="relative w-full overflow-hidden blog-carousel-wrapper"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        ref={trackRef}
        className="flex blog-carousel-track"
        style={{
          width: "max-content",
          gap: "clamp(24px, 4vw, 40px)",
          animationPlayState: isPaused ? "paused" : "running",
          willChange: "transform",
        }}
      >
        {articles.map((article, index) => (
          <BlogCard
            key={`${article.slug}-a`}
            article={article}
            index={index}
            isVisible={hasMounted}
          />
        ))}
        {articles.map((article, index) => (
          <BlogCard
            key={`${article.slug}-b`}
            article={article}
            index={index + articles.length}
            isVisible={hasMounted}
          />
        ))}
      </div>
    </div>
  )
}
