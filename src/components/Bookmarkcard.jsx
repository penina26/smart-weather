import React from 'react';

function getAdvisoryStyle(type) {
  switch (type) {
    case 'ideal':
      return 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
    case 'warning':
      return 'bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400';
    case 'danger':
      return 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400';
    default:
      return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';
  }
}

function getWeatherIcon(condition) {
  const c = (condition || '').toLowerCase();
  if (c.includes('sun') || c.includes('clear')) return '☀️';
  if (c.includes('cloud')) return '⛅';
  if (c.includes('rain')) return '🌧️';
  if (c.includes('snow')) return '❄️';
  if (c.includes('storm') || c.includes('thunder')) return '⛈️';
  if (c.includes('fog') || c.includes('mist')) return '🌫️';
  return '🌡️';
}

export function EmptyBookmarkCard({ onAdd }) {
  return (
    <div
      onClick={onAdd}
      className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300 min-h-[280px] group"
    >
      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 group-hover:text-blue-500 transition-all duration-300 text-2xl mb-3">
        +
      </div>
      <span className="text-sm text-slate-500 dark:text-slate-400 group-hover:text-blue-500 transition">
        Add New Location
      </span>
    </div>
  );
}

function BookmarkCard({ bookmark, onRemove, onClick }) {
  const { id, city, country, eventLabel, image, temperature, condition, humidity, wind, advisory, advisoryType } = bookmark;
  const icon = getWeatherIcon(condition);
  const advisoryStyle = getAdvisoryStyle(advisoryType);

  return (
    <div
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer"
      onClick={() => onClick?.(bookmark)}
    >
      <div className="relative h-44 bg-slate-200 dark:bg-slate-800">
        {image ? (
          <img src={image} alt={city} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">{icon}</div>
        )}
        {temperature !== undefined && (
          <div className="absolute top-3 right-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm text-slate-800 dark:text-slate-100 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center space-x-1 shadow-sm">
            <span>{icon}</span>
            <span>{Math.round(temperature)}°C</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-1">
          <div>
            <div className="font-semibold text-slate-800 dark:text-slate-100 text-base leading-tight">
              {city}{country && `, ${country}`}
            </div>
            {eventLabel && (
              <div className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-0.5">{eventLabel}</div>
            )}
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onRemove?.(id); }}
            className="text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 transition text-xl leading-none mt-0.5"
          >
            ♡
          </button>
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center space-x-3 text-xs text-slate-500 dark:text-slate-400">
            {humidity !== undefined && (
              <span className="flex items-center space-x-1"><span>💧</span><span>{humidity}%</span></span>
            )}
            {wind !== undefined && (
              <span className="flex items-center space-x-1"><span>💨</span><span>{wind}km/h</span></span>
            )}
            {condition && !humidity && !wind && <span>{condition}</span>}
          </div>
          {advisory && (
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${advisoryStyle}`}>{advisory}</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookmarkCard;