import os

from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required
from flasgger import swag_from

from extensions import db
from models.tag import Tag
from models.ticket import Ticket
from models.ticket_event import TicketEvent
from models.ticket_tag import TicketTag
from models.user import User

ticket_tags_bp = Blueprint("ticket_tags", __name__)
_SWAGGER_DIR = os.path.join(os.path.dirname(__file__), "..", "docs", "swagger")


def _get_admin_or_agent():
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    if not current_user:
        return None, jsonify(message="User not found"), 404
    if current_user.role not in ("admin", "agent"):
        return None, jsonify(message="Admin or agent privileges required"), 403
    return current_user, None, None


def _add_ticket_event(ticket_id, actor_id, event_type, meta=None):
    event = TicketEvent(
        ticket_id=ticket_id,
        actor_id=actor_id,
        event_type=event_type,
        meta=meta or {},
    )
    db.session.add(event)


@ticket_tags_bp.route("/<ticket_id>/tags", methods=["GET"])
@jwt_required()
@swag_from(os.path.join(_SWAGGER_DIR, "ticket_tags", "list_ticket_tags.yml"))
def list_ticket_tags(ticket_id):
    ticket = Ticket.query.get(ticket_id)
    if not ticket:
        return jsonify(message="Ticket not found"), 404

    tags = (
        Tag.query.join(TicketTag, Tag.id == TicketTag.tag_id)
        .filter(TicketTag.ticket_id == ticket.id)
        .order_by(Tag.name.asc())
        .all()
    )
    results = [
        {"id": tag.id, "name": tag.name, "created_at": tag.created_at.isoformat()}
        for tag in tags
    ]

    return jsonify(tags=results), 200


@ticket_tags_bp.route("/<ticket_id>/tags", methods=["POST"])
@jwt_required()
@swag_from(os.path.join(_SWAGGER_DIR, "ticket_tags", "add_ticket_tag.yml"))
def add_ticket_tag(ticket_id):
    current_user, error_response, status_code = _get_admin_or_agent()
    if error_response:
        return error_response, status_code

    data = request.get_json()
    if not data or not data.get("tag_id"):
        return jsonify(message="Missing tag_id"), 400

    ticket = Ticket.query.get(ticket_id)
    if not ticket:
        return jsonify(message="Ticket not found"), 404

    tag = Tag.query.get(data["tag_id"])
    if not tag:
        return jsonify(message="Tag not found"), 404

    if TicketTag.query.filter_by(ticket_id=ticket.id, tag_id=tag.id).first():
        return jsonify(message="Tag already assigned to ticket"), 409

    ticket_tag = TicketTag(ticket_id=ticket.id, tag_id=tag.id)
    db.session.add(ticket_tag)
    _add_ticket_event(
        ticket_id=ticket.id,
        actor_id=current_user.id,
        event_type="tag_added",
        meta={"tag_id": tag.id, "tag_name": tag.name},
    )
    db.session.commit()

    return jsonify(message="Tag added to ticket successfully"), 201


@ticket_tags_bp.route("/<ticket_id>/tags", methods=["DELETE"])
@jwt_required()
@swag_from(os.path.join(_SWAGGER_DIR, "ticket_tags", "remove_ticket_tag.yml"))
def remove_ticket_tag(ticket_id):
    current_user, error_response, status_code = _get_admin_or_agent()
    if error_response:
        return error_response, status_code

    data = request.get_json()
    if not data or not data.get("tag_id"):
        return jsonify(message="Missing tag_id"), 400

    ticket = Ticket.query.get(ticket_id)
    if not ticket:
        return jsonify(message="Ticket not found"), 404

    tag = Tag.query.get(data["tag_id"])
    if not tag:
        return jsonify(message="Tag not found"), 404

    ticket_tag = TicketTag.query.filter_by(ticket_id=ticket.id, tag_id=tag.id).first()
    if not ticket_tag:
        return jsonify(message="Tag not assigned to ticket"), 404

    db.session.delete(ticket_tag)
    _add_ticket_event(
        ticket_id=ticket.id,
        actor_id=current_user.id,
        event_type="tag_removed",
        meta={"tag_id": tag.id, "tag_name": tag.name},
    )
    db.session.commit()

    return jsonify(message="Tag removed from ticket successfully"), 200
