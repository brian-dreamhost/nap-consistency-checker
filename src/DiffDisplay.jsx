import { useMemo } from 'react'
import { computeDiff } from './napUtils.js'

export default function DiffDisplay({ canonical, comparison, label }) {
  const diff = useMemo(() => computeDiff(canonical, comparison), [canonical, comparison])

  if (!canonical && !comparison) return null

  const isMatch = diff.length === 1 && diff[0].type === 'equal'

  return (
    <div className="mb-3">
      <p className="text-xs font-medium text-galactic uppercase tracking-wider mb-1">{label}</p>
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="bg-abyss/60 border border-metal/20 rounded-lg px-3 py-2 text-sm font-mono break-all">
            {diff.map((part, i) => {
              if (part.type === 'equal') {
                return <span key={i} className="text-white">{part.value}</span>
              }
              if (part.type === 'delete') {
                return (
                  <span key={i} className="bg-coral/20 text-coral line-through">{part.value}</span>
                )
              }
              if (part.type === 'insert') {
                return (
                  <span key={i} className="bg-tangerine/20 text-tangerine underline">{part.value}</span>
                )
              }
              return null
            })}
            {!comparison && canonical && (
              <span className="text-galactic italic"> (missing)</span>
            )}
          </div>
        </div>
        <div className="flex-shrink-0 pt-1.5">
          {isMatch ? (
            <svg className="w-5 h-5 text-turtle" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-coral" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          )}
        </div>
      </div>
    </div>
  )
}
