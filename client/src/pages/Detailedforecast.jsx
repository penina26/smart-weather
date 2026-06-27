import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWeatherContext } from "../contexts/WeatherContext";
import { useBookmarks } from "../contexts/BookmarksContext";
import { getWeather } from "../utils/weatherCodes";
import PlanningNotesModal from "../components/PlanningNotesModal";
import { useRecentViews } from "../contexts/RecentViewsContext";



import {
  FiArrowLeft,
  FiBookmark,
  FiMap,
  FiThermometer,
  FiWind,
  FiDroplet,
  FiSun,
} from "react-icons/fi";
import WeatherAnalyticsDashboard from "../components/WeatherAnalyticsDashboard";

function DetailedForecast() {
  const navigate = useNavigate();

  const { city, weather, loading, error } = useWeatherContext();
  const { addBookmark, bookmarks = [] } = useBookmarks();
  const { addRecentView } = useRecentViews();

  const [showPlanningNotes, setShowPlanningNotes] = useState(false);

  useEffect(() => {
    if (!city || !weather?.current) return;

    addRecentView({
      city: city.name,
      country: city.country,
      latitude: city.latitude,
      longitude: city.longitude,
    });
  }, [city, weather, addRecentView]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
          Loading weather...
        </h2>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow text-center max-w-md">
          <h2 className="text-xl font-semibold text-red-600 mb-2">
            Weather could not be loaded
          </h2>

          <p className="text-slate-500 dark:text-slate-400">{error}</p>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl transition"
          >
            Back Home
          </button>
        </div>
      </main>
    );
  }

  if (!city || !weather || !weather.current) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow text-center max-w-md">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            No weather data available
          </h2>

          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Please search for a city first.
          </p>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl transition"
          >
            Back Home
          </button>
        </div>
      </main>
    );
  }

  const current = weather.current;
  const weatherInfo = getWeather(current.weather_code);

  const temperature = current.temperature_2m;
  const feelsLike = current.apparent_temperature;
  const humidity = current.relative_humidity_2m;
  const wind = current.wind_speed_10m;

  const isBookmarked = bookmarks.some(
    (item) => item.city === city.name && item.country === city.country
  );

  const handleBookmark = () => {
    const bookmarkData = {
      city: city.name,
      country: city.country,
      latitude: city.latitude,
      longitude: city.longitude,
      temperature,
      feelsLike,
      humidity,
      wind,
      condition: weatherInfo.label,
      icon: weatherInfo.icon,
      weatherCode: current.weather_code,
      savedAt: new Date().toISOString(),
    };

    addBookmark(bookmarkData);
  };

  let attire = "";
  let activity = "";
  let smartTip = "";

  if (temperature >= 30) {
    attire = "Wear light clothing, sunglasses and stay hydrated.";
    activity = "Avoid strenuous outdoor activities during peak afternoon hours.";
    smartTip = "Carry a water bottle and seek shade whenever possible.";
  } else if (temperature <= 15) {
    attire =
      "Wear warm clothing or a jacket, especially in the morning and evening.";
    activity =
      "Schedule outdoor activities closer to midday when temperatures are warmer.";
    smartTip =
      "Layer your clothing to adapt to temperature changes throughout the day.";
  } else {
    attire =
      "Comfortable weather. Light clothing is suitable for most activities.";
    activity = "Excellent conditions for outdoor activities and travel.";
    smartTip =
      "Take advantage of the pleasant weather for exercise or outdoor events.";
  }

  if (
    weatherInfo.label.toLowerCase().includes("rain") ||
    weatherInfo.label.toLowerCase().includes("drizzle")
  ) {
    attire = "Carry an umbrella or raincoat and wear waterproof footwear.";
    activity = "Plan indoor alternatives in case rainfall increases.";
    smartTip = "Check rain updates regularly before leaving home.";
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="relative h-80 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-sky-500 to-cyan-400" />
        <div className="absolute inset-0 bg-black/30" />

        <div className="absolute top-6 left-6 right-6 z-20 flex justify-between items-center">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-xl hover:bg-white/30 transition"
          >
            <FiArrowLeft />
            <span>Back</span>
          </button>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleBookmark}
              disabled={isBookmarked}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-md transition ${isBookmarked
                ? "bg-yellow-400 text-slate-900 cursor-not-allowed"
                : "bg-white/20 text-white hover:bg-white/30"
                }`}
            >
              <FiBookmark />
              <span>{isBookmarked ? "Bookmarked" : "Bookmark"}</span>
            </button>

            <button
              type="button"
              onClick={() => navigate("/bookmarks")}
              className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-xl hover:bg-white/30 transition"
            >
              <FiMap />
              <span>Bookmarks</span>
            </button>
          </div>
        </div>

        <div className="absolute inset-0 flex flex-col justify-center items-center text-white z-10">
          <h1 className="text-5xl font-bold">
            {/* location icon */}
            <FiMap className="inline-block mr-2" />
            {city.name}, {city.country}</h1>
        </div>
        <div className="mt-6">
          <button
            type="button"
            onClick={() => setShowPlanningNotes(true)}
            className="bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 px-6 py-3 rounded-xl font-semibold transition"
          >
            Planning Notes
          </button>
        </div>

        {showPlanningNotes && (
          <PlanningNotesModal onClose={() => setShowPlanningNotes(false)} />
        )}

      </div>
      {/* ANALYTICS DASHBOARD */}
      <WeatherAnalyticsDashboard />
    </main>
  );
}

export default DetailedForecast;