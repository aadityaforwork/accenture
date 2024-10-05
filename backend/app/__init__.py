# app/__init__.py

from flask import Flask
from flask_cors import CORS
import os
from .routes import roadmap
from flask_pymongo import PyMongo
from dotenv import load_dotenv

load_dotenv()

# Initialize `mongo` at the module level
mongo = PyMongo()

def create_app():
    app = Flask(__name__)
    app.config["MONGO_URI"] = os.getenv("MONGO_URL")
    mongo.init_app(app)
    CORS(app)  # Enable CORS
    from .routes.main import main_bp
    app.register_blueprint(main_bp)
    return app

app = create_app()
