from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.extensions import db
from app.models.bookmark import Bookmark


bookmarks_bp = Blueprint("bookmarks_bp", __name__, url_prefix="/api/bookmarks")


@bookmarks_bp.route("", methods=["GET"])
@jwt_required()
def get_bookmarks():
    user_id = get_jwt_identity()

    bookmarks = (
        Bookmark.query
        .filter_by(user_id=user_id)
        .order_by(Bookmark.created_at.desc())
        .all()
    )

    return jsonify({
        "bookmarks": [bookmark.to_dict() for bookmark in bookmarks]
    }), 200


@bookmarks_bp.route("", methods=["POST"])
@jwt_required()
def create_bookmark():
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

    existing_bookmark = Bookmark.query.filter_by(
        user_id=user_id,
        city=city,
        country=country
    ).first()

    if existing_bookmark:
        return jsonify({
            "error": "Bookmark already exists",
            "bookmark": existing_bookmark.to_dict()
        }), 409

    bookmark = Bookmark(
        user_id=user_id,
        city=city,
        country=country,
        latitude=latitude,
        longitude=longitude,
        label=data.get("label"),
        temperature=data.get("temperature"),
        feels_like=data.get("feelsLike"),
        humidity=data.get("humidity"),
        wind=data.get("wind"),
        condition=data.get("condition"),
        icon=data.get("icon"),
        weather_code=data.get("weatherCode"),
    )

    db.session.add(bookmark)
    db.session.commit()

    return jsonify({
        "message": "Bookmark created successfully",
        "bookmark": bookmark.to_dict()
    }), 201

@bookmarks_bp.route("/<int:bookmark_id>", methods=["GET"])
@jwt_required()
def get_single_bookmark(bookmark_id):
    user_id = get_jwt_identity()

    bookmark = Bookmark.query.filter_by(
        id=bookmark_id,
        user_id=user_id
    ).first()

    if not bookmark:
        return jsonify({"error": "Bookmark not found"}), 404

    return jsonify({
        "bookmark": bookmark.to_dict()
    }), 200

@bookmarks_bp.route("/<int:bookmark_id>", methods=["PATCH"])
@jwt_required()
def update_bookmark(bookmark_id):
    user_id = get_jwt_identity()
    data = request.get_json()

    bookmark = Bookmark.query.filter_by(
        id=bookmark_id,
        user_id=user_id
    ).first()

    if not bookmark:
        return jsonify({"error": "Bookmark not found"}), 404

    if data and "label" in data:
        bookmark.label = data.get("label")

    db.session.commit()

    return jsonify({
        "message": "Bookmark updated successfully",
        "bookmark": bookmark.to_dict()
    }), 200


@bookmarks_bp.route("/<int:bookmark_id>", methods=["DELETE"])
@jwt_required()
def delete_bookmark(bookmark_id):
    user_id = get_jwt_identity()

    bookmark = Bookmark.query.filter_by(
        id=bookmark_id,
        user_id=user_id
    ).first()

    if not bookmark:
        return jsonify({"error": "Bookmark not found"}), 404

    db.session.delete(bookmark)
    db.session.commit()

    return jsonify({
        "message": "Bookmark deleted successfully"
    }), 200