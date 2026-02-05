from sqlalchemy import Index

from extensions import db


class TicketTag(db.Model):
    __tablename__ = "ticket_tags"

    ticket_id = db.Column(
        db.BigInteger,
        db.ForeignKey("tickets.id", ondelete="CASCADE"),
        primary_key=True,
    )
    tag_id = db.Column(
        db.BigInteger,
        db.ForeignKey("tags.id", ondelete="CASCADE"),
        primary_key=True,
    )

    ticket = db.relationship("Ticket")
    tag = db.relationship("Tag")

    __table_args__ = (Index("ticket_tags_tag_idx", "tag_id"),)
