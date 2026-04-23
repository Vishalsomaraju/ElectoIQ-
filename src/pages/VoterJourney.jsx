import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, ChevronRight, ChevronLeft, Download, Share2, ClipboardList, Search, FileEdit, IdCard, CalendarDays, PartyPopper } from 'lucide-react'
import confetti from 'canvas-confetti'
import { AnimatedPage } from '../components/shared/AnimatedPage'
import { PageWrapper } from '../components/layout/PageWrapper'
import { SectionHeader } from '../components/shared/SectionHeader'
import { Button } from '../components/ui/Button'
import { useAuthContext } from '../context/AuthContext'
import { useFirestore } from '../hooks/useFirestore'
import { cn } from '../utils/helpers'

const WIZARD_STEPS = [
  {
    id: 1,
    title: 'Check Eligibility',
    icon: ClipboardList,
    color: 'text-green-400',
    bgColor: 'bg-green-400/20',
    Content: () => {
      const [checks, setChecks] = useState([false, false, false, false])
      const allChecked = checks.every(c => c)

      const toggleCheck = (idx) => {
        const newChecks = [...checks]
        newChecks[idx] = !newChecks[idx]
        setChecks(newChecks)
      }

      return (
        <div className="space-y-4">
          <p className="text-white/70 mb-6 text-sm">Please verify your eligibility to vote in India:</p>
          {[
            'I am 18 years or older',
            'I am a citizen of India',
            'I am ordinarily resident in the constituency',
            'I am not disqualified under any law'
          ].map((text, idx) => (
            <label key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition">
              <input type="checkbox" checked={checks[idx]} onChange={() => toggleCheck(idx)} className="w-5 h-5 rounded border-gray-600 bg-transparent focus:ring-blue-500 focus:ring-2" />
              <span className="text-white text-sm">{text}</span>
            </label>
          ))}
          {allChecked && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl mt-6 text-center">
              <p className="text-green-400 font-semibold">You are eligible! Let's register.</p>
            </motion.div>
          )}
        </div>
      )
    }
  },
  {
    id: 2,
    title: 'Register as a Voter',
    icon: FileEdit,
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/20',
    Content: () => (
      <div className="space-y-6 text-sm text-white/80">
        <div className="bg-white/5 p-5 rounded-xl border border-white/10">
          <h4 className="font-bold text-white mb-2 flex items-center gap-2"><span className="bg-blue-500 text-xs px-2 py-0.5 rounded text-white">Method 1</span> Online (Recommended)</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li>Go to <a href="https://voters.eci.gov.in" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">voters.eci.gov.in</a></li>
            <li>Click "New Registration" → Fill <strong>Form 6</strong></li>
            <li>Upload: Age proof (Aadhaar/Birth Certificate) + Address proof + Passport photo</li>
            <li>Submit and note your Application Reference Number</li>
          </ul>
        </div>
        <div className="bg-white/5 p-5 rounded-xl border border-white/10">
          <h4 className="font-bold text-white mb-2 flex items-center gap-2"><span className="bg-gray-500 text-xs px-2 py-0.5 rounded text-white">Method 2</span> Offline</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li>Visit your nearest Booth Level Officer (BLO) or Electoral Registration Officer</li>
            <li>Fill Form 6 (available free at ERO office)</li>
            <li>Submit with self-attested copies of documents</li>
          </ul>
        </div>
      </div>
    )
  },
  {
    id: 3,
    title: 'Verify Your Name',
    icon: Search,
    color: 'text-purple-400',
    bgColor: 'bg-purple-400/20',
    Content: () => (
      <div className="space-y-6 text-sm text-white/80">
        <p>Before voting day, you must verify that your name is on the Electoral Roll.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Visit <a href="https://electoralsearch.eci.gov.in" target="_blank" rel="noreferrer" className="text-purple-400 hover:underline">electoralsearch.eci.gov.in</a></li>
          <li>Search by Name + State + District + Assembly Constituency</li>
          <li><strong>OR</strong> search by EPIC number (Voter ID card number)</li>
        </ul>
        <div className="bg-red-500/10 p-4 rounded-xl border border-red-500/20 mt-4">
          <p className="font-bold text-red-300 mb-1">If your name is not found:</p>
          <p className="text-red-200/80 text-xs">File a complaint online, contact your BLO, or submit Form 6 again with supporting documents.</p>
        </div>
      </div>
    )
  },
  {
    id: 4,
    title: 'Your Voter ID',
    icon: IdCard,
    color: 'text-orange-400',
    bgColor: 'bg-orange-400/20',
    Content: () => (
      <div className="space-y-4 text-sm text-white/80">
        <p><strong>EPIC</strong> (Electors Photo Identity Card) is your official voter identity document.</p>
        <p>You can download the digital version (<strong>e-EPIC</strong>) from <a href="https://voters.eci.gov.in/e-epic" target="_blank" rel="noreferrer" className="text-orange-400 hover:underline">voters.eci.gov.in/e-epic</a> which is fully valid for voting.</p>
        <div className="mt-6">
          <h4 className="font-bold text-white mb-2">Approved alternate IDs (if you don't have Voter ID):</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {['Aadhaar Card', 'Passport', 'Driving License', 'PAN Card', 'MNREGA Job Card', 'Bank Passbook with photo'].map(id => (
              <div key={id} className="bg-white/5 p-2 rounded border border-white/5">{id}</div>
            ))}
          </div>
        </div>
      </div>
    )
  },
  {
    id: 5,
    title: 'Polling Day Guide',
    icon: CalendarDays,
    color: 'text-red-400',
    bgColor: 'bg-red-400/20',
    Content: () => (
      <div className="space-y-6 text-sm text-white/80">
        <div className="relative pl-6 border-l border-white/10 space-y-6">
          <div className="relative">
            <div className="absolute w-3 h-3 bg-red-400 rounded-full -left-[29px] top-1"></div>
            <h4 className="font-bold text-white">Before leaving home</h4>
            <p className="text-xs mt-1">Check polling booth location, carry your Voter ID, and verify polling time (usually 7AM–6PM).</p>
          </div>
          <div className="relative">
            <div className="absolute w-3 h-3 bg-red-400 rounded-full -left-[29px] top-1"></div>
            <h4 className="font-bold text-white">At the polling station</h4>
            <p className="text-xs mt-1">Join the queue. Show ID to polling officer. Ink will be applied to your left index finger.</p>
          </div>
          <div className="relative">
            <div className="absolute w-3 h-3 bg-red-400 rounded-full -left-[29px] top-1"></div>
            <h4 className="font-bold text-white">At the EVM</h4>
            <p className="text-xs mt-1">Press the button next to your candidate. Wait for the beep and check the VVPAT paper slip for 7 seconds to confirm your vote.</p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 6,
    title: 'You\'re Ready!',
    icon: PartyPopper,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-400/20',
    Content: () => (
      <div className="text-center space-y-6 py-6">
        <div className="w-20 h-20 bg-yellow-400/20 text-yellow-400 rounded-full flex items-center justify-center mx-auto">
          <PartyPopper size={40} />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white">You're an Informed Voter!</h3>
          <p className="text-white/60 text-sm mt-2 max-w-xs mx-auto">You have learned the complete process of voting in India. Your vote is your voice.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Button variant="outline" icon={<Share2 size={16} />}>Share Journey</Button>
          <Button variant="primary" icon={<Download size={16} />}>Download Checklist</Button>
        </div>
      </div>
    )
  }
]

