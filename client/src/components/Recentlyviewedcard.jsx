import React from 'react';

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

function RecentlyViewedCard({ item, onClick }) {
  const { city, country, condition, temperature, image } = item;
  const icon = getWeatherIcon(condition);

  return (
    <div
      onClick={() => onClick?.(item)}
      className="flex items-center space-x-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-all duration-200 group"
    >
      <div className="w-11 h-11 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-700 flex-shrink-0">
        {image ? (
          <img src={image} alt={city} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xl">{icon}</div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
          {city}{country && `, ${country}`}
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
          {condition && <span>{condition}</span>}
          {condition && temperature !== undefined && <span> • </span>}
          {temperature !== undefined && <span>+{Math.round(temperature)}°C</span>}
        </div>
      </div>

      <div className="text-slate-300 dark:text-slate-600 group-hover:text-slate-500 dark:group-hover:text-slate-400 transition text-sm flex-shrink-0">
        ›
      </div>
    </div>
  );
}

export default RecentlyViewedCard;