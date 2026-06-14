import { useState, useEffect } from "react";

export function useWeather(lat, lon) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  useEffect(() => {
    // Don't fetch if no coordinates yet
    if (!lat || !lon) return;

    const fetchWeather = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = `https://api.open-meteo.com/v1/forecast`
          + `?latitude=${lat}&longitude=${lon}`
          + `&current=temperature_2m,weathercode,windspeed_10m,relativehumidity_2m,apparent_temperature`
          + `&daily=temperature_2m_max,temperature_2m_min,weathercode,precipitation_probability_max`
          + `&timezone=Africa%2FNairobi`;

        const res  = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch weather");
        const data = await res.json();
        setWeather(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [lat, lon]); // re-fetch whenever coordinates change

  return { weather, loading, error };
}