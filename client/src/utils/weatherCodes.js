export const weatherCodes = {
  0:  { label: "Clear sky",        icon: "☀️"  },
  1:  { label: "Mainly clear",     icon: "🌤️"  },
  2:  { label: "Partly cloudy",    icon: "⛅"  },
  3:  { label: "Overcast",         icon: "☁️"  },
  45: { label: "Foggy",            icon: "🌫️"  },
  48: { label: "Icy fog",          icon: "🌫️"  },
  51: { label: "Light drizzle",    icon: "🌦️"  },
  61: { label: "Slight rain",      icon: "🌧️"  },
  63: { label: "Moderate rain",    icon: "🌧️"  },
  65: { label: "Heavy rain",       icon: "🌧️"  },
  71: { label: "Slight snow",      icon: "🌨️"  },
  80: { label: "Rain showers",     icon: "🌦️"  },
  95: { label: "Thunderstorm",     icon: "⛈️"  },
};

export function getWeather(code) {
  return weatherCodes[code] || { label: "Unknown", icon: "🌡️" };
}