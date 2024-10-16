from flask import Blueprint, request, jsonify

from src.services.db import db
from src.utils.employee.auth_functions import check_token, get_fields
from src.utils.general_functions import validate_uuid, update_features
from src.apps.protocols.models import Category, ProtocolCategory, Protocol
from src.apps.employees.models import Group, GroupCategory

category_routes = Blueprint(name='category_routes', import_name=__name__)

@category_routes.post('/')
def post(): 
    token_valid = check_token(request.headers, 'Administrador')
    if not token_valid:
        return jsonify({'message': 'No tiene permisos'}), 403
    
    data = request.get_json()
    
    try:
        duplicated = Category.query.filter_by(category_name=data['category_name']).all()
        if duplicated:
            return jsonify({'message': f'Ya existe una categoría con este nombre: {data["category_name"]}'}), 400
        
        category = Category(**data)
        db.session.add(category)
        db.session.commit()
        
        return jsonify({'message': 'Se ha creado correctamente la categoría'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Ocurrió un error: {str(e)}'}), 500
    
@category_routes.get('/')
def list():
    token_valid = check_token(request.headers)
    if not token_valid:
        return jsonify({'message': 'No tiene permisos'}), 403
    
    try:
        categories = Category.query.all()
        
        if not categories:
            return jsonify({'message':'No hay categorías'}), 404
        
        response = [{'category_id':category.category_id,
                    'category_name':category.category_name,
                    'active':category.active,
                    'description':category.description} for category in categories]
        
        return response, 200
    except Exception as e:
        return jsonify({'message': f'Ocurrió un error: {str(e)}'}), 500
    
@category_routes.get('/group')
def categories_by_group():
    token_valid = check_token(request.headers)
    if not token_valid:
        return jsonify({'message': 'No tiene permisos'}), 403
    
    data = get_fields(request.headers, ['group_name'])
    
    query = (
        db.session.query(
            Category.category_name
        )
        .join(GroupCategory, Category.category_id == GroupCategory.category_id)
        .join(Group, Group.group_id == GroupCategory.group_id)
        .filter(Group.group_name == data['group_name'])
        .filter(Category.active == True)
    )
    
    try:
        categories = query.all()
        
        if not categories:
            return jsonify({'message':'No hay categorías'}), 404
        
        response = [category.category_name for category in categories]
        
        return response, 200
    except Exception as e:
        return jsonify({'message': f'Ocurrió un error: {str(e)}'}), 500
    
@category_routes.get('/all')
def list_all():
    token_valid = check_token(request.headers, 'Administrador')
    if not token_valid:
        return jsonify({'message': 'No tiene permisos'}), 403
    
    try:
        categories = Category.query.order_by(Category.category_name).all()
        
        if not categories:
            return jsonify({'message':'No hay categorías'}), 404
        
        response = [category.category_name for category in categories]
        
        return response, 200
    except Exception as e:
        return jsonify({'message': f'Ocurrió un error: {str(e)}'}), 500
    
@category_routes.get('/<id>')
def get(id):
    token_valid = check_token(request.headers, 'Administrador')
    if not token_valid:
        return jsonify({'message': 'No tiene permisos'}), 403
    
    id = validate_uuid(id)
    if not id:
        return jsonify({"message": "Ingrese un id válido"}), 400
    
    try:
        category = Category.query.get(id)
        
        if not category:
            return {"message": "No existe la categoría buscada"}, 404
        
        query = (
            db.session.query(
                Protocol.title,
                Protocol.protocol_id,
                Protocol.summary, 
                ProtocolCategory.active,
            )
            .join(ProtocolCategory, Protocol.protocol_id == ProtocolCategory.protocol_id)
            .join(Category, Category.category_id == ProtocolCategory.category_id)
            .filter(Category.category_id == id)
        )
        
        protocols = query.all()
        
        all_protocols = [{
            'title': protocol.title,
            'protocol_id': protocol.protocol_id,
            'summary': protocol.summary,
            'relationship_state': protocol.active
            } for protocol in protocols]
        
        category_data ={
            'category_id': str(category.category_id),
            'category_name': category.category_name,
            'active': category.active,
            'description':category.description,
            'created_date': category.created_date,
            'updated_date': category.updated_date,
            'protocols': all_protocols
        }
        
        return category_data, 200
    except Exception as e:
        return jsonify({'message': f'Ocurrió un error: {str(e)}'}), 500
    
@category_routes.get('/unassociated_protocols/<id>')
def get_unassociated_protocols(id):
    token_valid = check_token(request.headers, 'Administrador')
    if not token_valid:
        return jsonify({'message': 'No tiene permisos'}), 403
    
    id = validate_uuid(id)
    if not id:
        return jsonify({"message": "Ingrese un id válido"}), 400
    
    try:
        category = Category.query.get(id)
        
        if not category:
            return {"message": "No existe la categoría buscada"}, 404
        
        query = (
            db.session.query(
                Protocol.title,
                Protocol.protocol_id,
            )
            .outerjoin(ProtocolCategory, 
                    (Protocol.protocol_id == ProtocolCategory.protocol_id) &
                    (ProtocolCategory.category_id == id))
            .filter(ProtocolCategory.category_id == None)
        ) 
        
        protocols = query.all()
        
        all_protocols = [{
            'title': protocol.title,
            'protocol_id': protocol.protocol_id,
            } for protocol in protocols]
    
        
        return all_protocols, 200
    except Exception as e:
        return jsonify({'message': f'Ocurrió un error: {str(e)}'}), 500
    
@category_routes.put('/<id>')
def update(id):
    token_valid = check_token(request.headers, 'Administrador')
    if not token_valid:
        return jsonify({'message': 'No tiene permisos'}), 403
    
    id = validate_uuid(id)
    if not id:
        return jsonify({"message": "Ingrese un id válido"}), 400
    
    try:
        category = Category.query.get(id)
        
        if not category:
            return jsonify({'message':'La categoría que desea actulizar no existe'}), 400
        
        data = request.get_json()
        
        if data['category_name'] != category.category_name_:
            duplicated = Category.query.filter_by(category_name=data['category_name']).all()
            if duplicated:
                return jsonify({'message': f'Ya existe una categoría con este nombre: {data["category_name"]}'}), 400
        
        update_features(model=category, data=data)   
        
        db.session.commit()
        
        return jsonify({'message':'La categoria se ha actualizado correctamente'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Ocurrió un error: {str(e)}'}), 500
    
@category_routes.delete('/<id>')
def delete(id):
    token_valid = check_token(request.headers, 'Administrador')
    if not token_valid:
        return jsonify({'message': 'No tiene permisos'}), 403
    
    id = validate_uuid(id)
    if not id:
        return jsonify({"message": "Ingrese un id válido"}), 400
    
    try:
        category = Category.query.get(id)
        
        if not category:
            return jsonify({'message':'La categoría que desea eliminar no existe'}), 400
        
        category.active = False
        
        db.session.commit()
        
        return jsonify({'message':'La categoría se ha eliminado correctamente'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Ocurrió un error: {str(e)}'}), 500

@category_routes.put('/active/<id>')
def active(id):
    token_valid = check_token(request.headers, 'Administrador')
    if not token_valid:
        return jsonify({'message': 'No tiene permisos'}), 403
    
    id = validate_uuid(id)
    if not id:
        return jsonify({"message": "Ingrese un id válido"}), 400
    
    try:
        category = Category.query.get(id)
        
        if not category:
            return jsonify({'message':'La categoría que desea activar no existe'}), 400
        
        category.active = True
        
        db.session.commit()
        
        return jsonify({'message':'La categoría se ha activado correctamente'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Ocurrió un error: {str(e)}'}), 500
    
@category_routes.post('/protocol/<id>')
def add_protocol(id):
    token_valid = check_token(request.headers, 'Administrador')
    if not token_valid:
        return jsonify({'message': 'No tiene permisos'}), 403
    
    category_id = validate_uuid(id)
    if not id:
        return jsonify({"message": "Ingrese un id válido"}), 400
    
    try:
        group = db.session.query(Category).get(category_id)
        
        if not group:
            return jsonify({'message':'El grupo de empleados que desea activar no existe'}), 404
        
        data = request.get_json()
        
        for obj in data:
            protocol_id = validate_uuid(obj['protocol_id'])
            categoryProtocol = ProtocolCategory(category_id=category_id, protocol_id=protocol_id)
            db.session.add(categoryProtocol)
        
        db.session.commit()
        
        return jsonify({'message':'Las relaciones se crearon correctamente correctamente'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Ocurrió un error: {str(e)}'}), 500
    
@category_routes.delete('/protocol/<id>')
def delete_protocol(id):
    token_valid = check_token(request.headers, 'Administrador')
    if not token_valid:
        return jsonify({'message': 'No tiene permisos'}), 403
    
    category_id = validate_uuid(id)
    if not id:
        return jsonify({"message": "Ingrese un id válido"}), 400
    
    try:
        data = request.get_json()
        
        protocol_id =  validate_uuid(data['protocol_id'])
        
        categoryProtocol = db.session.query(ProtocolCategory).filter(ProtocolCategory.protocol_id==protocol_id, ProtocolCategory.category_id==category_id).first()
        
        if not categoryProtocol:
            return jsonify({'message':'El grupo de empleados que desea activar no existe'}), 404
        
        categoryProtocol.active = False
        
        db.session.commit()
        
        return jsonify({'message':'Se dió de baja la relación correctamente'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Ocurrió un error: {str(e)}'}), 500
    
@category_routes.put('/protocol/active/<id>')
def active_protocol(id):
    token_valid = check_token(request.headers, 'Administrador')
    if not token_valid:
        return jsonify({'message': 'No tiene permisos'}), 403
    
    category_id = validate_uuid(id)
    if not id:
        return jsonify({"message": "Ingrese un id válido"}), 400
    
    try:
        data = request.get_json()
        
        protocol_id =  validate_uuid(data['protocol_id'])
        
        categoryProtocol = db.session.query(ProtocolCategory).filter(ProtocolCategory.protocol_id==protocol_id, ProtocolCategory.category_id==category_id).first()
        
        if not categoryProtocol:
            return jsonify({'message':'El grupo de empleados que desea activar no existe'}), 404
        
        categoryProtocol.active = True
        
        db.session.commit()
        
        return jsonify({'message':'Se dió de alta la relación correctamente'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Ocurrió un error: {str(e)}'}), 500