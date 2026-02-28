import { useState } from 'react'

const FACTS = [
  {
    title: 'NAP Inconsistencies Confuse Google',
    description: 'Inconsistent NAP across directories confuses Google and can lower your local rankings. Google cross-references your info across 100+ sources to verify your business is legitimate.',
  },
  {
    title: 'Small Differences Count',
    description: 'Even small differences like "St" vs "Street" or "(555) 555-5555" vs "555-555-5555" count as inconsistencies. Search engines treat these as potentially different businesses.',
  },
  {
    title: 'NAP Is a Top Local Ranking Factor',
    description: 'According to local SEO studies, citation consistency is one of the top 5 factors for local pack rankings. Businesses with consistent NAP across directories rank significantly higher.',
  },
  {
    title: 'Quick Win for Local SEO',
    description: 'Fixing NAP inconsistencies is one of the fastest local SEO wins. Unlike building backlinks or creating content, cleaning up your citations can show results within weeks.',
  },
  {
    title: 'Impact on Customer Trust',
    description: 'Inconsistent business information erodes customer trust. If your phone number or address differs across platforms, potential customers may question whether your business is legitimate.',
  },
]

export default function EducationalSection() {
  const [expanded, setExpanded] = useState(false)

  return (
    <section className="mb-8">
      <div className="card-gradient border border-metal/20 rounded-2xl overflow-hidden">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between px-6 sm:px-8 py-5 hover:bg-white/[0.02] transition-colors text-left"
        >
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-azure" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
            </svg>
            Why NAP Consistency Matters
          </h2>
          <svg
            className={`w-5 h-5 text-galactic transition-transform duration-200 flex-shrink-0 ${expanded ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </button>

        {expanded && (
          <div className="px-6 sm:px-8 pb-6 border-t border-metal/10">
            <div className="pt-4 space-y-4">
              {FACTS.map((fact, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-azure/10 border border-azure/20 flex items-center justify-center text-sm font-bold text-azure mt-0.5">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm mb-1">{fact.title}</h3>
                    <p className="text-sm text-cloudy leading-relaxed">{fact.description}</p>
                  </div>
                </div>
              ))}

              <div className="mt-6 pt-4 border-t border-metal/20">
                <p className="text-sm text-galactic">
                  <span className="text-white font-medium">Pro tip:</span> Start with the top 8 general directories (Google, Yelp, Facebook, Apple Maps, Bing, BBB, Yellow Pages, Nextdoor), then work through industry-specific ones. Update one at a time and use this tool to track your progress.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
