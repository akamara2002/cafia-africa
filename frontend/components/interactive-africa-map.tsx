"use client"

import { motion, useInView, AnimatePresence } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import { Search, TrendingUp, Users, Globe, Building2, Loader2, X } from "lucide-react"
import { getCountryFinancialData, type CountryFinancialData } from "@/lib/world-bank-api"

const AFRICAN_COUNTRIES = [
  { code: "DZ", name: "Algeria", region: "North Africa" },
  { code: "AO", name: "Angola", region: "Central Africa" },
  { code: "BJ", name: "Benin", region: "West Africa" },
  { code: "BW", name: "Botswana", region: "Southern Africa" },
  { code: "BF", name: "Burkina Faso", region: "West Africa" },
  { code: "BI", name: "Burundi", region: "East Africa" },
  { code: "CM", name: "Cameroon", region: "Central Africa" },
  { code: "CV", name: "Cape Verde", region: "West Africa" },
  { code: "CF", name: "Central African Republic", region: "Central Africa" },
  { code: "TD", name: "Chad", region: "Central Africa" },
  { code: "KM", name: "Comoros", region: "East Africa" },
  { code: "CG", name: "Congo", region: "Central Africa" },
  { code: "CD", name: "DR Congo", region: "Central Africa" },
  { code: "CI", name: "Ivory Coast", region: "West Africa" },
  { code: "DJ", name: "Djibouti", region: "East Africa" },
  { code: "EG", name: "Egypt", region: "North Africa" },
  { code: "GQ", name: "Equatorial Guinea", region: "Central Africa" },
  { code: "ER", name: "Eritrea", region: "East Africa" },
  { code: "SZ", name: "Eswatini", region: "Southern Africa" },
  { code: "ET", name: "Ethiopia", region: "East Africa" },
  { code: "GA", name: "Gabon", region: "Central Africa" },
  { code: "GM", name: "Gambia", region: "West Africa" },
  { code: "GH", name: "Ghana", region: "West Africa" },
  { code: "GN", name: "Guinea", region: "West Africa" },
  { code: "GW", name: "Guinea-Bissau", region: "West Africa" },
  { code: "KE", name: "Kenya", region: "East Africa" },
  { code: "LS", name: "Lesotho", region: "Southern Africa" },
  { code: "LR", name: "Liberia", region: "West Africa" },
  { code: "LY", name: "Libya", region: "North Africa" },
  { code: "MG", name: "Madagascar", region: "East Africa" },
  { code: "MW", name: "Malawi", region: "Southern Africa" },
  { code: "ML", name: "Mali", region: "West Africa" },
  { code: "MR", name: "Mauritania", region: "West Africa" },
  { code: "MU", name: "Mauritius", region: "East Africa" },
  { code: "MA", name: "Morocco", region: "North Africa" },
  { code: "MZ", name: "Mozambique", region: "Southern Africa" },
  { code: "NA", name: "Namibia", region: "Southern Africa" },
  { code: "NE", name: "Niger", region: "West Africa" },
  { code: "NG", name: "Nigeria", region: "West Africa" },
  { code: "RW", name: "Rwanda", region: "East Africa" },
  { code: "ST", name: "Sao Tome and Principe", region: "Central Africa" },
  { code: "SN", name: "Senegal", region: "West Africa" },
  { code: "SC", name: "Seychelles", region: "East Africa" },
  { code: "SL", name: "Sierra Leone", region: "West Africa" },
  { code: "SO", name: "Somalia", region: "East Africa" },
  { code: "ZA", name: "South Africa", region: "Southern Africa" },
  { code: "SS", name: "South Sudan", region: "East Africa" },
  { code: "SD", name: "Sudan", region: "North Africa" },
  { code: "TZ", name: "Tanzania", region: "East Africa" },
  { code: "TG", name: "Togo", region: "West Africa" },
  { code: "TN", name: "Tunisia", region: "North Africa" },
  { code: "UG", name: "Uganda", region: "East Africa" },
  { code: "ZM", name: "Zambia", region: "Southern Africa" },
  { code: "ZW", name: "Zimbabwe", region: "Southern Africa" },
]

