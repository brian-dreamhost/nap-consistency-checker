import { useState } from 'react'
import { DIRECTORIES, INDUSTRY_CATEGORIES } from './napUtils.js'

const STATUS_OPTIONS = [
  { value: 'not-checked', label: 'Not Checked', activeClass: 'border-galactic/40 text-galactic bg-metal/10', inactiveClass: 'border-metal/20 text-galactic hover:text-cloudy hover:border-metal/40' },
  { value: 'matches', label: 'Matches', activeClass: 'border-turtle/40 text-turtle bg-turtle/10', inactiveClass: 'border-metal/20 text-galactic hover:text-cloudy hover:border-metal/40' },
  { value: 'needs-fix', label: 'Needs Fix', activeClass: 'border-coral/40 text-coral bg-coral/10', inactiveClass: 'border-metal/20 text-galactic hover:text-cloudy hover:border-metal/40' },
  { value: 'not-listed', label: 'Not Listed', activeClass: 'border-tangerine/40 text-tangerine bg-tangerine/10', inactiveClass: 'border-metal/20 text-galactic hover:text-cloudy hover:border-metal/40' },
]

export default function DirectoryChecklist({ checklist, setChecklist }) {
  const [filter, setFilter] = useState('all')
  const [expanded, setExpanded] = useState(true)

  const filteredDirectories = DIRECTORIES.filter(dir => {
    if (filter === 'all') return dir.categories.includes('all')
    return dir.categories.includes('all') || dir.categories.includes(filter)
  })

  const updateStatus = (dirName, status) => {
    setChecklist(prev => ({ ...prev, [dirName]: status }))
  }

  const getStatus = (dirName) => checklist[dirName] || 'not-checked'

  const stats = {
    total: filteredDirectories.length,
    matches: filteredDirectories.filter(d => getStatus(d.name) === 'matches').length,
    needsFix: filteredDirectories.filter(d => getStatus(d.name) === 'needs-fix').length,
    notListed: filteredDirectories.filter(d => getStatus(d.name) === 'not-listed').length,
    notChecked: filteredDirectories.filter(d => getStatus(d.name) === 'not-checked').length,
  }

  return (
    <section className="mb-8">
      <div className="card-gradient border border-metal/20 rounded-2xl overflow-hidden">
        {/* Header */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between px-6 sm:px-8 py-6 hover:bg-white/[0.02] transition-colors text-left"
        >
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <svg className="w-6 h-6 text-turtle" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              Directory Audit Checklist
            </h2>
            <p className="text-sm text-galactic mt-0.5">
              Track your NAP status across {stats.total} directories
            </p>
          </div>
          <div className="flex items-center gap-4 flex-shrink-0">
            {stats.matches > 0 && (
              <span className="text-xs font-medium text-turtle hidden sm:block">{stats.matches} verified</span>
            )}
            {stats.needsFix > 0 && (
              <span className="text-xs font-medium text-coral hidden sm:block">{stats.needsFix} need{stats.needsFix === 1 ? 's' : ''} fix</span>
            )}
            <svg
              className={`w-5 h-5 text-galactic transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
              fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </div>
        </button>

        {expanded && (
          <div className="px-6 sm:px-8 pb-6">
            {/* Industry filter */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-cloudy mb-1.5">Filter by Industry</label>
              <select
                value={filter}
                onChange={e => setFilter(e.target.value)}
                className="w-full sm:w-auto bg-midnight border border-metal/30 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-azure focus:border-transparent transition-colors appearance-none cursor-pointer"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23677983'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m19.5 8.25-7.5 7.5-7.5-7.5'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1.25rem', paddingRight: '2.5rem' }}
              >
                {INDUSTRY_CATEGORIES.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <div className="bg-abyss/50 border border-metal/20 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-turtle">{stats.matches}</p>
                <p className="text-xs text-galactic">Verified</p>
              </div>
              <div className="bg-abyss/50 border border-metal/20 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-coral">{stats.needsFix}</p>
                <p className="text-xs text-galactic">Needs Fix</p>
              </div>
              <div className="bg-abyss/50 border border-metal/20 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-tangerine">{stats.notListed}</p>
                <p className="text-xs text-galactic">Not Listed</p>
              </div>
              <div className="bg-abyss/50 border border-metal/20 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-galactic">{stats.notChecked}</p>
                <p className="text-xs text-galactic">Unchecked</p>
              </div>
            </div>

            {/* Directory list */}
            <div className="space-y-2">
              {filteredDirectories.map(dir => {
                const status = getStatus(dir.name)
                const statusConfig = STATUS_OPTIONS.find(s => s.value === status)
                return (
                  <div
                    key={dir.name}
                    className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 bg-abyss/30 border border-metal/10 rounded-xl px-4 py-3"
                  >
                    {/* Directory info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white text-sm">{dir.name}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                      {/* Status selector */}
                      <div className="flex gap-1">
                        {STATUS_OPTIONS.map(opt => (
                          <button
                            key={opt.value}
                            onClick={() => updateStatus(dir.name, opt.value)}
                            className={`text-xs px-2.5 py-1.5 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-azure focus:ring-offset-1 focus:ring-offset-abyss ${
                              status === opt.value
                                ? opt.activeClass
                                : opt.inactiveClass
                            }`}
                            title={opt.label}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>

                      {/* Edit link */}
                      <a
                        href={dir.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-azure hover:text-white transition-colors px-2.5 py-1.5 border border-azure/20 rounded-lg hover:border-azure/40"
                      >
                        Edit
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                        </svg>
                      </a>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
