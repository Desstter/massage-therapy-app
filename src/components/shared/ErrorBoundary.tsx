import { Component, type ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
  fallbackLabel?: string
}

interface State {
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  private handleReset = () => {
    this.setState({ error: null })
  }

  private handleClearStorage = () => {
    try {
      localStorage.removeItem('massage-app-study')
      localStorage.removeItem('massage-app-progress')
    } catch {
      // ignore
    }
    window.location.reload()
  }

  render() {
    if (!this.state.error) return this.props.children

    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center">
          <AlertTriangle className="w-7 h-7 text-red-400" />
        </div>
        <div>
          <p className="text-lg font-bold text-white">
            {this.props.fallbackLabel ?? 'Something went wrong'}
          </p>
          <p className="text-sm text-gray-400 mt-1 max-w-sm">
            {this.state.error.message}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={this.handleReset}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-bg-elevated border border-bg-border text-sm text-gray-300 hover:text-white transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Try again
          </button>
          <button
            onClick={this.handleClearStorage}
            className="px-4 py-2 rounded-xl bg-red-500/15 border border-red-500/30 text-sm text-red-400 hover:bg-red-500/25 transition-colors"
          >
            Clear saved data &amp; reload
          </button>
        </div>
      </div>
    )
  }
}
