// src/components/ui/Badge.jsx
import { cn } from '../../utils/helpers'

const variants = {
  default:  'bg-slate-100 text-slate-600 border border-slate-200 dark:bg-white/10 dark:text-white/80 dark:border-white/10',
  primary:  'bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-500/30',
  accent:   'bg-sky-100 text-sky-700 border border-sky-200 dark:bg-sky-500/20 dark:text-sky-300 dark:border-sky-500/30',
  success:  'bg-green-100 text-green-700 border border-green-200 dark:bg-green-500/20 dark:text-green-300 dark:border-green-500/30',
  warning:  'bg-yellow-100 text-yellow-700 border border-yellow-200 dark:bg-yellow-500/20 dark:text-yellow-300 dark:border-yellow-500/30',
  danger:   'bg-red-100 text-red-700 border border-red-200 dark:bg-red-500/20 dark:text-red-300 dark:border-red-500/30',
  saffron:  'bg-orange-100 text-orange-700 border border-orange-200 dark:bg-orange-500/20 dark:text-orange-300 dark:border-orange-500/30',
  green:    'bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30',
  navy:     'bg-indigo-100 text-indigo-700 border border-indigo-200 dark:bg-indigo-800/40 dark:text-indigo-300 dark:border-indigo-700/30',
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
