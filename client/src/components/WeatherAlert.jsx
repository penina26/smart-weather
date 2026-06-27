import React from "react";
import { FiAlertTriangle } from "react-icons/fi";

export const WeatherAlert = ({ 
    title = "Weather Alert", 
    message = "Conditions may change quickly. Check the detailed forecast before travel or outdoor plans." 
}) => {
    return (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-5 shadow">
            <div className="flex items-start gap-3">
                <FiAlertTriangle className="text-xl text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                <div>
                    <h3 className="font-bold text-amber-900 dark:text-amber-300 mb-1">
                        {title}
                    </h3>
                    <p className="text-sm text-amber-800 dark:text-amber-200">
                        {message}
                    </p>
                </div>
            </div>
        </div>
    );
};