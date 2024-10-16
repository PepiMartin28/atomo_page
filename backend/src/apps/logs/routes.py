from flask import Blueprint, request, jsonify
from datetime import datetime
from sqlalchemy import desc, func

from src.apps.logs.models import Log
from src.apps.employees.models import Employee
from src.apps.protocols.models import Protocol
from src.services.db import db
from src.utils.employee.auth_functions import check_token, get_fields
from src.utils.general_functions import validate_uuid

log_routes = Blueprint(name='log_routes', import_name=__name__)

@log_routes.post('/login')
def login_log():
    data = get_fields(request.headers, ['id'])
    
    employee_id = validate_uuid(data.get('id'))
    if not employee_id:
        return jsonify({"message": "Ingrese un ID válido"}), 400
    
    try:
        log = Log(employee_id=employee_id, description='Inició sesión')
        db.session.add(log)
        db.session.commit()
        
        return jsonify({'message': 'Log creado correctamente'}), 201
    except Exception as e:
        db.session.rollback()  
        return jsonify({'message': f'Ocurrió un error: {str(e)}'}), 500
    
@log_routes.post('/protocol')
def protocol_log():
    data = request.get_json()

    token_valid = check_token(request.headers)
    if not token_valid:
        return jsonify({'message': 'No tiene permisos'}), 403
    
    employee_data = get_fields(request.headers, ['id'])

    employee_id = validate_uuid(employee_data.get('id'))
    if not employee_id:
        return jsonify({"message": "Ingrese un ID válido"}), 400
    
    protocol_id = validate_uuid(data.get('protocol_id'))
    if not protocol_id:
        return jsonify({"message": "Ingrese un ID válido para el protocolo"}), 400
        
    try:
        log = Log(employee_id=employee_id, description='Consultó un protocolo', protocol_id=protocol_id)
        db.session.add(log)
        db.session.commit()
        
        return jsonify({'message': 'Log creado correctamente'}), 201
    except Exception as e:
        db.session.rollback()  
        return jsonify({'message': f'Ocurrió un error: {str(e)}'}), 500
    
@log_routes.get('/')
def list_logs():
    token_valid = check_token(request.headers)
    if not token_valid:
        return jsonify({'message': 'No tiene permisos'}), 403
    
    page_num = request.args.get('page_num', 1, type=int)
    email = request.args.get('email', 'All')
    description = request.args.get('action', '', type=str)
    since_date = request.args.get('since_date', '')
    date_until = request.args.get('date_until', '')
    per_page = 20
    
    query = (
        db.session.query(
            Employee.email,
            Log.description,
            Log.date,
            Protocol.title,
        )
        .join(Log, Log.employee_id == Employee.employee_id)
        .outerjoin(Protocol, Protocol.protocol_id == Log.protocol_id)
    )
    
    if email and email != '':
        query = query.filter(Employee.email == email)
        
    if description:
        query = query.filter(Log.description == description)
        
    if since_date:
        since_date = datetime.strptime(since_date, "%Y-%m-%d").date()
        query = query.filter(func.date(Log.date) >= since_date)
    
    if date_until:
        date_until = datetime.strptime(date_until, "%Y-%m-%d").date()
        query = query.filter(func.date(Log.date) <= date_until)
        
    print(query)
        
    try:
        query = query.order_by(desc(Log.date))
        
        logs = query.paginate(per_page=per_page, page=page_num, error_out=False)
        
        response = [
            {
                'email': log.email,
                'description': log.description,
                'date': log.date,
                'protocol_title': log.title
            } for log in logs.items
        ]
        
        return jsonify({
            'data': response,
            'totalPages': logs.pages,
            'currentPage': logs.page
        }), 200
    except Exception as e:
        return jsonify({'message': f'Ocurrió un error: {str(e)}'}), 500

