import React from 'react'

class ErrorBoundary extends React.Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-sm font-medium text-gray-700 mb-2">
            Something went wrong
          </h2>
          <p className="text-xs text-gray-400 mb-6">
            An unexpected error occurred. Try refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="text-xs bg-indigo-600 text-white px-4 py-2 rounded-full font-medium hover:bg-indigo-700 transition-colors"
          >
            Refresh page
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary