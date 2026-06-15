import { useState } from "react";
import { useGeocoding }      from "../hooks/useGeocoding";
import { useWeatherContext } from "../contexts/WeatherContext";

export default function SearchBar() {
  const { setCity }                      = useWeatherContext();
  const [query, setQuery]                = useState("");
  const [showResults, setShowResults]    = useState(false);
  const { results, loading, searchCity } = useGeocoding();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    searchCity(query);
    setShowResults(true);
  };

  const handleSelect = (city) => {
    setCity(city);
    setQuery(city.name);
    setShowResults(false);
  };

  return (
    <div className="relative max-w-xl mx-auto">

      {/* Search form */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search city... e.g. Nairobi, London"
          className="flex-1 px-4 py-3 rounded-xl border border-gray-200
                     text-sm shadow-sm outline-none
                     focus:ring-2 focus:ring-blue-400 focus:border-transparent
                     transition-all duration-200"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-3 bg-blue-500 hover:bg-blue-600
                     text-white text-sm font-semibold rounded-xl
                     shadow-sm transition-all duration-200
                     disabled:opacity-50 disabled:cursor-not-allowed">
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10"
                        stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              Searching
            </span>
          ) : "Search"}
        </button>
      </form>

      {/* Dropdown results */}
      {showResults && results.length > 0 && (
        <ul className="absolute top-full left-0 right-0 mt-2 bg-white
                       border border-gray-100 rounded-xl shadow-lg
                       z-50 overflow-hidden">
          {results.map((city, i) => (
            <li
              key={i}
              onClick={() => handleSelect(city)}
              className="flex justify-between items-center px-4 py-3
                         cursor-pointer hover:bg-blue-50
                         border-b border-gray-50 last:border-none
                         transition-colors duration-150">
              <div className="flex items-center gap-2">
                <span className="text-base">📍</span>
                <span className="text-sm font-medium text-gray-800">
                  {city.name}
                </span>
              </div>
              <span className="text-xs text-gray-400">
                {city.admin1}, {city.country}
              </span>
            </li>
          ))}
        </ul>
      )}

      {/* No results */}
      {showResults && results.length === 0 && !loading && (
        <div className="mt-2 px-4 py-3 bg-red-50 border border-red-100
                        rounded-xl text-sm text-red-500 text-center">
          No cities found for "<span className="font-medium">{query}</span>".
          Try a different name.
        </div>
      )}
    </div>
  );
}