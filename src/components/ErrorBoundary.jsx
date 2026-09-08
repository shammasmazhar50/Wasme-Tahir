import React from 'react';

/**
 * ErrorBoundary — catches any render-time JavaScript error in its subtree
 * and shows a friendly fallback instead of a blank white screen.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // In production you could send this to an error tracking service
    console.error('[ErrorBoundary] Uncaught error:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Inter, sans-serif',
          color: '#1a1a18',
          textAlign: 'center',
          padding: '40px 24px',
          gap: '16px',
        }}>
          <div style={{ fontSize: '2.5rem' }}>⚠️</div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>
            Something went wrong
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#777', maxWidth: 360, margin: 0 }}>
            An unexpected error occurred. Please refresh the page. If the problem
            persists, contact support.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: 8,
              padding: '10px 24px',
              background: '#1a1a18',
              color: 'white',
              border: 'none',
              borderRadius: 6,
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
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
