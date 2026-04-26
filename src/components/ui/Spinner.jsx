// src/components/ui/Spinner.jsx
import { cn } from '../../utils/helpers'

/**
 * Simple loading spinner component.
 * @param {Object} props - Component props
 * @param {string} [props.size='md'] - Spinner size
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element} Spinner component
 */
export function Spinner({ size = 'md', className }) {
  const sizes = { sm: 'size-4', md: 'size-6', lg: 'size-10', xl: 'size-16' }
  return (
    <span
      role="status"
      aria-label="Loading…"
      className={cn(
        'inline-block rounded-full border-2 border-slate-200 dark:border-white/20 border-t-blue-500 dark:border-t-blue-400 animate-spin',
        sizes[size],
        className,
      )}
    />
  )
}

/**
 * Full page loading spinner with text.
 * @returns {JSX.Element} FullPageSpinner component
 */
export function FullPageSpinner() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <Spinner size="xl" />
      <p className="text-slate-500 dark:text-white/60 text-sm animate-pulse">Loading ElectoIQ…</p>
    </div>
  )
}
