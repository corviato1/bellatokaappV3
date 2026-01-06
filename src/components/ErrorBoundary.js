import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });

    // Log error to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("Error caught by boundary:", error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "20px", textAlign: "center" }}>
          <h2>Something went wrong.</h2>
          <details style={{ whiteSpace: "pre-wrap", marginTop: "10px" }}>
            <summary>Error Details (Click to expand)</summary>
            {this.state.error && this.state.error.toString()}
            <br />
            {(this.state.errorInfo && this.state.errorInfo.componentStack) ||
              "No component stack available"}
          </details>
          <button
            onClick={() => window.location.reload()}
            style={{ marginTop: "10px", padding: "10px 20px" }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
