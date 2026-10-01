import React from 'react';
import { Clock, CheckCircle2, XCircle, PlayCircle, PauseCircle, AlertCircle } from 'lucide-react';

export const StatusBadge = ({ status, className = '' }) => {
  const getBadgeConfig = () => {
    switch (status?.toLowerCase()) {
      case 'waiting':
        return {
          icon: <Clock size={12} strokeWidth={2.5} />,
          text: 'Waiting',
          badgeClass: 'badge-waiting',
        };
      case 'now serving':
      case 'serving':
        return {
          icon: <PlayCircle size={12} strokeWidth={2.5} />,
          text: 'Now Serving',
          badgeClass: 'badge-serving',
        };
      case 'completed':
        return {
          icon: <CheckCircle2 size={12} strokeWidth={2.5} />,
          text: 'Completed',
          badgeClass: 'badge-completed',
        };
      case 'cancelled':
        return {
          icon: <XCircle size={12} strokeWidth={2.5} />,
          text: 'Cancelled',
          badgeClass: 'badge-cancelled',
        };
      case 'paused':
        return {
          icon: <PauseCircle size={12} strokeWidth={2.5} />,
          text: 'Paused',
          badgeClass: 'badge-paused',
        };
      case 'active':
        return {
          icon: <PlayCircle size={12} strokeWidth={2.5} />,
          text: 'Active',
          badgeClass: 'badge-serving',
        };
      default:
        return {
          icon: <AlertCircle size={12} strokeWidth={2.5} />,
          text: status || 'Unknown',
          badgeClass: 'badge-paused',
        };
    }
  };

  const { icon, text, badgeClass } = getBadgeConfig();

  return (
    <span className={`badge ${badgeClass} ${className}`}>
      {icon}
      <span>{text}</span>
    </span>
  );
};
