from flask import Blueprint, request, jsonify

from src.apps.employees.models import Group, GroupCategory
from src.services.db import db
from src.utils.employee.auth_functions import check_token
from src.utils.general_functions import validate_uuid, update_features

group_routes = Blueprint(name='group_routes', import_name=__name__)

@group_routes.post('/')
def post():
    token_valid = check_token(request.headers, 'Administrador')
    if not token_valid:
        return jsonify({'message': 'No tiene permisos'}), 400
    
    data = request.get_json()
    
    try:
        duplicated = Group.query.filter_by(group_name=data['group_name']).all()
        if duplicated:
            return jsonify({'message': f'Ya existe un grupo de empleados con este nombre: {data['group_name']}'}), 400
        
        group = Group(**data)
        db.session.add(group)
        db.session.commit()
        
        return jsonify({'message': 'Se ha creado correctamente el grupo de empleados'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Ocurrió un error: {str(e)}'}), 500
    
@group_routes.get('/')
def list():
    token_valid = check_token(request.headers, 'Administrador')
    if not token_valid:
        return jsonify({'message': 'No tiene permisos'}), 400
    
    try:
        groups = db.session.query(Group).all()
        
        if not groups:
            return jsonify({'message':'No hay grupos de empleados'}), 404
        
        response = [{'group_id':group.group_id,
                    'group_name':group.group_name,
                    'description':group.description,
                    'active':group.active} for group in groups]
        
        return response, 200
    except Exception as e:
        return jsonify({'message': f'Ocurrió un error: {str(e)}'}), 500
    
@group_routes.get('/<id>')
def get(id):
    token_valid = check_token(request.headers, 'Administrador')
    if not token_valid:
        return jsonify({'message': 'No tiene permisos'}), 400
    
    id = validate_uuid(id)
    if not id:
        return jsonify({"message": "Ingrese un id válido"}), 400
    
    try:
        group = db.session.query(Group).get(id)
        
        if group:
            return {
                'group_id': str(group.group_id),
                'group_name': group.group_name,
                'description': group.description,
                'access_type': group.access_type,
                'active': group.active,
                'created_date': group.created_date,
                'updated_date': group.updated_date
            }, 200
        else:
            return {"message": "No existe el grupo de empleados buscado"}, 404
    except Exception as e:
        return jsonify({'message': f'Ocurrió un error: {str(e)}'}), 500
    
@group_routes.put('/<id>')
def update(id):
    token_valid = check_token(request.headers, 'Administrador')
    if not token_valid:
        return jsonify({'message': 'No tiene permisos'}), 400
    
    id = validate_uuid(id)
    if not id:
        return jsonify({"message": "Ingrese un id válido"}), 400
    
    try:
        group = db.session.query(Group).get(id)
        
        if not group:
            return jsonify({'message':'El grupo de empleados que desea actulizar no existe'}), 404
            
        data = request.get_json()
        
        duplicated = Group.query.filter_by(group_name=data['group_name']).all()
        if duplicated:
            return jsonify({'message': f'Ya existe un grupo de empleados con este nombre: {data['group_name']}'}), 400
        
        update_features(model=group, data=data)   
        
        db.session.commit()
        
        return jsonify({'message':'El grupo de empleados se ha actualizado correctamente'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Ocurrió un error: {str(e)}'}), 500
    
@group_routes.delete('/<id>')
def delete(id):
    token_valid = check_token(request.headers, 'Administrador')
    if not token_valid:
        return jsonify({'message': 'No tiene permisos'}), 400
    
    id = validate_uuid(id)
    if not id:
        return jsonify({"message": "Ingrese un id válido"}), 400
    
    try:
        group = db.session.query(Group).get(id)
        
        if not group:
            return jsonify({'message':'El grupo de empleados que desea eliminar no existe'}), 404
        
        group.active = False
        
        db.session.commit()
        
        return jsonify({'message':'El grupo de empleados se ha eliminado correctamente'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Ocurrió un error: {str(e)}'}), 500

@group_routes.put('/active/<id>')
def active(id):
    token_valid = check_token(request.headers, 'Administrador')
    if not token_valid:
        return jsonify({'message': 'No tiene permisos'}), 400
    
    id = validate_uuid(id)
    if not id:
        return jsonify({"message": "Ingrese un id válido"}), 400
    
    try:
        group = db.session.query(Group).get(id)
        
        if not group:
            return jsonify({'message':'El grupo de empleados que desea activar no existe'}), 404
        
        group.active = True
        
        db.session.commit()
        
        return jsonify({'message':'El grupo de empleados se ha activado correctamente'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Ocurrió un error: {str(e)}'}), 500
    
@group_routes.post('/category/<id>')
def add_category(id):
    token_valid = check_token(request.headers, 'Administrador')
    if not token_valid:
        return jsonify({'message': 'No tiene permisos'}), 400
    
    group_id = validate_uuid(id)
    if not id:
        return jsonify({"message": "Ingrese un id válido"}), 400
    
    try:
        group = db.session.query(Group).get(group_id)
        
        if not group:
            return jsonify({'message':'El grupo de empleados que desea activar no existe'}), 404
        
        data = request.get_json()
        
        for obj in data:
            category_id = validate_uuid(obj['category_id'])
            groupCategory = GroupCategory(group_id=group_id, category_id=category_id)
            db.session.add(groupCategory)
        
        db.session.commit()
        
        return jsonify({'message':'Las relaciones se crearon correctamente correctamente'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Ocurrió un error: {str(e)}'}), 500
    
@group_routes.delete('/category/<id>')
def delete_category(id):
    token_valid = check_token(request.headers, 'Administrador')
    if not token_valid:
        return jsonify({'message': 'No tiene permisos'}), 400
    
    group_id = validate_uuid(id)
    if not id:
        return jsonify({"message": "Ingrese un id válido"}), 400
    
    try:
        data = request.get_json()
        
        category_id =  validate_uuid(data['category_id'])
        
        groupCategory = db.session.query(GroupCategory).filter(GroupCategory.group_id==group_id, GroupCategory.category_id==category_id).first()
        
        if not groupCategory:
            return jsonify({'message':'El grupo de empleados que desea activar no existe'}), 404
        
        groupCategory.active = False
        
        db.session.commit()
        
        return jsonify({'message':'Se dió de baja la relación correctamente'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Ocurrió un error: {str(e)}'}), 500
    
@group_routes.put('/category/active/<id>')
def active_category(id):
    token_valid = check_token(request.headers, 'Administrador')
    if not token_valid:
        return jsonify({'message': 'No tiene permisos'}), 400
    
    group_id = validate_uuid(id)
    if not id:
        return jsonify({"message": "Ingrese un id válido"}), 400
    
    try:
        data = request.get_json()
        
        category_id =  validate_uuid(data['category_id'])
        
        groupCategory = db.session.query(GroupCategory).filter(GroupCategory.group_id==group_id, GroupCategory.category_id==category_id).first()
        
        if not groupCategory:
            return jsonify({'message':'El grupo de empleados que desea activar no existe'}), 404
        
        groupCategory.active = True
        
        db.session.commit()
        
        return jsonify({'message':'Se dió de alta la relación correctamente'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Ocurrió un error: {str(e)}'}), 500