import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught application error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#f9f8f3] flex items-center justify-center p-6 text-[#1A1C19]">
          <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl border border-red-200 p-6 space-y-4">
            <div className="flex items-center space-x-3 text-red-600">
              <span className="text-3xl">⚠️</span>
              <div>
                <h2 className="text-xl font-bold">Something went wrong</h2>
                <p className="text-sm text-gray-600">Application encountered an unexpected error</p>
              </div>
            </div>
            <div className="p-3 bg-red-50 text-red-800 rounded-lg text-xs font-mono overflow-auto max-h-48 border border-red-100">
              {this.state.error?.toString()}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm transition"
              >
                Reload App
              </button>
              <button
                onClick={() => {
                  localStorage.clear();
                  window.location.href = '/';
                }}
                className="py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-sm transition"
              >
                Reset & Reload
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
