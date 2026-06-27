from datetime import datetime
from app.extensions import db


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(db.String(120), nullable=True)

    email = db.Column(
        db.String(150),
        unique=True,
        nullable=False,
        index=True
    )

    password_hash = db.Column(db.String(255), nullable=True)

    google_sub = db.Column(
        db.String(255),
        unique=True,
        nullable=True,
        index=True
    )

    auth_provider = db.Column(
        db.String(50),
        nullable=False,
        default="local"
    )

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    bookmarks = db.relationship(
        "Bookmark",
        backref="user",
        lazy=True,
        cascade="all, delete-orphan"
    )

    planning_notes = db.relationship(
        "PlanningNote",
        backref="user",
        lazy=True,
        cascade="all, delete-orphan"
    )

    recent_views = db.relationship(
        "RecentView",
        backref="user",
        lazy=True,
        cascade="all, delete-orphan"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "auth_provider": self.auth_provider,
            "created_at": self.created_at.isoformat(),
        }