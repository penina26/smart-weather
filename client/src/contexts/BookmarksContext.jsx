import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const BookmarksContext = createContext(null);

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000";

export function BookmarksProvider({ children }) {
    const { token, isAuthenticated } = useAuth();

    const [bookmarks, setBookmarks] = useState([]);
    const [loadingBookmarks, setLoadingBookmarks] = useState(false);
    const [bookmarksError, setBookmarksError] = useState(null);

    const fetchBookmarks = async () => {
        if (!token || !isAuthenticated) {
            setBookmarks([]);
            return;
        }

        setLoadingBookmarks(true);
        setBookmarksError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/api/bookmarks`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
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

            const response = await fetch(`${API_BASE_URL}/api/bookmarks`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(bookmark),
            });

            const data = await response.json();

            if (response.status === 409) {
                return;
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

            const response = await fetch(`${API_BASE_URL}/api/bookmarks/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
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

        const response = await fetch(`${API_BASE_URL}/api/bookmarks/${id}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
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