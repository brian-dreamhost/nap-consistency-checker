import { useMemo, useState } from 'react'
import { standardizePhone, standardizeState, getStateFull, standardizeAddress } from './napUtils.js'

export default function CanonicalNAP({ canonical, setCanonical, onCopy }) {
  const [copied, setCopied] = useState(false)

  const update = (field, value) => {
    setCanonical(prev => ({ ...prev, [field]: value }))
  }

  const standardized = useMemo(() => {
    const phone = standardizePhone(canonical.phone)
    const stateAbbr = standardizeState(canonical.state)
    const stateFull = getStateFull(stateAbbr)
    const addressAbbr = standardizeAddress(canonical.address, true)
    const addressFull = standardizeAddress(canonical.address, false)
    return { phone, stateAbbr, stateFull, addressAbbr, addressFull }
  }, [canonical])

  const hasInput = canonical.name || canonical.address || canonical.phone

  const handleCopy = () => {
    onCopy()
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="mb-8">
      <div className="card-gradient border border-metal/20 rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-2">
          <svg className="w-6 h-6 text-turtle" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          <h2 className="text-xl font-bold text-white">Enter Your Correct Business Information</h2>
        </div>
        <p className="text-cloudy text-sm mb-6">
          This is your canonical NAP. Every directory should match this exactly.
        </p>

        <div className="space-y-4">
          {/* Business Name */}
          <div>
            <label className="block text-sm font-medium text-cloudy mb-1.5">Business Name</label>
            <input
              type="text"
              value={canonical.name}
              onChange={e => update('name', e.target.value)}
              placeholder="e.g., Acme Web Design LLC"
              className="w-full bg-midnight border border-metal/30 rounded-lg px-4 py-3 text-white placeholder-galactic focus:outline-none focus:ring-2 focus:ring-azure focus:border-transparent transition-colors"
            />
          </div>

          {/* Street Address */}
          <div>
            <label className="block text-sm font-medium text-cloudy mb-1.5">Street Address</label>
            <input
              type="text"
              value={canonical.address}
              onChange={e => update('address', e.target.value)}
              placeholder="e.g., 123 Main Street, Suite 200"
              className="w-full bg-midnight border border-metal/30 rounded-lg px-4 py-3 text-white placeholder-galactic focus:outline-none focus:ring-2 focus:ring-azure focus:border-transparent transition-colors"
            />
          </div>

          {/* City, State, ZIP row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-cloudy mb-1.5">City</label>
              <input
                type="text"
                value={canonical.city}
                onChange={e => update('city', e.target.value)}
                placeholder="e.g., Portland"
                className="w-full bg-midnight border border-metal/30 rounded-lg px-4 py-3 text-white placeholder-galactic focus:outline-none focus:ring-2 focus:ring-azure focus:border-transparent transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-cloudy mb-1.5">State</label>
              <input
                type="text"
                value={canonical.state}
                onChange={e => update('state', e.target.value)}
                placeholder="e.g., OR or Oregon"
                className="w-full bg-midnight border border-metal/30 rounded-lg px-4 py-3 text-white placeholder-galactic focus:outline-none focus:ring-2 focus:ring-azure focus:border-transparent transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-cloudy mb-1.5">ZIP Code</label>
              <input
                type="text"
                value={canonical.zip}
                onChange={e => update('zip', e.target.value)}
                placeholder="e.g., 97201"
                className="w-full bg-midnight border border-metal/30 rounded-lg px-4 py-3 text-white placeholder-galactic focus:outline-none focus:ring-2 focus:ring-azure focus:border-transparent transition-colors"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-cloudy mb-1.5">Phone Number</label>
            <input
              type="tel"
              value={canonical.phone}
              onChange={e => update('phone', e.target.value)}
              placeholder="e.g., (555) 123-4567"
              className="w-full bg-midnight border border-metal/30 rounded-lg px-4 py-3 text-white placeholder-galactic focus:outline-none focus:ring-2 focus:ring-azure focus:border-transparent transition-colors"
            />
          </div>

          {/* Website */}
          <div>
            <label className="block text-sm font-medium text-cloudy mb-1.5">Website URL</label>
            <input
              type="url"
              value={canonical.website}
              onChange={e => update('website', e.target.value)}
              placeholder="e.g., https://www.acmewebdesign.com"
              className="w-full bg-midnight border border-metal/30 rounded-lg px-4 py-3 text-white placeholder-galactic focus:outline-none focus:ring-2 focus:ring-azure focus:border-transparent transition-colors"
            />
          </div>
        </div>

        {/* Standardized Preview */}
        {hasInput && (
          <div className="mt-6 pt-6 border-t border-metal/20">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-azure" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
              </svg>
              Standardized Format
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Abbreviated */}
              <div className="bg-abyss/50 border border-metal/20 rounded-xl p-4">
                <p className="text-xs font-medium text-galactic uppercase tracking-wider mb-2">Abbreviated</p>
                <div className="text-sm text-white space-y-0.5">
                  {canonical.name && <p>{canonical.name}</p>}
                  {standardized.addressAbbr && <p>{standardized.addressAbbr}</p>}
                  {(canonical.city || standardized.stateAbbr || canonical.zip) && (
                    <p>
                      {[canonical.city, standardized.stateAbbr].filter(Boolean).join(', ')}
                      {canonical.zip ? ' ' + canonical.zip : ''}
                    </p>
                  )}
                  {standardized.phone && <p>{standardized.phone}</p>}
                  {canonical.website && <p className="text-azure">{canonical.website}</p>}
                </div>
              </div>
              {/* Full */}
              <div className="bg-abyss/50 border border-metal/20 rounded-xl p-4">
                <p className="text-xs font-medium text-galactic uppercase tracking-wider mb-2">Full</p>
                <div className="text-sm text-white space-y-0.5">
                  {canonical.name && <p>{canonical.name}</p>}
                  {standardized.addressFull && <p>{standardized.addressFull}</p>}
                  {(canonical.city || standardized.stateFull || canonical.zip) && (
                    <p>
                      {[canonical.city, standardized.stateFull || standardized.stateAbbr].filter(Boolean).join(', ')}
                      {canonical.zip ? ' ' + canonical.zip : ''}
                    </p>
                  )}
                  {standardized.phone && <p>{standardized.phone}</p>}
                  {canonical.website && <p className="text-azure">{canonical.website}</p>}
                </div>
              </div>
            </div>
            <button
              onClick={handleCopy}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-azure hover:bg-azure-hover text-white text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-azure focus:ring-offset-2 focus:ring-offset-abyss"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9.75a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
              </svg>
              {copied ? 'Copied!' : 'Copy Standardized NAP'}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
