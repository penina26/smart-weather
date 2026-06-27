import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBookmarks } from "../contexts/BookmarksContext";
import { useWeatherContext } from "../contexts/WeatherContext";
import { RecentViewsContext } from "../contexts/WeatherContext";
import {
    FiArrowLeft,
    FiClock,
    FiAlertTriangle,
    FiMapPin,
    FiEye,
    FiTrash2,
} from "react-icons/fi";

function BookmarksPage() {
    const navigate = useNavigate();

    const {
        bookmarks,
        removeBookmark,
        loadingBookmarks,
        bookmarksError,
        fetchBookmarks,
    } = useBookmarks();

    const { setCity } = useWeatherContext();

    const [recentlyViewed, setRecentlyViewed] = useState([]);

    useEffect(() => {
        fetchBookmarks();

        const storedRecent =
            JSON.parse(localStorage.getItem("recentlyViewed")) || [];

        setRecentlyViewed(storedRecent);
    }, []);

    const handleViewBookmark = (item) => {
        setCity({
            name: item.city,
            country: item.country,
            latitude: item.latitude,
            longitude: item.longitude,
        });

        navigate("/details");
    };

    const handleViewRecent = (item) => {
        if (!item.latitude || !item.longitude) {
            return;
        }

        setCity({
            name: item.city,
            country: item.country,
            latitude: item.latitude,
            longitude: item.longitude,
        });

        navigate("/details");
    };

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950 px-6 py-10">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-2 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-white px-4 py-2 rounded-xl hover:opacity-90 transition w-fit"
                    >
                        <FiArrowLeft className="text-lg" />
                        <span>Back</span>
                    </button>

                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                        Bookmarked Locations
                    </h1>
                </div>

                {/* Error Message */}
                {bookmarksError && (
                    <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-xl px-5 py-4 text-sm">
                        {bookmarksError}
                    </div>
                )}

                {/* Page Content */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Main Area */}
                    <section className="lg:col-span-3">
                        {loadingBookmarks ? (
                            <div className="bg-white dark:bg-slate-900 rounded-2xl p-10 shadow text-center">
                                <p className="text-slate-500 dark:text-slate-400">
                                    Loading bookmarks...
                                </p>
                            </div>
                        ) : !bookmarks || bookmarks.length === 0 ? (
                            <div className="bg-white dark:bg-slate-900 rounded-2xl p-10 shadow text-center">
                                <div className="flex justify-center mb-4">
                                    <FiMapPin className="text-3xl text-slate-400" />
                                </div>

                                <h2 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">
                                    No bookmarks yet
                                </h2>

                                <p className="text-slate-500">
                                    Save a city from the detailed forecast page and it will appear
                                    here.
                                </p>
                            </div>
                        ) : (
                            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {bookmarks.map((item) => (
                                    <div
                                        key={item.id}
                                        className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow hover:shadow-lg transition"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                                    {item.city}
                                                </h2>
                                                <p className="text-slate-500">{item.country}</p>
                                            </div>

                                            <div className="text-3xl">{item.icon || ""}</div>
                                        </div>

                                        <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                                            <p>
                                                <span className="font-semibold">Condition:</span>{" "}
                                                {item.condition || "Unknown"}
                                            </p>

                                            <p>
                                                <span className="font-semibold">Temperature:</span>{" "}
                                                {item.temperature !== null &&
                                                    item.temperature !== undefined
                                                    ? `${item.temperature}°`
                                                    : "N/A"}
                                            </p>

                                            <p>
                                                <span className="font-semibold">Feels Like:</span>{" "}
                                                {item.feelsLike !== null &&
                                                    item.feelsLike !== undefined
                                                    ? `${item.feelsLike}°`
                                                    : "N/A"}
                                            </p>

                                            <p>
                                                <span className="font-semibold">Humidity:</span>{" "}
                                                {item.humidity !== null && item.humidity !== undefined
                                                    ? `${item.humidity}%`
                                                    : "N/A"}
                                            </p>

                                            <p>
                                                <span className="font-semibold">Wind:</span>{" "}
                                                {item.wind !== null && item.wind !== undefined
                                                    ? `${item.wind} km/h`
                                                    : "N/A"}
                                            </p>
                                        </div>

                                        <div className="mt-5 flex gap-3">
                                            <button
                                                onClick={() => handleViewBookmark(item)}
                                                className="flex-1 inline-flex items-center justify-center gap-2 bg-sky-500 text-white py-2 rounded-xl hover:bg-sky-600 transition"
                                            >
                                                <FiEye />
                                                <span>View</span>
                                            </button>

                                            <button
                                                onClick={() => removeBookmark(item.id)}
                                                className="flex-1 inline-flex items-center justify-center gap-2 bg-red-500 text-white py-2 rounded-xl hover:bg-red-600 transition"
                                            >
                                                <FiTrash2 />
                                                <span>Remove</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Sidebar */}
                    <aside className="lg:col-span-1 space-y-6">
                        {/* Recently Viewed */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow">
                            <div className="flex items-center gap-2 mb-4">
                                <FiClock className="text-slate-600 dark:text-slate-300" />
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                    Recently Viewed
                                </h2>
                            </div>

                            {!recentlyViewed || recentlyViewed.length === 0 ? (
                                <p className="text-sm text-slate-500">
                                    No recently viewed locations yet.
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {recentlyViewed.slice(0, 5).map((item, index) => (
                                        <button
                                            key={item.id || index}
                                            onClick={() => handleViewRecent(item)}
                                            disabled={!item.latitude || !item.longitude}
                                            className="w-full text-left p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
                                        >
                                            <div className="flex items-center justify-between gap-3">
                                                <div>
                                                    <p className="font-semibold text-slate-900 dark:text-white">
                                                        {item.city}
                                                    </p>
                                                    <p className="text-xs text-slate-500">
                                                        {item.country}
                                                    </p>
                                                </div>

                                                <div className="text-2xl">{item.icon || ""}</div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Alert */}
                        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-5 shadow">
                            <div className="flex items-start gap-3">
                                <FiAlertTriangle className="text-xl text-amber-600 dark:text-amber-400 mt-0.5" />

                                <div>
                                    <h3 className="font-bold text-amber-900 dark:text-amber-300 mb-1">
                                        Weather Alert
                                    </h3>

                                    <p className="text-sm text-amber-800 dark:text-amber-200">
                                        Conditions may change quickly. Check the detailed forecast
                                        before travel or outdoor plans.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
}

export default BookmarksPage;