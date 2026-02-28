// ── Address abbreviation mappings ──────────────────────────────────────
const ADDRESS_ABBREVIATIONS = [
  ['Street', 'St'],
  ['Avenue', 'Ave'],
  ['Boulevard', 'Blvd'],
  ['Drive', 'Dr'],
  ['Lane', 'Ln'],
  ['Road', 'Rd'],
  ['Court', 'Ct'],
  ['Place', 'Pl'],
  ['Circle', 'Cir'],
  ['Terrace', 'Ter'],
  ['Highway', 'Hwy'],
  ['Parkway', 'Pkwy'],
  ['Suite', 'Ste'],
  ['Apartment', 'Apt'],
  ['Building', 'Bldg'],
  ['Floor', 'Fl'],
  ['North', 'N'],
  ['South', 'S'],
  ['East', 'E'],
  ['West', 'W'],
  ['Northeast', 'NE'],
  ['Northwest', 'NW'],
  ['Southeast', 'SE'],
  ['Southwest', 'SW'],
]

// ── State mappings ────────────────────────────────────────────────────
const STATE_MAP = {
  'Alabama': 'AL', 'Alaska': 'AK', 'Arizona': 'AZ', 'Arkansas': 'AR',
  'California': 'CA', 'Colorado': 'CO', 'Connecticut': 'CT', 'Delaware': 'DE',
  'Florida': 'FL', 'Georgia': 'GA', 'Hawaii': 'HI', 'Idaho': 'ID',
  'Illinois': 'IL', 'Indiana': 'IN', 'Iowa': 'IA', 'Kansas': 'KS',
  'Kentucky': 'KY', 'Louisiana': 'LA', 'Maine': 'ME', 'Maryland': 'MD',
  'Massachusetts': 'MA', 'Michigan': 'MI', 'Minnesota': 'MN', 'Mississippi': 'MS',
  'Missouri': 'MO', 'Montana': 'MT', 'Nebraska': 'NE', 'Nevada': 'NV',
  'New Hampshire': 'NH', 'New Jersey': 'NJ', 'New Mexico': 'NM', 'New York': 'NY',
  'North Carolina': 'NC', 'North Dakota': 'ND', 'Ohio': 'OH', 'Oklahoma': 'OK',
  'Oregon': 'OR', 'Pennsylvania': 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC',
  'South Dakota': 'SD', 'Tennessee': 'TN', 'Texas': 'TX', 'Utah': 'UT',
  'Vermont': 'VT', 'Virginia': 'VA', 'Washington': 'WA', 'West Virginia': 'WV',
  'Wisconsin': 'WI', 'Wyoming': 'WY', 'District of Columbia': 'DC',
}

const STATE_REVERSE = Object.fromEntries(
  Object.entries(STATE_MAP).map(([full, abbr]) => [abbr, full])
)

// ── Phone standardization ─────────────────────────────────────────────
export function standardizePhone(phone) {
  if (!phone) return ''
  const digits = phone.replace(/\D/g, '')
  // Handle 11-digit with leading 1
  const cleaned = digits.length === 11 && digits[0] === '1' ? digits.slice(1) : digits
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  }
  return phone.trim()
}

// ── State standardization ─────────────────────────────────────────────
export function standardizeState(state) {
  if (!state) return ''
  const trimmed = state.trim()
  const upper = trimmed.toUpperCase()
  // Already an abbreviation
  if (upper.length === 2 && STATE_REVERSE[upper]) return upper
  // Full name
  const titleCase = trimmed.replace(/\b\w/g, c => c.toUpperCase()).replace(/\b\w+/g, (word, idx, str) => {
    // Handle "of" in state names - there are none, but just in case
    return word
  })
  for (const [full, abbr] of Object.entries(STATE_MAP)) {
    if (full.toLowerCase() === trimmed.toLowerCase()) return abbr
  }
  return trimmed
}

export function getStateFull(abbr) {
  if (!abbr) return ''
  return STATE_REVERSE[abbr.toUpperCase()] || abbr
}

