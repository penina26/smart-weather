import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const PlanningNotesContext = createContext(null);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000";

export function PlanningNotesProvider({ children }) {
    // Bring in the refresh and logout methods
    const { token, isAuthenticated, refreshAccessToken, logout } = useAuth();

    const [planningNotes, setPlanningNotes] = useState([]);
    const [loadingNotes, setLoadingNotes] = useState(false);
    const [notesError, setNotesError] = useState(null);

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
                if (logout) logout();
                throw new Error("Session expired. Please log in again.");
            }
        }

        return response;
    };

    const fetchPlanningNotes = async () => {
        if (!token || !isAuthenticated) {
            setPlanningNotes([]);
            return;
        }

        setLoadingNotes(true);
        setNotesError(null);

        try {
            const response = await fetchWithAuth("/api/planning-notes", {
                method: "GET",
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to fetch planning notes");
            }

            setPlanningNotes(data.planning_notes || []);
        } catch (error) {
            setNotesError(error.message || "Failed to fetch planning notes");
        } finally {
            setLoadingNotes(false);
        }
    };

    useEffect(() => {
        fetchPlanningNotes();
    }, [token, isAuthenticated]);

    const createPlanningNote = async (payload) => {
        if (!token || !isAuthenticated) {
            throw new Error("You must be logged in to create planning notes.");
        }

        const response = await fetchWithAuth("/api/planning-notes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Failed to create planning note");
        }

        setPlanningNotes((prev) => [data.planning_note, ...prev]);

        return data.planning_note;
    };

    const updatePlanningNote = async (id, payload) => {
        if (!token || !isAuthenticated) {
            throw new Error("You must be logged in to update planning notes.");
        }

        const response = await fetchWithAuth(`/api/planning-notes/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Failed to update planning note");
        }

        setPlanningNotes((prev) =>
            prev.map((note) => (note.id === id ? data.planning_note : note))
        );

        return data.planning_note;
    };

    const deletePlanningNote = async (id) => {
        if (!token || !isAuthenticated) {
            throw new Error("You must be logged in to delete planning notes.");
        }

        const response = await fetchWithAuth(`/api/planning-notes/${id}`, {
            method: "DELETE",
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Failed to delete planning note");
        }

        setPlanningNotes((prev) => prev.filter((note) => note.id !== id));
    };

    return (
        <PlanningNotesContext.Provider
            value={{
                planningNotes,
                loadingNotes,
                notesError,
                fetchPlanningNotes,
                createPlanningNote,
                updatePlanningNote,
                deletePlanningNote,
            }}
        >
            {children}
        </PlanningNotesContext.Provider>
    );
}

export function usePlanningNotes() {
    const context = useContext(PlanningNotesContext);

    if (!context) {
        throw new Error(
            "usePlanningNotes must be used inside PlanningNotesProvider"
        );
    }

    return context;
}