import os

from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required
from flasgger import swag_from

from extensions import db
from models.tag import Tag
from models.user import User

tags_bp = Blueprint("tags", __name__)
_SWAGGER_DIR = os.path.join(os.path.dirname(__file__), "..", "docs", "swagger")


def _get_admin_user():
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    if not current_user:
        return None, jsonify(message="User not found"), 404
    if current_user.role != "admin":
        return None, jsonify(message="Admin privileges required"), 403
    return current_user, None, None


@tags_bp.route("/", methods=["GET"])
@jwt_required()
@swag_from(os.path.join(_SWAGGER_DIR, "tags", "list_tags.yml"))
def list_tags():
    sort = request.args.get("sort", "asc").lower()
    sort_by = request.args.get("sort_by", "name").lower()
    limit = request.args.get("limit")

    if sort not in ("asc", "desc"):
        return jsonify(message="Invalid sort. Use 'asc' or 'desc'."), 400

    sortable_fields = {
        "name": Tag.name,
        "created_at": Tag.created_at,
        "id": Tag.id,
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
    query = Tag.query.order_by(order_by)
    if limit_value is not None:
        query = query.limit(limit_value)

    tags = query.all()
    results = [
        {
            "id": tag.id,
            "name": tag.name,
            "created_at": tag.created_at.isoformat() if tag.created_at else None,
        }
        for tag in tags
    ]

    return jsonify(tags=results), 200


@tags_bp.route("/<tag_id>", methods=["GET"])
@jwt_required()
@swag_from(os.path.join(_SWAGGER_DIR, "tags", "get_tag.yml"))
def get_tag(tag_id):
    tag = Tag.query.get(tag_id)
    if not tag:
        return jsonify(message="Tag not found"), 404

    result = {
        "id": tag.id,
        "name": tag.name,
        "created_at": tag.created_at.isoformat() if tag.created_at else None,
    }

    return jsonify(tag=result), 200


@tags_bp.route("/", methods=["POST"])
@jwt_required()
@swag_from(os.path.join(_SWAGGER_DIR, "tags", "create_tag.yml"))
def create_tag():
    current_user, error_response, status_code = _get_admin_user()
    if error_response:
        return error_response, status_code

    data = request.get_json()
    if not data or not data.get("name"):
        return jsonify(message="Missing name"), 400

    name = data["name"].strip()
    if not name:
        return jsonify(message="Missing name"), 400
    if len(name) > 20:
        return jsonify(message="Tag name must be 20 characters or fewer"), 400

    if Tag.query.filter_by(name=name).first():
        return jsonify(message="Tag already exists"), 409

    tag = Tag(name=name)
    db.session.add(tag)
    db.session.commit()

    return jsonify(message="Tag created successfully", id=tag.id), 201


@tags_bp.route("/<tag_id>", methods=["PATCH"])
@jwt_required()
@swag_from(os.path.join(_SWAGGER_DIR, "tags", "rename_tag.yml"))
def rename_tag(tag_id):
    current_user, error_response, status_code = _get_admin_user()
    if error_response:
        return error_response, status_code

    data = request.get_json()
    if not data or not data.get("name"):
        return jsonify(message="Missing name"), 400

    name = data["name"].strip()
    if not name:
        return jsonify(message="Missing name"), 400
    if len(name) > 20:
        return jsonify(message="Tag name must be 20 characters or fewer"), 400

    tag = Tag.query.get(tag_id)
    if not tag:
        return jsonify(message="Tag not found"), 404

    if Tag.query.filter_by(name=name).first():
        return jsonify(message="Tag already exists"), 409

    tag.name = name
    db.session.commit()

    return jsonify(message="Tag renamed successfully"), 200


@tags_bp.route("/<tag_id>", methods=["DELETE"])
@jwt_required()
@swag_from(os.path.join(_SWAGGER_DIR, "tags", "delete_tag.yml"))
def delete_tag(tag_id):
    current_user, error_response, status_code = _get_admin_user()
    if error_response:
        return error_response, status_code

    tag = Tag.query.get(tag_id)
    if not tag:
        return jsonify(message="Tag not found"), 404

    db.session.delete(tag)
    db.session.commit()

    return jsonify(message="Tag deleted successfully"), 200
