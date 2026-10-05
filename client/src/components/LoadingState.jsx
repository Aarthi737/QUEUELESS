import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingState = ({ message = 'Loading queue...', className = '' }) => {
  return (
    <div
      className={`card ${className}`}
      style={{
        textAlign: 'center',
        padding: '3rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Loader2
        size={36}
        style={{
          color: 'var(--primary)',
          animation: 'spin 1s linear infinite',
          marginBottom: '1rem',
        }}
      />
      <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', fontWeight: 500 }}>
        {message}
      </p>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