export default function VoterJourney() {
  const [currentStep, setCurrentStep] = useState(1)
  const [direction, setDirection] = useState(1) // 1 = forward, -1 = backward
  const { currentUser } = useAuthContext()
  const { setDocument } = useFirestore('users')

  const handleNext = useCallback(() => {
    if (currentStep < WIZARD_STEPS.length) {
      setDirection(1)
      setCurrentStep(prev => prev + 1)
    }
  }, [currentStep])

  const handlePrev = useCallback(() => {
    if (currentStep > 1) {
      setDirection(-1)
      setCurrentStep(prev => prev - 1)
    }
  }, [currentStep])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'Enter') handleNext()
      if (e.key === 'ArrowLeft') handlePrev()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleNext, handlePrev])

  // Effects per step
  useEffect(() => {
    if (currentStep === 1) {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 }, colors: ['#FF9933', '#ffffff', '#138808'] })
    }
    
    if (currentStep === WIZARD_STEPS.length) {
      confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 }, colors: ['#FF9933', '#ffffff', '#138808'] })
      
      if (currentUser) {
        setDocument(currentUser.uid, {
          progress: {
            voterJourney: { completed: true, completedAt: new Date(), stepsViewed: 6 }
          }
        })
      }
    }
  }, [currentStep, currentUser, setDocument])

  const ActiveStepData = WIZARD_STEPS[currentStep - 1]

  return (
    <AnimatedPage>
      <PageWrapper>
        <SectionHeader
          eyebrow="Interactive Guide"
          title="The Voter Journey Wizard"
          description="A step-by-step interactive guide from checking eligibility to casting your vote."
          center
        />

        <div className="max-w-2xl mx-auto mb-20">
          {/* Progress Bar Header */}
          <div className="relative flex justify-between items-center mb-12">
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white/10 -z-10 -translate-y-1/2"></div>
            <motion.div 
              className="absolute top-1/2 left-0 h-[2px] bg-gradient-to-r from-[#FF9933] to-[#138808] -z-10 -translate-y-1/2"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep - 1) / (WIZARD_STEPS.length - 1)) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
            
            {WIZARD_STEPS.map((step) => {
              const isPast = currentStep > step.id
              const isActive = currentStep === step.id
              
              return (
                <div key={step.id} className="relative flex flex-col items-center group">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-300 border-2",
                    isPast ? "bg-green-500 border-green-500 text-white" : 
                    isActive ? "bg-[#FF9933] border-[#FF9933] text-white" : 
                    "bg-[#0f172a] border-white/20 text-white/40"
                  )}>
                    {isPast ? <CheckCircle2 size={18} /> : step.id}
                  </div>
                  <span className={cn(
                    "absolute top-12 text-xs w-20 text-center font-medium transition-colors opacity-0 md:opacity-100",
                    isActive ? "text-white" : "text-white/40"
                  )}>
                    {step.title}
                  </span>
                </div>
              )
            })}
          </div>

          {!currentUser && currentStep === 3 && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-center text-sm text-blue-300">
              Sign in with Google to save your progress automatically.
            </motion.div>
          )}

          {/* Main Wizard Card */}
          <div className="glass rounded-3xl border border-white/10 overflow-hidden shadow-2xl relative min-h-[400px] flex flex-col">
            <div className="flex-1 p-6 md:p-10 relative overflow-hidden">
              <AnimatePresence mode="popLayout" custom={direction}>
                <motion.div
                  key={currentStep}
                  custom={direction}
                  initial={{ opacity: 0, x: direction * 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction * -50 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="w-full h-full"
                >
                  <div className="flex items-center gap-4 mb-8">
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", ActiveStepData.bgColor, ActiveStepData.color)}>
                      <ActiveStepData.icon size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-mono text-white/40">Step {currentStep} of {WIZARD_STEPS.length}</p>
                      <h2 className="text-2xl font-bold text-white">{ActiveStepData.title}</h2>
                    </div>
                  </div>
                  
                  <ActiveStepData.Content />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Footer */}
            <div className="bg-white/5 border-t border-white/10 p-4 md:px-10 flex items-center justify-between">
              <Button 
                variant="ghost" 
                onClick={handlePrev} 
                disabled={currentStep === 1}
                icon={<ChevronLeft size={16} />}
              >
                Back
              </Button>
              
              {currentStep < WIZARD_STEPS.length ? (
                <Button 
                  variant="primary" 
                  onClick={handleNext}
                  className="gap-2"
                >
                  Next Step <ChevronRight size={16} />
                </Button>
              ) : (
                <Button 
                  variant="primary" 
                  className="bg-green-600 hover:bg-green-500 text-white border-none"
                  onClick={() => {
                    // Route to Quiz or Dashboard
                    window.location.href = '/quiz'
                  }}
                >
                  Take the Quiz 🎉
                </Button>
              )}
            </div>
          </div>
        </div>
      </PageWrapper>
    </AnimatedPage>
  )
}
