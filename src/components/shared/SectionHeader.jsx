// src/components/shared/SectionHeader.jsx
import { cn } from '../../utils/helpers'

/**
 * Reusable section header component.
 * @param {Object} props - Component props
 * @param {string} [props.eyebrow] - Small uppercase text above title
 * @param {string} props.title - Main section title
 * @param {string} [props.description] - Subtitle or description text
 * @param {boolean} [props.center=false] - Center align content
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element} SectionHeader component
 */
export function SectionHeader({ eyebrow, title, description, center = false, className }) {
  return (
    <div className={cn('mb-10', center && 'text-center', className)}>
      {eyebrow && (
        <p className="text-sm font-semibold uppercase tracking-widest text-[#0ea5e9] mb-2">
          {eyebrow}
        </p>
      )}
      <h2 className={cn(
        'font-display font-bold text-slate-900 dark:text-white leading-tight',
        'text-3xl md:text-4xl',
      )}>
        {title}
      </h2>
      {description && (
        <p className={cn(
          'mt-3 text-slate-600 dark:text-white/60 text-base md:text-lg leading-relaxed max-w-2xl',
          center && 'mx-auto',
        )}>
          {description}
        </p>
      )}
    </div>
  )
}
