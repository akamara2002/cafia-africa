// Utility to normalize and merge duplicate street names
// This ensures consistent naming and merges duplicates as specified

export function normalizeStreetName(streetName: string): string {
  if (!streetName) return streetName
  
  const normalized = streetName.trim()
  
  // Merge Lumley variations
  if (normalized.includes('Lumley Beach Road') || normalized.includes('Lumley Beach Road – Kamayama') || 
      normalized.includes('Lumley Market Area') || normalized.includes('Lumley Market')) {
    return 'Lumley–Kamayama'
  }
  
  // Normalize Dundas Street (case-insensitive, handle variations including Daunda)
  if (normalized.toLowerCase().includes('dundas street') || 
      normalized.toLowerCase().includes('daunda street') ||
      normalized.toLowerCase() === 'dundas' ||
      normalized.toLowerCase() === 'daunda') {
    return 'Dundas Street'
  }
  
  // Normalize Sander Street (case-insensitive, handle variations)
  if (normalized.toLowerCase().includes('sander street') || normalized.toLowerCase() === 'sander') {
    return 'Sander Street'
  }
  
  return normalized
}

// Post-process function to merge duplicates in result arrays
export function mergeDuplicateStreets<T extends { street_name: string }>(
  items: T[],
  mergeFn: (a: T, b: T) => T
): T[] {
  const merged = new Map<string, T>()
  
  for (const item of items) {
    const normalized = normalizeStreetName(item.street_name)
    const existing = merged.get(normalized)
    
    if (existing) {
      merged.set(normalized, mergeFn(existing, item))
    } else {
      merged.set(normalized, { ...item, street_name: normalized })
    }
  }
  
  return Array.from(merged.values())
}

// SQL CASE expression for normalizing in database queries
export function getStreetNormalizationSQL(columnName: string = 'street_standardized'): string {
  // Return a properly formatted CASE expression
  return `CASE
    WHEN LOWER(${columnName}) LIKE '%lumley beach road%' OR 
         LOWER(${columnName}) LIKE '%lumley market%' OR
         ${columnName} = 'Lumley Beach Road – Kamayama' OR
         ${columnName} = 'Lumley Market Area'
    THEN 'Lumley–Kamayama'
    WHEN LOWER(${columnName}) LIKE '%dundas street%' OR 
         LOWER(${columnName}) LIKE '%daunda street%' OR
         LOWER(${columnName}) = 'dundas' OR
         LOWER(${columnName}) = 'daunda'
    THEN 'Dundas Street'
    WHEN LOWER(${columnName}) LIKE '%sander street%' OR LOWER(${columnName}) = 'sander'
    THEN 'Sander Street'
    ELSE ${columnName}
  END`
}
