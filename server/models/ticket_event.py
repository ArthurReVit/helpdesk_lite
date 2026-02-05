from sqlalchemy import Index, text
from sqlalchemy.dialects.postgresql import JSONB, UUID

from extensions import db


TICKET_EVENT_TYPE = db.Enum(
    "ticket_created",
    "status_changed",
    "priority_changed",
    "assignee_changed",
    "title_changed",
    "description_changed",
    "tag_added",
    "tag_removed",
    "comment_added",
    name="ticket_event_type",
    create_type=False,
)


class TicketEvent(db.Model):
    __tablename__ = "ticket_events"

    id = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    ticket_id = db.Column(
        db.BigInteger,
        db.ForeignKey("tickets.id", ondelete="CASCADE"),
        nullable=False,
    )
    actor_id = db.Column(
        UUID(as_uuid=True),
        db.ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
    )
    event_type = db.Column(TICKET_EVENT_TYPE, nullable=False)
    meta = db.Column(
        JSONB,
        nullable=False,
        server_default=text("'{}'::jsonb"),
    )
    created_at = db.Column(
        db.DateTime(timezone=True),
        nullable=False,
        server_default=db.func.now(),
    )

    ticket = db.relationship("Ticket", back_populates="events")
    actor = db.relationship("User", back_populates="events")

    __table_args__ = (
        Index("ticket_events_ticket_idx", "ticket_id"),
        Index("ticket_events_created_idx", text("created_at desc")),
    )
