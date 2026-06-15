import { createContext, useContext, useState } from "react";
import { useWeather }    from "../hooks/useWeather";

// 1. Create the context
const WeatherContext = createContext(null);

// 2. Create the provider — wraps the whole app
export function WeatherProvider({ children }) {
  const [city, setCity] = useState({
    name:      "Nairobi",
    latitude:  -1.286389,
    longitude:  36.817223,
    country:   "Kenya",
  });

  const { weather, loading, error }      = useWeather(city.latitude, city.longitude);

  // Everything any component might need
  const value = {
    city, setCity,
    weather, loading, error,
  };

  return (
    <WeatherContext.Provider value={value}>
      {children}
    </WeatherContext.Provider>
  );
}

// 3. Custom hook — components use this to access context
export function useWeatherContext() {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error("useWeatherContext must be used inside WeatherProvider");
  }
  return context;
}