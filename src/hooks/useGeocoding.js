import { useState } from "react";

export function useGeocoding() {
  const [results, setResults]   = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);

  const searchCity = async (cityName) => {
    if (!cityName.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const url = `https://geocoding-api.open-meteo.com/v1/search`
        + `?name=${encodeURIComponent(cityName)}`
        + `&count=5&language=en&format=json`;

      const res  = await fetch(url);
      const data = await res.json();
      setResults(data.results || []);
    } catch (err) {
      setError("Could not find city. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return { results, loading, error, searchCity };
}