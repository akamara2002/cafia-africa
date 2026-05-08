"use client"

import { FormEvent, useMemo, useState } from "react"
import Link from "next/link"

const REPORT_PDF = "/documents/cafia-policy-report-msme-western-area-sl-2026.pdf"
const REPORT_SLUG = "msme-western-area-sl-2026"
const REPORT_TITLE = "The State of Micro, Small and Medium Enterprises Inclusion in Sierra Leone"

export default function ResearchPublicationsContent() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [statusMessage, setStatusMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [locationMessage, setLocationMessage] = useState("")

  const emailIsValid = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), [email])

  const getLocationPayload = async () => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      setLocationMessage("Location not available on this browser.")
      return { locationStatus: "unavailable" }
    }

    return new Promise<{
      latitude?: number
      longitude?: number
      locationAccuracyM?: number
      locationStatus: string
    }>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords
          setLocationMessage("Location captured.")
          resolve({
            latitude,
            longitude,
            locationAccuracyM: accuracy,
            locationStatus: "captured",
          })
        },
        (error) => {
          const denied = error.code === error.PERMISSION_DENIED
          setLocationMessage(denied ? "Location permission denied." : "Could not capture location.")
          resolve({ locationStatus: denied ? "denied" : "failed" })
        },
        {
          enableHighAccuracy: false,
          timeout: 8000,
          maximumAge: 120000,
        },
      )
    })
  }

  const handleUnlock = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage("")
    setStatusMessage("")

    if (!emailIsValid) {
      setErrorMessage("Please enter a valid email address.")
      return
    }

    try {
      setIsSubmitting(true)
      const locationPayload = await getLocationPayload()
      const response = await fetch("/api/reports/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          reportSlug: REPORT_SLUG,
          reportTitle: REPORT_TITLE,
          ...locationPayload,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.error || "Unable to unlock report")
      }

      setIsUnlocked(true)
      setStatusMessage("Access granted. You can now view or download the report.")
    } catch (error) {
      console.error("Report unlock error:", error)
      setErrorMessage("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDownload = () => {
    const link = document.createElement("a")
    link.href = REPORT_PDF
    link.download = ""
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  return (
    <main className="min-h-screen pt-24 bg-gradient-to-b from-white to-blue-50">
      <section className="relative py-16 md:py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-hidden">
        <div className="container max-w-screen-xl mx-auto px-6 relative z-10">
          <p className="text-sm uppercase tracking-widest text-cyan-300 mb-4">Research and Publications</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance leading-tight">{REPORT_TITLE}</h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-3xl leading-relaxed">
            A survey of businesses across commercial corridors in Western Area Urban and Rural, Sierra Leone (2026).
            CAFIA Policy Report Vol.1, with evidence on registration, account ownership, digital payments, and barriers
            facing predominantly micro enterprises.
          </p>

          {!isUnlocked ? (
            <form onSubmit={handleUnlock} className="mt-10 max-w-2xl bg-white/10 border border-white/20 rounded-2xl p-6">
              <p className="text-sm md:text-base text-blue-100 mb-4">
                Enter your email to unlock and download this report. We use this to track report access.
              </p>
              <p className="text-xs text-blue-200/90 mb-3">
                We also request browser location (with your permission) to capture approximate download location.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="flex-1 rounded-full px-5 py-3 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-cyan-300"
                  required
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex justify-center items-center rounded-full bg-yellow-400 text-slate-900 px-8 py-3 font-semibold hover:bg-yellow-300 transition-colors shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Unlocking..." : "Unlock Report"}
                </button>
              </div>
              {errorMessage ? <p className="mt-3 text-sm text-red-200">{errorMessage}</p> : null}
              {locationMessage ? <p className="mt-2 text-xs text-blue-100">{locationMessage}</p> : null}
            </form>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 mt-10">
              <button
                onClick={handleDownload}
                className="inline-flex justify-center items-center rounded-full bg-yellow-400 text-slate-900 px-8 py-3 font-semibold hover:bg-yellow-300 transition-colors shadow-lg"
              >
                Download PDF
              </button>
              <a
                href={REPORT_PDF}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex justify-center items-center rounded-full border-2 border-white/80 text-white px-8 py-3 font-semibold hover:bg-white/10 transition-colors"
              >
                Open in new tab
              </a>
            </div>
          )}

          {(statusMessage || errorMessage) && !isSubmitting ? (
            <p className="mt-6 text-sm text-blue-100">{statusMessage}</p>
          ) : null}
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container max-w-screen-xl mx-auto px-6">
          {isUnlocked ? (
            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-xl bg-white">
              <iframe title={REPORT_TITLE} src={`${REPORT_PDF}#toolbar=1`} className="w-full min-h-[70vh] md:min-h-[85vh] border-0" />
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <p className="text-slate-700 font-medium">Report preview is locked.</p>
              <p className="mt-2 text-sm text-slate-500">Submit your email above to view or download the report.</p>
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-4 text-sm text-slate-600">
            <Link href="/strategic-pillars" className="text-blue-600 hover:text-blue-800 font-medium underline-offset-2 hover:underline">
              Strategic pillars
            </Link>
            <span aria-hidden>·</span>
            <Link href="/datahub" className="text-blue-600 hover:text-blue-800 font-medium underline-offset-2 hover:underline">
              Datahub
            </Link>
            <span aria-hidden>·</span>
            <Link href="/contact" className="text-blue-600 hover:text-blue-800 font-medium underline-offset-2 hover:underline">
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
