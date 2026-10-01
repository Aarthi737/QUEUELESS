import React from 'react';
import { StatusBadge } from './StatusBadge';
import { Users, Clock, Radio, Info } from 'lucide-react';

export const TokenCard = ({
  tokenNumber,
  status = 'Waiting',
  peopleAhead = 7,
  estimatedWait = 21,
  currentServing = 'A35',
  serviceName = 'CityCare Hospital',
  department = 'General Consultation',
  counterNumber = 'OPD Desk 4',
  showProgress = true,
  actionButton,
  className = '',
}) => {
  const isNowServing = status === 'Now Serving';
  const isCompleted = status === 'Completed';

  // Build the progress sequence: e.g. A35 -> A36 -> A37 -> ... -> A42
  const renderProgressTokens = () => {
    if (!showProgress) return null;

    // Extract prefix and numeric parts if possible
    const currentMatch = currentServing?.match(/^([A-Z]+)(\d+)$/i);
    const targetMatch = tokenNumber?.match(/^([A-Z]+)(\d+)$/i);

    if (currentMatch && targetMatch && currentMatch[1] === targetMatch[1]) {
      const prefix = currentMatch[1];
      const start = parseInt(currentMatch[2], 10);
      const end = parseInt(targetMatch[2], 10);

      // If gap is reasonable (<= 5), show all, otherwise show first few, ellipsis, and target
      const nodes = [];
      if (end >= start) {
        if (end - start <= 4) {
          for (let i = start; i <= end; i++) {
            nodes.push(`${prefix}${i < 10 ? '0' + i : i}`);
          }
        } else {
          // e.g. A35, A36, A37, '...', A42
          nodes.push(`${prefix}${start < 10 ? '0' + start : start}`);
          nodes.push(`${prefix}${start + 1 < 10 ? '0' + (start + 1) : start + 1}`);
          nodes.push(`${prefix}${start + 2 < 10 ? '0' + (start + 2) : start + 2}`);
          nodes.push('...');
          nodes.push(`${prefix}${end < 10 ? '0' + end : end}`);
        }
      } else {
        nodes.push(currentServing, tokenNumber);
      }

      return (
        <div className="queue-progress-bar">
          {nodes.map((node, index) => {
            const isFirst = index === 0;
            const isLast = index === nodes.length - 1;
            const isEllipsis = node === '...';

            return (
              <div key={index} className="queue-progress-node">
                {isEllipsis ? (
                  <span style={{ color: 'var(--text-muted)', fontWeight: 700, padding: '0 4px' }}>•••</span>
                ) : (
                  <span
                    className={`node-pill ${isFirst ? 'node-serving' : ''} ${isLast ? 'node-target' : ''}`}
                    title={isFirst ? 'Currently Serving' : isLast ? 'Your Token' : 'Waiting Token'}
                  >
                    {node}
                    {isFirst && <span style={{ fontSize: '0.65rem', marginLeft: '4px', opacity: 0.85 }}>(Now)</span>}
                    {isLast && !isFirst && <span style={{ fontSize: '0.65rem', marginLeft: '4px' }}>(You)</span>}
                  </span>
                )}
                {index < nodes.length - 1 && (
                  <span className="node-arrow">→</span>
                )}
              </div>
            );
          })}
        </div>
      );
    }

    // Fallback if not matching format
    return (
      <div className="queue-progress-bar">
        <span className="node-pill node-serving">{currentServing} (Now)</span>
        <span className="node-arrow">→</span>
        <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>...</span>
        <span className="node-arrow">→</span>
        <span className="node-pill node-target">{tokenNumber} (You)</span>
      </div>
    );
  };

  return (
    <div className={`token-card-prominent ${className}`}>
      {/* Service Header */}
      <div style={{ marginBottom: '1.25rem' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-main)' }}>
          {serviceName}
        </h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          {department} • {counterNumber}
        </p>
      </div>

      {/* Prominent Token Display */}
      <div className="token-label">YOUR TOKEN</div>
      <div className="token-number-hero">
        #{tokenNumber}
      </div>

      {/* Status Badge */}
      <div style={{ marginBottom: '1.5rem' }}>
        <StatusBadge status={status} />
      </div>

      {/* Live Serving & Wait Summary Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          backgroundColor: '#F8FAFC',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.25rem 0.75rem',
          margin: '0 auto 1.5rem',
          maxWidth: '480px',
          textAlign: 'center',
        }}
      >
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            Current Serving
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '4px' }}>
            {currentServing}
          </div>
        </div>

        <div style={{ borderLeft: '1px solid var(--border-color)', borderRight: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            People Ahead
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: 700, color: isNowServing ? 'var(--success)' : 'var(--primary)', marginTop: '4px' }}>
            {isNowServing ? '0 (You!)' : peopleAhead}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            Est. Wait Time
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: 700, color: isNowServing ? 'var(--success)' : 'var(--text-main)', marginTop: '4px' }}>
            {isNowServing ? '0 min' : `${estimatedWait} min`}
          </div>
        </div>
      </div>

      {/* Progress sequence indicator */}
      {!isCompleted && renderProgressTokens()}

      {/* Turn Alert if Serving */}
      {isNowServing && (
        <div
          style={{
            backgroundColor: 'var(--success-light)',
            border: '1px solid var(--success-border)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            margin: '1.25rem 0',
            color: 'var(--success)',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
          }}
        >
          <Radio size={20} className="animate-pulse" />
          <span>It is your turn! Please report to {counterNumber}.</span>
        </div>
      )}

      {/* Info notification */}
      {!isNowServing && !isCompleted && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
            marginTop: '1rem',
            marginBottom: actionButton ? '1.5rem' : '0',
          }}
        >
          <Info size={16} style={{ color: 'var(--primary)', flexShrink: 0 }} />
          <span>You will receive a notification when your turn is approaching.</span>
        </div>
      )}

      {/* Action Button (e.g. Leave Queue or View Queue) */}
      {actionButton && <div>{actionButton}</div>}
    </div>
  );
};
