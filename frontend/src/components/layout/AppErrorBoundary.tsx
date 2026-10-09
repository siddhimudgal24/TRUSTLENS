import { Component, type ErrorInfo, type ReactNode } from "react";

interface AppErrorBoundaryProps {
  children: ReactNode;
}

interface AppErrorBoundaryState {
  hasError: boolean;
}

class AppErrorBoundary extends Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  state: AppErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Unhandled application render error", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[50vh] items-center justify-center p-6">
          <section
            role="alert"
            className="w-full max-w-md rounded-lg border border-red-200 bg-white p-6 text-center shadow-sm"
          >
            <h1 className="text-lg font-bold text-slate-900">
              This page could not be displayed
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              An unexpected display error occurred. Reload the page to try again.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-5 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Reload page
            </button>
          </section>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AppErrorBoundary;
