import uuid
from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.types import Uuid, DateTime, String, Boolean, Text
from datetime import datetime
from src.services.db import db
from src.apps.protocols.models import Category

#Clase para los grupos de empleados
class Group(db.Model):
    __tablename__ = 'groups'

    group_id: Mapped[Uuid] = mapped_column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    group_name: Mapped[str] = mapped_column(String(100))
    description: Mapped[str] = mapped_column(Text, nullable=True)
    access_type: Mapped[str] = mapped_column(String(20))
    active: Mapped[Boolean] = mapped_column(Boolean, nullable=False, default=True)
    created_date: Mapped[DateTime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now())
    updated_date: Mapped[DateTime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(), onupdate=lambda: datetime.now())
    employees: Mapped[list["Employee"]] = relationship('Employee', back_populates='group')
    groupCategories: Mapped[list["GroupCategory"]] = relationship('GroupCategory', back_populates='group')

    def __repr__(self):
        return f'{self.group_name}'

#Clase para los empleados
class Employee(db.Model):
    __tablename__ = 'employees'

    employee_id: Mapped[Uuid] = mapped_column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(50), nullable=True)
    last_name: Mapped[str] = mapped_column(String(50), nullable=True)
    email: Mapped[str] = mapped_column(String(100), nullable=False)
    password: Mapped[str] = mapped_column(Text, nullable=True)
    document_type: Mapped[str] = mapped_column(String(10), nullable=True)
    document_num: Mapped[str] = mapped_column(String(20), nullable=True)
    phone: Mapped[str] = mapped_column(String(15), nullable=True)
    created_date: Mapped[DateTime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now())
    updated_date: Mapped[DateTime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(), onupdate=lambda: datetime.now())
    group_id: Mapped[Uuid] = mapped_column(Uuid(as_uuid=True), ForeignKey('groups.group_id'))
    group: Mapped[Group] = relationship('Group', back_populates='employees')
    employeeStates: Mapped[list["EmployeeState"]] = relationship('EmployeeState', back_populates='employee')

    def __repr__(self):
        return f'{self.email} - {self.group.group_name}'

#Clase para los estados del empleado
class StateEmployee(db.Model):
    __tablename__ = 'stateEmployees'

    stateEmployee_id: Mapped[Uuid] = mapped_column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    state_name: Mapped[str] = mapped_column(String(50))
    active: Mapped[Boolean] = mapped_column(Boolean, nullable=False, default=True)
    created_date: Mapped[DateTime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now())
    updated_date: Mapped[DateTime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(), onupdate=lambda: datetime.now())

    def __repr__(self):
        return f'{self.state_name}'

#Clase intermedia entre los empleados y sus estados
class EmployeeState(db.Model):
    __tablename__ = 'employeeStates'

    employeeState_id: Mapped[Uuid] = mapped_column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    stateEmployee_id: Mapped[Uuid] = mapped_column(Uuid(as_uuid=True), ForeignKey('stateEmployees.stateEmployee_id'))
    stateEmployee: Mapped["StateEmployee"] = relationship('StateEmployee')
    employee_id: Mapped[Uuid] = mapped_column(Uuid(as_uuid=True), ForeignKey('employees.employee_id'))
    employee: Mapped["Employee"] = relationship('Employee', back_populates='employeeStates')
    created_date: Mapped[DateTime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now())
    
    def __repr__(self):
        return f'{self.employee.email} - {self.stateEmployee.state_name}'
    
#Clase intermedia entre los empleados y sus estados
class GroupCategory(db.Model):
    __tablename__ = 'groupCategories'

    groupCategory_id: Mapped[Uuid] = mapped_column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    group_id: Mapped[Uuid] = mapped_column(Uuid(as_uuid=True), ForeignKey('groups.group_id'))
    group: Mapped["Group"] = relationship('Group', back_populates='groupCategories')
    category_id: Mapped[Uuid] = mapped_column(Uuid(as_uuid=True), ForeignKey('categories.category_id'))
    category: Mapped["Category"] = relationship('Category')
    active: Mapped[Boolean] = mapped_column(Boolean, nullable=False, default=True)
    created_date: Mapped[DateTime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now())
    updated_date: Mapped[DateTime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(), onupdate=lambda: datetime.now())
    
    def __repr__(self):
        return f'{self.group.group_name} - {self.category.category_name}'
