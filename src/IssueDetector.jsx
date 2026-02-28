import { useMemo } from 'react'
import { detectIssues } from './napUtils.js'

const SEVERITY_CONFIG = {
  high: {
    label: 'High',
    icon: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z',
    cardClass: 'border-coral/20',
    iconClass: 'text-coral',
    badgeClass: 'border-coral/30 text-coral',
  },
  medium: {
    label: 'Medium',
    icon: 'M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z',
    cardClass: 'border-tangerine/20',
    iconClass: 'text-tangerine',
    badgeClass: 'border-tangerine/30 text-tangerine',
  },
  low: {
    label: 'Low',
    icon: 'm11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z',
    cardClass: 'border-azure/20',
    iconClass: 'text-azure',
    badgeClass: 'border-azure/30 text-azure',
  },
}

export default function IssueDetector({ canonical, entries }) {
  const allIssues = useMemo(() => {
    const issues = []
    for (const entry of entries) {
      const entryWithState = { ...entry, state: '' }
      const canonicalWithState = { ...canonical }
      const detected = detectIssues(canonicalWithState, entryWithState)
      for (const issue of detected) {
        // Deduplicate
        const key = `${issue.type}-${issue.message}`
        if (!issues.find(i => `${i.type}-${i.message}` === key)) {
          issues.push({ ...issue, directories: [entry.directory || `Listing ${entries.indexOf(entry) + 1}`] })
        } else {
          const existing = issues.find(i => `${i.type}-${i.message}` === key)
          existing.directories.push(entry.directory || `Listing ${entries.indexOf(entry) + 1}`)
        }
      }
    }
    // Sort by severity
    const order = { high: 0, medium: 1, low: 2 }
    issues.sort((a, b) => (order[a.severity] ?? 2) - (order[b.severity] ?? 2))
    return issues
  }, [canonical, entries])

  if (allIssues.length === 0) return null

  return (
    <section className="mb-8">
      <div className="card-gradient border border-metal/20 rounded-2xl p-6 sm:p-8">
        <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          <svg className="w-6 h-6 text-tangerine" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
          Common Issues Detected
        </h2>
        <p className="text-sm text-galactic mb-6">
          {allIssues.length} inconsistenc{allIssues.length === 1 ? 'y' : 'ies'} found across your listings
        </p>

        <div className="space-y-3">
          {allIssues.map((issue, i) => {
            const config = SEVERITY_CONFIG[issue.severity] || SEVERITY_CONFIG.low
            return (
              <div
                key={i}
                className={`bg-abyss/50 border ${config.cardClass} rounded-xl p-4`}
              >
                <div className="flex items-start gap-3">
                  <svg className={`w-5 h-5 ${config.iconClass} flex-shrink-0 mt-0.5`} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d={config.icon} />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-medium text-white text-sm">{issue.message}</span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${config.badgeClass}`}>
                        {config.label}
                      </span>
                    </div>
                    <p className="text-sm text-cloudy mb-2">{issue.tip}</p>
                    <p className="text-xs text-galactic">
                      Found in: {issue.directories.join(', ')}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
