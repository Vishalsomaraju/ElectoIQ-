// src/pages/VoterJourney.jsx
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, Circle, ArrowRight, ExternalLink, ClipboardList, Search, FileEdit, IdCard, MapPin, CalendarDays, Vote, BadgeCheck } from 'lucide-react'
import { AnimatedPage } from '../components/shared/AnimatedPage'
import { PageWrapper } from '../components/layout/PageWrapper'
import { SectionHeader } from '../components/shared/SectionHeader'
import { Button } from '../components/ui/Button'
import { ProgressBar } from '../components/ui/ProgressBar'
import { cn } from '../utils/helpers'

const steps = [
  {
    id: 1, icon: ClipboardList, title: 'Check Eligibility',
    description: 'You must be a citizen of India, at least 18 years old, and ordinarily resident in a constituency.',
    action: 'Verify you meet: Indian citizenship + 18+ years + valid address proof.',
    link: null,
    tip: 'You become eligible on the qualifying date — January 1st, April 1st, July 1st, or October 1st of the year.',
  },
  {
    id: 2, icon: Search, title: 'Find Your Name on Voter Roll',
    description: 'Search the Electoral Roll to see if you are already registered. Your name must appear to vote.',
    action: 'Visit voters.eci.gov.in → "Search your name in Electoral Roll"',
    link: 'https://voters.eci.gov.in',
    tip: 'You can also check via the Voter Helpline app or by calling 1950.',
  },
  {
    id: 3, icon: FileEdit, title: 'Register as a Voter (Form 6)',
    description: 'If not registered, fill Form 6 online or offline to add your name to the electoral roll.',
    action: 'Fill Form 6 at voters.eci.gov.in with your photo, address proof, and age proof.',
    link: 'https://voters.eci.gov.in',
    tip: 'New voters can register throughout the year. BLO will verify your details at your doorstep.',
  },
  {
    id: 4, icon: IdCard, title: 'Receive Your Voter ID (EPIC)',
    description: 'After verification, you will receive your Electoral Photo Identity Card (EPIC) — your Voter ID.',
    action: 'Download your digital Voter ID from voters.eci.gov.in → "e-EPIC Download".',
    link: 'https://voters.eci.gov.in',
    tip: 'The e-EPIC is a fully valid PDF version of your Voter ID card, accepted at all polling booths.',
  },
  {
    id: 5, icon: MapPin, title: 'Find Your Polling Booth',
    description: 'Once registered, find your designated polling booth using the Voter Helpline or voter portal.',
    action: 'Visit voters.eci.gov.in → "Know Your Polling Station".',
    link: 'https://voters.eci.gov.in',
    tip: 'Your polling booth is usually within 2 km of your registered address.',
  },
  {
    id: 6, icon: CalendarDays, title: 'Check the Polling Date',
    description: 'India uses a multi-phase system. Check which phase your constituency falls in.',
    action: 'Follow ECI announcements or visit eci.gov.in for constituency-wise polling dates.',
    link: 'https://eci.gov.in',
    tip: 'Polling day is a public holiday. Most government offices and private employers must grant paid leave.',
  },
  {
    id: 7, icon: Vote, title: 'Vote on Polling Day',
    description: 'Go to your polling booth with valid ID, join the queue, and cast your vote on the EVM.',
    action: 'Carry EPIC or any 12 alternate photo IDs. Join queue. Ink finger. Press button on EVM.',
    link: null,
    tip: 'Arrive early to avoid long queues. Queue token (if any) means your place is saved even if you step away.',
  },
  {
    id: 8, icon: BadgeCheck, title: 'Verify Your Vote (VVPAT)',
    description: 'After pressing the EVM button, a VVPAT slip will show your candidate\'s name and symbol for 7 seconds.',
    action: 'Look at the VVPAT transparent window to confirm your vote before the slip falls.',
    link: null,
    tip: 'If the VVPAT shows the wrong candidate, inform the Presiding Officer immediately.',
  },
]

