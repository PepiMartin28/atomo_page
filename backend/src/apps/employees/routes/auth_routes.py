from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash
from sqlalchemy import func
import pytz
from datetime import datetime
from jwt import decode, exceptions
from decouple import config

from src.services.db import db
from src.utils.employee.auth_functions import generate_token
from src.apps.employees.models import Employee, EmployeeState, StateEmployee, Group

auth_routes = Blueprint(name='auth_routes', import_name=__name__)

@auth_routes.post('/login')
def login():
    data = request.get_json()
    
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
            Employee.password,
            Group.group_name,
            StateEmployee.state_name
        )
        .join(EmployeeState, Employee.employee_id == EmployeeState.employee_id)
        .join(StateEmployee, EmployeeState.stateEmployee_id == StateEmployee.stateEmployee_id)
        .join(Group, Employee.group_id == Group.group_id)
        .join(subquery, (EmployeeState.employee_id == subquery.c.employee_id) & (EmployeeState.created_date == subquery.c.max_date))
        .filter(Employee.email==data['email'])
    )
    
    try:
        employee = query.first()
        
        if not employee:
            return jsonify({'message':'No existe un usuario con ese email'}), 404
        
        if not check_password_hash(employee.password, data['password']):
            return jsonify({'message':'El email y la contraseña no coincide'}), 400
        
        if employee.state_name != 'ACTIVO':
            return jsonify({'message':'Su cuenta no se encuentra disponible, comuniquese con soporte'}), 403
        
        token = generate_token(employee)
        
        return jsonify({'token': token, 'group':employee.group_name}), 200
    except Exception as e:
        return jsonify({'message': f'Ocurrió un error: {str(e)}'}), 500

@auth_routes.post('/token')
def verify_token():
    data = request.get_json()
    token = data['token']
    
    try:
        payload = decode(token.split()[1], config('JWT_KEY'), algorithms=['HS256'])
    except exceptions.InvalidTokenError:
        return jsonify({'message':'Token invalido'}), 400
    
    if datetime.fromtimestamp(payload['exp']) < datetime.now():
        return jsonify({'message':'Token expirado'}), 400
    else:
        return jsonify({'group':payload['group_name']}), 200
    
    
    
    
    
    
    