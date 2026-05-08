"use client"

import type React from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { useState } from "react"
import { fadeUp } from "@/lib/motion/variants"

interface LeaderCardProps {
  name: string
  role: string
  credentials: string
  imageSrc: string
  shortBio: string
  fullBio: React.ReactNode
  borderColor: string
  buttonColor: string
}

export default function LeaderCard({
  name,
  role,
  credentials,
  imageSrc,
  shortBio,
  fullBio,
  borderColor,
  buttonColor,
}: LeaderCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showImageModal, setShowImageModal] = useState(false)

  const getBorderColorClass = () => {
    switch (borderColor) {
      case "blue-100":
        return "border-blue-100"
      case "green-100":
        return "border-green-100"
      case "purple-100":
        return "border-purple-100"
      default:
        return "border-blue-100"
    }
  }

  const getRoleColorClass = () => {
    switch (buttonColor) {
      case "blue":
        return "text-blue-600"
      case "green":
        return "text-green-600"
      case "purple":
        return "text-purple-600"
      default:
        return "text-blue-600"
    }
  }

  const getButtonColorClasses = () => {
    switch (buttonColor) {
      case "blue":
        return "bg-blue-600 hover:bg-blue-700"
      case "green":
        return "bg-green-600 hover:bg-green-700"
      case "purple":
        return "bg-purple-600 hover:bg-purple-700"
      default:
        return "bg-blue-600 hover:bg-blue-700"
    }
  }

  return (
    <>
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className={`glass-card-light rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 hover:scale-105 border-t-4 ${getBorderColorClass()}`}
      >
        <div
          className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden ring-4 ring-white shadow-xl cursor-pointer hover:ring-8 transition-all duration-300 bg-gray-50"
          onClick={() => setShowImageModal(true)}
        >
          <Image src={imageSrc || "/placeholder.svg"} alt={name} fill className="object-contain" />
        </div>

        <h3 className="text-2xl font-bold text-center mb-2 text-gray-800">{name}</h3>
        <p className={`text-lg font-semibold text-center mb-2 ${getRoleColorClass()}`}>{role}</p>
        <p className="text-sm text-center text-gray-600 mb-6 italic">{credentials}</p>

        <div className="text-gray-700 text-base leading-relaxed">
          {isExpanded ? <div className="space-y-3">{fullBio}</div> : <p>{shortBio}</p>}
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`mt-6 w-full ${getButtonColorClasses()} text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 shadow-md`}
        >
          {isExpanded ? "Show Less" : "Read Full Bio"}
        </button>
      </motion.div>

      {showImageModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.95)",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
          onClick={() => setShowImageModal(false)}
        >
          <button
            onClick={() => setShowImageModal(false)}
            style={{
              position: "absolute",
              top: "1rem",
              right: "1rem",
              color: "white",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              borderRadius: "9999px",
              padding: "0.75rem",
              zIndex: 100000,
              border: "none",
              cursor: "pointer",
            }}
          >
            <svg style={{ width: "2rem", height: "2rem" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div onClick={(e) => e.stopPropagation()}>
            <img
              src={imageSrc || "/placeholder.svg"}
              alt={name}
              style={{
                maxWidth: "90vw",
                maxHeight: "90vh",
                width: "auto",
                height: "auto",
                objectFit: "contain",
                borderRadius: "0.5rem",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
              }}
            />
          </div>
        </div>
      )}
    </>
  )
}
