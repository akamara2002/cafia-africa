"use client"

import { useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { X } from 'lucide-react'
import ScrollSection from './scroll-section'

// Fix for default marker icons in Next.js
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  })
}

interface MapPoint {
  id: number
  lat: number
  lng: number
  setup_type: string
  activity_type: string
  gender: string
  street_name: string
}

interface StreetSummary {
  street_name: string
  total: number
  shops: number
  tables: number
  kiosks: number
  retail_pct: number
  services_pct: number
  female_pct: number
}

interface InteractiveMapProps {
  points: MapPoint[]
  onStreetSelect?: (street: string) => void
}

function MapController({ points }: { points: MapPoint[] }) {
  const map = useMap()
  const hasFittedBounds = useRef(false)

  useEffect(() => {
    if (points.length === 0) return
    
    // Only fit bounds once on initial load to prevent re-initialization
    if (!hasFittedBounds.current) {
      try {
        const bounds = L.latLngBounds(
          points.map((p) => [p.lat, p.lng] as [number, number])
        )
        map.fitBounds(bounds, { padding: [50, 50] })
        hasFittedBounds.current = true
      } catch (error) {
        console.error('Error fitting bounds:', error)
      }
    }
  }, [map, points])

  return null
}

function CustomMarker({ point, filters, onMarkerClick }: { point: MapPoint; filters: any; onMarkerClick: (point: MapPoint) => void }) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const matches =
      (!filters.setupTypes.length || filters.setupTypes.includes(point.setup_type)) &&
      (!filters.activityTypes.length || filters.activityTypes.includes(point.activity_type)) &&
      (!filters.genders.length || filters.genders.includes(point.gender)) &&
      (!filters.street || filters.street === point.street_name)

    setIsVisible(matches)
  }, [filters, point])

  const getColor = (setupType: string) => {
    switch (setupType) {
      case 'Shop':
        return '#3b82f6'
      case 'Table':
        return '#8b5cf6'
      case 'Kiosk':
        return '#ec4899'
      default:
        return '#94a3b8'
    }
  }

  if (!isVisible) return null

  const icon = L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      width: 12px;
      height: 12px;
      background-color: ${getColor(point.setup_type)};
      border: 2px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      transition: all 0.3s;
    "></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  })

  return (
    <Marker
      position={[point.lat, point.lng]}
      icon={icon}
      eventHandlers={{
        click: () => onMarkerClick(point),
        mouseover: (e) => {
          const marker = e.target
          marker.setIcon(
            L.divIcon({
              className: 'custom-marker',
              html: `<div style="
                width: 16px;
                height: 16px;
                background-color: ${getColor(point.setup_type)};
                border: 2px solid white;
                border-radius: 50%;
                box-shadow: 0 4px 8px rgba(0,0,0,0.4);
                transition: all 0.3s;
              "></div>`,
              iconSize: [16, 16],
              iconAnchor: [8, 8],
            })
          )
        },
        mouseout: (e) => {
          const marker = e.target
          marker.setIcon(icon)
        },
      }}
    >
      <Popup>
        <div className="p-2 min-w-[200px]">
          <h3 className="font-semibold text-gray-900 mb-2">{point.street_name}</h3>
          <div className="space-y-1 text-sm text-gray-600">
            <div>
              <span className="font-medium">Setup:</span> {point.setup_type}
            </div>
            <div>
              <span className="font-medium">Activity:</span> {point.activity_type}
            </div>
            <div>
              <span className="font-medium">Gender:</span> {point.gender}
            </div>
          </div>
        </div>
      </Popup>
    </Marker>
  )
}

