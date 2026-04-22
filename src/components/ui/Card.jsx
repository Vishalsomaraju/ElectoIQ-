// src/components/ui/Card.jsx
import { cn } from '../../utils/helpers'

export function Card({ children, className, hover = false, glow = false, onClick }) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'glass rounded-2xl p-6 transition-all duration-300',
        hover && 'hover:border-blue-500/30 hover:scale-[1.01] cursor-pointer',
        glow && 'hover:glow-primary',
        onClick && 'cursor-pointer',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className }) {
  return <div className={cn('mb-4', className)}>{children}</div>
}

export function CardTitle({ children, className }) {
  return (
    <h3 className={cn('font-display font-bold text-lg text-white', className)}>
      {children}
    </h3>
  )
}

export function CardDescription({ children, className }) {
  return (
    <p className={cn('text-sm text-white/60 mt-1', className)}>
      {children}
    </p>
  )
}

export function CardContent({ children, className }) {
  return <div className={cn('', className)}>{children}</div>
}

export function CardFooter({ children, className }) {
  return (
    <div className={cn('mt-4 pt-4 border-t border-white/5 flex items-center justify-between', className)}>
      {children}
    </div>
  )
}
