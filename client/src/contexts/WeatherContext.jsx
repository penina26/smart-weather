import { createContext, useContext, useState } from "react";
import { useWeather } from "../hooks/useWeather";

const WeatherContext = createContext(null);

export function WeatherProvider({ children }) {
  const [city, setCity] = useState({
    name: "Nairobi",
    latitude: -1.286389,
    longitude: 36.817223,
    country: "Kenya",
  });

  const { weather, backendCity, loading, error } = useWeather(
    city.latitude,
    city.longitude,
    city.name,
    city.country
  );

  const value = {
    city,
    setCity,
    backendCity,
    weather,
    loading,
    error,
  };

  return (
    <WeatherContext.Provider value={value}>
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeatherContext() {
  const context = useContext(WeatherContext);

  if (!context) {
    throw new Error("useWeatherContext must be used inside WeatherProvider");
  }

  return context;
}