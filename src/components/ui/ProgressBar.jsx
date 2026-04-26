// src/components/ui/ProgressBar.jsx
import { cn } from '../../utils/helpers'

/**
 * Animated progress bar component.
 * @param {Object} props - Component props
 * @param {number} [props.value=0] - Current progress value
 * @param {number} [props.max=100] - Maximum progress value
 * @param {string} [props.label] - Optional label above the bar
 * @param {boolean} [props.showPercent=false] - Display percentage text
 * @param {string} [props.color='primary'] - Bar color variant
 * @param {string} [props.size='md'] - Bar height
 * @param {string} [props.className] - Additional CSS classes
 * @param {boolean} [props.animated=true] - Enable subtle pulsing animation
 * @returns {JSX.Element} ProgressBar component
 */
export function ProgressBar({
  value = 0,
  max = 100,
  label,
  showPercent = false,
  color = 'primary',
  size = 'md',
  className,
  animated = true,
  ariaLabel = 'Progress',
}) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))

  const colors = {
    primary: 'bg-gradient-to-r from-blue-500 to-blue-400',
    accent: 'bg-gradient-to-r from-sky-500 to-cyan-400',
    saffron: 'bg-gradient-to-r from-orange-500 to-amber-400',
    green: 'bg-gradient-to-r from-green-600 to-emerald-400',
    danger: 'bg-gradient-to-r from-red-600 to-red-400',
  }

  const heights = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-4' }

  return (
    <div className={cn('w-full', className)}>
      {(label || showPercent) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-sm text-slate-600 dark:text-white/70">{label}</span>}
          {showPercent && <span className="text-sm font-medium text-slate-800 dark:text-white/90">{Math.round(pct)}%</span>}
        </div>
      )}
      <div className={cn('w-full rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden', heights[size])}>
        <div
          className={cn('rounded-full transition-all duration-700 ease-out', colors[color], heights[size], animated && 'animate-pulse-subtle')}
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-label={label || ariaLabel}
          aria-valuenow={Math.min(max, Math.max(0, value))}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  )
}
