import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const RecentViewsContext = createContext(null);

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000";

export function RecentViewsProvider({ children }) {
    const { token, isAuthenticated } = useAuth();

    const [recentViews, setRecentViews] = useState([]);
    const [loadingRecentViews, setLoadingRecentViews] = useState(false);
    const [recentViewsError, setRecentViewsError] = useState(null);

    const fetchRecentViews = async () => {
        if (!token || !isAuthenticated) {
            setRecentViews([]);
            return;
        }

        setLoadingRecentViews(true);
        setRecentViewsError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/api/recent-views`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to fetch recent views");
            }

            setRecentViews(data.recent_views || []);
        } catch (error) {
            setRecentViewsError(error.message || "Failed to fetch recent views");
        } finally {
            setLoadingRecentViews(false);
        }
    };

    const addRecentView = async (location) => {
        if (!token || !isAuthenticated) {
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/recent-views`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(location),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to save recent view");
            }

            await fetchRecentViews();
        } catch (error) {
            setRecentViewsError(error.message || "Failed to save recent view");
        }
    };

    const clearRecentViews = async () => {
        if (!token || !isAuthenticated) {
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/recent-views`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to clear recent views");
            }

            setRecentViews([]);
        } catch (error) {
            setRecentViewsError(error.message || "Failed to clear recent views");
        }
    };

    useEffect(() => {
        fetchRecentViews();
    }, [token, isAuthenticated]);

    return (
        <RecentViewsContext.Provider
            value={{
                recentViews,
                loadingRecentViews,
                recentViewsError,
                fetchRecentViews,
                addRecentView,
                clearRecentViews,
            }}
        >
            {children}
        </RecentViewsContext.Provider>
    );
}

export function useRecentViews() {
    const context = useContext(RecentViewsContext);

    if (!context) {
        throw new Error("useRecentViews must be used inside RecentViewsProvider");
    }

    return context;
}