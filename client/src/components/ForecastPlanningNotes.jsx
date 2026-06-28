import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
    FiEdit2,
    FiPlus,
    FiSave,
    FiTrash2,
    FiX,
    FiFileText,
} from "react-icons/fi";
import { useBookmarks } from "../contexts/BookmarksContext";
import { useWeatherContext } from "../contexts/WeatherContext";
import { usePlanningNotes } from "../contexts/PlanningNotesContext";

function ForecastPlanningNotes() {
    const { city } = useWeatherContext();
    const { bookmarks } = useBookmarks();

    const {
        planningNotes,
        loadingNotes,
        notesError,
        createPlanningNote,
        updatePlanningNote,
        deletePlanningNote,
    } = usePlanningNotes();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [forecastDate, setForecastDate] = useState("");

    const [editingId, setEditingId] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [editContent, setEditContent] = useState("");
    const [editForecastDate, setEditForecastDate] = useState("");
    const [selectedNote, setSelectedNote] = useState(null);

    const [formError, setFormError] = useState("");

    const currentBookmark = useMemo(() => {
        if (!city || !bookmarks) return null;

        return bookmarks.find(
            (bookmark) =>
                bookmark.city === city.name && bookmark.country === city.country
        );
    }, [city, bookmarks]);

    const cityNotes = useMemo(() => {
        if (!currentBookmark) return [];

        return planningNotes.filter(
            (note) => note.bookmark_id === currentBookmark.id
        );
    }, [planningNotes, currentBookmark]);

    const resetCreateForm = () => {
        setTitle("");
        setContent("");
        setForecastDate("");
        setFormError("");
    };

    const handleCreateNote = async (e) => {
        e.preventDefault();

        if (!currentBookmark) {
            setFormError("Bookmark this location first before adding planning notes.");
            return;
        }

        if (!title.trim() || !content.trim()) {
            setFormError("Title and content are required.");
            return;
        }

        try {
            setFormError("");

            await createPlanningNote({
                title: title.trim(),
                content: content.trim(),
                forecast_date: forecastDate || null,
                bookmark_id: currentBookmark.id,
            });

            resetCreateForm();
        } catch (error) {
            setFormError(error.message || "Failed to create planning note.");
        }
    };

    const startEditing = (note) => {
        setEditingId(note.id);
        setEditTitle(note.title);
        setEditContent(note.content);
        setEditForecastDate(note.forecast_date || "");
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditTitle("");
        setEditContent("");
        setEditForecastDate("");
    };

    const handleUpdateNote = async (noteId) => {
        if (!editTitle.trim() || !editContent.trim()) {
            setFormError("Title and content cannot be empty.");
            return;
        }

        try {
            setFormError("");

            await updatePlanningNote(noteId, {
                title: editTitle.trim(),
                content: editContent.trim(),
                forecast_date: editForecastDate || null,
            });

            cancelEditing();
        } catch (error) {
            setFormError(error.message || "Failed to update planning note.");
        }
    };

    const handleDeleteNote = async (noteId) => {
        try {
            await deletePlanningNote(noteId);
        } catch (error) {
            setFormError(error.message || "Failed to delete planning note.");
        }
    };

    return (
        <section className="mt-8 bg-white dark:bg-slate-900 rounded-3xl p-6 shadow">
            <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <FiFileText />
                </div>

                <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                        Planning Notes
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Add practical notes for this bookmarked forecast location.
                    </p>
                </div>
            </div>

            {!currentBookmark && (
                <div className="mb-5 rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-4 text-sm text-amber-800 dark:text-amber-200">
                    Bookmark this location first, then you can attach planning notes to it.
                </div>
            )}

            {(formError || notesError) && (
                <div className="mb-5 rounded-2xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-4 text-sm text-red-700 dark:text-red-300">
                    {formError || notesError}
                </div>
            )}

            <form onSubmit={handleCreateNote} className="space-y-4 mb-6">
                <div className="grid md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        value={title}
                        disabled={!currentBookmark}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Note title e.g. Friday travel plan"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
                    />

                    <input
                        type="date"
                        value={forecastDate}
                        disabled={!currentBookmark}
                        onChange={(e) => setForecastDate(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
                    />
                </div>

                <textarea
                    value={content}
                    disabled={!currentBookmark}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your planning note..."
                    rows="3"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
                />

                <button
                    type="submit"
                    disabled={!currentBookmark}
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white px-5 py-3 rounded-xl transition"
                >
                    <FiPlus />
                    <span>Add Planning Note</span>
                </button>
            </form>

            {loadingNotes ? (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Loading notes...
                </p>
            ) : cityNotes.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-6 text-center">
                    <p className="text-slate-500 dark:text-slate-400">
                        No planning notes for this forecast yet.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {cityNotes.map((note) => (
                        <div
                            key={note.id}
                            className="rounded-2xl border border-slate-200 dark:border-slate-700 p-4"
                        >
                            {editingId === note.id ? (
                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                                    />

                                    <input
                                        type="date"
                                        value={editForecastDate}
                                        onChange={(e) => setEditForecastDate(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                                    />

                                    <textarea
                                        value={editContent}
                                        onChange={(e) => setEditContent(e.target.value)}
                                        rows="3"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                                    />

                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            onClick={() => handleUpdateNote(note.id)}
                                            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl transition"
                                        >
                                            <FiSave />
                                            <span>Save</span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={cancelEditing}
                                            className="inline-flex items-center gap-2 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-white px-4 py-2 rounded-xl transition"
                                        >
                                            <FiX />
                                            <span>Cancel</span>
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="flex justify-between gap-4">
                                        <div>
                                            <h4 
                                                onClick={() => setSelectedNote(note)}
                                                className="font-bold text-slate-900 dark:text-white">
                                                {note.title}
                                            </h4>

                                            {note.forecast_date && (
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                    Forecast date: {note.forecast_date}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() => startEditing(note)}
                                                className="text-slate-500 hover:text-blue-600 transition"
                                            >
                                                <FiEdit2 />
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => handleDeleteNote(note.id)}
                                                className="text-slate-500 hover:text-red-600 transition"
                                            >
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                    </div>

                                    <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                                        {note.content}
                                    </p>
                                    
                                </>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Modal Overlay */}
            {selectedNote && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    {/* Modal Container */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-lg shadow-xl border border-slate-200 dark:border-slate-700 relative">
                        
                        {/* Header */}
                        <div className="flex justify-between items-start mb-6 pr-8">
                            <div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                                    {selectedNote.title}
                                </h3>
                                {selectedNote.forecast_date && (
                                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mt-2">
                                        Forecast date: {selectedNote.forecast_date}
                                    </p>
                                )}
                            </div>
                            
                            {/* Close Button */}
                            <button 
                                onClick={() => setSelectedNote(null)}
                                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
                            >
                                <FiX size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
                            <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                                {selectedNote.content}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}

export default ForecastPlanningNotes;