from datetime import datetime
from app.extensions import db


class PlanningNote(db.Model):
    __tablename__ = "planning_notes"

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    bookmark_id = db.Column(
        db.Integer,
        db.ForeignKey("bookmarks.id"),
        nullable=True
    )

    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    forecast_date = db.Column(db.Date, nullable=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "bookmark_id": self.bookmark_id,
            "title": self.title,
            "content": self.content,
            "forecast_date": self.forecast_date.isoformat() if self.forecast_date else None,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }