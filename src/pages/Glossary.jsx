// src/pages/Glossary.jsx
import React, { useState, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Search, BookOpen, X } from 'lucide-react'
import { AnimatedPage } from '../components/shared/AnimatedPage'
import { PageWrapper } from '../components/layout/PageWrapper'
import { SectionHeader } from '../components/shared/SectionHeader'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { glossaryTerms, glossaryCategories } from '../data/glossaryTerms'
import { cn } from '../utils/helpers'

const categoryBadgeMap = {
  Institution: 'primary', Regulation: 'warning', Voter: 'success',
  Technology: 'accent', Legislature: 'navy', Structure: 'default',
  Candidate: 'saffron', 'Political Party': 'green', Process: 'primary',
  Finance: 'warning', Campaign: 'danger', Governance: 'navy',
  Statistics: 'success',
}

const GlossaryCard = React.memo(function GlossaryCard({ term, idx, isOpen, onToggle }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(idx * 0.03, 0.3) }}
    >
      <Card
        hover
        aria-expanded={isOpen}
        className={cn('h-full cursor-pointer', isOpen && 'border-blue-500/30')}
        onClick={() => onToggle(term.id)}
      >
        <div className="flex items-start justify-between gap-2 mb-3">
          <Badge variant={categoryBadgeMap[term.category] || 'default'}>{term.category}</Badge>
        </div>
        <h3 className="font-semibold text-slate-900 dark:text-white text-base leading-snug mb-2">{term.term}</h3>
        <p className={cn('text-sm text-slate-600 dark:text-white/60 leading-relaxed', !isOpen && 'line-clamp-3')}>
          {term.definition}
        </p>
        {term.example && isOpen && (
          <div className="mt-3 rounded-lg bg-slate-50 dark:bg-white/5 p-3 border border-slate-100 dark:border-white/5">
            <p className="text-xs text-slate-500 dark:text-white/40 uppercase font-semibold mb-1">Example</p>
            <p className="text-xs text-slate-700 dark:text-white/70 italic">{term.example}</p>
          </div>
        )}
        <p className="mt-2 text-xs text-blue-400" aria-hidden="true">{isOpen ? '▲ Show less' : '▼ Show more'}</p>
      </Card>
    </motion.div>
  )
})

export default function Glossary() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [expanded, setExpanded] = useState(null)
  const [visibleCount, setVisibleCount] = useState(24)

  const handleSearch = useCallback((e) => { setSearch(e.target.value); setVisibleCount(24) }, [])
  const handleClear = useCallback(() => { setSearch(''); setVisibleCount(24) }, [])
  const handleCategoryChange = useCallback((cat) => { setCategory(cat); setVisibleCount(24) }, [])
  const handleExpand = useCallback((termId) => setExpanded(prev => prev === termId ? null : termId), [])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return glossaryTerms.filter(t => {
      const matchCat = category === 'All' || t.category === category
      const matchSearch = !q || t.term.toLowerCase().includes(q) || t.definition.toLowerCase().includes(q)
      return matchCat && matchSearch
    })
  }, [search, category])

  const visible = useMemo(() => filtered.slice(0, visibleCount), [filtered, visibleCount])

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
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/40" />
            <input
              value={search}
              onChange={handleSearch}
              placeholder="Search terms or definitions…"
              aria-label="Search election terms and definitions"
              className="w-full bg-white dark:bg-white/10 border border-slate-200 dark:border-white/15 rounded-xl pl-10 pr-10 py-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/40 outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50"
            />
            {search && (
              <button
                onClick={handleClear}
                aria-label="Clear search"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/40 hover:text-slate-900 dark:hover:text-white"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {glossaryCategories.map(cat => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                aria-pressed={category === cat}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border',
                  category === cat
                    ? 'bg-[#1a56db] border-[#1a56db] text-white'
                    : 'border-slate-200 dark:border-white/15 text-slate-500 dark:text-white/60 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-white/30',
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Count */}
        <p role="status" aria-live="polite" aria-atomic="true" className="text-slate-500 dark:text-white/40 text-sm text-center mb-8">
          Showing <span className="text-slate-900 dark:text-white font-medium">{Math.min(visibleCount, filtered.length)}</span> of <span className="text-slate-900 dark:text-white font-medium">{filtered.length}</span> terms
        </p>

        {/* Terms */}
        {filtered.length === 0 ? (
          <div role="status" className="text-center py-20 text-slate-500 dark:text-white/40">
            <BookOpen size={40} className="mx-auto mb-3 opacity-50" />
            <p>No terms found for &ldquo;{search}&rdquo;</p>
          </div>
        ) : (
          <>
            <motion.div
              layout
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {visible.map((term, idx) => {
                const isOpen = expanded === term.id
                return (
                  <GlossaryCard
                    key={term.id}
                    idx={idx}
                    term={term}
                    isOpen={isOpen}
                    onToggle={handleExpand}
                  />
                )
              })}
            </motion.div>
            {visibleCount < filtered.length && (
              <div className="text-center mt-8">
                <button
                  onClick={() => setVisibleCount(c => c + 24)}
                  className="px-6 py-2.5 rounded-xl border border-slate-200 dark:border-white/15 text-sm font-medium text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-white/30 transition-all duration-200"
                >
                  Load more ({filtered.length - visibleCount} remaining)
                </button>
              </div>
            )}
          </>
        )}
      </PageWrapper>
    </AnimatedPage>
  )
}
