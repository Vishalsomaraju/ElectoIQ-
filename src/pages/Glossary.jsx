// src/pages/Glossary.jsx
import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, BookOpen, X } from 'lucide-react'
import { AnimatedPage } from '../components/shared/AnimatedPage'
import { PageWrapper } from '../components/layout/PageWrapper'
import { SectionHeader } from '../components/shared/SectionHeader'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { glossaryTerms, glossaryCategories } from '../data/glossaryTerms'
import { cn, debounce } from '../utils/helpers'

const categoryBadgeMap = {
  Institution: 'primary', Regulation: 'warning', Voter: 'success',
  Technology: 'accent', Legislature: 'navy', Structure: 'default',
  Candidate: 'saffron', 'Political Party': 'green', Process: 'primary',
  Finance: 'warning', Campaign: 'danger', Governance: 'navy',
  Statistics: 'success',
}

export default function Glossary() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [expanded, setExpanded] = useState(null)

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return glossaryTerms.filter(t => {
      const matchCat = category === 'All' || t.category === category
      const matchSearch = !q || t.term.toLowerCase().includes(q) || t.definition.toLowerCase().includes(q)
      return matchCat && matchSearch
    })
  }, [search, category])

  const grouped = useMemo(() => {
    if (search || category !== 'All') return null
    return glossaryCategories.slice(1).reduce((acc, cat) => {
      const terms = filtered.filter(t => t.category === cat)
      if (terms.length) acc[cat] = terms
      return acc
    }, {})
  }, [filtered, search, category])

  return (
    <AnimatedPage>
      <PageWrapper>
        <SectionHeader
          eyebrow="Election Vocabulary"
          title="Glossary of Terms"
          description={`${glossaryTerms.length} election terms explained in plain language — from EPIC to VVPAT.`}
          center
        />

        {/* Search & Filter */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-md mx-auto">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search terms or definitions…"
              className="w-full bg-white/10 border border-white/15 rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white">
                <X size={16} />
              </button>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {glossaryCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border',
                  category === cat
                    ? 'bg-[#1a56db] border-[#1a56db] text-white'
                    : 'border-white/15 text-white/60 hover:text-white hover:border-white/30',
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Count */}
        <p className="text-white/40 text-sm text-center mb-8">
          Showing <span className="text-white font-medium">{filtered.length}</span> terms
        </p>

        {/* Terms */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-white/40">
            <BookOpen size={40} className="mx-auto mb-3 opacity-50" />
            <p>No terms found for "{search}"</p>
          </div>
        ) : (
          <motion.div
            layout
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {filtered.map((term, idx) => {
              const isOpen = expanded === term.id
              return (
                <motion.div
                  key={term.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: Math.min(idx * 0.03, 0.3) }}
                >
                  <Card
                    hover
                    className={cn('h-full cursor-pointer', isOpen && 'border-blue-500/30')}
                    onClick={() => setExpanded(isOpen ? null : term.id)}
                  >
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <Badge variant={categoryBadgeMap[term.category] || 'default'}>{term.category}</Badge>
                    </div>
                    <h3 className="font-semibold text-white text-base leading-snug mb-2">{term.term}</h3>
                    <p className={cn('text-sm text-white/60 leading-relaxed', !isOpen && 'line-clamp-3')}>
                      {term.definition}
                    </p>
                    {term.example && isOpen && (
                      <div className="mt-3 rounded-lg bg-white/5 p-3 border border-white/5">
                        <p className="text-xs text-white/40 uppercase font-semibold mb-1">Example</p>
                        <p className="text-xs text-white/70 italic">{term.example}</p>
                      </div>
                    )}
                    <p className="mt-2 text-xs text-blue-400">{isOpen ? '▲ Show less' : '▼ Show more'}</p>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </PageWrapper>
    </AnimatedPage>
  )
}
