import uuid
from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.types import Uuid, DateTime, String, Integer, Boolean, Text
from datetime import datetime
from typing import List
from src.services.db import db

# Clase para los protocolos
class Protocol(db.Model):
    __tablename__ = 'protocols'

    protocol_id: Mapped[Uuid] = mapped_column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title: Mapped[str] = mapped_column(String(255))
    summary: Mapped[str] = mapped_column(Text, nullable=True)
    author: Mapped[str] = mapped_column(String(100))
    active: Mapped[Boolean] = mapped_column(Boolean, nullable=False, default=True)
    created_date: Mapped[DateTime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now())
    updated_date: Mapped[DateTime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(), onupdate=lambda: datetime.now())
    content: Mapped[List["Content"]] = relationship('Content', back_populates='protocol')
    protocolCategory: Mapped[List["ProtocolCategory"]] = relationship('ProtocolCategory', back_populates='protocol')

    def __repr__(self):
        return f'{self.title}'

# Clase para el contenido de los protocolos
class Content(db.Model):
    __tablename__ = 'content'

    content_id: Mapped[Uuid] = mapped_column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    author: Mapped[str] = mapped_column(String(100), nullable=True)
    body: Mapped[str] = mapped_column(Text, nullable=True)  # Renombrado de 'content' a 'body'
    order: Mapped[int] = mapped_column(Integer)
    image: Mapped[str] = mapped_column(Text, nullable=True)
    document: Mapped[str] = mapped_column(Text, nullable=True)
    active: Mapped[Boolean] = mapped_column(Boolean, nullable=False, default=True)
    created_date: Mapped[DateTime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now())
    updated_date: Mapped[DateTime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(), onupdate=lambda: datetime.now())
    protocol_id: Mapped[Uuid] = mapped_column(Uuid(as_uuid=True), ForeignKey('protocols.protocol_id'))
    protocol: Mapped["Protocol"] = relationship('Protocol', back_populates='content')

    def __repr__(self):
        return f'{self.protocol.title} - {self.order}'

# Clase para las categorías de los protocolos
class Category(db.Model):
    __tablename__ = 'categories'

    category_id: Mapped[Uuid] = mapped_column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    description: Mapped[str] = mapped_column(Text)
    category_name: Mapped[str] = mapped_column(String(100))
    active: Mapped[Boolean] = mapped_column(Boolean, nullable=False, default=True)
    created_date: Mapped[DateTime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now())
    updated_date: Mapped[DateTime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(), onupdate=lambda: datetime.now())
    protocolCategory: Mapped[List["ProtocolCategory"]] = relationship('ProtocolCategory', back_populates='category')

    def __repr__(self):
        return f'{self.category_name}'

# Clase intermedia entre protocolos y las categorías
class ProtocolCategory(db.Model):
    __tablename__ = 'protocolcategories'

    protocolCategory_id: Mapped[Uuid] = mapped_column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    protocol_id: Mapped[Uuid] = mapped_column(Uuid(as_uuid=True), ForeignKey('protocols.protocol_id'))
    protocol: Mapped["Protocol"] = relationship('Protocol', back_populates='protocolCategory')
    category_id: Mapped[Uuid] = mapped_column(Uuid(as_uuid=True), ForeignKey('categories.category_id'))
    category: Mapped["Category"] = relationship('Category', back_populates='protocolCategory')
    active: Mapped[Boolean] = mapped_column(Boolean, nullable=False, default=True)
    created_date: Mapped[DateTime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now())
    updated_date: Mapped[DateTime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(), onupdate=lambda: datetime.now())

    def __repr__(self):
        return f'{self.protocol.title} - {self.category.category_name}'
