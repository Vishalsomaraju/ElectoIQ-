import { Component } from 'react'
import { logger } from '../../utils/logger'

/** Catches render errors and shows a graceful fallback. */
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() { return { hasError: true } }
  componentDidCatch(error, info) {
    logger.warn('[ElectoIQ] ErrorBoundary:', error.message, info.componentStack)
  }
  render() {
    if (this.state.hasError) return (
      <div role="alert" className="min-h-screen flex flex-col items-center justify-center text-center px-6">
        <p className="text-6xl mb-6">⚠</p>
        <h1 className="font-display font-bold text-2xl text-slate-900 dark:text-white mb-3">
          Something went wrong
        </h1>
        <p className="text-slate-600 dark:text-white/60 max-w-md mb-8 text-sm">
          An unexpected error occurred. Your progress has been saved.
        </p>
        <div className="flex gap-3">
          <button onClick={() => this.setState({ hasError: false })}
            className="px-6 py-3 rounded-xl bg-[#FF9933] text-white font-semibold hover:bg-[#e8891f] transition-colors">
            Try Again
          </button>
          <a href="/" className="px-6 py-3 rounded-xl border border-slate-300 dark:border-white/20 text-slate-700 dark:text-white/80 font-semibold">
            Go Home
          </a>
        </div>
      </div>
    )
    return this.props.children
  }
}
