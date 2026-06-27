import React from 'react';

function AlertCard({ alert, onDismiss }) {
  const { id, location, message, ctaLabel, ctaAction } = alert;

  return (
    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-2xl p-4 transition-colors duration-300">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          <span className="text-amber-500 text-base">⚠️</span>
          <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wide">
            Proactive Alert
          </span>
        </div>
        {onDismiss && (
          <button
            onClick={() => onDismiss?.(id)}
            className="text-amber-400 dark:text-amber-600 hover:text-amber-600 dark:hover:text-amber-400 transition text-lg leading-none"
          >
            ×
          </button>
        )}
      </div>

      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        Storm front approaching{' '}
        {location && (
          <span className="font-bold text-slate-900 dark:text-slate-100">{location}</span>
        )}{' '}
        {message}
      </p>

      {ctaLabel && (
        <button
          onClick={ctaAction}
          className="mt-3 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline transition"
        >
          {ctaLabel}
        </button>
      )}
    </div>
  );
}

export default AlertCard;