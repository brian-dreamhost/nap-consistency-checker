import { useMemo } from 'react'
import { fieldsMatch, phoneMatch, urlMatch, addressMatch } from './napUtils.js'

const COLOR_MAP = {
  turtle: { text: 'text-turtle', bg: 'bg-turtle' },
  tangerine: { text: 'text-tangerine', bg: 'bg-tangerine' },
  coral: { text: 'text-coral', bg: 'bg-coral' },
  galactic: { text: 'text-galactic', bg: 'bg-galactic' },
}

function ScoreBar({ label, matched, total, color }) {
  const pct = total > 0 ? Math.round((matched / total) * 100) : 0
  const colorClasses = COLOR_MAP[color] || COLOR_MAP.galactic

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm font-medium text-cloudy">{label}</span>
        <span className={`text-sm font-bold ${colorClasses.text}`}>{matched}/{total} match</span>
      </div>
      <div className="h-2.5 bg-metal/20 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${colorClasses.bg}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

function CircularGauge({ percentage, size = 120, strokeWidth = 8 }) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference

  let colorClass = 'text-turtle'
  if (percentage < 50) colorClass = 'text-coral'
  else if (percentage < 80) colorClass = 'text-tangerine'

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-metal/20"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={`${colorClass} transition-all duration-700 ease-out`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-2xl font-bold ${colorClass}`}>{percentage}%</span>
        <span className="text-xs text-galactic">consistent</span>
      </div>
    </div>
  )
}

export default function ConsistencyScore({ canonical, entries }) {
  const scores = useMemo(() => {
    let nameMatched = 0, nameTotal = 0
    let addressMatched = 0, addressTotal = 0
    let phoneMatched = 0, phoneTotal = 0
    let websiteMatched = 0, websiteTotal = 0

    const canonicalFullAddress = [
      canonical.address,
      [canonical.city, canonical.state].filter(Boolean).join(', ') + (canonical.zip ? ' ' + canonical.zip : '')
    ].filter(Boolean).join(', ')

    for (const entry of entries) {
      if (canonical.name && entry.name) {
        nameTotal++
        if (fieldsMatch(canonical.name, entry.name)) nameMatched++
      }
      if (canonical.address && entry.address) {
        addressTotal++
        if (addressMatch(canonicalFullAddress, entry.address)) addressMatched++
      }
      if (canonical.phone && entry.phone) {
        phoneTotal++
        if (phoneMatch(canonical.phone, entry.phone)) phoneMatched++
      }
      if (canonical.website && entry.website) {
        websiteTotal++
        if (urlMatch(canonical.website, entry.website)) websiteMatched++
      }
    }

    const totalChecks = nameTotal + addressTotal + phoneTotal + websiteTotal
    const totalMatched = nameMatched + addressMatched + phoneMatched + websiteMatched
    const overallPct = totalChecks > 0 ? Math.round((totalMatched / totalChecks) * 100) : 0

    return {
      overall: overallPct,
      name: { matched: nameMatched, total: nameTotal },
      address: { matched: addressMatched, total: addressTotal },
      phone: { matched: phoneMatched, total: phoneTotal },
      website: { matched: websiteMatched, total: websiteTotal },
    }
  }, [canonical, entries])

  const getFieldColor = (matched, total) => {
    if (total === 0) return 'galactic'
    if (matched === total) return 'turtle'
    if (matched > 0) return 'tangerine'
    return 'coral'
  }

  const nameColor = getFieldColor(scores.name.matched, scores.name.total)
  const addressColor = getFieldColor(scores.address.matched, scores.address.total)
  const phoneColor = getFieldColor(scores.phone.matched, scores.phone.total)
  const websiteColor = getFieldColor(scores.website.matched, scores.website.total)

  const overallTextClass = scores.overall >= 80 ? 'text-turtle' : scores.overall >= 50 ? 'text-tangerine' : 'text-coral'

  return (
    <section className="mb-8">
      <div className="card-gradient border border-metal/20 rounded-2xl p-6 sm:p-8">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <svg className="w-6 h-6 text-azure" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
          </svg>
          Consistency Score
        </h2>

        <div className="flex flex-col sm:flex-row items-center gap-8">
          {/* Circular gauge */}
          <div className="flex-shrink-0">
            <CircularGauge percentage={scores.overall} />
          </div>

          {/* Per-field bars */}
          <div className="flex-1 w-full space-y-4">
            <ScoreBar label="Business Name" matched={scores.name.matched} total={scores.name.total} color={nameColor} />
            <ScoreBar label="Address" matched={scores.address.matched} total={scores.address.total} color={addressColor} />
            <ScoreBar label="Phone" matched={scores.phone.matched} total={scores.phone.total} color={phoneColor} />
            <ScoreBar label="Website" matched={scores.website.matched} total={scores.website.total} color={websiteColor} />
          </div>
        </div>

        {/* Summary message */}
        <div className={`mt-6 pt-4 border-t border-metal/20 text-sm ${overallTextClass}`}>
          {scores.overall === 100 && (
            <p className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              All checked directories match your canonical NAP. Great job!
            </p>
          )}
          {scores.overall >= 80 && scores.overall < 100 && (
            <p className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              Good consistency! A few listings need updates.
            </p>
          )}
          {scores.overall >= 50 && scores.overall < 80 && (
            <p className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
              Several inconsistencies found. Fix these to improve your local SEO.
            </p>
          )}
          {scores.overall < 50 && scores.overall > 0 && (
            <p className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
              Major inconsistencies detected. This could be hurting your local search rankings.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
