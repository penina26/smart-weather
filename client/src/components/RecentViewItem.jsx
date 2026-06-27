import React from "react";

export const RecentViewItem = ({ item, onView }) => {
    return (
        <button
            onClick={() => onView(item)}
            disabled={!item.latitude || !item.longitude}
            className="w-full text-left p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition disabled:opacity-60 disabled:cursor-not-allowed group bg-white dark:bg-slate-900"
        >
            <div className="flex items-center justify-between gap-3">
                <div>
                    <p className="font-semibold text-slate-900 dark:text-white group-hover:text-sky-500 transition-colors">
                        {item.city}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                        {item.country}
                    </p>
                </div>
                <div className="text-2xl opacity-80 group-hover:opacity-100 transition-opacity">
                    {item.icon || ""}
                </div>
            </div>
        </button>
    );
};