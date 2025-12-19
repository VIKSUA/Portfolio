import React from "react";

type ErrorBoundaryState = {
  hasError: boolean;
  error?: Error;
};

export class ErrorBoundary extends React.Component<
  React.PropsWithChildren,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
          <div className="mx-auto max-w-4xl px-6 py-24">
            <h1 className="font-display text-3xl font-semibold">Something went wrong.</h1>
            <p className="mt-3 text-slate-300">
              Please refresh the page. If the issue persists, reach out and I will fix it.
            </p>
            {this.state.error && (
              <pre className="mt-6 overflow-auto rounded-lg bg-slate-900 p-4 text-xs text-slate-400">
                {this.state.error.message}
              </pre>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
