import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWeatherContext } from "../contexts/WeatherContext";
import { useBookmarks } from "../contexts/BookmarksContext";
import { getWeather } from "../utils/weatherCodes";
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
  const { city, weather, loading } = useWeatherContext();
  const { addBookmark, bookmarks } = useBookmarks();

  useEffect(() => {
    if (!city || !weather?.current) return;

    const weatherInfo = getWeather(weather.current.weathercode);

    const viewedItem = {
      id: `${city.name}-${city.country}`,
      city: city.name,
      country: city.country,
      temperature: weather.current.temperature_2m,
      feelsLike: weather.current.apparent_temperature,
      humidity: weather.current.relativehumidity_2m,
      wind: weather.current.windspeed_10m,
      condition: weatherInfo.label,
      icon: weatherInfo.icon,
      weatherCode: weather.current.weathercode,
      viewedAt: new Date().toISOString(),
    };

    const existing =
      JSON.parse(localStorage.getItem("recentlyViewed")) || [];

    const updated = [
      viewedItem,
      ...existing.filter((item) => item.id !== viewedItem.id),
    ].slice(0, 5);

    localStorage.setItem("recentlyViewed", JSON.stringify(updated));
  }, [city, weather]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <h2 className="text-xl font-semibold">Loading weather...</h2>
      </main>
    );
  }

  if (!weather || !city) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <h2 className="text-xl font-semibold">No weather data available</h2>
      </main>
    );
  }

  const weatherInfo = getWeather(weather.current.weathercode);

  const temperature = weather.current.temperature_2m;
  const feelsLike = weather.current.apparent_temperature;
  const humidity = weather.current.relativehumidity_2m;
  const wind = weather.current.windspeed_10m;

  const isBookmarked = bookmarks.some(
    (item) => item.city === city.name && item.country === city.country
  );

  const handleBookmark = () => {
    const bookmarkData = {
      id: `${city.name}-${city.country}`,
      city: city.name,
      country: city.country,
      temperature,
      feelsLike,
      humidity,
      wind,
      condition: weatherInfo.label,
      icon: weatherInfo.icon,
      weatherCode: weather.current.weathercode,
      savedAt: new Date().toISOString(),
    };

    addBookmark(bookmarkData);
  };

  let attire = "";
  let activity = "";
  let smartTip = "";

  if (temperature >= 30) {
    attire = "Wear light clothing, sunglasses and stay hydrated.";
    activity =
      "Avoid strenuous outdoor activities during peak afternoon hours.";
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
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-xl hover:bg-white/30 transition"
          >
            <FiArrowLeft />
            <span>Back</span>
          </button>

          <div className="flex gap-3">
            <button
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
      </div>
       {/* ANALYTICS DASHBOARD */}
      <WeatherAnalyticsDashboard />
    </main>
  );
}

export default DetailedForecast;