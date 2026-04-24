// src/components/ui/Button.jsx
import { cn } from '../../utils/helpers'

const variants = {
  primary: 'bg-[#1a56db] hover:bg-[#1e429f] text-white shadow-lg shadow-blue-900/30 hover:shadow-blue-900/50',
  accent: 'bg-[#0ea5e9] hover:bg-[#0284c7] text-white shadow-lg shadow-sky-900/30',
  outline: 'border border-white/20 text-white hover:bg-white/10 hover:border-white/40',
  ghost: 'text-white/70 hover:text-white hover:bg-white/10',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
  saffron: 'bg-[#FF9933] hover:bg-[#e8871f] text-white shadow-lg shadow-orange-900/30',
  green: 'bg-[#138808] hover:bg-[#0f6a06] text-white shadow-lg shadow-green-900/30',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm rounded-md',
  md: 'px-5 py-2.5 text-sm rounded-lg',
  lg: 'px-7 py-3 text-base rounded-xl',
  xl: 'px-9 py-4 text-lg rounded-xl',
}

/**
 * Button component with various variants and sizes.
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Button content
 * @param {string} [props.variant='primary'] - Visual variant (primary, accent, outline, ghost, danger, saffron, green)
 * @param {string} [props.size='md'] - Button size (sm, md, lg, xl)
 * @param {string} [props.className] - Additional CSS classes
 * @param {boolean} [props.disabled] - Disabled state
 * @param {boolean} [props.loading] - Loading state
 * @param {React.ReactNode} [props.icon] - Icon element to display before text
 * @param {React.ReactNode} [props.iconRight] - Icon element to display after text
 * @returns {JSX.Element} Button component
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  disabled,
  loading,
  icon,
  iconRight,
  ...props
}) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-transparent active:scale-[0.97] cursor-pointer',
        variants[variant],
        sizes[size],
        (disabled || loading) && 'opacity-50 cursor-not-allowed pointer-events-none',
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="size-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {!loading && icon && <span>{icon}</span>}
      {children}
      {!loading && iconRight && <span>{iconRight}</span>}
    </button>
  )
}
