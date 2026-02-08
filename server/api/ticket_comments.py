import os

from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required
from flasgger import swag_from

from extensions import db
from models.ticket import Ticket
from models.ticket_comment import TicketComment
from models.ticket_event import TicketEvent
from models.user import User

ticket_comments_bp = Blueprint("ticket_comments", __name__)
_SWAGGER_DIR = os.path.join(os.path.dirname(__file__), "..", "docs", "swagger")


def _get_current_user():
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    if not current_user:
        return None, jsonify(message="User not found"), 404
    return current_user, None, None


def _can_access_ticket(current_user, ticket):
    if current_user.role == "admin":
        return True
    if ticket.assignee_id and str(ticket.assignee_id) == str(current_user.id):
        return True
    if str(ticket.requester_id) == str(current_user.id):
        return True
    return False


def _add_ticket_event(ticket_id, actor_id, event_type, meta=None):
    event = TicketEvent(
        ticket_id=ticket_id,
        actor_id=actor_id,
        event_type=event_type,
        meta=meta or {},
    )
    db.session.add(event)


@ticket_comments_bp.route("/<ticket_id>/comments", methods=["GET"])
@jwt_required()
@swag_from(os.path.join(_SWAGGER_DIR, "ticket_comments", "list_ticket_comments.yml"))
def list_ticket_comments(ticket_id):
    current_user, error_response, status_code = _get_current_user()
    if error_response:
        return error_response, status_code

    ticket = Ticket.query.get(ticket_id)
    if not ticket:
        return jsonify(message="Ticket not found"), 404

    if not _can_access_ticket(current_user, ticket):
        return jsonify(message="Access denied"), 403

    query = TicketComment.query.filter_by(ticket_id=ticket.id).order_by(
        TicketComment.created_at.asc()
    )
    if current_user.role != "admin" and not (
        ticket.assignee_id and str(ticket.assignee_id) == str(current_user.id)
    ):
        query = query.filter_by(is_internal=False)

    comments = query.all()
    results = [
        {
            "id": comment.id,
            "ticket_id": comment.ticket_id,
            "author_id": str(comment.author_id),
            "body": comment.body,
            "is_internal": comment.is_internal,
            "created_at": (
                comment.created_at.isoformat() if comment.created_at else None
            ),
        }
        for comment in comments
    ]

    return jsonify(comments=results), 200


@ticket_comments_bp.route("/<ticket_id>/comments", methods=["POST"])
@jwt_required()
@swag_from(os.path.join(_SWAGGER_DIR, "ticket_comments", "create_ticket_comment.yml"))
def create_ticket_comment(ticket_id):
    current_user, error_response, status_code = _get_current_user()
    if error_response:
        return error_response, status_code

    ticket = Ticket.query.get(ticket_id)
    if not ticket:
        return jsonify(message="Ticket not found"), 404

    if not _can_access_ticket(current_user, ticket):
        return jsonify(message="Access denied"), 403

    data = request.get_json()
    if not data or not data.get("body"):
        return jsonify(message="Missing body"), 400

    is_internal = bool(data.get("is_internal", False))
    is_assignee = ticket.assignee_id and str(ticket.assignee_id) == str(current_user.id)
    if is_internal and current_user.role != "admin" and not is_assignee:
        return (
            jsonify(message="Only admins or assignees can create internal comments"),
            403,
        )

    comment = TicketComment(
        ticket_id=ticket.id,
        author_id=current_user.id,
        body=data["body"],
        is_internal=is_internal,
    )
    db.session.add(comment)
    _add_ticket_event(
        ticket_id=ticket.id,
        actor_id=current_user.id,
        event_type="comment_added",
        meta={"comment_id": comment.id, "is_internal": is_internal},
    )
    db.session.commit()

    return jsonify(message="Comment created successfully", id=comment.id), 201
