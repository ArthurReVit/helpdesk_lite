from extensions import db


class Tag(db.Model):
    __tablename__ = "tags"

    id = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    name = db.Column(db.Text, unique=True, nullable=False)
    created_at = db.Column(
        db.DateTime(timezone=True),
        nullable=False,
        server_default=db.func.now(),
    )

    tickets = db.relationship(
        "Ticket",
        secondary="ticket_tags",
        back_populates="tags",
    )
