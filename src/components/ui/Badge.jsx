// src/components/ui/Badge.jsx
import { cn } from '../../utils/helpers'

const variants = {
  default: 'bg-white/10 text-white/80 border border-white/10',
  primary: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
  accent: 'bg-sky-500/20 text-sky-300 border border-sky-500/30',
  success: 'bg-green-500/20 text-green-300 border border-green-500/30',
  warning: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
  danger: 'bg-red-500/20 text-red-300 border border-red-500/30',
  saffron: 'bg-orange-500/20 text-orange-300 border border-orange-500/30',
  green: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
  navy: 'bg-indigo-800/40 text-indigo-300 border border-indigo-700/30',
}

/**
 * Badge component for displaying status or labels.
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Badge text or content
 * @param {string} [props.variant='default'] - Visual variant
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element} Badge component
 */
export function Badge({ children, variant = 'default', className }) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium',
      variants[variant],
      className,
    )}>
      {children}
    </span>
  )
}
