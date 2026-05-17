import { Component, ErrorInfo, ReactNode } from "react";
import { Button, Result } from "antd";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  reset = () => this.setState({ hasError: false, error: undefined });

  render() {
    if (!this.state.hasError) return this.props.children;

    if (this.props.fallback) return this.props.fallback;

    return (
      <Result
        status="error"
        title="Algo deu errado"
        subTitle={
          this.state.error?.message ??
          "Ocorreu um erro inesperado nesta página."
        }
        extra={
          <Button type="primary" onClick={this.reset}>
            Tentar novamente
          </Button>
        }
      />
    );
  }
}

export default ErrorBoundary;
