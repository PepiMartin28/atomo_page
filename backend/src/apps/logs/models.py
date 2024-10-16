import uuid
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.types import Uuid, DateTime, Text
from datetime import datetime
from src.services.db import db

# Clase para los logs
class Log(db.Model):
    __tablename__ = 'logs'

    id: Mapped[Uuid] = mapped_column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    employee_id: Mapped[Uuid] = mapped_column(Uuid(as_uuid=True))
    protocol_id: Mapped[Uuid] = mapped_column(Uuid(as_uuid=True), nullable=True)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    date: Mapped[DateTime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now())
