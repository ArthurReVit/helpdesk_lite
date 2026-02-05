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


@users_bp.route("/all", methods=["GET"])
@jwt_required()
@swag_from(os.path.join(_SWAGGER_DIR, "users", "list_users.yml"))
def list_users():
    current_user, error_response, status_code = _get_admin_user()
    if error_response:
        return error_response, status_code

    sort = request.args.get("sort", "asc").lower()
    sort_by = request.args.get("sort_by", "full_name").lower()
    limit = request.args.get("limit")

    if sort not in ("asc", "desc"):
        return jsonify(message="Invalid sort. Use 'asc' or 'desc'."), 400

    sortable_fields = {
        "full_name": User.full_name,
        "email": User.email,
        "role": User.role,
        "is_active": User.is_active,
        "created_at": User.created_at,
        "updated_at": User.updated_at,
        "id": User.id,
    }
    if sort_by not in sortable_fields:
        return (
            jsonify(
                message="Invalid sort_by. Use one of: "
                + ", ".join(sorted(sortable_fields.keys()))
            ),
            400,
        )

    if limit is not None:
        try:
            limit_value = int(limit)
        except ValueError:
            return jsonify(message="limit must be an integer"), 400
        if limit_value <= 0:
            return jsonify(message="limit must be greater than 0"), 400
    else:
        limit_value = None

    sort_column = sortable_fields[sort_by]
    order_by = sort_column.asc() if sort == "asc" else sort_column.desc()
    query = User.query.order_by(order_by)
    if limit_value is not None:
        query = query.limit(limit_value)

    users = query.all()
    results = [
        {
            "id": str(user.id),
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role,
            "is_active": user.is_active,
            "created_at": user.created_at.isoformat() if user.created_at else None,
            "updated_at": user.updated_at.isoformat() if user.updated_at else None,
        }
        for user in users
    ]

    return jsonify(users=results), 200


@users_bp.route("/<user_id>", methods=["GET"])
@jwt_required()
@swag_from(os.path.join(_SWAGGER_DIR, "users", "get_user.yml"))
def get_user(user_id):
    current_user, error_response, status_code = _get_admin_user()
    if error_response:
        return error_response, status_code

    user = User.query.get(user_id)
    if not user:
        return jsonify(message="User not found"), 404

    result = {
        "id": str(user.id),
        "email": user.email,
        "full_name": user.full_name,
        "role": user.role,
        "is_active": user.is_active,
        "created_at": user.created_at.isoformat() if user.created_at else None,
        "updated_at": user.updated_at.isoformat() if user.updated_at else None,
    }

    return jsonify(user=result), 200


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
@swag_from(os.path.join(_SWAGGER_DIR, "users", "change_password.yml"))
def change_password():
    data = request.get_json()

    if not data:
        return jsonify(message="Missing request body"), 400

    current_password = data.get("current_password")
    new_password = data.get("password")
    confirm_password = data.get("password_confirmation")

    if not current_password:
        return jsonify(message="Missing current_password"), 400
    if not new_password:
        return jsonify(message="Missing password"), 400
    if not confirm_password:
        return jsonify(message="Missing password_confirmation"), 400
    if new_password != confirm_password:
        return jsonify(message="Passwords do not match"), 400

    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user:
        return jsonify(message="User not found"), 404

    if not user.check_password(current_password):
        return jsonify(message="Current password is incorrect"), 401

    user.set_password(new_password)
    db.session.commit()

    return jsonify(message="Password updated successfully"), 200


@users_bp.route("/<user_id>/active", methods=["PATCH"])
@jwt_required()
@swag_from(os.path.join(_SWAGGER_DIR, "users", "set_user_active.yml"))
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
@swag_from(os.path.join(_SWAGGER_DIR, "users", "delete_user.yml"))
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
