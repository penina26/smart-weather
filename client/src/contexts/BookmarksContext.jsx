import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const BookmarksContext = createContext(null);

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000";

export function BookmarksProvider({ children }) {
    // Make sure your AuthContext exports these methods!
    const { token, isAuthenticated, refreshAccessToken, logout } = useAuth();

    const [bookmarks, setBookmarks] = useState([]);
    const [loadingBookmarks, setLoadingBookmarks] = useState(false);
    const [bookmarksError, setBookmarksError] = useState(null);

    /**
     * Internal helper to make API calls with automatic 401 retry logic.
     */
    const fetchWithAuth = async (endpoint, options = {}) => {
        let currentToken = token;

        const makeRequest = (authToken) => 
            fetch(`${API_BASE_URL}${endpoint}`, {
                ...options,
                headers: {
                    ...options.headers,
                    Authorization: `Bearer ${authToken}`,
                },
            });

        let response = await makeRequest(currentToken);

        // If unauthorized, attempt to refresh the token and retry
        if (response.status === 401 && refreshAccessToken) {
            try {
                currentToken = await refreshAccessToken();
                response = await makeRequest(currentToken);
            } catch (refreshError) {
                // If refresh fails, session is completely dead
                if (logout) logout();
                throw new Error("Session expired. Please log in again.");
            }
        }

        return response;
    };

    const fetchBookmarks = async () => {
        if (!token || !isAuthenticated) {
            setBookmarks([]);
            return;
        }

        setLoadingBookmarks(true);
        setBookmarksError(null);

        try {
            const response = await fetchWithAuth("/api/bookmarks", {
                method: "GET",
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to fetch bookmarks");
            }

            setBookmarks(data.bookmarks || []);
        } catch (error) {
            setBookmarksError(error.message || "Failed to fetch bookmarks");
        } finally {
            setLoadingBookmarks(false);
        }
    };

    // Automatically fetch when auth state changes
    useEffect(() => {
        fetchBookmarks();
    }, [token, isAuthenticated]);

    const addBookmark = async (bookmark) => {
        if (!token || !isAuthenticated) {
            setBookmarksError("You must be logged in to save bookmarks.");
            return;
        }

        try {
            setBookmarksError(null);

            const response = await fetchWithAuth("/api/bookmarks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(bookmark),
            });

            const data = await response.json();

            if (response.status === 409) {
                return; // Already bookmarked
            }

            if (!response.ok) {
                throw new Error(data.error || "Failed to add bookmark");
            }

            setBookmarks((prev) => [data.bookmark, ...prev]);
        } catch (error) {
            setBookmarksError(error.message || "Failed to add bookmark");
        }
    };

    const removeBookmark = async (id) => {
        if (!token || !isAuthenticated) {
            setBookmarksError("You must be logged in to remove bookmarks.");
            return;
        }

        try {
            setBookmarksError(null);

            const response = await fetchWithAuth(`/api/bookmarks/${id}`, {
                method: "DELETE",
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to remove bookmark");
            }

            setBookmarks((prev) => prev.filter((item) => item.id !== id));
        } catch (error) {
            setBookmarksError(error.message || "Failed to remove bookmark");
        }
    };

    const getBookmarkById = async (id) => {
        if (!token || !isAuthenticated) {
            throw new Error("You must be logged in to view this bookmark.");
        }

        const response = await fetchWithAuth(`/api/bookmarks/${id}`, {
            method: "GET",
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Failed to fetch bookmark");
        }

        return data.bookmark;
    };

    return (
        <BookmarksContext.Provider
            value={{
                bookmarks,
                loadingBookmarks,
                bookmarksError,
                fetchBookmarks,
                addBookmark,
                removeBookmark,
                getBookmarkById,
            }}
        >
            {children}
        </BookmarksContext.Provider>
    );
}

export function useBookmarks() {
    const context = useContext(BookmarksContext);

    if (!context) {
        throw new Error("useBookmarks must be used inside BookmarksProvider");
    }

    return context;
}