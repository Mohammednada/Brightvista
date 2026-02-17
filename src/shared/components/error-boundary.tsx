import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex items-center justify-center h-full w-full p-8">
            <div className="text-center">
              <p className="text-[16px] font-semibold text-text-primary">
                Something went wrong
              </p>
              <p className="text-[14px] text-text-secondary mt-1">
                Please refresh the page to try again.
              </p>
            </div>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
