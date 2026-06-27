import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBookmarks } from "../contexts/BookmarksContext";
import { useWeatherContext } from "../contexts/WeatherContext";
import { useRecentViews } from "../contexts/RecentViewsContext";
import { useAuth } from "../contexts/AuthContext";
import {
    FiArrowLeft,
    FiClock,
    FiMapPin,
    FiPlus,
    FiChevronLeft,
    FiChevronRight
} from "react-icons/fi";


import { BookmarkCard } from "../components/BookmarkCard";
import { RecentViewItem } from "../components/RecentViewItem";
import { WeatherAlert } from "../components/WeatherAlert";

function BookmarksPage() {
    const navigate = useNavigate();
    const { setCity } = useWeatherContext();
    const { token, isAuthenticated } = useAuth();

    const {
        bookmarks,
        removeBookmark,
        loadingBookmarks,
        bookmarksError,
        fetchBookmarks,
    } = useBookmarks();

    const { recentViews = [], fetchRecentViews } = useRecentViews();

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    useEffect(() => {
        fetchBookmarks();
        if (fetchRecentViews) fetchRecentViews();
    }, [token, isAuthenticated]);

    // Calculate pagination details
    const totalPages = Math.ceil((bookmarks?.length || 0) / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentBookmarks = bookmarks?.slice(startIndex, startIndex + itemsPerPage) || [];

    // Safety check: If a user deletes the last item on the current page, step back one page
    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }
    }, [bookmarks, currentPage, totalPages]);

    const handleViewLocation = (item) => {
        if (!item.latitude || !item.longitude) return;

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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="inline-flex items-center gap-2 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-white px-4 py-2 rounded-xl hover:opacity-90 transition"
                        >
                            <FiArrowLeft className="text-lg" />
                            <span className="hidden sm:inline">Back</span>
                        </button>
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                            Bookmarked Locations
                        </h1>
                    </div>

                    <button
                        onClick={() => navigate("/")} 
                        className="inline-flex items-center justify-center gap-2 bg-sky-500 text-white px-5 py-2.5 rounded-xl hover:bg-sky-600 transition font-semibold shadow-sm"
                    >
                        <FiPlus className="text-lg" />
                        <span>Add Bookmark</span>
                    </button>
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
                        ) : !bookmarks?.length ? (
                            <div className="bg-white dark:bg-slate-900 rounded-2xl p-10 shadow text-center">
                                <div className="flex justify-center mb-4">
                                    <FiMapPin className="text-3xl text-slate-400" />
                                </div>
                                <h2 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">
                                    No bookmarks yet
                                </h2>
                                <p className="text-slate-500 mb-6">
                                    Search for a city and save it to quickly check its weather later.
                                </p>
                                <button
                                    onClick={() => navigate("/")}
                                    className="inline-flex items-center gap-2 bg-sky-500 text-white px-6 py-2.5 rounded-xl hover:bg-sky-600 transition font-medium"
                                >
                                    <FiPlus />
                                    <span>Find a City</span>
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col min-h-[500px]">
                                {/* Bookmarks Grid */}
                                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6 flex-grow items-start">
                                    {currentBookmarks.map((item) => (
                                        <BookmarkCard 
                                            key={item.id} 
                                            item={item} 
                                            onView={handleViewLocation} 
                                            onRemove={removeBookmark} 
                                        />
                                    ))}
                                </div>

                                {/* Pagination Controls */}
                                {totalPages > 1 && (
                                    <div className="flex items-center justify-center gap-4 mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
                                        <button
                                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                            disabled={currentPage === 1}
                                            className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                                        >
                                            <FiChevronLeft className="text-xl" />
                                        </button>
                                        
                                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                            Page {currentPage} of {totalPages}
                                        </span>

                                        <button
                                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                            disabled={currentPage === totalPages}
                                            className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                                        >
                                            <FiChevronRight className="text-xl" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </section>

                    {/* Sidebar */}
                    <aside className="lg:col-span-1 space-y-6">
                        {/* Recently Viewed */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow border border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-2 mb-4">
                                <FiClock className="text-slate-600 dark:text-slate-300" />
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                    Recently Viewed
                                </h2>
                            </div>

                            {!recentViews?.length ? (
                                <p className="text-sm text-slate-500">
                                    No recently viewed locations yet.
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {recentViews.slice(0, 5).map((item, index) => (
                                        <RecentViewItem 
                                            key={item.id || index} 
                                            item={item} 
                                            onView={handleViewLocation} 
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Alert Component */}
                        <WeatherAlert />
                    </aside>
                </div>
            </div>
        </main>
    );
}

export default BookmarksPage;