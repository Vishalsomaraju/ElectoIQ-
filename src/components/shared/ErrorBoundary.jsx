// src/components/shared/ErrorBoundary.jsx
import { Component } from 'react'

/**
 * React error boundary that catches render errors and shows a fallback UI.
 * Prevents the entire app from crashing on unexpected component errors.
 * Wrap the root of the app (or sub-trees) with this component.
 *
 * @example
 * <ErrorBoundary>
 *   <App />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, errorMessage: '' }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, errorMessage: error.message }
  }

  componentDidCatch(error, errorInfo) {
    console.warn('[ElectoIQ] Caught by ErrorBoundary:', error.message, errorInfo.componentStack)
  }

  handleReset() {
    this.setState({ hasError: false, errorMessage: '' })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-slate-50 dark:bg-[#0f1524]"
        >
          <div className="text-6xl mb-6" aria-hidden="true">⚠️</div>
          <h1 className="font-display font-bold text-2xl text-slate-900 dark:text-white mb-3">
            Something went wrong
          </h1>
          <p className="text-slate-600 dark:text-white/60 max-w-md mb-8 text-sm leading-relaxed">
            ElectoIQ encountered an unexpected error. Your progress has been saved.
            Try refreshing the page or returning to the home screen.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => this.handleReset()}
              className="px-6 py-3 rounded-xl bg-[#FF9933] text-white font-semibold hover:bg-[#e8891f] transition-colors"
            >
              Try Again
            </button>
            <a
              href="/"
              className="px-6 py-3 rounded-xl border border-slate-300 dark:border-white/20 text-slate-700 dark:text-white/80 font-semibold hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
            >
              Go Home
            </a>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
