import React from "react";
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";
import {
    FiTrendingUp,
    FiThermometer,
    FiDroplet,
    FiAlertTriangle,
} from "react-icons/fi";

const forecastData = [
    { day: "Mon", temperature: 27, humidity: 64, rainRisk: 20 },
    { day: "Tue", temperature: 29, humidity: 58, rainRisk: 15 },
    { day: "Wed", temperature: 31, humidity: 52, rainRisk: 10 },
    { day: "Thu", temperature: 28, humidity: 61, rainRisk: 35 },
    { day: "Fri", temperature: 26, humidity: 68, rainRisk: 50 },
    { day: "Sat", temperature: 30, humidity: 55, rainRisk: 18 },
    { day: "Sun", temperature: 32, humidity: 50, rainRisk: 8 },
];

function WeatherAnalyticsDashboard() {
    const avgTemp = Math.round(
        forecastData.reduce((sum, item) => sum + item.temperature, 0) /
        forecastData.length
    );

    const avgHumidity = Math.round(
        forecastData.reduce((sum, item) => sum + item.humidity, 0) /
        forecastData.length
    );

    const highestTemp = Math.max(...forecastData.map((item) => item.temperature));
    const highestRainRisk = Math.max(
        ...forecastData.map((item) => item.rainRisk)
    );

    const statCards = [
        {
            title: "Average Temperature",
            value: `${avgTemp}°C`,
            subtitle: "7-day outlook",
            icon: <FiThermometer />,
            accent: "from-blue-500/20 to-cyan-500/10",
            iconColor: "text-blue-400",
            border: "border-blue-500/20",
        },
        {
            title: "Average Humidity",
            value: `${avgHumidity}%`,
            subtitle: "Atmospheric comfort",
            icon: <FiDroplet />,
            accent: "from-emerald-500/20 to-teal-500/10",
            iconColor: "text-emerald-400",
            border: "border-emerald-500/20",
        },
        {
            title: "Peak Temperature",
            value: `${highestTemp}°C`,
            subtitle: "Warmest day this week",
            icon: <FiTrendingUp />,
            accent: "from-orange-500/20 to-amber-500/10",
            iconColor: "text-orange-400",
            border: "border-orange-500/20",
        },
        {
            title: "Highest Rain Risk",
            value: `${highestRainRisk}%`,
            subtitle: "Potential weather disruption",
            icon: <FiAlertTriangle />,
            accent: "from-rose-500/20 to-pink-500/10",
            iconColor: "text-rose-400",
            border: "border-rose-500/20",
        },
    ];

    return (
        <section className="bg-slate-100 dark:bg-slate-950 px-6 py-16">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-left">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 mb-3">
                        Weather Analytics
                    </p>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                        Forecast Intelligence Dashboard
                    </h2>
                    <p className="mt-3 max-w-3xl text-slate-600 dark:text-slate-400 leading-7">
                        A quick planning view of expected temperature, humidity, and rain
                        risk patterns to support better daily decisions, travel preparation,
                        and activity planning.
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                    {statCards.map((card) => (
                        <div
                            key={card.title}
                            className={`rounded-2xl border ${card.border} bg-white dark:bg-slate-900 p-5 shadow-sm`}
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        {card.title}
                                    </p>
                                    <h3 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">
                                        {card.value}
                                    </h3>
                                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                                        {card.subtitle}
                                    </p>
                                </div>

                                <div
                                    className={`w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xl ${card.iconColor}`}
                                >
                                    {card.icon}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Chart */}
                    <div className="xl:col-span-2 rounded-3xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 p-6 md:p-8">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                            <div>
                                <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
                                    7-Day Forecast Trend
                                </h3>
                                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                                    Temperature is shown as an area trend, while humidity is
                                    overlaid as a line for quick comparison.
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <span className="inline-block w-4 h-1 rounded bg-blue-500"></span>
                                    <span className="text-slate-600 dark:text-slate-300">
                                        Temperature
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="inline-block w-4 h-1 rounded bg-emerald-500"></span>
                                    <span className="text-slate-600 dark:text-slate-300">
                                        Humidity
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="h-[320px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={forecastData}>
                                    <defs>
                                        <linearGradient
                                            id="temperatureFill"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="5%"
                                                stopColor="#3b82f6"
                                                stopOpacity={0.35}
                                            />
                                            <stop
                                                offset="95%"
                                                stopColor="#3b82f6"
                                                stopOpacity={0.04}
                                            />
                                        </linearGradient>
                                    </defs>

                                    <CartesianGrid
                                        strokeDasharray="4 4"
                                        stroke="#334155"
                                        opacity={0.15}
                                    />
                                    <XAxis
                                        dataKey="day"
                                        stroke="#94a3b8"
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="#94a3b8"
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "#0f172a",
                                            border: "1px solid #1e293b",
                                            borderRadius: "14px",
                                            color: "#fff",
                                        }}
                                        labelStyle={{ color: "#fff", fontWeight: 600 }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="temperature"
                                        stroke="#3b82f6"
                                        fill="url(#temperatureFill)"
                                        strokeWidth={3}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="humidity"
                                        stroke="#10b981"
                                        strokeWidth={3}
                                        dot={{ r: 4, strokeWidth: 2 }}
                                        activeDot={{ r: 6 }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        <div className="rounded-3xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                Planning Summary
                            </h3>

                            <div className="mt-5 space-y-4">
                                <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/60 p-4">
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                        Best Outdoor Window
                                    </p>
                                    <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
                                        Wednesday to Saturday
                                    </p>
                                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                        Lower rain risk and stable humidity support outdoor activity.
                                    </p>
                                </div>

                                <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/60 p-4">
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                        Caution Period
                                    </p>
                                    <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
                                        Friday
                                    </p>
                                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                        Elevated rain probability may affect field travel and
                                        events.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-sm p-6">
                            <p className="text-sm uppercase tracking-[0.18em] text-slate-300">
                                Insight
                            </p>
                            <h3 className="mt-3 text-2xl font-bold">
                                Weather supports smarter scheduling
                            </h3>
                            <p className="mt-4 text-sm leading-7 text-slate-300">
                                This dashboard turns raw forecast patterns into practical
                                planning signals, helping users decide when to travel, when to
                                schedule activities, and when to prepare for weather-related
                                disruptions.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default WeatherAnalyticsDashboard;