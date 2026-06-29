from flask import Flask, jsonify
from flask_cors import CORS

from app.config import Config
from app.extensions import db, jwt, bcrypt, migrate

# Import models 
from app.models import User, Bookmark, PlanningNote, RecentView

 # blueprints
from app.routes.auth import auth_bp
from app.routes.weather import weather_bp
from app.routes.bookmarks import bookmarks_bp
from app.routes.planning_notes import planning_notes_bp
from app.routes.recent_views import recent_views_bp


# def create_app():
#     app = Flask(__name__)
#     app.config.from_object(Config)

#     CORS(app)

#     db.init_app(app)
#     jwt.init_app(app)
#     bcrypt.init_app(app)
#     migrate.init_app(app, db)

#     #register blueprints
#     app.register_blueprint(auth_bp)
#     app.register_blueprint(weather_bp)
#     app.register_blueprint(bookmarks_bp)
#     app.register_blueprint(planning_notes_bp)
#     app.register_blueprint(recent_views_bp)

#     @app.route("/api/health", methods=["GET"])
#     def health_check():
#         return jsonify({"message": "Backend is running"}), 200   

#     return app

def create_app():
    print("Creating Flask app")
    app = Flask(__name__)

    print("Loading config")
    app.config.from_object(Config)

    print("Initializing extensions")
    db.init_app(app)
    jwt.init_app(app)
    bcrypt.init_app(app)
    migrate.init_app(app, db)

    print("Registering auth blueprint")
    app.register_blueprint(auth_bp)

    print("Registering weather blueprint")
    app.register_blueprint(weather_bp)

    print("Registering bookmarks blueprint")
    app.register_blueprint(bookmarks_bp)

    print("Done")
    return app