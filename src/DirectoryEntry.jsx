import { useState, useMemo } from 'react'
import DiffDisplay from './DiffDisplay.jsx'
import { fieldsMatch, phoneMatch, urlMatch, addressMatch, DIRECTORY_NAMES } from './napUtils.js'

export default function DirectoryEntry({ canonical, entry, index, onUpdate, onRemove }) {
  const [expanded, setExpanded] = useState(true)

  const update = (field, value) => {
    onUpdate(index, { ...entry, [field]: value })
  }

  // Build the canonical full address for comparison
  const canonicalFullAddress = useMemo(() => {
    const parts = [canonical.address]
    if (canonical.city || canonical.state || canonical.zip) {
      parts.push([canonical.city, canonical.state].filter(Boolean).join(', ') + (canonical.zip ? ' ' + canonical.zip : ''))
    }
    return parts.filter(Boolean).join(', ')
  }, [canonical])

  // Build entry full address
  const entryFullAddress = entry.address || ''

  // Match status
  const status = useMemo(() => {
    const nameOk = !canonical.name || fieldsMatch(canonical.name, entry.name)
    const addressOk = !canonical.address || addressMatch(canonicalFullAddress, entryFullAddress)
    const phoneOk = !canonical.phone || phoneMatch(canonical.phone, entry.phone)
    const websiteOk = !canonical.website || urlMatch(canonical.website, entry.website)

    const checks = []
    if (canonical.name) checks.push(nameOk)
    if (canonical.address) checks.push(addressOk)
    if (canonical.phone) checks.push(phoneOk)
    if (canonical.website) checks.push(websiteOk)

    const matched = checks.filter(Boolean).length
    const total = checks.length

    if (total === 0) return { label: 'No Data', badgeClass: 'border-galactic/30 text-galactic bg-metal/20' }
    if (matched === total) return { label: 'Match', badgeClass: 'border-turtle/30 text-turtle bg-turtle/10' }
    if (matched === 0) return { label: 'Mismatch', badgeClass: 'border-coral/30 text-coral bg-coral/10' }
    return { label: 'Partial Match', badgeClass: 'border-tangerine/30 text-tangerine bg-tangerine/10' }
  }, [canonical, entry, canonicalFullAddress, entryFullAddress])

  return (
    <div className="card-gradient border border-metal/20 rounded-2xl overflow-hidden">
      {/* Header - always visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition-colors text-left"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-azure/10 border border-azure/20 flex items-center justify-center text-sm font-bold text-azure">
            {index + 1}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-white truncate">
              {entry.directory || 'New Listing'}
            </p>
            {entry.name && (
              <p className="text-xs text-galactic truncate">{entry.name}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${status.badgeClass}`}>
            {status.label}
          </span>
          <svg
            className={`w-5 h-5 text-galactic transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="px-5 pb-5 border-t border-metal/10">
          <div className="pt-4 space-y-4">
            {/* Directory picker */}
            <div>
              <label className="block text-sm font-medium text-cloudy mb-1.5">Directory</label>
              <select
                value={entry.directory}
                onChange={e => update('directory', e.target.value)}
                className="w-full bg-midnight border border-metal/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-azure focus:border-transparent transition-colors appearance-none cursor-pointer"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23677983'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m19.5 8.25-7.5 7.5-7.5-7.5'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1.25rem' }}
              >
                <option value="">Select a directory...</option>
                {DIRECTORY_NAMES.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Business Name */}
            <div>
              <label className="block text-sm font-medium text-cloudy mb-1.5">Business Name (as it appears)</label>
              <input
                type="text"
                value={entry.name}
                onChange={e => update('name', e.target.value)}
                placeholder="How the name appears on this directory"
                className="w-full bg-midnight border border-metal/30 rounded-lg px-4 py-3 text-white placeholder-galactic focus:outline-none focus:ring-2 focus:ring-azure focus:border-transparent transition-colors"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-cloudy mb-1.5">Full Address (as it appears)</label>
              <input
                type="text"
                value={entry.address}
                onChange={e => update('address', e.target.value)}
                placeholder="Full address as shown on this directory"
                className="w-full bg-midnight border border-metal/30 rounded-lg px-4 py-3 text-white placeholder-galactic focus:outline-none focus:ring-2 focus:ring-azure focus:border-transparent transition-colors"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-cloudy mb-1.5">Phone (as it appears)</label>
              <input
                type="tel"
                value={entry.phone}
                onChange={e => update('phone', e.target.value)}
                placeholder="Phone number as shown on this directory"
                className="w-full bg-midnight border border-metal/30 rounded-lg px-4 py-3 text-white placeholder-galactic focus:outline-none focus:ring-2 focus:ring-azure focus:border-transparent transition-colors"
              />
            </div>

            {/* Website */}
            <div>
              <label className="block text-sm font-medium text-cloudy mb-1.5">Website (as it appears)</label>
              <input
                type="text"
                value={entry.website}
                onChange={e => update('website', e.target.value)}
                placeholder="Website URL as shown on this directory"
                className="w-full bg-midnight border border-metal/30 rounded-lg px-4 py-3 text-white placeholder-galactic focus:outline-none focus:ring-2 focus:ring-azure focus:border-transparent transition-colors"
              />
            </div>

            {/* Diff Display */}
            {(entry.name || entry.address || entry.phone || entry.website) && (
              <div className="mt-4 pt-4 border-t border-metal/10">
                <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4 text-prince" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                  </svg>
                  Comparison with Canonical NAP
                </h4>
                {canonical.name && (
                  <DiffDisplay
                    canonical={canonical.name}
                    comparison={entry.name}
                    label="Business Name"
                  />
                )}
                {canonical.address && (
                  <DiffDisplay
                    canonical={canonicalFullAddress}
                    comparison={entry.address}
                    label="Address"
                  />
                )}
                {canonical.phone && (
                  <DiffDisplay
                    canonical={canonical.phone}
                    comparison={entry.phone}
                    label="Phone"
                  />
                )}
                {canonical.website && (
                  <DiffDisplay
                    canonical={canonical.website}
                    comparison={entry.website}
                    label="Website"
                  />
                )}
              </div>
            )}

            {/* Remove button */}
            <div className="pt-2">
              <button
                onClick={() => onRemove(index)}
                className="text-sm text-coral hover:text-white transition-colors flex items-center gap-1.5 min-h-[44px] py-2 focus:outline-none focus:ring-2 focus:ring-coral focus:ring-offset-2 focus:ring-offset-abyss rounded-lg"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
                Remove Listing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
