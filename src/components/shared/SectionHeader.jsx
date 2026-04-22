// src/components/shared/SectionHeader.jsx
import { cn } from '../../utils/helpers'

export function SectionHeader({ eyebrow, title, description, center = false, className }) {
  return (
    <div className={cn('mb-10', center && 'text-center', className)}>
      {eyebrow && (
        <p className="text-sm font-semibold uppercase tracking-widest text-[#0ea5e9] mb-2">
          {eyebrow}
        </p>
      )}
      <h2 className={cn(
        'font-display font-bold text-white leading-tight',
        'text-3xl md:text-4xl',
      )}>
        {title}
      </h2>
      {description && (
        <p className={cn(
          'mt-3 text-white/60 text-base md:text-lg leading-relaxed max-w-2xl',
          center && 'mx-auto',
        )}>
          {description}
        </p>
      )}
    </div>
  )
}
