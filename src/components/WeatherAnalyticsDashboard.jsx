import React, { useMemo } from "react";
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
    FiCloudRain,
    FiAlertTriangle,
    FiBarChart2,
} from "react-icons/fi";
import { useWeatherContext } from "../contexts/WeatherContext";

function WeatherAnalyticsDashboard() {
    const { weather, loading, city } = useWeatherContext();

    const forecastData = useMemo(() => {
        if (!weather?.daily?.time) return [];

        const dates = weather.daily.time || [];
        const tempMax = weather.daily.temperature_2m_max || [];
        const rainRisk = weather.daily.precipitation_probability_max || [];

        return dates.map((date, index) => ({
            day: new Date(date).toLocaleDateString("en-US", { weekday: "short" }),
            fullDate: date,
            temperature: tempMax[index] ?? null,
            rainRisk: rainRisk[index] ?? 0,
        }));
    }, [weather]);

    const stats = useMemo(() => {
        if (!forecastData.length) {
            return {
                avgTemp: "--",
                avgRainRisk: "--",
                peakTemp: "--",
                highestRainRisk: "--",
            };
        }

        const avgTemp = Math.round(
            forecastData.reduce((sum, item) => sum + (item.temperature ?? 0), 0) /
            forecastData.length
        );

        const avgRainRisk = Math.round(
            forecastData.reduce((sum, item) => sum + (item.rainRisk ?? 0), 0) /
            forecastData.length
        );

        const peakTemp = Math.max(...forecastData.map((item) => item.temperature ?? 0));
        const highestRainRisk = Math.max(
            ...forecastData.map((item) => item.rainRisk ?? 0)
        );

        return {
            avgTemp: `${avgTemp}°C`,
            avgRainRisk: `${avgRainRisk}%`,
            peakTemp: `${peakTemp}°C`,
            highestRainRisk: `${highestRainRisk}%`,
        };
    }, [forecastData]);

    const bestDay = useMemo(() => {
        if (!forecastData.length) return null;

        return [...forecastData].sort((a, b) => {
            const scoreA = (a.rainRisk ?? 0) * 2 - (a.temperature ?? 0);
            const scoreB = (b.rainRisk ?? 0) * 2 - (b.temperature ?? 0);
            return scoreA - scoreB;
        })[0];
    }, [forecastData]);

    const cautionDay = useMemo(() => {
        if (!forecastData.length) return null;

        return [...forecastData].sort(
            (a, b) => (b.rainRisk ?? 0) - (a.rainRisk ?? 0)
        )[0];
    }, [forecastData]);

    const statCards = [
        {
            title: "Average Temperature",
            value: stats.avgTemp,
            subtitle: "Forecast planning baseline",
            icon: <FiThermometer />,
            iconColor: "text-blue-400",
            border: "border-blue-500/20",
        },
        {
            title: "Average Rain Risk",
            value: stats.avgRainRisk,
            subtitle: "Expected disruption level",
            icon: <FiCloudRain />,
            iconColor: "text-cyan-400",
            border: "border-cyan-500/20",
        },
        {
            title: "Peak Temperature",
            value: stats.peakTemp,
            subtitle: "Warmest expected day",
            icon: <FiTrendingUp />,
            iconColor: "text-orange-400",
            border: "border-orange-500/20",
        },
        {
            title: "Highest Rain Risk",
            value: stats.highestRainRisk,
            subtitle: "Most weather-sensitive day",
            icon: <FiAlertTriangle />,
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
                        A planning view for {city?.name || "your selected location"} using
                        real forecast data from your current weather search.
                    </p>
                </div>

                {/* Empty / Loading states */}
                {loading ? (
                    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-10 text-center shadow-sm">
                        <p className="text-slate-600 dark:text-slate-300 text-lg font-medium">
                            Loading dashboard data...
                        </p>
                    </div>
                ) : !forecastData.length ? (
                    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 p-10 text-center shadow-sm">
                        <FiBarChart2 className="mx-auto text-3xl text-slate-400 mb-4" />
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                            No forecast analytics yet
                        </h3>
                        <p className="mt-2 text-slate-500 dark:text-slate-400">
                            Search for a city to populate the dashboard with real forecast
                            trends and planning insights.
                        </p>
                    </div>
                ) : (
                    <>
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
                                            Temperature is shown as an area trend, while rain risk is
                                            overlaid as a line for decision support.
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
                                            <span className="inline-block w-4 h-1 rounded bg-amber-500"></span>
                                            <span className="text-slate-600 dark:text-slate-300">
                                                Rain Risk
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
                                                dataKey="rainRisk"
                                                stroke="#f59e0b"
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
                                                Best Planning Day
                                            </p>
                                            <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
                                                {bestDay ? bestDay.day : "--"}
                                            </p>
                                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                                Lowest disruption risk with relatively favorable
                                                temperature conditions.
                                            </p>
                                        </div>

                                        <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/60 p-4">
                                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                                Caution Day
                                            </p>
                                            <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
                                                {cautionDay ? cautionDay.day : "--"}
                                            </p>
                                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                                Highest rain probability may affect mobility, events,
                                                or field activities.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-sm p-6">
                                    <p className="text-sm uppercase tracking-[0.18em] text-slate-300">
                                        Insight
                                    </p>
                                    <h3 className="mt-3 text-2xl font-bold">
                                        Forecast patterns support smarter planning
                                    </h3>
                                    <p className="mt-4 text-sm leading-7 text-slate-300">
                                        This dashboard uses your live forecast response to surface
                                        planning signals instead of relying on static sample values.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}

export default WeatherAnalyticsDashboard;
