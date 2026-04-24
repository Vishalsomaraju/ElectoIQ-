// src/components/voter-journey/WizardNavigation.jsx
import { memo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '../ui/Button'
import { useNavigate } from 'react-router-dom'

/**
 * Navigation footer for wizard
 * @param {Object} props
 * @param {number} props.currentStep
 * @param {number} props.totalSteps
 * @param {Function} props.onPrev
 * @param {Function} props.onNext
 * @returns {JSX.Element}
 */
export const WizardNavigation = memo(function WizardNavigation({ currentStep, totalSteps, onPrev, onNext }) {
  const navigate = useNavigate()
  
  return (
    <div className="bg-slate-50 dark:bg-white/5 border-t border-slate-200 dark:border-white/10 p-4 md:px-10 flex items-center justify-between">
      <Button 
        variant="ghost" 
        onClick={onPrev} 
        disabled={currentStep === 1}
        icon={<ChevronLeft size={16} />}
      >
        Back
      </Button>
      
      {currentStep < totalSteps ? (
        <Button 
          variant="primary" 
          onClick={onNext}
          className="gap-2"
        >
          Next Step <ChevronRight size={16} />
        </Button>
      ) : (
        <Button 
          variant="primary" 
          className="bg-green-600 hover:bg-green-500 text-white border-none"
          onClick={() => navigate('/quiz')}
        >
          Take the Quiz 🎉
        </Button>
      )}
    </div>
  )
})
