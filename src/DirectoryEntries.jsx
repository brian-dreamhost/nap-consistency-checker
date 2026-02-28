import DirectoryEntry from './DirectoryEntry.jsx'

const MAX_ENTRIES = 15

function createEmptyEntry() {
  return {
    id: Date.now() + Math.random(),
    directory: '',
    name: '',
    address: '',
    phone: '',
    website: '',
  }
}

export default function DirectoryEntries({ canonical, entries, setEntries }) {
  const addEntry = () => {
    if (entries.length >= MAX_ENTRIES) return
    setEntries(prev => [...prev, createEmptyEntry()])
  }

  const updateEntry = (index, updated) => {
    setEntries(prev => prev.map((e, i) => i === index ? updated : e))
  }

  const removeEntry = (index) => {
    setEntries(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <svg className="w-6 h-6 text-prince" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" />
            </svg>
            Directory Listings
          </h2>
          <p className="text-sm text-galactic mt-0.5">
            {entries.length === 0
              ? 'Add your business info as it appears on each directory'
              : `${entries.length} of ${MAX_ENTRIES} listings`
            }
          </p>
        </div>
        <button
          onClick={addEntry}
          disabled={entries.length >= MAX_ENTRIES}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-azure hover:bg-azure-hover disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-azure focus:ring-offset-2 focus:ring-offset-abyss"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Directory Listing
        </button>
      </div>

      {entries.length === 0 ? (
        <div className="card-gradient border border-metal/20 border-dashed rounded-2xl p-8 text-center">
          <svg className="w-12 h-12 text-galactic mx-auto mb-3" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
          </svg>
          <p className="text-cloudy mb-1">No directory listings yet</p>
          <p className="text-sm text-galactic">Click "Add Directory Listing" to start comparing your NAP across directories</p>
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map((entry, index) => (
            <DirectoryEntry
              key={entry.id}
              canonical={canonical}
              entry={entry}
              index={index}
              onUpdate={updateEntry}
              onRemove={removeEntry}
            />
          ))}
        </div>
      )}
    </section>
  )
}
