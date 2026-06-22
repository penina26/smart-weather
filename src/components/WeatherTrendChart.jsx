import React from "react";
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

const sampleForecastData = [
  { day: "Mon", temperature: 27, humidity: 64 },
  { day: "Tue", temperature: 29, humidity: 58 },
  { day: "Wed", temperature: 31, humidity: 52 },
  { day: "Thu", temperature: 28, humidity: 61 },
  { day: "Fri", temperature: 26, humidity: 68 },
  { day: "Sat", temperature: 30, humidity: 55 },
  { day: "Sun", temperature: 32, humidity: 50 },
];

function WeatherTrendChart() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-6 md:p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Forecast Trend Overview
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          A quick visual summary of expected temperature and humidity trends for
          the next 7 days.
        </p>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={sampleForecastData}>
            <defs>
              <linearGradient id="tempFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
            <XAxis dataKey="day" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                border: "none",
                borderRadius: "12px",
                color: "#fff",
              }}
              labelStyle={{ color: "#fff" }}
            />
            <Area
              type="monotone"
              dataKey="temperature"
              stroke="#3b82f6"
              fill="url(#tempFill)"
              strokeWidth={3}
            />
            <Line
              type="monotone"
              dataKey="humidity"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="inline-block w-4 h-1 rounded bg-blue-500"></span>
          <span className="text-slate-600 dark:text-slate-300">
            Temperature (°C)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-block w-4 h-1 rounded bg-emerald-500"></span>
          <span className="text-slate-600 dark:text-slate-300">
            Humidity (%)
          </span>
        </div>
      </div>
    </div>
  );
}

export default WeatherTrendChart;