// ── Address standardization ───────────────────────────────────────────
export function standardizeAddress(address, useAbbreviated = true) {
  if (!address) return ''
  let result = address.trim()
  // Remove extra spaces
  result = result.replace(/\s+/g, ' ')
  // Remove trailing periods from abbreviations
  result = result.replace(/\b(St|Ave|Blvd|Dr|Ln|Rd|Ct|Pl|Cir|Ter|Hwy|Pkwy|Ste|Apt|Bldg|Fl)\./gi, '$1')
  // Normalize # to Ste/Suite
  result = result.replace(/#\s*(\d)/g, (useAbbreviated ? 'Ste ' : 'Suite ') + '$1')

  for (const [full, abbr] of ADDRESS_ABBREVIATIONS) {
    if (useAbbreviated) {
      // Full → abbreviated
      const fullRegex = new RegExp(`\\b${full}\\b`, 'gi')
      result = result.replace(fullRegex, abbr)
    } else {
      // Abbreviated → full (match with optional period)
      const abbrRegex = new RegExp(`\\b${abbr}\\.?\\b`, 'gi')
      result = result.replace(abbrRegex, full)
    }
  }

  return result
}

// ── URL standardization ───────────────────────────────────────────────
export function standardizeUrl(url) {
  if (!url) return ''
  let result = url.trim().toLowerCase()
  // Remove protocol
  result = result.replace(/^https?:\/\//, '')
  // Remove www.
  result = result.replace(/^www\./, '')
  // Remove trailing slash
  result = result.replace(/\/$/, '')
  return result
}

// ── Business name normalization ───────────────────────────────────────
export function normalizeName(name) {
  if (!name) return ''
  let result = name.trim()
  // Normalize LLC variants
  result = result.replace(/\bL\.?L\.?C\.?\b/gi, 'LLC')
  result = result.replace(/\bInc\.?\b/gi, 'Inc')
  result = result.replace(/\bCo\.?\b/gi, 'Co')
  result = result.replace(/\bCorp\.?\b/gi, 'Corp')
  // Remove extra spaces
  result = result.replace(/\s+/g, ' ')
  return result
}

// ── Character-level diff ──────────────────────────────────────────────
// Returns array of { type: 'equal' | 'insert' | 'delete', value: string }
export function computeDiff(canonical, comparison) {
  if (!canonical && !comparison) return []
  if (!canonical) return [{ type: 'insert', value: comparison }]
  if (!comparison) return [{ type: 'delete', value: canonical }]

  // Use word-level diff for better readability, falling back to char-level for short strings
  const canonicalNorm = canonical.trim()
  const comparisonNorm = comparison.trim()

  if (canonicalNorm === comparisonNorm) {
    return [{ type: 'equal', value: canonicalNorm }]
  }

  // Character-level LCS-based diff
  const a = canonicalNorm
  const b = comparisonNorm
  const m = a.length
  const n = b.length

  // Build LCS table
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0))
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
      }
    }
  }

  // Backtrack to build diff
  const ops = []
  let i = m, j = n
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
      ops.unshift({ type: 'equal', char: a[i - 1] })
      i--
      j--
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      ops.unshift({ type: 'insert', char: b[j - 1] })
      j--
    } else {
      ops.unshift({ type: 'delete', char: a[i - 1] })
      i--
    }
  }

  // Merge consecutive operations of the same type
  const merged = []
  for (const op of ops) {
    if (merged.length > 0 && merged[merged.length - 1].type === op.type) {
      merged[merged.length - 1].value += op.char
    } else {
      merged.push({ type: op.type, value: op.char })
    }
  }

  return merged
}

// ── Comparison utilities ──────────────────────────────────────────────
export function normalizeForComparison(str) {
  if (!str) return ''
  return str.trim().toLowerCase().replace(/\s+/g, ' ')
    .replace(/\./g, '')
    .replace(/,/g, '')
}

export function fieldsMatch(canonical, comparison) {
  return normalizeForComparison(canonical) === normalizeForComparison(comparison)
}

export function phoneMatch(canonical, comparison) {
  if (!canonical || !comparison) return !canonical && !comparison
  const d1 = canonical.replace(/\D/g, '')
  const d2 = comparison.replace(/\D/g, '')
  const n1 = d1.length === 11 && d1[0] === '1' ? d1.slice(1) : d1
  const n2 = d2.length === 11 && d2[0] === '1' ? d2.slice(1) : d2
  return n1 === n2
}

