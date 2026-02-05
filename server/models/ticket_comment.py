from sqlalchemy import Index, text
from sqlalchemy.dialects.postgresql import UUID

from extensions import db


class TicketComment(db.Model):
    __tablename__ = "ticket_comments"

    id = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    ticket_id = db.Column(
        db.BigInteger,
        db.ForeignKey("tickets.id", ondelete="CASCADE"),
        nullable=False,
    )
    author_id = db.Column(
        UUID(as_uuid=True),
        db.ForeignKey("users.id", ondelete="RESTRICT"),
        nullable=False,
    )
    body = db.Column(db.Text, nullable=False)
    is_internal = db.Column(db.Boolean, nullable=False, server_default=text("false"))
    created_at = db.Column(
        db.DateTime(timezone=True),
        nullable=False,
        server_default=db.func.now(),
    )

    ticket = db.relationship("Ticket", back_populates="comments")
    author = db.relationship("User", back_populates="comments")

    __table_args__ = (
        Index("ticket_comments_ticket_idx", "ticket_id"),
        Index("ticket_comments_author_idx", "author_id"),
    )
