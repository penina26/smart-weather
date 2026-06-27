from datetime import datetime
from app.extensions import db


class Bookmark(db.Model):
    __tablename__ = "bookmarks"

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

    label = db.Column(db.String(120), nullable=True)

    temperature = db.Column(db.Float, nullable=True)
    feels_like = db.Column(db.Float, nullable=True)
    humidity = db.Column(db.Float, nullable=True)
    wind = db.Column(db.Float, nullable=True)
    condition = db.Column(db.String(120), nullable=True)
    icon = db.Column(db.String(50), nullable=True)
    weather_code = db.Column(db.Integer, nullable=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    planning_notes = db.relationship(
        "PlanningNote",
        backref="bookmark",
        lazy=True,
        cascade="all, delete-orphan"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "city": self.city,
            "country": self.country,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "label": self.label,
            "temperature": self.temperature,
            "feelsLike": self.feels_like,
            "humidity": self.humidity,
            "wind": self.wind,
            "condition": self.condition,
            "icon": self.icon,
            "weatherCode": self.weather_code,
            "created_at": self.created_at.isoformat(),
        }