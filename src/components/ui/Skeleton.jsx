import { cn } from '../../utils/helpers'

export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-slate-200 dark:bg-white/10", className)}
      {...props}
    />
  )
}
