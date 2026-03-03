import { useState, useEffect, useCallback } from 'react'
import CanonicalNAP from './CanonicalNAP.jsx'
import DirectoryEntries from './DirectoryEntries.jsx'
import ConsistencyScore from './ConsistencyScore.jsx'
import IssueDetector from './IssueDetector.jsx'
import DirectoryChecklist from './DirectoryChecklist.jsx'
import EducationalSection from './EducationalSection.jsx'

const STORAGE_KEY = 'nap-consistency-checker'

function getInitialState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved)
  } catch {
    // ignore
  }
  return {
    canonical: { name: '', address: '', city: '', state: '', zip: '', phone: '', website: '' },
    entries: [],
    checklist: {},
  }
}

export default function App() {
  const [canonical, setCanonical] = useState(() => getInitialState().canonical)
  const [entries, setEntries] = useState(() => getInitialState().entries)
  const [checklist, setChecklist] = useState(() => getInitialState().checklist)

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ canonical, entries, checklist }))
    } catch {
      // ignore quota errors
    }
  }, [canonical, entries, checklist])

  const handleCopyNAP = useCallback(() => {
    const { name, address, city, state, zip, phone, website } = canonical
    const lines = []
    if (name) lines.push(name)
    if (address) lines.push(address)
    if (city || state || zip) lines.push([city, state].filter(Boolean).join(', ') + (zip ? ' ' + zip : ''))
    if (phone) lines.push(phone)
    if (website) lines.push(website)
    navigator.clipboard.writeText(lines.join('\n'))
  }, [canonical])

  const fillTestData = () => {
    setCanonical({
      name: 'Evergreen Plumbing & Heating',
      address: '742 Maple Avenue',
      city: 'Portland',
      state: 'OR',
      zip: '97205',
      phone: '(503) 555-0147',
      website: 'https://www.evergreenplumbingpdx.com',
    })
    setEntries([
      {
        id: Date.now() + 1,
        directory: 'Google Business Profile',
        name: 'Evergreen Plumbing & Heating',
        address: '742 Maple Avenue',
        phone: '(503) 555-0147',
        website: 'https://www.evergreenplumbingpdx.com',
      },
      {
        id: Date.now() + 2,
        directory: 'Yelp',
        name: 'Evergreen Plumbing and Heating',
        address: '742 Maple Ave',
        phone: '503-555-0147',
        website: 'https://evergreenplumbingpdx.com',
      },
      {
        id: Date.now() + 3,
        directory: 'Facebook',
        name: 'Evergreen Plumbing & Heating LLC',
        address: '742 Maple Avenue, Suite 100',
        phone: '(503) 555-0147',
        website: 'https://www.evergreenplumbingpdx.com/',
      },
    ])
  }

  const hasCanonical = canonical.name || canonical.address || canonical.phone

  return (
    <div className="bg-glow bg-grid min-h-screen">
      <div className="relative z-10 max-w-[1600px] mx-auto px-4 py-12 animate-fadeIn">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-galactic">
          <a href="https://seo-tools-tau.vercel.app/" className="text-azure hover:text-white transition-colors">Free Tools</a>
          <span className="mx-2 text-metal">/</span>
          <a href="https://seo-tools-tau.vercel.app/local-business/" className="text-azure hover:text-white transition-colors">Local Business Tools</a>
          <span className="mx-2 text-metal">/</span>
          <span className="text-cloudy">NAP Consistency Checker</span>
        </nav>

        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-azure/10 border border-azure/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-azure" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white">NAP Consistency Checker</h1>
              <p className="text-cloudy mt-1">Compare your business Name, Address, and Phone across directories</p>
            </div>
          </div>
          <div className="card-gradient border border-metal/20 rounded-xl px-4 py-3 flex items-start gap-3">
            <svg className="w-5 h-5 text-tangerine flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
            </svg>
            <p className="text-sm text-cloudy">
              <span className="text-white font-medium">This is a manual comparison workbook.</span> Enter your business info as it appears on each directory, and this tool will highlight differences and flag inconsistencies. It does not auto-scan directories.
            </p>
          </div>
        </header>

        {/* Fill Test Data */}
        <div className="flex justify-end mb-4">
          <button
            type="button"
            onClick={fillTestData}
            className="px-3 py-1.5 text-xs font-mono bg-prince/20 text-prince border border-prince/30 rounded hover:bg-prince/30 transition-colors focus:outline-none focus:ring-2 focus:ring-prince focus:ring-offset-2 focus:ring-offset-abyss"
          >
            Fill Test Data
          </button>
        </div>

        {/* Canonical NAP Input */}
        <CanonicalNAP canonical={canonical} setCanonical={setCanonical} onCopy={handleCopyNAP} />

        {/* Directory Entries */}
        {hasCanonical && (
          <DirectoryEntries
            canonical={canonical}
            entries={entries}
            setEntries={setEntries}
          />
        )}

        {/* Consistency Score */}
        {entries.length > 0 && hasCanonical && (
          <ConsistencyScore canonical={canonical} entries={entries} />
        )}

        {/* Common Issues */}
        {entries.length > 0 && hasCanonical && (
          <IssueDetector canonical={canonical} entries={entries} />
        )}

        {/* Directory Audit Checklist */}
        <DirectoryChecklist checklist={checklist} setChecklist={setChecklist} />

        {/* Educational Section */}
        <EducationalSection />

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-metal/30 text-center">
          <p className="text-galactic text-sm">
            NAP Consistency Checker &mdash; A free tool by{' '}
            <a href="https://www.dreamhost.com/" target="_blank" rel="noopener noreferrer" className="text-azure hover:text-white transition-colors">
              DreamHost
            </a>
          </p>
        </footer>
      </div>
    </div>
  )
}
