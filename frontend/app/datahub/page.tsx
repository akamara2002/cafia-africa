"use client"

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import HeroSection from '@/components/datahub/hero-section'
import EnhancedHeroTiles from '@/components/datahub/enhanced-hero-tiles'
import UnifiedDistributionGrid from '@/components/datahub/unified-distribution-grid'
import StackedBarChart from '@/components/datahub/stacked-bar-chart'
import SectionHeadline from '@/components/datahub/section-headline'
import InsightCallout from '@/components/datahub/insight-callout'

interface SummaryData {
  total_businesses: number
  total_streets: number
  gps_coverage_pct: number
  distinct_setup_types: number
}

interface DistributionData {
  setup_type?: string
  activity_type?: string
  gender?: string
  count: number
  percentage: number
}

export default function DatahubPage() {
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState<SummaryData | null>(null)
  const [setupDistribution, setSetupDistribution] = useState<DistributionData[]>([])
  const [activityDistribution, setActivityDistribution] = useState<DistributionData[]>([])
  const [genderDistribution, setGenderDistribution] = useState<DistributionData[]>([])
  const [setupByStreet, setSetupByStreet] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        const [summaryRes, setupRes, activityRes, genderRes, setupByStreetRes] =
          await Promise.all([
            fetch('/api/datahub/summary'),
            fetch('/api/datahub/setup-distribution'),
            fetch('/api/datahub/activity-distribution'),
            fetch('/api/datahub/gender-distribution'),
            fetch('/api/datahub/setup-by-street'),
          ])

        if (summaryRes.ok) {
          const summaryData = await summaryRes.json()
          setSummary(summaryData)
        }

        if (setupRes.ok) {
          const setupData = await setupRes.json()
          setSetupDistribution(setupData)
        }

        if (activityRes.ok) {
          const activityData = await activityRes.json()
          setActivityDistribution(activityData)
        }

        if (genderRes.ok) {
          const genderData = await genderRes.json()
          setGenderDistribution(genderData)
        }

        if (setupByStreetRes.ok) {
          const data = await setupByStreetRes.json()
          setSetupByStreet(data)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-24 flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-4" />
            <p className="text-white text-lg">Loading dashboard data...</p>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (!summary) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-24 flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
          <div className="text-center">
            <p className="text-white text-lg">Failed to load dashboard data</p>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        <HeroSection
          totalBusinesses={summary.total_businesses}
          totalStreets={summary.total_streets}
        />

        <div className="container max-w-screen-2xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="mb-6 sm:mb-8">
            <EnhancedHeroTiles data={summary} />
          </div>

          <div className="mb-8 sm:mb-12">
            <SectionHeadline>
              Understanding the informal economy: how businesses are set up, what they do, and who runs them.
            </SectionHeadline>

            <UnifiedDistributionGrid
              setupData={setupDistribution as any}
              activityData={activityDistribution as any}
              genderData={genderDistribution as any}
            />
          </div>

          {setupByStreet.length > 0 && (
            <div className="mb-8 sm:mb-12">
              <SectionHeadline>
                Not all businesses look the same. Here's how traders organize their operations.
              </SectionHeadline>

              <StackedBarChart data={setupByStreet} />
              <InsightCallout text="Tables dominate in high-footfall corridors. Shops cluster near transport nodes." />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