export default function VoterJourney() {
  const [completed, setCompleted] = useState(new Set())
  const [active, setActive] = useState(1)

  const toggle = (id) => {
    const next = new Set(completed)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setCompleted(next)
  }

  const progress = Math.round((completed.size / steps.length) * 100)

  return (
    <AnimatedPage>
      <PageWrapper>
        <SectionHeader
          eyebrow="Your Civic Journey"
          title="The Voter's Roadmap"
          description="Follow these 8 steps to go from eligible citizen to confident voter. Check off each step as you complete it."
          center
        />

        {/* Progress */}
        <div className="glass rounded-2xl p-6 mb-10 max-w-xl mx-auto">
          <div className="flex justify-between items-center mb-3">
            <span className="text-white/70 text-sm">Your Progress</span>
            <span className="font-bold text-white">{completed.size}/{steps.length} Steps</span>
          </div>
          <ProgressBar value={completed.size} max={steps.length} showPercent color="green" size="lg" />
          {progress === 100 && (
            <p className="text-green-400 text-center mt-3 text-sm font-medium animate-pulse">
              🎉 You're ready to vote! Share your civic readiness.
            </p>
          )}
        </div>

        {/* Steps */}
        <div className="space-y-4">
          {steps.map((step, idx) => {
            const isDone = completed.has(step.id)
            const isActive = active === step.id

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.4, delay: idx * 0.04 }}
              >
                <div
                  className={cn(
                    'glass rounded-2xl border transition-all duration-300',
                    isActive ? 'border-blue-500/40' : 'border-white/10 hover:border-white/20',
                  )}
                >
                  {/* Header */}
                  <div
                    className="flex items-center gap-4 p-5 cursor-pointer"
                    onClick={() => setActive(isActive ? null : step.id)}
                  >
                    <button
                      onClick={(e) => { e.stopPropagation(); toggle(step.id) }}
                      className="shrink-0 transition-transform hover:scale-110"
                      aria-label={isDone ? 'Mark incomplete' : 'Mark complete'}
                    >
                      {isDone
                        ? <CheckCircle size={26} className="text-green-400" />
                        : <Circle size={26} className="text-white/30 hover:text-white/60" />
                      }
                    </button>

                    <div className="size-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                      <step.icon size={20} className="text-white/80" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-white/40 font-mono">Step {step.id}</span>
                        {isDone && <span className="text-xs text-green-400 font-medium">✓ Done</span>}
                      </div>
                      <h3 className={cn(
                        'font-semibold text-base transition-colors',
                        isDone ? 'text-white/50 line-through' : 'text-white',
                      )}>
                        {step.title}
                      </h3>
                    </div>

                    <ArrowRight
                      size={18}
                      className={cn('shrink-0 text-white/30 transition-transform', isActive && 'rotate-90')}
                    />
                  </div>

                  {/* Expanded */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 pt-0 border-t border-white/5">
                          <p className="text-white/70 text-sm leading-relaxed mb-4 mt-4">{step.description}</p>

                          <div className="rounded-xl bg-blue-500/10 border border-blue-500/20 p-4 mb-4">
                            <p className="text-xs uppercase text-blue-400 font-semibold tracking-wider mb-1.5">Action</p>
                            <p className="text-sm text-white/80">{step.action}</p>
                          </div>

                          <div className="rounded-xl bg-orange-500/10 border border-orange-500/20 p-4 mb-4">
                            <p className="text-xs uppercase text-orange-400 font-semibold tracking-wider mb-1.5">💡 Tip</p>
                            <p className="text-sm text-white/80">{step.tip}</p>
                          </div>

                          <div className="flex items-center gap-3">
                            <Button size="sm" variant="ghost" onClick={() => toggle(step.id)}>
                              {isDone ? 'Mark Incomplete' : '✓ Mark Complete'}
                            </Button>
                            {step.link && (
                              <a href={step.link} target="_blank" rel="noopener noreferrer">
                                <Button size="sm" variant="outline" icon={<ExternalLink size={13} />}>
                                  Official Site
                                </Button>
                              </a>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )
          })}
        </div>
      </PageWrapper>
    </AnimatedPage>
  )
}