export interface ExtendedCountryData extends CountryFinancialData {
  smeCount?: number
  region: string
}

interface InteractiveAfricaMapProps {
  selectedCountry?: ExtendedCountryData | null
  onCountrySelect?: (country: ExtendedCountryData | null) => void
}

export default function InteractiveAfricaMap({ 
  selectedCountry: externalSelectedCountry,
  onCountrySelect 
}: InteractiveAfricaMapProps = {}) {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 })
  const [internalSelectedCountry, setInternalSelectedCountry] = useState<ExtendedCountryData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRegion, setSelectedRegion] = useState<string>("All Regions")
  const [economyData, setEconomyData] = useState<CountryFinancialData[]>([])
  const [isLoadingEconomyData, setIsLoadingEconomyData] = useState(false)
  const [sortBy, setSortBy] = useState<keyof CountryFinancialData>('accountOwnership')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [showEconomyTable, setShowEconomyTable] = useState(false)
  
  // Use external state if provided, otherwise use internal state
  const selectedCountry = externalSelectedCountry !== undefined ? externalSelectedCountry : internalSelectedCountry
  const setSelectedCountry = onCountrySelect || setInternalSelectedCountry

  const regions = ["All Regions", "North Africa", "West Africa", "Central Africa", "East Africa", "Southern Africa"]

  const filteredCountries = AFRICAN_COUNTRIES.filter((country) => {
    const matchesSearch = country.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRegion = selectedRegion === "All Regions" || country.region === selectedRegion
    return matchesSearch && matchesRegion
  })

  // Fetch economy-level data for all African countries
  useEffect(() => {
    const fetchEconomyData = async () => {
      setIsLoadingEconomyData(true)
      try {
        const response = await fetch('/api/world-bank/african-countries')
        if (response.ok) {
          const result = await response.json()
          setEconomyData(result.countries || [])
        }
      } catch (error) {
        console.error('Error fetching economy data:', error)
      } finally {
        setIsLoadingEconomyData(false)
      }
    }
    fetchEconomyData()
  }, [])

  // Sort economy data
  const sortedEconomyData = [...economyData].sort((a, b) => {
    const aValue = a[sortBy] as number || 0
    const bValue = b[sortBy] as number || 0
    return sortOrder === 'desc' ? bValue - aValue : aValue - bValue
  })

  const handleCountryClick = async (countryCode: string, countryName: string, region: string) => {
    setSelectedCountry({
      countryCode,
      countryName,
      region,
      year: undefined,
      population: undefined,
      accountOwnership: undefined,
      gdpPerCapita: undefined,
      smeCount: undefined,
    })

    // Fast path: use already-fetched economy table data to avoid extra network latency.
    const cachedCountry = economyData.find((c) => c.countryCode === countryCode)
    if (cachedCountry) {
      const smeCount = cachedCountry.population
        ? Math.round(
            (cachedCountry.population / 1000) *
              (cachedCountry.gdpPerCapita ? Math.min(cachedCountry.gdpPerCapita / 1000, 50) : 10),
          )
        : undefined

      setSelectedCountry({
        ...cachedCountry,
        countryName: cachedCountry.countryName || countryName,
        smeCount,
        region,
      })
      return
    }

    setIsLoading(true)

    try {
      const data = await getCountryFinancialData(countryCode)
      if (data) {
        const smeCount = data.population
          ? Math.round((data.population / 1000) * (data.gdpPerCapita ? Math.min(data.gdpPerCapita / 1000, 50) : 10))
          : undefined

        setSelectedCountry({
          ...data,
          smeCount,
          region,
        })
      }
    } catch (error) {
      console.error("Error fetching country data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const closeModal = () => {
    setSelectedCountry(null)
  }

  return (
    <section
      ref={sectionRef}
      className="relative py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden"
    >
      {/* Animated background particles */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => {
          // Use index-based deterministic positions to avoid hydration mismatch
          const left = ((i * 37) % 100) + ((i * 7) % 20) / 100
          const top = ((i * 23) % 100) + ((i * 11) % 30) / 100
          return (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-blue-400 rounded-full"
              style={{
                left: `${left}%`,
                top: `${top}%`,
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 3 + (i % 3),
                repeat: Infinity,
                delay: (i % 5) * 0.4,
              }}
            />
          )
        })}
      </div>

      <div className="container max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Financial Inclusion Across Africa</h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Explore real time financial inclusion data from the World Bank for all 54 African countries
          </p>
          <p className="text-base md:text-lg text-cyan-300 font-semibold mb-8 animate-pulse">
            👆 Click on any country to view detailed financial metrics
          </p>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center max-w-4xl mx-auto">
            <div className="relative flex-1 w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search countries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-sm sm:text-base bg-slate-800/80 border border-blue-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full sm:w-auto px-4 sm:px-6 py-3 text-sm sm:text-base bg-slate-800/80 border border-blue-500/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
            >
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>

          <p className="text-sm text-gray-400 mt-4">
            Showing {filteredCountries.length} of {AFRICAN_COUNTRIES.length} countries
          </p>
        </motion.div>

        {/* Country Cards Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3 mb-8"
        >
          {filteredCountries.map((country, index) => (
            <motion.button
              key={country.code}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: index * 0.02 }}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCountryClick(country.code, country.name, country.region)}
              className={`relative p-3 sm:p-4 rounded-xl backdrop-blur-sm transition-all shadow-lg overflow-hidden group min-h-[92px] sm:min-h-[106px] touch-manipulation ${
                selectedCountry?.countryCode === country.code
                  ? "bg-gradient-to-br from-blue-600 to-cyan-600 ring-2 ring-yellow-400"
                  : "bg-slate-800/60 hover:bg-slate-700/80 border border-blue-500/20"
              }`}
            >
              {/* Hover gradient effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-cyan-500/0 group-hover:from-blue-500/10 group-hover:to-cyan-500/10 transition-all duration-300" />

              <div className="relative z-10">
                <div className="text-2xl font-bold text-yellow-400 mb-1">{country.code}</div>
                <div className="text-xs text-white font-medium line-clamp-2">{country.name}</div>
                <div className="text-[10px] text-gray-400 mt-1">{country.region}</div>
              </div>

              {/* Selected indicator */}
              {selectedCountry?.countryCode === country.code && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 w-2 h-2 bg-yellow-400 rounded-full"
                />
              )}
            </motion.button>
          ))}
        </motion.div>

        {/* Economy-Level Data Table Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8 text-center"
        >
          <button
            onClick={() => setShowEconomyTable(!showEconomyTable)}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl touch-manipulation"
          >
            {showEconomyTable ? 'Hide' : 'Show'} Economy Data Table
          </button>
        </motion.div>

        {/* Economy-Level Data Table */}
        <AnimatePresence>
          {showEconomyTable && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-8"
            >
                <div className="bg-slate-800/90 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-blue-500/30">
                <div className="mb-6">
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Digital Financial Services Economy Data</h3>
                  <p className="text-gray-300 text-sm">
                    Comprehensive financial inclusion metrics for all African countries from World Bank Global Findex Database
                  </p>
                </div>

                {isLoadingEconomyData ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
                    <span className="ml-3 text-gray-300">Loading economy data...</span>
                  </div>
                ) : (
                  <>
                    {/* Sort Controls */}
                    <div className="mb-4 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 items-stretch sm:items-center">
                      <label className="text-sm text-gray-300">Sort by:</label>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as keyof CountryFinancialData)}
                        className="w-full sm:w-auto px-4 py-2 bg-slate-700/50 border border-blue-500/30 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="accountOwnership">Account Ownership</option>
                        <option value="internetUsers">Internet Users</option>
                        <option value="mobileCellular">Mobile Cellular</option>
                        <option value="gdpPerCapita">GDP Per Capita</option>
                        <option value="population">Population</option>
                      </select>
                      <button
                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                        className="w-full sm:w-auto px-4 py-2 bg-slate-700/50 border border-blue-500/30 rounded-lg text-white text-sm hover:bg-slate-700 transition-colors"
                      >
                        {sortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
                      </button>
                    </div>

                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full text-left min-w-[760px]">
                        <thead>
                          <tr className="border-b border-slate-600/50">
                            <th className="px-4 py-3 text-sm font-semibold text-gray-300">Country</th>
                            <th className="px-4 py-3 text-sm font-semibold text-gray-300">Account Ownership %</th>
                            <th className="px-4 py-3 text-sm font-semibold text-gray-300">Mobile Cellular</th>
                            <th className="px-4 py-3 text-sm font-semibold text-gray-300">Internet Users %</th>
                            <th className="px-4 py-3 text-sm font-semibold text-gray-300">GDP/Capita (US$)</th>
                            <th className="px-4 py-3 text-sm font-semibold text-gray-300">Population</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sortedEconomyData.map((country, index) => (
                            <motion.tr
                              key={country.countryCode}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.02 }}
                              className="border-b border-slate-700/30 hover:bg-slate-700/30 transition-colors cursor-pointer"
                              onClick={() => {
                                const countryInfo = AFRICAN_COUNTRIES.find(c => c.code === country.countryCode)
                                if (countryInfo) {
                                  handleCountryClick(country.countryCode, country.countryName, countryInfo.region)
                                }
                              }}
                            >
                              <td className="px-4 py-3">
                                <div className="font-semibold text-white">{country.countryName}</div>
                                <div className="text-xs text-gray-400">{country.countryCode}</div>
                              </td>
                              <td className="px-4 py-3 text-gray-300">
                                {country.accountOwnership ? `${country.accountOwnership.toFixed(1)}%` : 'N/A'}
                              </td>
                              <td className="px-4 py-3 text-gray-300">
                                {country.mobileCellular ? country.mobileCellular.toFixed(1) : 'N/A'}
                              </td>
                              <td className="px-4 py-3 text-gray-300">
                                {country.internetUsers ? `${country.internetUsers.toFixed(1)}%` : 'N/A'}
                              </td>
                              <td className="px-4 py-3 text-gray-300">
                                {country.gdpPerCapita ? `$${Math.round(country.gdpPerCapita).toLocaleString()}` : 'N/A'}
                              </td>
                              <td className="px-4 py-3 text-gray-300">
                                {country.population ? `${(country.population / 1000000).toFixed(1)}M` : 'N/A'}
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile cards */}
                    <div className="md:hidden space-y-2">
                      {sortedEconomyData.map((country, index) => (
                        <motion.button
                          key={`${country.countryCode}-mobile`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.01 }}
                          className="w-full text-left rounded-xl bg-slate-700/30 border border-slate-600/40 p-3"
                          onClick={() => {
                            const countryInfo = AFRICAN_COUNTRIES.find(c => c.code === country.countryCode)
                            if (countryInfo) {
                              handleCountryClick(country.countryCode, country.countryName, countryInfo.region)
                            }
                          }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-semibold text-white">{country.countryName}</div>
                            <div className="text-xs text-gray-400">{country.countryCode}</div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="text-gray-300">Account Ownership</div>
                            <div className="text-white text-right">{country.accountOwnership ? `${country.accountOwnership.toFixed(1)}%` : 'N/A'}</div>
                            <div className="text-gray-300">Internet Users</div>
                            <div className="text-white text-right">{country.internetUsers ? `${country.internetUsers.toFixed(1)}%` : 'N/A'}</div>
                            <div className="text-gray-300">GDP/Capita</div>
                            <div className="text-white text-right">{country.gdpPerCapita ? `$${Math.round(country.gdpPerCapita).toLocaleString()}` : 'N/A'}</div>
                            <div className="text-gray-300">Population</div>
                            <div className="text-white text-right">{country.population ? `${(country.population / 1000000).toFixed(1)}M` : 'N/A'}</div>
                          </div>
                        </motion.button>
                      ))}
                    </div>

                    <div className="mt-4 text-xs text-gray-400 text-center">
                      Data source: World Bank Global Findex Database | Last updated: {new Date().toLocaleDateString()}
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {selectedCountry && (
            <>
              {/* Modal Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeModal}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
              />

              {/* Modal Content */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="fixed inset-4 md:inset-10 lg:inset-20 z-50 overflow-auto"
              >
                <div className="min-h-full flex items-center justify-center p-4">
                  <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-blue-500/30 rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden">
                    {/* Modal Header */}
                    <div className="relative bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 p-6 md:p-8">
                      <div className="absolute inset-0 opacity-10" />
                      <div className="relative flex justify-between items-start">
                        <div>
                          <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">
                            {selectedCountry.countryName}
                          </h3>
                          <div className="flex flex-wrap gap-3 text-sm text-blue-100">
                            <span className="px-3 py-1 bg-white/20 rounded-full">
                              Code: {selectedCountry.countryCode}
                            </span>
                            <span className="px-3 py-1 bg-white/20 rounded-full">Region: {selectedCountry.region}</span>
                            <span className="px-3 py-1 bg-white/20 rounded-full">
                              Data Year: {selectedCountry.year || "N/A"}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={closeModal}
                          className="text-white hover:bg-white/20 transition-colors p-2 rounded-lg"
                          aria-label="Close modal"
                        >
                          <X className="w-6 h-6" />
                        </button>
                      </div>
                    </div>

                    {/* Modal Body */}
                    <div className="p-6 md:p-8">
                      {isLoading ? (
                        <div className="flex items-center justify-center py-20">
                          <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                          {/* Population */}
                          {selectedCountry.population !== undefined && (
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.1 }}
                              className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-2xl p-6 border border-blue-400/30"
                            >
                              <div className="flex items-center gap-4 mb-3">
                                <div className="p-3 bg-blue-500/30 rounded-xl">
                                  <Users className="w-7 h-7 text-blue-300" />
                                </div>
                                <p className="text-sm text-gray-300 font-medium">Total Population</p>
                              </div>
                              <p className="text-3xl font-bold text-white">
                                {(selectedCountry.population / 1_000_000).toFixed(1)}M
                              </p>
                            </motion.div>
                          )}

                          {/* SME Count */}
                          {selectedCountry.smeCount !== undefined && (
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.15 }}
                              className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/30"
                            >
                              <div className="flex items-center gap-4 mb-3">
                                <div className="p-3 bg-purple-500/30 rounded-xl">
                                  <Building2 className="w-7 h-7 text-purple-300" />
                                </div>
                                <p className="text-sm text-gray-300 font-medium">SME Count (Est.)</p>
                              </div>
                              <p className="text-3xl font-bold text-white">
                                {selectedCountry.smeCount.toLocaleString()}
                              </p>
                            </motion.div>
                          )}

                          {/* Account Ownership */}
                          {selectedCountry.accountOwnership !== undefined ? (
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.2 }}
                              className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-2xl p-6 border border-green-400/30"
                            >
                              <div className="flex items-center gap-4 mb-3">
                                <div className="p-3 bg-green-500/30 rounded-xl">
                                  <TrendingUp className="w-7 h-7 text-green-300" />
                                </div>
                                <p className="text-sm text-gray-300 font-medium">Financial Access (15+)</p>
                              </div>
                              <p className="text-3xl font-bold text-white">
                                {selectedCountry.accountOwnership.toFixed(1)}%
                              </p>
                            </motion.div>
                          ) : (
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.2 }}
                              className="bg-slate-700/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-600/30"
                            >
                              <div className="flex items-center gap-4 mb-3">
                                <div className="p-3 bg-slate-600/30 rounded-xl">
                                  <TrendingUp className="w-7 h-7 text-gray-500" />
                                </div>
                                <p className="text-sm text-gray-400 font-medium">Financial Access (15+)</p>
                              </div>
                              <p className="text-2xl font-semibold text-gray-500">N/A</p>
                            </motion.div>
                          )}

                          {/* GDP Per Capita */}
                          {selectedCountry.gdpPerCapita !== undefined ? (
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.25 }}
                              className="bg-gradient-to-br from-yellow-500/20 to-amber-500/20 backdrop-blur-sm rounded-2xl p-6 border border-yellow-400/30"
                            >
                              <div className="flex items-center gap-4 mb-3">
                                <div className="p-3 bg-yellow-500/30 rounded-xl">
                                  <Globe className="w-7 h-7 text-yellow-300" />
                                </div>
                                <p className="text-sm text-gray-300 font-medium">GDP Per Capita</p>
                              </div>
                              <p className="text-3xl font-bold text-white">
                                ${selectedCountry.gdpPerCapita.toLocaleString()}
                              </p>
                            </motion.div>
                          ) : (
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.25 }}
                              className="bg-slate-700/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-600/30"
                            >
                              <div className="flex items-center gap-4 mb-3">
                                <div className="p-3 bg-slate-600/30 rounded-xl">
                                  <Globe className="w-7 h-7 text-gray-500" />
                                </div>
                                <p className="text-sm text-gray-400 font-medium">GDP Per Capita</p>
                              </div>
                              <p className="text-2xl font-semibold text-gray-500">N/A</p>
                            </motion.div>
                          )}

                          {/* Mobile Subscriptions */}
                          {selectedCountry.mobileCellular !== undefined ? (
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.3 }}
                              className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-sm rounded-2xl p-6 border border-orange-400/30"
                            >
                              <div className="flex items-center gap-4 mb-3">
                                <div className="p-3 bg-orange-500/30 rounded-xl">
                                  <svg
                                    className="w-7 h-7 text-orange-300"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                                    />
                                  </svg>
                                </div>
                                <p className="text-sm text-gray-300 font-medium">Mobile Subscriptions</p>
                              </div>
                              <p className="text-3xl font-bold text-white">
                                {selectedCountry.mobileCellular.toFixed(0)} per 100
                              </p>
                            </motion.div>
                          ) : (
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.3 }}
                              className="bg-slate-700/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-600/30"
                            >
                              <div className="flex items-center gap-4 mb-3">
                                <div className="p-3 bg-slate-600/30 rounded-xl">
                                  <svg
                                    className="w-7 h-7 text-gray-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                                    />
                                  </svg>
                                </div>
                                <p className="text-sm text-gray-400 font-medium">Mobile Subscriptions</p>
                              </div>
                              <p className="text-2xl font-semibold text-gray-500">N/A</p>
                            </motion.div>
                          )}

                          {/* Internet Users */}
                          {selectedCountry.internetUsers !== undefined ? (
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.35 }}
                              className="bg-gradient-to-br from-teal-500/20 to-cyan-500/20 backdrop-blur-sm rounded-2xl p-6 border border-teal-400/30"
                            >
                              <div className="flex items-center gap-4 mb-3">
                                <div className="p-3 bg-teal-500/30 rounded-xl">
                                  <svg
                                    className="w-7 h-7 text-teal-300"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                                    />
                                  </svg>
                                </div>
                                <p className="text-sm text-gray-300 font-medium">Internet Users</p>
                              </div>
                              <p className="text-3xl font-bold text-white">
                                {selectedCountry.internetUsers.toFixed(1)}%
                              </p>
                            </motion.div>
                          ) : (
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.35 }}
                              className="bg-slate-700/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-600/30"
                            >
                              <div className="flex items-center gap-4 mb-3">
                                <div className="p-3 bg-slate-600/30 rounded-xl">
                                  <svg
                                    className="w-7 h-7 text-gray-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                                    />
                                  </svg>
                                </div>
                                <p className="text-sm text-gray-400 font-medium">Internet Users</p>
                              </div>
                              <p className="text-2xl font-semibold text-gray-500">N/A</p>
                            </motion.div>
                          )}
                        </div>
                      )}

                      {/* Data Source Note */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-6 p-4 bg-blue-500/10 border border-blue-400/20 rounded-xl"
                      >
                        <p className="text-sm text-gray-300 text-center">
                          Data sourced from World Bank API. SME counts are estimated based on population and economic
                          indicators.
                        </p>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
