"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Calendar, User, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const posts = [
  {
    title: "The Future of Digital Financial Services in Africa",
    excerpt: "Exploring how mobile money and fintech innovations are reshaping the continent's economic landscape.",
    author: "CAFIA Research Team",
    date: "March 15, 2024",
    image: "/mobile-money-transaction-africa.jpg",
    category: "Research",
  },
  {
    title: "Islamic Finance: Unlocking Capital for African SMEs",
    excerpt: "How Shariah-compliant financial products are opening new pathways to funding for Muslim entrepreneurs.",
    author: "Dr. Amina Hassan",
    date: "March 10, 2024",
    image: "/islamic-finance-halal-icon.jpg",
    category: "Islamic Finance",
  },
  {
    title: "Policy Brief: Strengthening Financial Inclusion in West Africa",
    excerpt: "Key recommendations for policymakers to accelerate SME access to formal financial services.",
    author: "Policy Team",
    date: "March 5, 2024",
    image: "/advisory-consulting-strategy-icon.jpg",
    category: "Policy",
  },
]

export default function BlogSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })

  return (
    <section
      id="blog"
      ref={sectionRef}
      className="relative py-24 bg-gradient-to-b from-gray-50 to-white overflow-hidden"
    >
      <div className="container max-w-screen-xl mx-auto px-6">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 text-balance">Latest Insights & Research</h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed text-pretty">
            Stay informed with cutting-edge research, policy briefs, and thought leadership on African financial
            inclusion.
          </p>
        </motion.div>

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {posts.map((post, index) => (
            <motion.article
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              whileHover={{ y: -8 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={post.image || "/placeholder.svg"}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {post.category}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 text-gray-900 line-clamp-2">{post.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {post.author}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {post.date}
                  </div>
                </div>
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-sm group"
                >
                  Read More
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center"
        >
          <Link
            href="/blog"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold transition-all hover:scale-105 shadow-md"
          >
            View All Articles
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
