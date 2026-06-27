import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const PlanningNotesContext = createContext(null);

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000";

export function PlanningNotesProvider({ children }) {
    const { token, isAuthenticated } = useAuth();

    const [planningNotes, setPlanningNotes] = useState([]);
    const [loadingNotes, setLoadingNotes] = useState(false);
    const [notesError, setNotesError] = useState(null);

    const fetchPlanningNotes = async () => {
        if (!token || !isAuthenticated) {
            setPlanningNotes([]);
            return;
        }

        setLoadingNotes(true);
        setNotesError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/api/planning-notes`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
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

        const response = await fetch(`${API_BASE_URL}/api/planning-notes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
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

        const response = await fetch(`${API_BASE_URL}/api/planning-notes/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
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

        const response = await fetch(`${API_BASE_URL}/api/planning-notes/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
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