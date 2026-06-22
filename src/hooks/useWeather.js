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
          `&current_weather=true` +
          `&hourly=temperature_2m,apparent_temperature,relativehumidity_2m,windspeed_10m,weathercode` +
          `&daily=temperature_2m_max,temperature_2m_min,weathercode,precipitation_probability_max` +
          `&timezone=Africa%2FNairobi`;

        const res = await fetch(url);

        if (!res.ok) {
          throw new Error("Failed to fetch weather");
        }

        const data = await res.json();

        // Normalize response so components can read 'weather.current.*'
        const current = {};

        if (data.current_weather) {
          current.temperature_2m = data.current_weather.temperature;
          current.weathercode = data.current_weather.weathercode;
          current.windspeed_10m = data.current_weather.windspeed;
          current.time = data.current_weather.time;
        }

        // Fallback to hourly arrays for missing fields
        if (data.hourly) {
          const idx = 0;
          current.temperature_2m =
            current.temperature_2m ?? data.hourly.temperature_2m?.[idx];
          current.apparent_temperature =
            data.hourly.apparent_temperature?.[idx] ?? null;
          current.relativehumidity_2m =
            data.hourly.relativehumidity_2m?.[idx] ?? null;
          current.windspeed_10m =
            current.windspeed_10m ?? data.hourly.windspeed_10m?.[idx];
          current.weathercode = current.weathercode ?? data.hourly.weathercode?.[idx];
        }

        const normalized = {
          ...data,
          current,
        };

        setWeather(normalized);
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
