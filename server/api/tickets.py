import os
from datetime import datetime

from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required
from flasgger import swag_from

from extensions import db
from models.ticket import Ticket
from models.user import User

ticket_bp = Blueprint("tickets", __name__)
_SWAGGER_DIR = os.path.join(os.path.dirname(__file__), "..", "docs", "swagger")


def _get_admin_user():
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    if not current_user:
        return None, jsonify(message="User not found"), 404
    if current_user.role != "admin":
        return None, jsonify(message="Admin privileges required"), 403
    return current_user, None, None


@ticket_bp.route("/", methods=["GET"])
@jwt_required()
@swag_from(os.path.join(_SWAGGER_DIR, "tickets", "list_tickets.yml"))
def list_tickets():
    current_user, error_response, status_code = _get_admin_user()
    if error_response:
        return error_response, status_code

    sort = request.args.get("sort", "desc").lower()
    sort_by = request.args.get("sort_by", "created_at").lower()
    limit = request.args.get("limit")

    if sort not in ("asc", "desc"):
        return jsonify(message="Invalid sort. Use 'asc' or 'desc'."), 400

    sortable_fields = {
        "created_at": Ticket.created_at,
        "updated_at": Ticket.updated_at,
        "title": Ticket.title,
        "status": Ticket.status,
        "priority": Ticket.priority,
        "id": Ticket.id,
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
    query = Ticket.query.order_by(order_by)
    if limit_value is not None:
        query = query.limit(limit_value)

    tickets = query.all()
    results = [
        {
            "id": ticket.id,
            "requester_id": str(ticket.requester_id) if ticket.requester_id else None,
            "assignee_id": str(ticket.assignee_id) if ticket.assignee_id else None,
            "title": ticket.title,
            "description": ticket.description,
            "status": ticket.status,
            "priority": ticket.priority,
            "created_at": ticket.created_at.isoformat() if ticket.created_at else None,
            "updated_at": ticket.updated_at.isoformat() if ticket.updated_at else None,
        }
        for ticket in tickets
    ]

    return jsonify(tickets=results), 200


@ticket_bp.route("/<ticket_id>", methods=["GET"])
@jwt_required()
@swag_from(os.path.join(_SWAGGER_DIR, "tickets", "get_ticket.yml"))
def get_ticket(ticket_id):
    current_user, error_response, status_code = _get_admin_user()
    if error_response:
        return error_response, status_code

    ticket = Ticket.query.get(ticket_id)
    if not ticket:
        return jsonify(message="Ticket not found"), 404

    result = {
        "id": ticket.id,
        "requester_id": str(ticket.requester_id) if ticket.requester_id else None,
        "assignee_id": str(ticket.assignee_id) if ticket.assignee_id else None,
        "title": ticket.title,
        "description": ticket.description,
        "status": ticket.status,
        "priority": ticket.priority,
        "created_at": ticket.created_at.isoformat() if ticket.created_at else None,
        "updated_at": ticket.updated_at.isoformat() if ticket.updated_at else None,
    }

    return jsonify(ticket=result), 200


@ticket_bp.route("/requester/<requester_id>", methods=["GET"])
@jwt_required()
@swag_from(os.path.join(_SWAGGER_DIR, "tickets", "list_requester_tickets.yml"))
def list_requester_tickets(requester_id):
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    if not current_user:
        return jsonify(message="User not found"), 404

    if str(current_user.id) != requester_id:
        return jsonify(message="You can only view your own tickets"), 403

    tickets = (
        Ticket.query.filter_by(requester_id=current_user.id)
        .order_by(Ticket.created_at.desc())
        .all()
    )
    results = [
        {
            "id": ticket.id,
            "requester_id": str(ticket.requester_id) if ticket.requester_id else None,
            "assignee_id": str(ticket.assignee_id) if ticket.assignee_id else None,
            "title": ticket.title,
            "description": ticket.description,
            "status": ticket.status,
            "priority": ticket.priority,
            "created_at": ticket.created_at.isoformat() if ticket.created_at else None,
            "updated_at": ticket.updated_at.isoformat() if ticket.updated_at else None,
        }
        for ticket in tickets
    ]

    return jsonify(tickets=results), 200


@ticket_bp.route("/assignee/<assignee_id>", methods=["GET"])
@jwt_required()
@swag_from(os.path.join(_SWAGGER_DIR, "tickets", "list_assignee_tickets.yml"))
def list_assignee_tickets(assignee_id):
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    if not current_user:
        return jsonify(message="User not found"), 404

    if current_user.role != "agent":
        return jsonify(message="Agent privileges required"), 403

    if str(current_user.id) != assignee_id:
        return jsonify(message="You can only view your own assigned tickets"), 403

    tickets = (
        Ticket.query.filter_by(assignee_id=current_user.id)
        .order_by(Ticket.created_at.desc())
        .all()
    )
    results = [
        {
            "id": ticket.id,
            "requester_id": str(ticket.requester_id) if ticket.requester_id else None,
            "assignee_id": str(ticket.assignee_id) if ticket.assignee_id else None,
            "title": ticket.title,
            "description": ticket.description,
            "status": ticket.status,
            "priority": ticket.priority,
            "created_at": ticket.created_at.isoformat() if ticket.created_at else None,
            "updated_at": ticket.updated_at.isoformat() if ticket.updated_at else None,
        }
        for ticket in tickets
    ]

    return jsonify(tickets=results), 200


@ticket_bp.route("/", methods=["POST"])
@jwt_required()
@swag_from(os.path.join(_SWAGGER_DIR, "tickets", "create_ticket.yml"))
def create_ticket():
    data = request.get_json()

    if not data or not data.get("title") or not data.get("description"):
        return jsonify(message="Missing required fields"), 400

    current_user_id = get_jwt_identity()
    requester = User.query.get(current_user_id)

    if not requester:
        return jsonify(message="User not found"), 404

    ticket = Ticket(
        requester_id=requester.id,
        title=data["title"],
        description=data["description"],
        priority=data.get("priority", "medium"),
    )

    db.session.add(ticket)
    db.session.commit()

    return jsonify(message="Ticket created successfully", id=ticket.id), 201


@ticket_bp.route("/<ticket_id>", methods=["PATCH"])
@jwt_required()
@swag_from(os.path.join(_SWAGGER_DIR, "tickets", "update_ticket.yml"))
def update_ticket(ticket_id):
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    if not current_user:
        return jsonify(message="User not found"), 404
    if current_user.role not in ("admin", "agent"):
        return jsonify(message="Admin or agent privileges required"), 403

    data = request.get_json()
    if not data:
        return jsonify(message="Missing request body"), 400

    ticket = Ticket.query.get(ticket_id)
    if not ticket:
        return jsonify(message="Ticket not found"), 404

    allowed_statuses = {
        "open",
        "triaged",
        "in_progress",
        "waiting_on_requester",
        "resolved",
        "closed",
        "canceled",
    }
    allowed_priorities = {"low", "medium", "high", "urgent"}

    updates_applied = False

    if "status" in data:
        status = data["status"]
        if status not in allowed_statuses:
            return jsonify(message="Invalid status"), 400
        ticket.status = status
        updates_applied = True

    if "priority" in data:
        priority = data["priority"]
        if priority not in allowed_priorities:
            return jsonify(message="Invalid priority"), 400
        ticket.priority = priority
        updates_applied = True

    if "due_at" in data:
        due_at = data["due_at"]
        if due_at is None:
            ticket.due_at = None
        else:
            try:
                ticket.due_at = datetime.fromisoformat(due_at)
            except (TypeError, ValueError):
                return jsonify(message="Invalid due_at format"), 400
        updates_applied = True

    if not updates_applied:
        return (
            jsonify(message="No updatable fields provided: status, priority, due_at"),
            400,
        )

    db.session.commit()

    return jsonify(message="Ticket updated successfully"), 200


@ticket_bp.route("/<ticket_id>/assignee", methods=["PATCH"])
@jwt_required()
@swag_from(os.path.join(_SWAGGER_DIR, "tickets", "assign_ticket.yml"))
def assign_ticket(ticket_id):
    current_user, error_response, status_code = _get_admin_user()
    if error_response:
        return error_response, status_code

    data = request.get_json()
    if not data or not data.get("assignee_id"):
        return jsonify(message="Missing assignee_id"), 400

    ticket = Ticket.query.get(ticket_id)
    if not ticket:
        return jsonify(message="Ticket not found"), 404

    assignee = User.query.get(data["assignee_id"])
    if not assignee:
        return jsonify(message="Assignee not found"), 404
    if assignee.role != "agent":
        return jsonify(message="Assignee must have role 'agent'"), 400

    ticket.assignee_id = assignee.id
    db.session.commit()

    return jsonify(message="Assignee updated successfully"), 200
