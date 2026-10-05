import React from 'react';
import { useQueue } from '../context/QueueContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, removeToast } = useQueue();

  if (!toasts || toasts.length === 0) return null;

  const getToastIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={18} style={{ color: 'var(--success)' }} />;
      case 'warning':
        return <AlertTriangle size={18} style={{ color: 'var(--warning)' }} />;
      case 'error':
        return <AlertCircle size={18} style={{ color: 'var(--error)' }} />;
      default:
        return <Info size={18} style={{ color: 'var(--primary)' }} />;
    }
  };

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type || 'info'}`}>
          <div style={{ flexShrink: 0, marginTop: '2px' }}>
            {getToastIcon(toast.type)}
          </div>
          <div style={{ flex: 1, lineHeight: 1.4 }}>{toast.message}</div>
          <button
            type="button"
            onClick={() => removeToast(toast.id)}
            style={{
              color: 'var(--text-muted)',
              padding: '2px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
            aria-label="Dismiss toast"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};
