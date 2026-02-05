from sqlalchemy import Index, text
from sqlalchemy.dialects.postgresql import UUID

from extensions import db


TICKET_STATUS = db.Enum(
    "open",
    "triaged",
    "in_progress",
    "waiting_on_requester",
    "resolved",
    "closed",
    "canceled",
    name="ticket_status",
    create_type=False,
)

TICKET_PRIORITY = db.Enum(
    "low",
    "medium",
    "high",
    "urgent",
    name="ticket_priority",
    create_type=False,
)


class Ticket(db.Model):
    __tablename__ = "tickets"

    id = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    requester_id = db.Column(
        UUID(as_uuid=True),
        db.ForeignKey("users.id", ondelete="RESTRICT"),
        nullable=False,
    )
    assignee_id = db.Column(
        UUID(as_uuid=True),
        db.ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
    )
    title = db.Column(db.Text, nullable=False)
    description = db.Column(db.Text, nullable=False)
    status = db.Column(
        TICKET_STATUS,
        nullable=False,
        server_default=text("'open'"),
    )
    priority = db.Column(
        TICKET_PRIORITY,
        nullable=False,
        server_default=text("'medium'"),
    )
    due_at = db.Column(db.DateTime(timezone=True), nullable=True)
    resolved_at = db.Column(db.DateTime(timezone=True), nullable=True)
    closed_at = db.Column(db.DateTime(timezone=True), nullable=True)
    created_at = db.Column(
        db.DateTime(timezone=True),
        nullable=False,
        server_default=db.func.now(),
    )
    updated_at = db.Column(
        db.DateTime(timezone=True),
        nullable=False,
        server_default=db.func.now(),
        onupdate=db.func.now(),
    )

    requester = db.relationship(
        "User",
        foreign_keys=[requester_id],
        back_populates="requested_tickets",
    )
    assignee = db.relationship(
        "User",
        foreign_keys=[assignee_id],
        back_populates="assigned_tickets",
    )
    comments = db.relationship(
        "TicketComment",
        back_populates="ticket",
        cascade="all, delete-orphan",
    )
    events = db.relationship(
        "TicketEvent",
        back_populates="ticket",
        cascade="all, delete-orphan",
    )
    tags = db.relationship(
        "Tag",
        secondary="ticket_tags",
        back_populates="tickets",
    )

    __table_args__ = (
        Index("tickets_status_idx", "status"),
        Index("tickets_priority_idx", "priority"),
        Index("tickets_requester_idx", "requester_id"),
        Index("tickets_assignee_idx", "assignee_id"),
        Index("tickets_created_at_idx", text("created_at desc")),
    )
