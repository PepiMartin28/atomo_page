from flask import Blueprint, request, jsonify

from src.apps.employees.models import StateEmployee
from src.services.db import db
from src.utils.employee.auth_functions import check_token
from src.utils.general_functions import validate_uuid

statEemployee_routes = Blueprint(name='statEemployee_routes', import_name=__name__)

@statEemployee_routes.post('/')
def post():
    token_valid = check_token(request.headers, 'Administrador')
    if not token_valid:
        return jsonify({'message': 'No tiene permisos'}), 403
    
    data = request.get_json()
    
    try:
        duplicated = StateEmployee.query.filter_by(state_name=data['state_name']).all()
        if duplicated:
            return jsonify({'message': f'Ya existe un estado de empleado con este nombre: {data["state_name"]}'}), 400
        
        state = StateEmployee(state_name=data['state_name'])
        db.session.add(state)
        db.session.commit()
        
        return jsonify({'message': 'Se ha creado correctamente el estado de empleado'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Ocurrió un error: {str(e)}'}), 500
    
@statEemployee_routes.get('/')
def list():
    token_valid = check_token(request.headers, 'Administrador')
    if not token_valid:
        return jsonify({'message': 'No tiene permisos'}), 403
    
    try:
        states = db.session.query(StateEmployee).all()
        
        if not states:
            return jsonify({'message':'No hay estados de empleado'}), 404
        
        response = [{'stateEmployee_id':state.stateEmployee_id,
                    'state_name':state.state_name,
                    'active':state.active} for state in states]
        
        return response, 200
    except Exception as e:
        return jsonify({'message': f'Ocurrió un error: {str(e)}'}), 500
    
@statEemployee_routes.get('/<id>')
def get(id):
    token_valid = check_token(request.headers, 'Administrador')
    if not token_valid:
        return jsonify({'message': 'No tiene permisos'}), 403
    
    id = validate_uuid(id)
    if not id:
        return jsonify({"message": "Ingrese un id válido"}), 400
    
    try:
        state = db.session.query(StateEmployee).get(id)
        
        if state:
            return {
                'stateEmployee_id': str(state.stateEmployee_id),
                'state_name': state.state_name,
                'active': state.active,
                'created_date': state.created_date,
                'updated_date': state.updated_date
            }, 200
        else:
            return {"message": "No existe el estado de empleado buscado"}, 404
    except Exception as e:
        return jsonify({'message': f'Ocurrió un error: {str(e)}'}), 500
    
@statEemployee_routes.put('/<id>')
def update(id):
    token_valid = check_token(request.headers, 'Administrador')
    if not token_valid:
        return jsonify({'message': 'No tiene permisos'}), 403
    
    id = validate_uuid(id)
    if not id:
        return jsonify({"message": "Ingrese un id válido"}), 400
    
    try:
        state = db.session.query(StateEmployee).get(id)
        
        if not state:
            return jsonify({'message':'El estado de empleado que desea actulizar no existe'}), 400
        
        data = request.get_json()
        
        if data['state_name'] != state.state_name:
            duplicated = StateEmployee.query.filter_by(state_name=data['state_name']).all()
            if duplicated:
                return jsonify({'message': f'Ya existe un estado de empleado con este nombre: {data["state_name"]}'}), 400
        
        state.state_name = data['state_name']
        
        db.session.commit()
        
        return jsonify({'message':'El estado de empleado se ha actualizado correctamente'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Ocurrió un error: {str(e)}'}), 500
    
@statEemployee_routes.delete('/<id>')
def delete(id):
    token_valid = check_token(request.headers, 'Administrador')
    if not token_valid:
        return jsonify({'message': 'No tiene permisos'}), 403
    
    id = validate_uuid(id)
    if not id:
        return jsonify({"message": "Ingrese un id válido"}), 400
    
    try:
        state = db.session.query(StateEmployee).get(id)
        
        if not state:
            return jsonify({'message':'El estado de empleado que desea eliminar no existe'}), 400
        
        state.active = False
        
        db.session.commit()
        
        return jsonify({'message':'El estado de empleado se ha eliminado correctamente'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Ocurrió un error: {str(e)}'}), 500

@statEemployee_routes.put('/active/<id>')
def active(id):
    token_valid = check_token(request.headers, 'Administrador')
    if not token_valid:
        return jsonify({'message': 'No tiene permisos'}), 403
    
    id = validate_uuid(id)
    if not id:
        return jsonify({"message": "Ingrese un id válido"}), 400
    
    try:
        state = db.session.query(StateEmployee).get(id)
        
        if not state:
            return jsonify({'message':'El estado de empleado que desea activar no existe'}), 400
        
        state.active = True
        
        db.session.commit()
        
        return jsonify({'message':'El estado de empleado se ha activado correctamente'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Ocurrió un error: {str(e)}'}), 500