from datetime import datetime

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.extensions import db
from app.models.planning_note import PlanningNote
from app.models.bookmark import Bookmark


planning_notes_bp = Blueprint(
    "planning_notes_bp",
    __name__,
    url_prefix="/api/planning-notes"
)


@planning_notes_bp.route("", methods=["GET"])
@jwt_required()
def get_planning_notes():
    user_id = get_jwt_identity()

    notes = (
        PlanningNote.query
        .filter_by(user_id=user_id)
        .order_by(PlanningNote.created_at.desc())
        .all()
    )

    return jsonify({
        "planning_notes": [note.to_dict() for note in notes]
    }), 200


@planning_notes_bp.route("", methods=["POST"])
@jwt_required()
def create_planning_note():
    user_id = get_jwt_identity()
    data = request.get_json()

    if not data:
        return jsonify({"error": "Request body is required"}), 400

    title = data.get("title")
    content = data.get("content")
    bookmark_id = data.get("bookmark_id")
    forecast_date = data.get("forecast_date")

    if not title or not content:
        return jsonify({"error": "title and content are required"}), 400

    if bookmark_id is not None:
        bookmark = Bookmark.query.filter_by(
            id=bookmark_id,
            user_id=user_id
        ).first()

        if not bookmark:
            return jsonify({"error": "Bookmark not found"}), 404

    parsed_forecast_date = None

    if forecast_date:
        try:
            parsed_forecast_date = datetime.strptime(
                forecast_date,
                "%Y-%m-%d"
            ).date()
        except ValueError:
            return jsonify({
                "error": "forecast_date must be in YYYY-MM-DD format"
            }), 400

    note = PlanningNote(
        user_id=user_id,
        bookmark_id=bookmark_id,
        title=title,
        content=content,
        forecast_date=parsed_forecast_date
    )

    db.session.add(note)
    db.session.commit()

    return jsonify({
        "message": "Planning note created successfully",
        "planning_note": note.to_dict()
    }), 201


@planning_notes_bp.route("/<int:note_id>", methods=["GET"])
@jwt_required()
def get_planning_note(note_id):
    user_id = get_jwt_identity()

    note = PlanningNote.query.filter_by(
        id=note_id,
        user_id=user_id
    ).first()

    if not note:
        return jsonify({"error": "Planning note not found"}), 404

    return jsonify({
        "planning_note": note.to_dict()
    }), 200


@planning_notes_bp.route("/<int:note_id>", methods=["PATCH"])
@jwt_required()
def update_planning_note(note_id):
    user_id = get_jwt_identity()
    data = request.get_json()

    if not data:
        return jsonify({"error": "Request body is required"}), 400

    note = PlanningNote.query.filter_by(
        id=note_id,
        user_id=user_id
    ).first()

    if not note:
        return jsonify({"error": "Planning note not found"}), 404

    if "title" in data:
        if not data.get("title"):
            return jsonify({"error": "title cannot be empty"}), 400
        note.title = data.get("title")

    if "content" in data:
        if not data.get("content"):
            return jsonify({"error": "content cannot be empty"}), 400
        note.content = data.get("content")

    if "bookmark_id" in data:
        bookmark_id = data.get("bookmark_id")

        if bookmark_id is not None:
            bookmark = Bookmark.query.filter_by(
                id=bookmark_id,
                user_id=user_id
            ).first()

            if not bookmark:
                return jsonify({"error": "Bookmark not found"}), 404

        note.bookmark_id = bookmark_id

    if "forecast_date" in data:
        forecast_date = data.get("forecast_date")

        if forecast_date:
            try:
                note.forecast_date = datetime.strptime(
                    forecast_date,
                    "%Y-%m-%d"
                ).date()
            except ValueError:
                return jsonify({
                    "error": "forecast_date must be in YYYY-MM-DD format"
                }), 400
        else:
            note.forecast_date = None

    db.session.commit()

    return jsonify({
        "message": "Planning note updated successfully",
        "planning_note": note.to_dict()
    }), 200


@planning_notes_bp.route("/<int:note_id>", methods=["DELETE"])
@jwt_required()
def delete_planning_note(note_id):
    user_id = get_jwt_identity()

    note = PlanningNote.query.filter_by(
        id=note_id,
        user_id=user_id
    ).first()

    if not note:
        return jsonify({"error": "Planning note not found"}), 404

    db.session.delete(note)
    db.session.commit()

    return jsonify({
        "message": "Planning note deleted successfully"
    }), 200