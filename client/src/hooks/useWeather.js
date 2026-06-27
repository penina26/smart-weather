import { useState, useEffect } from "react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000";

export function useWeather(lat, lon, cityName, country) {
  const [weather, setWeather] = useState(null);
  const [backendCity, setBackendCity] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!lat || !lon) return;

    const fetchWeather = async () => {
      setLoading(true);
      setError(null);

      try {
        const url =
          `${API_BASE_URL}/api/weather` +
          `?lat=${lat}` +
          `&lon=${lon}` +
          `&city=${encodeURIComponent(cityName || "")}` +
          `&country=${encodeURIComponent(country || "")}`;

        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch weather");
        }

        setBackendCity(data.city);
        setWeather(data.weather);
      } catch (err) {
        setError(err.message || "Failed to load weather");
        setWeather(null);
        setBackendCity(null);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [lat, lon, cityName, country]);

  return {
    weather,
    backendCity,
    loading,
    error,
  };
}