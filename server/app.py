import os

from flask import Flask, jsonify
from dotenv import load_dotenv

from extensions import db, jwt
from flasgger import Swagger
import models
from api.auth import auth_bp
from api.users import users_bp
from api.tickets import ticket_bp
from api.tags import tags_bp

load_dotenv()

app = Flask(__name__)
swagger = Swagger(app)

# Configuration
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"] = os.getenv(
    "JWT_SECRET_KEY", "super-secret"
)  # Change this in production!

# Initialize extensions
db.init_app(app)
jwt.init_app(app)

# Register blueprints
app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(users_bp, url_prefix="/api/users")
app.register_blueprint(ticket_bp, url_prefix="/api/tickets")
app.register_blueprint(tags_bp, url_prefix="/api/tags")


@app.route("/")
def hello_world():
    return "Hello from Flask!"


@app.route("/db-check")
def db_check():
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        return jsonify(ok=False, error="DATABASE_URL is not set"), 500

    return jsonify(ok=True, has_database_url=True)


if __name__ == "__main__":
    app.run(debug=True)
