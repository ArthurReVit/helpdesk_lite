import os

from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from flasgger import swag_from

from models.user import User

auth_bp = Blueprint("auth", __name__)
_SWAGGER_DIR = os.path.join(os.path.dirname(__file__), "..", "docs", "swagger")


@auth_bp.route("/me", methods=["GET"])
@jwt_required()
@swag_from(os.path.join(_SWAGGER_DIR, "auth", "me.yml"))
def me():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user:
        return jsonify(message="User not found"), 404

    return jsonify(
        id=str(user.id), email=user.email, full_name=user.full_name, role=user.role
    )


@auth_bp.route("/login", methods=["POST"])
@swag_from(os.path.join(_SWAGGER_DIR, "auth", "login.yml"))
def login():
    data = request.get_json()

    if not data or not data.get("email") or not data.get("password"):
        return jsonify(message="Missing email or password"), 400

    user = User.query.filter_by(email=data["email"]).first()

    if user and user.check_password(data["password"]):
        access_token = create_access_token(identity=str(user.id))
        return jsonify(
            access_token=access_token,
            user={
                "id": str(user.id),
                "email": user.email,
                "full_name": user.full_name,
                "role": user.role,
            },
        )

    return jsonify(message="Invalid email or password"), 401


@auth_bp.route("/logout", methods=["POST"])
@jwt_required()
@swag_from(os.path.join(_SWAGGER_DIR, "auth", "logout.yml"))
def logout():
    return jsonify(message="Logged out successfully"), 200
