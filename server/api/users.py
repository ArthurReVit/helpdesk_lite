import os

from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required, verify_jwt_in_request
from flasgger import swag_from

from extensions import db
from models.user import User

users_bp = Blueprint("users", __name__)
_SWAGGER_DIR = os.path.join(os.path.dirname(__file__), "..", "docs", "swagger")


def _get_admin_user():
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    if not current_user:
        return None, jsonify(message="User not found"), 404
    if current_user.role != "admin":
        return None, jsonify(message="Admin privileges required"), 403
    return current_user, None, None


@users_bp.route("/register", methods=["POST"])
@swag_from(os.path.join(_SWAGGER_DIR, "users", "register.yml"))
def register_user():
    data = request.get_json()

    if (
        not data
        or not data.get("email")
        or not data.get("password")
        or not data.get("full_name")
    ):
        return jsonify(message="Missing required fields"), 400

    if User.query.filter_by(email=data["email"]).first():
        return jsonify(message="Email already registered"), 409

    total_users = User.query.count()

    if total_users == 0:
        role = "admin"
    else:
        try:
            verify_jwt_in_request()
        except Exception:
            return jsonify(message="Authentication required"), 401

        current_user_id = get_jwt_identity()
        current_user = User.query.get(current_user_id)

        if not current_user or current_user.role != "admin":
            return jsonify(message="Admin privileges required"), 403

        role = data.get("role", "requester")

    user = User(
        email=data["email"],
        full_name=data["full_name"],
        role=role,
    )
    user.set_password(data["password"])

    db.session.add(user)
    db.session.commit()

    return jsonify(message="User registered successfully"), 201


@users_bp.route("/me/password", methods=["PATCH"])
@jwt_required()
def change_password():
    data = request.get_json()

    if not data or not data.get("password"):
        return jsonify(message="Missing password"), 400

    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user:
        return jsonify(message="User not found"), 404

    user.set_password(data["password"])
    db.session.commit()

    return jsonify(message="Password updated successfully"), 200


@users_bp.route("/<user_id>/active", methods=["PATCH"])
@jwt_required()
def set_user_active(user_id):
    current_user, error_response, status_code = _get_admin_user()
    if error_response:
        return error_response, status_code

    if str(current_user.id) == user_id:
        return jsonify(message="You cannot change your own active status"), 400

    data = request.get_json()
    if data is None or "is_active" not in data:
        return jsonify(message="Missing is_active"), 400

    is_active = data["is_active"]
    if not isinstance(is_active, bool):
        return jsonify(message="is_active must be a boolean"), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify(message="User not found"), 404

    user.is_active = is_active
    db.session.commit()

    return jsonify(message="User active status updated successfully"), 200


@users_bp.route("/<user_id>", methods=["DELETE"])
@jwt_required()
def delete_user(user_id):
    current_user, error_response, status_code = _get_admin_user()
    if error_response:
        return error_response, status_code

    if str(current_user.id) == user_id:
        return jsonify(message="You cannot delete your own account"), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify(message="User not found"), 404

    db.session.delete(user)
    db.session.commit()

    return jsonify(message="User deleted successfully"), 200
