import { useState, useEffect } from "react";

export function useWeather(lat, lon) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!lat || !lon) return;

    const fetchWeather = async () => {
      setLoading(true);
      setError(null);

      try {
        const url =
          `https://api.open-meteo.com/v1/forecast` +
          `?latitude=${lat}&longitude=${lon}` +
          `&current=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m,apparent_temperature` +
          `&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max` +
          `&timezone=Africa%2FNairobi`;

        const res = await fetch(url);

        if (!res.ok) {
          throw new Error("Failed to fetch weather");
        }

        const data = await res.json();
        setWeather(data);
      } catch (err) {
        setError(err.message || "Failed to load weather");
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [lat, lon]);

  return { weather, loading, error };
}
