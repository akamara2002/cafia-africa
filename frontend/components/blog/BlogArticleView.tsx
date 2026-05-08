"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import ReadingProgressBar from "@/components/blog/ReadingProgressBar"
import ArticleHero from "@/components/blog/ArticleHero"
import CinematicLoader from "@/components/blog/CinematicLoader"
import type { BlogArticleMeta } from "@/lib/blog-data"
import BankPerceptionContent from "@/components/blog/article-content/BankPerceptionContent"
import CashAndDigitalPaymentsContent from "@/components/blog/article-content/CashAndDigitalPaymentsContent"
import RecordKeepingContent from "@/components/blog/article-content/RecordKeepingContent"
import TrustInDigitalPaymentsContent from "@/components/blog/article-content/TrustInDigitalPaymentsContent"
import DigitalRecordsForCreditContent from "@/components/blog/article-content/DigitalRecordsForCreditContent"

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
}

function ArticleContent({ slug }: { slug: string }) {
  switch (slug) {
    case "bank-perception":
      return <BankPerceptionContent />
    case "cash-and-digital-payments":
      return <CashAndDigitalPaymentsContent />
    case "record-keeping":
      return <RecordKeepingContent />
    case "trust-in-digital-payments":
      return <TrustInDigitalPaymentsContent />
    case "digital-records-for-credit":
      return <DigitalRecordsForCreditContent />
    default:
      return null
  }
}

interface BlogArticleViewProps {
  article: BlogArticleMeta
}

export default function BlogArticleView({ article }: BlogArticleViewProps) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const delay = reduced ? 200 : 800
    const t = setTimeout(() => setIsLoading(false), delay)
    return () => clearTimeout(t)
  }, [article.slug])

  const isVideo = article.media === "video" && article.videoSrc

  return (
    <>
      <Navbar />
      <ReadingProgressBar />
      <AnimatePresence mode="wait">
        {isLoading && <CinematicLoader key="cinematic-loader" />}
      </AnimatePresence>

      {!isLoading && (
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="min-h-screen bg-stone-950 text-white"
        >
          <ArticleHero
            title={article.articleTitle ?? article.title}
            subtitle={article.articleSubtitle}
            image={article.thumbnail}
            imageAlt={article.imageAlt}
            videoSrc={article.videoSrc}
            isVideo={isVideo}
          />

          <article className="relative max-w-[900px] mx-auto px-4 sm:px-6 lg:px-10 py-12 md:py-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-stone-500 mb-16"
            >
              <span>By {article.author}</span>
              <span>Published {formatDate(article.datePublished)}</span>
              {article.dateUpdated && <span>Updated {formatDate(article.dateUpdated)}</span>}
              <span>{article.readTimeMinutes} min read</span>
            </motion.div>

            <ArticleContent slug={article.slug} />
          </article>

          <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-10 pb-20 pt-16 border-t border-white/10">
            <Link
              href="/blog"
              className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
            >
              ← Back to Blog
            </Link>
          </div>
        </motion.main>
      )}

      <Footer />
    </>
  )
}
