from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required

from extensions import db
from models.ticket import Ticket
from models.user import User

ticket_bp = Blueprint("tickets", __name__)


@ticket_bp.route("/", methods=["POST"])
@jwt_required()
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
