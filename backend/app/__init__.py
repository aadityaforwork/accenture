from flask import Flask
from flask_cors import CORS
from .routes import roadmap

def create_app():
    app = Flask(__name__)
    CORS(app)  # Enable CORS
    app.register_blueprint(roadmap.bp)
    return app
