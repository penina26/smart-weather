import React from "react";
import { FiX } from "react-icons/fi";
import ForecastPlanningNotes from "./ForecastPlanningNotes";

function PlanningNotesModal({ onClose }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-950 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                        Planning Notes
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                        className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-white flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                    >
                        <FiX />
                    </button>
                </div>

                <ForecastPlanningNotes />
            </div>
        </div>
    );
}

export default PlanningNotesModal;