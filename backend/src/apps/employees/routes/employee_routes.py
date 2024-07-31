from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash
from sqlalchemy.exc import IntegrityError
from sqlalchemy import func

from src.apps.employees.models import Employee, EmployeeState, StateEmployee, Group
from src.services.db import db
from src.utils.mail_functions import registerMail, passwordMail
from src.utils.employee.auth_functions import check_token, get_fields
from src.utils.general_functions import validate_uuid, update_features
from src.utils.employee.employeeState_functions import set_employee_state

employee_routes = Blueprint(name='employee_routes', import_name=__name__)

@employee_routes.post('/')
def post():
    data = request.get_json()
    
    token_valid = check_token(request.headers, 'Administrador')
    if not token_valid:
        return jsonify({'message': 'No tiene permisos'}), 400
    
    try:
        duplicated = Employee.query.filter_by(email=data['email']).first()
        if duplicated:
            return jsonify({'message': f'Ya existe un usuario con este mail: {data["email"]}'}), 400
    except Exception as e:
        return jsonify({'message': f'Ocurrió un error: {str(e)}'}), 500
    
    group_id = validate_uuid(data.get('group_id'))
    if not group_id:
        return jsonify({"message": "Ingrese un id válido"}), 400
    
    try:
        email = data['email']
        
        employee = Employee(email=email, group_id=group_id)
        db.session.add(employee)
        db.session.flush()  
        
        if not set_employee_state(employee, 'ACTIVO'):
            return jsonify({'message': 'Estado ACTIVO no encontrado'}), 404
        
        registerMail(employee.employee_id, employee.email)
        
        return jsonify({'message': 'Empleado creado correctamente'}), 201
    except IntegrityError:
        db.session.rollback()
        return jsonify({'message': 'Error de integridad de la base de datos'}), 500
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Ocurrió un error: {str(e)}'}), 500


