import React from "react";
import { FiEye, FiTrash2 } from "react-icons/fi";

const formatValue = (value, suffix = "") => 
    value != null ? `${value}${suffix}` : "N/A";

export const BookmarkCard = ({ item, onView, onRemove }) => {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow hover:shadow-lg transition h-fit border border-slate-100 dark:border-slate-800">
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
                    <span className="font-semibold text-slate-700 dark:text-slate-200">Condition:</span> {item.condition || "Unknown"}
                </p>
                <p>
                    <span className="font-semibold text-slate-700 dark:text-slate-200">Temp:</span> {formatValue(item.temperature, "°")}
                </p>
                <p>
                    <span className="font-semibold text-slate-700 dark:text-slate-200">Feels Like:</span> {formatValue(item.feelsLike, "°")}
                </p>
                <p>
                    <span className="font-semibold text-slate-700 dark:text-slate-200">Humidity:</span> {formatValue(item.humidity, "%")}
                </p>
                <p>
                    <span className="font-semibold text-slate-700 dark:text-slate-200">Wind:</span> {formatValue(item.wind, " km/h")}
                </p>
            </div>

            <div className="mt-5 flex gap-3">
                <button
                    onClick={() => onView(item)}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-sky-500 text-white py-2.5 rounded-xl hover:bg-sky-600 transition font-medium"
                >
                    <FiEye />
                    <span>View</span>
                </button>
                <button
                    onClick={() => onRemove(item.id)}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-red-500 text-white py-2.5 rounded-xl hover:bg-red-600 transition font-medium"
                >
                    <FiTrash2 />
                    <span>Remove</span>
                </button>
            </div>
        </div>
    );
};