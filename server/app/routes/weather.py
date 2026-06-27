from flask import Blueprint, request, jsonify
import requests

weather_bp = Blueprint("weather_bp", __name__, url_prefix="/api")


@weather_bp.route("/weather", methods=["GET"])
def get_weather():
    lat = request.args.get("lat")
    lon = request.args.get("lon")
    city_name = request.args.get("city")
    country = request.args.get("country")

    if not lat or not lon:
        return jsonify({"error": "lat and lon are required"}), 400

    try:
        url = (
            f"https://api.open-meteo.com/v1/forecast"
            f"?latitude={lat}&longitude={lon}"
            f"&current=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m,apparent_temperature"
            f"&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max"
            f"&timezone=Africa%2FNairobi"
        )

        response = requests.get(url, timeout=15)
        response.raise_for_status()
        data = response.json()

        normalized_response = {
            "city": {
                "name": city_name,
                "country": country,
                "latitude": float(lat),
                "longitude": float(lon),
            },
            "weather": {
                "current": {
                    "temperature_2m": data.get("current", {}).get("temperature_2m"),
                    "apparent_temperature": data.get("current", {}).get("apparent_temperature"),
                    "relative_humidity_2m": data.get("current", {}).get("relative_humidity_2m"),
                    "wind_speed_10m": data.get("current", {}).get("wind_speed_10m"),
                    "weather_code": data.get("current", {}).get("weather_code"),
                },
                "daily": {
                    "time": data.get("daily", {}).get("time", []),
                    "temperature_2m_max": data.get("daily", {}).get("temperature_2m_max", []),
                    "temperature_2m_min": data.get("daily", {}).get("temperature_2m_min", []),
                    "weather_code": data.get("daily", {}).get("weather_code", []),
                    "precipitation_probability_max": data.get("daily", {}).get(
                        "precipitation_probability_max", []
                    ),
                },
            },
        }

        return jsonify(normalized_response), 200

    except requests.RequestException:
        return jsonify({"error": "Unable to fetch weather data at this time"}), 500
    except ValueError:
        return jsonify({"error": "Invalid latitude or longitude value"}), 400