export function urlMatch(canonical, comparison) {
  return standardizeUrl(canonical) === standardizeUrl(comparison)
}

export function addressMatch(canonical, comparison) {
  if (!canonical || !comparison) return !canonical && !comparison
  const norm1 = standardizeAddress(canonical, true).toLowerCase().replace(/[.,]/g, '').replace(/\s+/g, ' ').trim()
  const norm2 = standardizeAddress(comparison, true).toLowerCase().replace(/[.,]/g, '').replace(/\s+/g, ' ').trim()
  return norm1 === norm2
}

// ── Issue detection ───────────────────────────────────────────────────
export function detectIssues(canonical, entry) {
  const issues = []

  // Name issues
  if (canonical.name && entry.name) {
    const cn = canonical.name.trim()
    const en = entry.name.trim()
    if (cn !== en) {
      // Check LLC variants
      if (/\bL\.?L\.?C\.?\b/i.test(cn) !== /\bL\.?L\.?C\.?\b/i.test(en)) {
        issues.push({
          field: 'name',
          type: 'entity_suffix',
          message: 'Business entity suffix mismatch (e.g., "LLC" vs "L.L.C." or missing)',
          severity: 'medium',
          tip: 'Use the exact same entity suffix everywhere. Google treats "LLC" and "L.L.C." as different businesses.',
        })
      }
      // Check trailing/leading spaces
      if (cn.toLowerCase() === en.toLowerCase() && cn !== en) {
        issues.push({
          field: 'name',
          type: 'case_mismatch',
          message: 'Business name capitalization differs',
          severity: 'low',
          tip: 'While search engines may not penalize case differences, consistent capitalization looks more professional.',
        })
      }
    }
  }

  // Address issues
  if (canonical.address && entry.address) {
    const ca = canonical.address
    const ea = entry.address

    // St vs Street vs St.
    const stVariants = [/\bSt\.?\b/i, /\bStreet\b/i]
    const hasStCanonical = stVariants.some(r => r.test(ca))
    const hasStEntry = stVariants.some(r => r.test(ea))
    if (hasStCanonical && hasStEntry) {
      const canonicalForm = /\bStreet\b/i.test(ca) ? 'Street' : (/\bSt\.\b/i.test(ca) ? 'St.' : 'St')
      const entryForm = /\bStreet\b/i.test(ea) ? 'Street' : (/\bSt\.\b/i.test(ea) ? 'St.' : 'St')
      if (canonicalForm !== entryForm) {
        issues.push({
          field: 'address',
          type: 'abbreviation',
          message: `"${canonicalForm}" vs "${entryForm}" — abbreviation mismatch`,
          severity: 'medium',
          tip: 'Pick one format (abbreviated or full) and use it everywhere. Google may see "123 Main St" and "123 Main Street" as different locations.',
        })
      }
    }

    // Suite/Ste/# variations
    const suiteVariants = [/\bSuite\b/i, /\bSte\.?\b/i, /#/]
    const caSuiteMatch = suiteVariants.findIndex(r => r.test(ca))
    const eaSuiteMatch = suiteVariants.findIndex(r => r.test(ea))
    if (caSuiteMatch !== -1 && eaSuiteMatch !== -1 && caSuiteMatch !== eaSuiteMatch) {
      const labels = ['Suite', 'Ste', '#']
      issues.push({
        field: 'address',
        type: 'suite_format',
        message: `"${labels[caSuiteMatch]}" vs "${labels[eaSuiteMatch]}" — suite format mismatch`,
        severity: 'medium',
        tip: 'Use the same suite/unit format across all directories.',
      })
    }

    // Ave vs Avenue
    const aveVariants = [/\bAve\.?\b/i, /\bAvenue\b/i]
    if (aveVariants[0].test(ca) && aveVariants[1].test(ea) || aveVariants[1].test(ca) && aveVariants[0].test(ea)) {
      issues.push({
        field: 'address',
        type: 'abbreviation',
        message: '"Ave" vs "Avenue" — abbreviation mismatch',
        severity: 'medium',
        tip: 'Standardize all address abbreviations. Use either full words or abbreviations consistently.',
      })
    }

    // Blvd vs Boulevard
    const blvdVariants = [/\bBlvd\.?\b/i, /\bBoulevard\b/i]
    if (blvdVariants[0].test(ca) && blvdVariants[1].test(ea) || blvdVariants[1].test(ca) && blvdVariants[0].test(ea)) {
      issues.push({
        field: 'address',
        type: 'abbreviation',
        message: '"Blvd" vs "Boulevard" — abbreviation mismatch',
        severity: 'medium',
        tip: 'Standardize all address abbreviations. Use either full words or abbreviations consistently.',
      })
    }

    // Trailing/leading spaces
    if (ca !== ca.trim() || ea !== ea.trim()) {
      issues.push({
        field: 'address',
        type: 'whitespace',
        message: 'Extra leading or trailing spaces detected',
        severity: 'low',
        tip: 'Remove extra spaces — some directories treat them as different characters.',
      })
    }
  }

  // Phone issues
  if (canonical.phone && entry.phone) {
    const cp = canonical.phone.replace(/\D/g, '')
    const ep = entry.phone.replace(/\D/g, '')
    if (cp === ep && canonical.phone.trim() !== entry.phone.trim()) {
      issues.push({
        field: 'phone',
        type: 'format',
        message: `Phone format differs: "${canonical.phone.trim()}" vs "${entry.phone.trim()}"`,
        severity: 'low',
        tip: 'Use a consistent phone format. (555) 555-5555 is the most common standard.',
      })
    }
  }

  // State issues
  if (canonical.state && entry.state) {
    const cs = canonical.state.trim()
    const es = entry.state.trim()
    if (cs.toLowerCase() !== es.toLowerCase()) {
      const csAbbr = standardizeState(cs)
      const esAbbr = standardizeState(es)
      if (csAbbr === esAbbr) {
        issues.push({
          field: 'address',
          type: 'state_format',
          message: `State format differs: "${cs}" vs "${es}"`,
          severity: 'low',
          tip: 'Use the 2-letter state abbreviation consistently across all listings.',
        })
      }
    }
  }

  // URL issues
  if (canonical.website && entry.website) {
    const cu = canonical.website.trim()
    const eu = entry.website.trim()
    if (cu !== eu && standardizeUrl(cu) === standardizeUrl(eu)) {
      const hasHttp = /^https?:\/\//i.test(cu) !== /^https?:\/\//i.test(eu)
      const hasWww = /^(https?:\/\/)?www\./i.test(cu) !== /^(https?:\/\/)?www\./i.test(eu)
      if (hasHttp || hasWww) {
        issues.push({
          field: 'website',
          type: 'url_format',
          message: 'URL format differs (http/https/www variations)',
          severity: 'low',
          tip: 'Use the exact same URL format everywhere, including the protocol (https://) and www prefix.',
        })
      }
    }
  }

  // ZIP+4
  if (canonical.zip && entry.zip) {
    const cz = canonical.zip.trim()
    const ez = entry.zip.trim()
    if (cz !== ez) {
      const czBase = cz.split('-')[0]
      const ezBase = ez.split('-')[0]
      if (czBase === ezBase && cz.includes('-') !== ez.includes('-')) {
        issues.push({
          field: 'address',
          type: 'zip_format',
          message: `ZIP code format differs: "${cz}" vs "${ez}" (ZIP+4 mismatch)`,
          severity: 'low',
          tip: 'Use the same ZIP code format. If you use ZIP+4, use it everywhere.',
        })
      }
    }
  }

  return issues
}

// ── Directory database ────────────────────────────────────────────────
export const DIRECTORIES = [
  { name: 'Google Business Profile', url: 'https://business.google.com/', categories: ['all'], icon: 'search' },
  { name: 'Yelp', url: 'https://biz.yelp.com/', categories: ['all'], icon: 'star' },
  { name: 'Facebook', url: 'https://www.facebook.com/business/', categories: ['all'], icon: 'share' },
  { name: 'Apple Maps', url: 'https://mapsconnect.apple.com/', categories: ['all'], icon: 'map' },
  { name: 'Bing Places', url: 'https://www.bingplaces.com/', categories: ['all'], icon: 'search' },
  { name: 'BBB', url: 'https://www.bbb.org/', categories: ['all'], icon: 'shield' },
  { name: 'Yellow Pages', url: 'https://www.yellowpages.com/', categories: ['all'], icon: 'book' },
  { name: 'Nextdoor', url: 'https://business.nextdoor.com/', categories: ['all'], icon: 'home' },
  { name: 'Angi', url: 'https://www.angi.com/', categories: ['home-services', 'contractors'], icon: 'wrench' },
  { name: 'Thumbtack', url: 'https://www.thumbtack.com/', categories: ['home-services', 'contractors', 'professional-services'], icon: 'wrench' },
  { name: 'Healthgrades', url: 'https://www.healthgrades.com/', categories: ['medical', 'healthcare'], icon: 'heart' },
  { name: 'Zocdoc', url: 'https://www.zocdoc.com/', categories: ['medical', 'healthcare'], icon: 'heart' },
  { name: 'Vitals', url: 'https://www.vitals.com/', categories: ['medical', 'healthcare'], icon: 'heart' },
  { name: 'Avvo', url: 'https://www.avvo.com/', categories: ['legal'], icon: 'scale' },
  { name: 'FindLaw', url: 'https://www.findlaw.com/', categories: ['legal'], icon: 'scale' },
  { name: 'Justia', url: 'https://www.justia.com/', categories: ['legal'], icon: 'scale' },
  { name: 'TripAdvisor', url: 'https://www.tripadvisor.com/', categories: ['hospitality', 'restaurants', 'travel'], icon: 'plane' },
  { name: 'OpenTable', url: 'https://restaurant.opentable.com/', categories: ['restaurants'], icon: 'utensils' },
  { name: 'DoorDash', url: 'https://www.doordash.com/merchant/', categories: ['restaurants'], icon: 'utensils' },
  { name: 'Houzz', url: 'https://www.houzz.com/', categories: ['home-services', 'contractors', 'real-estate'], icon: 'home' },
  { name: 'Zillow', url: 'https://www.zillow.com/', categories: ['real-estate'], icon: 'home' },
  { name: 'Realtor.com', url: 'https://www.realtor.com/', categories: ['real-estate'], icon: 'home' },
  { name: 'Cars.com', url: 'https://www.cars.com/', categories: ['automotive'], icon: 'truck' },
  { name: 'AutoTrader', url: 'https://www.autotrader.com/', categories: ['automotive'], icon: 'truck' },
  { name: 'MapQuest', url: 'https://www.mapquest.com/', categories: ['all'], icon: 'map' },
  { name: 'Foursquare', url: 'https://foursquare.com/', categories: ['all'], icon: 'map' },
  { name: 'ChamberOfCommerce.com', url: 'https://www.chamberofcommerce.com/', categories: ['all'], icon: 'building' },
  { name: 'Manta', url: 'https://www.manta.com/', categories: ['all'], icon: 'building' },
]

export const INDUSTRY_CATEGORIES = [
  { value: 'all', label: 'All Industries / General' },
  { value: 'home-services', label: 'Home Services' },
  { value: 'contractors', label: 'Contractors' },
  { value: 'medical', label: 'Medical / Healthcare' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'legal', label: 'Legal' },
  { value: 'hospitality', label: 'Hospitality' },
  { value: 'restaurants', label: 'Restaurants' },
  { value: 'travel', label: 'Travel' },
  { value: 'real-estate', label: 'Real Estate' },
  { value: 'automotive', label: 'Automotive' },
  { value: 'professional-services', label: 'Professional Services' },
]

export const DIRECTORY_NAMES = [
  'Google Business Profile',
  'Yelp',
  'Facebook',
  'Apple Maps',
  'Bing Places',
  'BBB',
  'Yellow Pages',
  'Nextdoor',
  'Angi',
  'Thumbtack',
  'Healthgrades',
  'TripAdvisor',
  'Houzz',
  'Other',
]
