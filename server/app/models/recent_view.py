from datetime import datetime
from app.extensions import db


class RecentView(db.Model):
    __tablename__ = "recent_views"

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    city = db.Column(db.String(120), nullable=False)
    country = db.Column(db.String(120), nullable=True)
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)

    viewed_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "city": self.city,
            "country": self.country,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "viewed_at": self.viewed_at.isoformat(),
        }