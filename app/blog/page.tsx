"use client"

import { motion } from "framer-motion"
import { BookOpen, Rss, FileText } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container max-w-screen-xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Animated Icon */}
            <motion.div
              animate={{
                y: [0, -20, 0],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              className="w-32 h-32 mx-auto mb-8 relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-400 rounded-3xl blur-xl opacity-50" />
              <div className="relative w-full h-full bg-gradient-to-br from-purple-600 to-pink-500 rounded-3xl flex items-center justify-center">
                <BookOpen className="w-16 h-16 text-white" />
              </div>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-5xl md:text-6xl font-bold mb-6 text-white"
            >
              CAFIA Blog
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-2xl md:text-3xl text-gray-300 mb-4"
            >
              Stay Tuned
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="text-lg text-gray-400 max-w-2xl mx-auto mb-12"
            >
              We're preparing insightful articles, research findings, and stories about financial inclusion across
              Africa. Check back soon for our latest updates.
            </motion.p>

            {/* Animated Feature Icons */}
            <div className="flex justify-center gap-8 flex-wrap">
              {[
                { icon: Rss, label: "Latest Updates" },
                { icon: FileText, label: "Research Papers" },
                { icon: BookOpen, label: "Case Studies" },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + index * 0.2, duration: 0.6 }}
                  whileHover={{ scale: 1.1, y: -5 }}
                  className="flex flex-col items-center gap-3"
                >
                  <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
                    <feature.icon className="w-8 h-8 text-pink-400" />
                  </div>
                  <span className="text-gray-300 text-sm">{feature.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  )
}
