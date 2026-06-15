import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const SAMPLE_DATA = {
  1: {
    city: 'Maui',
    country: 'HI',
    eventLabel: 'Surfing Trip',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    temperature: 28,
    feelsLike: 30,
    condition: 'Sunny',
    humidity: 12,
    wind: 14,
    windDirection: 'NW',
    uvIndex: 8,
    advisory: 'Ideal Conditions',
    advisoryType: 'ideal',
    planningConfidence: 92,
    attire: 'Light clothing recommended. Expect a temperature drop after 7:30 PM sunset — bring a light jacket.',
    contingency: 'Low priority. 3% rain probability. No backup plan required but have sunscreen ready.',
    smartTip: 'May Gray usually burns off by 1:00 PM. High likelihood of crisp, clear blue skies by your scheduled time.',
  },
  2: {
    city: 'Aspen',
    country: 'CO',
    eventLabel: 'Ski Weekend',
    image: 'https://images.unsplash.com/photo-1548777123-e216912df34c?w=800&q=80',
    temperature: -4,
    feelsLike: -8,
    condition: 'Partly Cloudy',
    humidity: 60,
    wind: 20,
    windDirection: 'N',
    uvIndex: 10,
    advisory: 'High UV',
    advisoryType: 'warning',
    planningConfidence: 78,
    attire: 'Heavy layers essential. UV radiation is intense at altitude — wear UV-protective goggles and sunscreen.',
    contingency: 'Moderate priority. 20% chance of afternoon snowfall. Have indoor warm-up spots identified.',
    smartTip: 'UV index peaks between 11 AM and 2 PM at this altitude. Schedule outdoor runs for early morning.',
  },
  3: {
    city: 'London',
    country: 'UK',
    eventLabel: 'Business Summit',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80',
    temperature: 14,
    feelsLike: 11,
    condition: 'Rain',
    humidity: 80,
    wind: 18,
    windDirection: 'SW',
    uvIndex: 2,
    advisory: 'Bring Umbrella',
    advisoryType: 'warning',
    planningConfidence: 65,
    attire: 'Waterproof jacket and formal shoes with grip. Avoid light-colored clothing.',
    contingency: 'High priority. 80% rain probability. Arrange covered transport between venues.',
    smartTip: 'Rain is heaviest in the morning. Afternoon showers are lighter and shorter. Plan outdoor moments after 3 PM.',
  },
};

function getAdvisoryStyle(type) {
  switch (type) {
    case 'ideal': return 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
    case 'warning': return 'bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400';
    case 'danger': return 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400';
    default: return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';
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

function DetailedForecast() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    const forecast = SAMPLE_DATA[id];
    if (forecast) setData(forecast);
  }, [id]);

  if (!data) {
    return (
      <main className="flex-grow flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-slate-500 dark:text-slate-400 text-sm">Forecast not found.</div>
      </main>
    );
  }

  const icon = getWeatherIcon(data.condition);
  const advisoryStyle = getAdvisoryStyle(data.advisoryType);

  return (
    <main className="flex-grow bg-slate-50 dark:bg-slate-950 transition-colors duration-300">

      {/* Hero image */}
      <div className="relative h-72 w-full overflow-hidden">
        <img src={data.image} alt={data.city} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60" />

        {/* Back button */}
        <button
          onClick={() => navigate('/bookmarks')}
          className="absolute top-5 left-6 text-white text-sm font-medium flex items-center space-x-1 hover:opacity-80 transition"
        >
          <span>←</span>
          <span>Back</span>
        </button>

        {/* Location card overlay */}
        <div className="absolute bottom-5 left-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-2xl px-5 py-4 shadow-lg">
          <div className="flex items-center space-x-1 text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>📍</span>
            <span>{data.city}, {data.country}</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{data.eventLabel}</div>
        </div>

        {/* Planning confidence badge */}
        <div className="absolute bottom-5 right-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-2xl px-5 py-4 shadow-lg text-center">
          <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Planning Confidence</div>
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{data.planningConfidence}%</div>
          <div className="text-xs font-medium text-slate-700 dark:text-slate-300 mt-0.5">Ideal Conditions</div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">

        {/* Precision Metrics */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">Precision Metrics</h2>
            <span className="text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full">
              Live Updates
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div>
              <div className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1">Temperature</div>
              <div className="text-4xl font-bold text-slate-800 dark:text-slate-100">{data.temperature}°</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">RealFeel {data.feelsLike}°</div>
            </div>
            <div>
              <div className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1">UV Index</div>
              <div className="text-4xl font-bold text-slate-800 dark:text-slate-100">{data.uvIndex}</div>
              <div className={`text-xs font-medium mt-0.5 ${data.uvIndex >= 8 ? 'text-red-500' : data.uvIndex >= 5 ? 'text-orange-500' : 'text-green-500'}`}>
                {data.uvIndex >= 8 ? 'Very High Risk' : data.uvIndex >= 5 ? 'Moderate Risk' : 'Low Risk'}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1">Wind</div>
              <div className="text-4xl font-bold text-slate-800 dark:text-slate-100">{data.wind}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">mph {data.windDirection}</div>
            </div>
            <div>
              <div className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1">Humidity</div>
              <div className="text-4xl font-bold text-slate-800 dark:text-slate-100">{data.humidity}%</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {data.humidity < 40 ? 'Dry' : data.humidity < 70 ? 'Comfortable' : 'Humid'}
              </div>
            </div>
          </div>
        </div>

        {/* Attire + Contingency */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
            <div className="text-xl mb-3">👔</div>
            <div className="font-semibold text-slate-800 dark:text-slate-100 mb-2">Attire</div>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{data.attire}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
            <div className="text-xl mb-3">📋</div>
            <div className="font-semibold text-slate-800 dark:text-slate-100 mb-2">Contingency</div>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{data.contingency}</p>
          </div>
        </div>

        {/* Smart Tip */}
        <div className="bg-blue-600 dark:bg-blue-700 rounded-2xl p-5">
          <div className="text-xs font-semibold text-blue-200 uppercase tracking-wide mb-2">Smart Tip</div>
          <p className="text-sm text-white leading-relaxed">{data.smartTip}</p>
        </div>

      </div>
    </main>
  );
}

export default DetailedForecast;