from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.extensions import db
from app.models.recent_view import RecentView


recent_views_bp = Blueprint(
    "recent_views_bp",
    __name__,
    url_prefix="/api/recent-views"
)


@recent_views_bp.route("", methods=["GET"])
@jwt_required()
def get_recent_views():
    user_id = get_jwt_identity()

    recent_views = (
        RecentView.query
        .filter_by(user_id=user_id)
        .order_by(RecentView.viewed_at.desc())
        .limit(10)
        .all()
    )

    return jsonify({
        "recent_views": [item.to_dict() for item in recent_views]
    }), 200


@recent_views_bp.route("", methods=["POST"])
@jwt_required()
def create_recent_view():
    user_id = get_jwt_identity()
    data = request.get_json()

    if not data:
        return jsonify({"error": "Request body is required"}), 400

    city = data.get("city")
    country = data.get("country")
    latitude = data.get("latitude")
    longitude = data.get("longitude")

    if not city or latitude is None or longitude is None:
        return jsonify({
            "error": "city, latitude and longitude are required"
        }), 400

    existing_recent_view = RecentView.query.filter_by(
        user_id=user_id,
        city=city,
        country=country
    ).first()

    if existing_recent_view:
        existing_recent_view.latitude = latitude
        existing_recent_view.longitude = longitude

        db.session.commit()

        return jsonify({
            "message": "Recent view updated successfully",
            "recent_view": existing_recent_view.to_dict()
        }), 200

    recent_view = RecentView(
        user_id=user_id,
        city=city,
        country=country,
        latitude=latitude,
        longitude=longitude,
    )

    db.session.add(recent_view)
    db.session.commit()

    return jsonify({
        "message": "Recent view saved successfully",
        "recent_view": recent_view.to_dict()
    }), 201


@recent_views_bp.route("", methods=["DELETE"])
@jwt_required()
def clear_recent_views():
    user_id = get_jwt_identity()

    RecentView.query.filter_by(user_id=user_id).delete()
    db.session.commit()

    return jsonify({
        "message": "Recent views cleared successfully"
    }), 200