@employee_routes.post('/register/<id>')
def register(id):
    id = validate_uuid(id)
    if not id:
        return jsonify({"message": "Ingrese un id válido"}), 400
    
    try:
        employee = db.session.query(Employee).get(id)
    
        if not employee:
            return jsonify({'message':'El empleado que desea registrar no existe'}), 404
            
        data = request.get_json()
        data['password'] = generate_password_hash(data['password'])
            
        update_features(model=employee, data=data)       
        
        db.session.commit()
        
        return jsonify({'message':'El empleado se ha registrado correctamente'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Ocurrió un error: {str(e)}'}), 500


@employee_routes.get('/')
def list():
    token_valid = check_token(request.headers, 'Administrador')
    if not token_valid:
        return jsonify({'message': 'No tiene permisos'}), 400
    
    subquery = (
        db.session.query(
            EmployeeState.employee_id,
            func.max(EmployeeState.created_date).label('max_date')
        )
        .group_by(EmployeeState.employee_id)
        .subquery()
    )
    
    query = (
        db.session.query(
            Employee.employee_id,
            Employee.email,
            Employee.name,
            Employee.last_name,
            Group.group_name,
            StateEmployee.state_name
        )
        .join(EmployeeState, Employee.employee_id == EmployeeState.employee_id)
        .join(StateEmployee, EmployeeState.stateEmployee_id == StateEmployee.stateEmployee_id)
        .join(Group, Employee.group_id == Group.group_id)
        .join(subquery, (EmployeeState.employee_id == subquery.c.employee_id) & (EmployeeState.created_date == subquery.c.max_date))
    )

    try:
        employees = query.all()
        
        if not employees:
            return jsonify({'message': 'No hay empleados'}), 404
        
        response = [
            {
                'id': str(employee.employee_id),
                'email': employee.email,
                'name': employee.name,
                'last_name': employee.last_name,
                'group_name': employee.group_name,
                'state_name': employee.state_name
            }
            for employee in employees
        ]
        
        return jsonify(response), 200
    except Exception as e:
        return jsonify({'message': f'Ocurrió un error: {str(e)}'}), 500

@employee_routes.get('/<id>')
def get(id):
    token_valid = check_token(request.headers)
    if not token_valid:
        return jsonify({'message': 'No tiene permisos'}), 400
    
    id = validate_uuid(id)
    if not id:
        return jsonify({"message": "Ingrese un id válido"}), 400
    
    subquery = (
        db.session.query(
            EmployeeState.employee_id,
            func.max(EmployeeState.created_date).label('max_date')
        )
        .group_by(EmployeeState.employee_id)
        .subquery()
    )
    
    query = (
        db.session.query(
            Employee.employee_id,
            Employee.email,
            Employee.name,
            Employee.last_name,
            Employee.document_type,
            Employee.document_num,
            Employee.phone,
            Group.group_name,
            StateEmployee.state_name
        )
        .join(EmployeeState, Employee.employee_id == EmployeeState.employee_id)
        .join(StateEmployee, EmployeeState.stateEmployee_id == StateEmployee.stateEmployee_id)
        .join(Group, Employee.group_id == Group.group_id)
        .join(subquery, (EmployeeState.employee_id == subquery.c.employee_id) & (EmployeeState.created_date == subquery.c.max_date))
        .filter(Employee.employee_id==id)
    )

    try:
        employee = query.first()
        
        if not employee:
            return jsonify({'message':'No se encuentra el usuario'}), 404
        
        response ={
                'id': str(employee.employee_id),
                'email': employee.email,
                'name': employee.name,
                'last_name': employee.last_name,
                'document_type': employee.document_type,
                'document_num': employee.document_num,
                'phone': employee.phone,
                'group_name': employee.group_name,
                'state_name': employee.state_name
        }
        
        return response, 200
    except Exception as e:
        return jsonify({'message': f'Ocurrió un error: {str(e)}'}), 500
    
@employee_routes.get('/info')
def get_info():
    token_valid = check_token(request.headers)
    if not token_valid:
        return jsonify({'message': 'No tiene permisos'}), 400
    
    data = get_fields(request.headers, ['id'])
    
    id = validate_uuid(data['id'])
    if not id:
        return jsonify({"message": "Ingrese un id válido"}), 400
    
    query = (
        db.session.query(
            Employee.employee_id,
            Employee.email,
            Employee.name,
            Employee.last_name,
            Employee.document_type,
            Employee.document_num,
            Employee.phone,
            Group.group_name,
        )
        .join(Group, Employee.group_id == Group.group_id)
        .filter(Employee.employee_id==id)
    )

    try:
        employee = query.first()
        
        if not employee:
            return jsonify({'message':'No se encuentra el usuario'}), 404
        
        response ={
                'id': str(employee.employee_id),
                'email': employee.email,
                'name': employee.name,
                'last_name': employee.last_name,
                'document_type': employee.document_type,
                'document_num': employee.document_num,
                'phone': employee.phone,
                'group_name': employee.group_name,
        }
        
        return response, 200
    except Exception as e:
        return jsonify({'message': f'Ocurrió un error: {str(e)}'}), 500


@employee_routes.put('/<id>')
def update(id):
    token_valid = check_token(request.headers)
    if not token_valid:
        return jsonify({'message': 'No tiene permisos'}), 400
    
    id = validate_uuid(id)
    if not id:
        return jsonify({"message": "Ingrese un id válido"}), 400
    
    try:
        employee = db.session.query(Employee).get(id)
        
        if not employee:
            return jsonify({'message':'El empleado que desea actulizar no existe'}), 404
            
        data = request.get_json()
        
        update_features(model=employee, data=data)    
        
        db.session.commit()
        
        return jsonify({'message':'El empleado se ha actualizado correctamente'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Ocurrió un error: {str(e)}'}), 500


@employee_routes.delete('/<id>')
def delete(id):
    token_valid = check_token(request.headers)
    if not token_valid:
        return jsonify({'message': 'No tiene permisos'}), 400
    
    id = validate_uuid(id)
    if not id:
        return jsonify({"message": "Ingrese un id válido"}), 400
    
    try:
        employee = db.session.query(Employee).get(id)
        
        if not employee:
            return jsonify({'message':'El empleado que desea dar de baja no existe'}), 404
            
        if not set_employee_state(employee, 'INACTIVO'):
            return jsonify({'message': 'Estado INACTIVO no encontrado'}), 404
        
        return jsonify({'message':'La cuenta se ha dado de baja correctamente'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Ocurrió un error: {str(e)}'}), 500

@employee_routes.put('/active/<id>')
def active(id):
    token_valid = check_token(request.headers, 'Administrador')
    if not token_valid:
        return jsonify({'message': 'No tiene permisos'}), 400
    
    id = validate_uuid(id)
    if not id:
        return jsonify({"message": "Ingrese un id válido"}), 400
    
    try:
        employee = db.session.query(Employee).get(id)
        
        if not employee:
            return jsonify({'message':'El empleado que desea activar no existe'}), 404
            
        if not set_employee_state(employee, 'ACTIVO'):
            return jsonify({'message': 'Estado ACTIVO no encontrado'}), 404
        
        return jsonify({'message':'El empleado se ha activado correctamente'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Ocurrió un error: {str(e)}'}), 500
    
@employee_routes.post('/forgotPassword')
def forgotPassword():
    
    data = request.get_json()
    
    try:
        employee = db.session.query(Employee).filter(Employee.email == data['email']).first()
        
        passwordMail(employee.employee_id, employee.email)
        
        return jsonify({'message':'Mail enviado'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Ocurrió un error: {str(e)}'}), 500
    
@employee_routes.post('/resetPassword/<id>')
def resetPassword(id):
    id = validate_uuid(id)
    if not id:
        return jsonify({"message": "Ingrese un id válido"}), 400
    
    data = request.get_json()
    
    try:
        employee = db.session.query(Employee).get(id)
    
        if not employee:
            return jsonify({'message':'El empleado que desea registrar no existe'}), 404
            
        data['password'] = generate_password_hash(data['password'])
            
        update_features(model=employee, data=data)       
        
        db.session.commit()
        
        return jsonify({'message':'Se ha actualizado la contraseña correctamente'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Ocurrió un error: {str(e)}'}), 500