export default function InteractiveMap({ points, onStreetSelect }: InteractiveMapProps) {
  const [filters, setFilters] = useState({
    setupTypes: [] as string[],
    activityTypes: [] as string[],
    genders: [] as string[],
    street: '',
  })
  const [selectedStreet, setSelectedStreet] = useState<string | null>(null)
  const [streetSummary, setStreetSummary] = useState<StreetSummary | null>(null)
  const [showSummary, setShowSummary] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const isInitializingRef = useRef(false)
  
  useEffect(() => {
    // Only mount on client side
    if (typeof window !== 'undefined' && !isMounted && !isInitializingRef.current) {
      isInitializingRef.current = true
      setIsMounted(true)
    }
    
    return () => {
      // Cleanup on unmount
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove()
        } catch (e) {
          // Ignore cleanup errors
        }
        mapInstanceRef.current = null
      }
      isInitializingRef.current = false
    }
  }, [isMounted])

  const uniqueSetups = Array.from(new Set(points.map((p) => p.setup_type))).filter(Boolean)
  const uniqueActivities = Array.from(new Set(points.map((p) => p.activity_type))).filter(Boolean)
  const uniqueGenders = Array.from(new Set(points.map((p) => p.gender))).filter(Boolean)
  const uniqueStreets = Array.from(new Set(points.map((p) => p.street_name))).filter(Boolean).sort()

  const toggleFilter = (type: 'setupTypes' | 'activityTypes' | 'genders', value: string) => {
    setFilters((prev) => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter((v) => v !== value)
        : [...prev[type], value],
    }))
  }

  const handleStreetFilter = (street: string) => {
    setFilters((prev) => ({
      ...prev,
      street: prev.street === street ? '' : street,
    }))
    setSelectedStreet(street === filters.street ? null : street)
    if (street !== filters.street) {
      fetchStreetSummary(street)
    } else {
      setStreetSummary(null)
      setShowSummary(false)
    }
  }

  const fetchStreetSummary = async (street: string) => {
    try {
      const response = await fetch(`/api/datahub/street-summary?street=${encodeURIComponent(street)}`)
      if (response.ok) {
        const data = await response.json()
        setStreetSummary(data)
        setShowSummary(true)
        if (onStreetSelect) {
          onStreetSelect(street)
        }
      }
    } catch (error) {
      console.error('Error fetching street summary:', error)
    }
  }

  const handleMarkerClick = (point: MapPoint) => {
    if (point.street_name && point.street_name !== filters.street) {
      handleStreetFilter(point.street_name)
    }
  }

  const filteredPoints = points.filter(
    (p) =>
      (!filters.setupTypes.length || filters.setupTypes.includes(p.setup_type)) &&
      (!filters.activityTypes.length || filters.activityTypes.includes(p.activity_type)) &&
      (!filters.genders.length || filters.genders.includes(p.gender)) &&
      (!filters.street || filters.street === p.street_name)
  )

  return (
    <ScrollSection className="bg-white rounded-xl shadow-lg p-6 mb-12 relative" data-map-section>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Interactive Business Map</h2>

      {/* Filter Bar */}
      <div className="mb-6 space-y-4">
        {/* Setup Type Filters */}
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-2 block">Setup Type</label>
          <div className="flex flex-wrap gap-2">
            {uniqueSetups.map((setup) => (
              <button
                key={setup}
                onClick={() => toggleFilter('setupTypes', setup)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  filters.setupTypes.includes(setup)
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {setup}
              </button>
            ))}
          </div>
        </div>

        {/* Activity Type Filters */}
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-2 block">Activity Type</label>
          <div className="flex flex-wrap gap-2">
            {uniqueActivities.slice(0, 5).map((activity) => (
              <button
                key={activity}
                onClick={() => toggleFilter('activityTypes', activity)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  filters.activityTypes.includes(activity)
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {activity}
              </button>
            ))}
          </div>
        </div>

        {/* Gender Filters */}
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-2 block">Gender</label>
          <div className="flex flex-wrap gap-2">
            {uniqueGenders.map((gender) => (
              <button
                key={gender}
                onClick={() => toggleFilter('genders', gender)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  filters.genders.includes(gender)
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {gender}
              </button>
            ))}
          </div>
        </div>

        {/* Street Filter */}
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-2 block">Street</label>
          <select
            value={filters.street}
            onChange={(e) => {
              const street = e.target.value
              if (street) {
                handleStreetFilter(street)
              } else {
                setFilters((prev) => ({ ...prev, street: '' }))
                setSelectedStreet(null)
                setStreetSummary(null)
                setShowSummary(false)
              }
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="">All Streets</option>
            {uniqueStreets.map((street) => (
              <option key={street} value={street}>
                {street}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Map */}
      <div className="relative">
        <div ref={mapContainerRef} className="h-[600px] w-full rounded-lg overflow-hidden border border-gray-200">
          {isMounted && !mapInstanceRef.current && (
            <MapContainer
              key="datahub-map-singleton"
              center={[8.4844, -13.2344]}
              zoom={13}
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={true}
              whenCreated={(map) => {
                // Prevent multiple initializations
                if (!mapInstanceRef.current) {
                  mapInstanceRef.current = map
                } else {
                  // If somehow we get here with an existing map, remove the duplicate
                  try {
                    map.remove()
                  } catch (e) {
                    // Ignore errors
                  }
                }
              }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapController points={filteredPoints} />
              {filteredPoints.map((point) => (
                <CustomMarker
                  key={point.id}
                  point={point}
                  filters={filters}
                  onMarkerClick={handleMarkerClick}
                />
              ))}
            </MapContainer>
          )}
        </div>

        {/* Street Summary Panel */}
        {showSummary && streetSummary && (
          <div className="absolute top-4 right-4 bg-white rounded-lg shadow-xl p-6 max-w-sm z-[1000] border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">{streetSummary.street_name}</h3>
              <button
                onClick={() => {
                  setShowSummary(false)
                  setSelectedStreet(null)
                  setFilters((prev) => ({ ...prev, street: '' }))
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="border-b pb-2">
                <div className="text-2xl font-bold text-gray-900">{streetSummary.total}</div>
                <div className="text-gray-600">businesses</div>
              </div>
              <div>
                <div className="text-gray-700 font-medium mb-1">Setup Breakdown</div>
                <div className="space-y-1 text-gray-600">
                  <div>
                    {streetSummary.shops} shops ({Math.round((streetSummary.shops / streetSummary.total) * 100)}%)
                  </div>
                  <div>
                    {streetSummary.tables} tables ({Math.round((streetSummary.tables / streetSummary.total) * 100)}%)
                  </div>
                  <div>
                    {streetSummary.kiosks} kiosks ({Math.round((streetSummary.kiosks / streetSummary.total) * 100)}%)
                  </div>
                </div>
              </div>
              <div>
                <div className="text-gray-700 font-medium mb-1">Activity</div>
                <div className="text-gray-600">
                  {streetSummary.retail_pct}% retail | {streetSummary.services_pct}% services
                </div>
              </div>
              <div>
                <div className="text-gray-700 font-medium mb-1">Ownership</div>
                <div className="text-gray-600">{streetSummary.female_pct}% female-owned</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center gap-6 text-sm">
        <div className="font-semibold text-gray-700">Legend:</div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-blue-500"></div>
          <span className="text-gray-600">Shop</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-purple-500"></div>
          <span className="text-gray-600">Table</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-pink-500"></div>
          <span className="text-gray-600">Kiosk</span>
        </div>
      </div>
    </ScrollSection>
  )
}
