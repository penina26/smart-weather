import React, { createContext, useContext, useEffect, useState } from "react";

const BookmarksContext = createContext();

export function BookmarksProvider({ children }) {
    const [bookmarks, setBookmarks] = useState(() => {
        const saved = localStorage.getItem("weatherBookmarks");
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem("weatherBookmarks", JSON.stringify(bookmarks));
    }, [bookmarks]);

    const addBookmark = (bookmark) => {
        const exists = bookmarks.some(
            (item) =>
                item.city === bookmark.city &&
                item.country === bookmark.country
        );

        if (!exists) {
            setBookmarks((prev) => [bookmark, ...prev]);
        }
    };

    const removeBookmark = (id) => {
        setBookmarks((prev) => prev.filter((item) => item.id !== id));
    };

    return (
        <BookmarksContext.Provider
            value={{ bookmarks, addBookmark, removeBookmark }}
        >
            {children}
        </BookmarksContext.Provider>
    );
}

export function useBookmarks() {
    return useContext(BookmarksContext);
}
