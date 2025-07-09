import { Component, ErrorInfo, ReactNode } from "react";
import { BasePage } from "@/components/BasePage.tsx";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // You can also log the error to an error reporting service
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Use BasePage with isError=true
      return (
        <BasePage isLoading={false} isError={true} showEmpty={true}>
          <BasePage.Content>
            {/* Error content will be handled by BasePage's showEmpty prop */}
            <div></div>
          </BasePage.Content>
        </BasePage>
      );
    }

    return this.props.children;
  }
}
