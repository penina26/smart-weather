import { useState } from "react";
import { useGeocoding } from "../hooks/useGeocoding";
import { useWeatherContext } from "../contexts/WeatherContext";
import { useNavigate } from "react-router-dom";
import { FiMapPin, FiCalendar, FiSearch } from "react-icons/fi";

export default function SearchBar() {
  const navigate = useNavigate();
  const weatherContext = useWeatherContext();
  const { setCity } = weatherContext;

  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [dateError, setDateError] = useState("");

  const { results, loading, searchCity } = useGeocoding();

  const today = new Date().toISOString().split("T")[0];

  const addDays = (days) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split("T")[0];
  };

  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(addDays(7));

  const handleQuickRange = (days) => {
    setStartDate(today);
    setEndDate(addDays(days));
    setDateError("");
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!query.trim()) return;

    if (new Date(endDate) < new Date(startDate)) {
      setDateError("End date cannot be earlier than start date.");
      return;
    }

    setDateError("");
    await searchCity(query);
    setShowResults(true);
  };

  const handleSelect = (selectedCity) => {
    setCity(selectedCity);

    if (typeof weatherContext.setDateRange === "function") {
      weatherContext.setDateRange({
        startDate,
        endDate,
      });
    }

    setQuery(selectedCity.name);
    setShowResults(false);
    navigate("/details");
  };

  return (
    <div className="relative max-w-3xl mx-auto">
      <form onSubmit={handleSearch} className="space-y-4">
        {/* Search row */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowResults(false);
              }}
              placeholder="Search city... e.g. Nairobi, London"
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 text-sm shadow-sm outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-5 py-3 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-xl shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        {/* Date range row */}
        <div className="grid md:grid-cols-2 gap-3">
          <div className="relative">
            <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 text-sm shadow-sm outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div className="relative">
            <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 text-sm shadow-sm outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        {/* Quick ranges */}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleQuickRange(7)}
            className="px-4 py-2 rounded-lg bg-blue-50 text-blue-600 text-sm font-medium hover:bg-blue-100 transition"
          >
            Next 7 Days
          </button>

          <button
            type="button"
            onClick={() => handleQuickRange(14)}
            className="px-4 py-2 rounded-lg bg-blue-50 text-blue-600 text-sm font-medium hover:bg-blue-100 transition"
          >
            Next 14 Days
          </button>

          <button
            type="button"
            onClick={() => handleQuickRange(16)}
            className="px-4 py-2 rounded-lg bg-blue-50 text-blue-600 text-sm font-medium hover:bg-blue-100 transition"
          >
            Next 16 Days
          </button>
        </div>

        {dateError && (
          <div className="mt-2 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-500 text-center">
            {dateError}
          </div>
        )}
      </form>

      {/* Dropdown results */}
      {showResults && results.length > 0 && (
        <ul className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-lg z-50 overflow-hidden">
          {results.map((city, i) => (
            <li
              key={i}
              onClick={() => handleSelect(city)}
              className="flex justify-between items-center px-4 py-3 cursor-pointer hover:bg-blue-50 border-b border-gray-50 last:border-none transition-colors duration-150"
            >
              <div className="flex items-center gap-2">
                <FiMapPin className="text-gray-500" />
                <span className="text-sm font-medium text-gray-800">
                  {city.name}
                </span>
              </div>
              <span className="text-xs text-gray-400">
                {city.admin1 ? `${city.admin1}, ` : ""}
                {city.country}
              </span>
            </li>
          ))}
        </ul>
      )}

      {/* No results */}
      {showResults && results.length === 0 && !loading && (
        <div className="mt-2 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-500 text-center">
          No cities found for <span className="font-medium">"{query}"</span>.
          Try a different name.
        </div>
      )}
    </div>
  );
}