import uuid

from sqlalchemy import Index, text
from sqlalchemy.dialects.postgresql import UUID

from werkzeug.security import generate_password_hash, check_password_hash
from extensions import db


USER_ROLE = db.Enum(
    "admin",
    "agent",
    "requester",
    name="user_role",
    create_type=False,
)


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        server_default=text("gen_random_uuid()"),
    )
    full_name = db.Column(db.Text, nullable=False)
    email = db.Column(db.Text, unique=True, nullable=False)
    role = db.Column(USER_ROLE, nullable=False, server_default=text("'requester'"))
    password_hash = db.Column(db.Text, nullable=False)
    is_active = db.Column(db.Boolean, nullable=False, server_default=text("true"))
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

    requested_tickets = db.relationship(
        "Ticket",
        foreign_keys="Ticket.requester_id",
        back_populates="requester",
    )
    assigned_tickets = db.relationship(
        "Ticket",
        foreign_keys="Ticket.assignee_id",
        back_populates="assignee",
    )
    comments = db.relationship("TicketComment", back_populates="author")
    events = db.relationship("TicketEvent", back_populates="actor")

    __table_args__ = (
        Index("users_role_idx", "role"),
        Index("users_email_idx", "email"),
    )

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
