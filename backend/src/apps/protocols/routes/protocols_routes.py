from flask import Blueprint, request, jsonify
from sqlalchemy import asc

from src.apps.protocols.models import Protocol, Content, ProtocolCategory, Category
from src.apps.employees.models import Group, GroupCategory
from src.services.db import db
from src.utils.employee.auth_functions import check_token, get_fields
from src.utils.general_functions import validate_uuid, update_features

protocol_routes = Blueprint(name='protocol_routes', import_name=__name__)

@protocol_routes.post('/')
def post():
    token_valid = check_token(request.headers, 'Administrador')
    if not token_valid:
        return jsonify({'message': 'No tiene permisos'}), 403
    
    data = request.get_json()
    
    try:
        protocol = Protocol(
            title = data['title'],
            author = data['author'],
            summary = data['summary']
        )
        db.session.add(protocol)
        db.session.flush()  
        
        category = Category.query.filter(Category.category_name == data['category_name']).first()
        
        print(category, protocol)
        
        protocolCategory = ProtocolCategory(
            protocol_id = protocol.protocol_id,
            category_id = category.category_id
        )
        
        db.session.add(protocolCategory)
        
        db.session.commit()  
        
        return jsonify({'message': 'Protocolo creado correctamente'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Ocurrió un error: {str(e)}'}), 500


@protocol_routes.get('/')
def list():
    token_valid = check_token(request.headers)
    if not token_valid:
        return jsonify({'message': 'No tiene permisos'}), 403
    
    data = get_fields(request.headers, ['group_name'])
    
    page_num = request.args.get('page', 1, type=int)
    category = request.args.get('category', 'All')
    title = request.args.get('title', '', type=str)
    per_page = 10

    query = (
        db.session.query(
            Protocol.title,
            Protocol.protocol_id,
            Protocol.summary,
            Protocol.created_date,
            Protocol.author,
            Category.category_name
        )
        .join(ProtocolCategory, Protocol.protocol_id == ProtocolCategory.protocol_id)
        .join(Category, Category.category_id == ProtocolCategory.category_id)
        .join(GroupCategory, Category.category_id == GroupCategory.category_id)
        .join(Group, Group.group_id == GroupCategory.group_id)
        .filter(Group.group_name == data['group_name'])
        .filter(Protocol.active == True)
        .filter(Category.active == True)
        .group_by(Protocol.protocol_id)
    )
    
    if category != 'All':
        query = query.filter(Category.category_name == category)
        
    if title:
        query = query.filter(Protocol.title.ilike(f'%{title}%'))
    
    try:
        protocols = query.paginate(per_page=per_page, page=page_num, error_out=False)
        
        if not protocols.items:
            return jsonify({'message': 'No hay protocolos'}), 404
        
        response = [
            {
                'protocol_id': protocol.protocol_id,
                'title': protocol.title,
                'summary': protocol.summary,
                'created_date': protocol.created_date,
                'author': protocol.author,
                'category_name': protocol.category_name
            }
            for protocol in protocols.items
        ]
        
        return jsonify({
            'data': response,
            'totalPages': protocols.pages,
            'currentPage': protocols.page
        }), 200
    except Exception as e:
        return jsonify({'message': f'Ocurrió un error: {str(e)}'}), 500

@protocol_routes.get('/all')
def list_all():
    token_valid = check_token(request.headers, 'Administrador')
    if not token_valid:
        return jsonify({'message': 'No tiene permisos'}), 403
    
    page_num = request.args.get('page', 1, type=int)
    category = request.args.get('category', 'All')
    title = request.args.get('title', '', type=str)
    state = request.args.get('state', '', type=str)
    per_page = 10

    query = (
        db.session.query(
            Protocol.title,
            Protocol.protocol_id,
            Protocol.summary,
            Protocol.created_date,
            Protocol.active,
            Protocol.author,
            Category.category_name
        ) 
        .join(ProtocolCategory, Protocol.protocol_id == ProtocolCategory.protocol_id)
        .join(Category, Category.category_id == ProtocolCategory.category_id)
        .group_by(Protocol.protocol_id)
        .filter(Category.active == True)
    )
    
    if category != 'All':
        query = query.filter(Category.category_name == category)
        
    if title:
        query = query.filter(Protocol.title.ilike(f'%{title}%'))
        
    if state:
        query = query.filter(Protocol.active == True if state == 'Active' else False)
    
    try:
        protocols = query.paginate(per_page=per_page, page=page_num, error_out=False)
        
        if not protocols.items:
            return jsonify({'message': 'No hay protocolos'}), 404
        
        response = [
            {
                'protocol_id': protocol.protocol_id,
                'title': protocol.title,
                'summary': protocol.summary,
                'created_date': protocol.created_date,
                'active': protocol.active,
                'author': protocol.author,
                'category_name': protocol.category_name
            }
            for protocol in protocols.items
        ]
        
        return jsonify({
            'data': response,
            'totalPages': protocols.pages,
            'currentPage': protocols.page
        }), 200
    except Exception as e:
        return jsonify({'message': f'Ocurrió un error: {str(e)}'}), 500

@protocol_routes.get('/<id>')
def get(id):
    token_valid = check_token(request.headers)
    if not token_valid:
        return jsonify({'message': 'No tiene permisos'}), 403
    
    id = validate_uuid(id)
    if not id:
        return jsonify({"message": "Ingrese un id válido"}), 400
    
    query = (
            db.session.query(
                Protocol.title,
                Protocol.protocol_id,
                Protocol.summary,
                Protocol.created_date,
                Protocol.active,
                Protocol.author,
                Protocol.created_date,
                Category.category_name
            )
            .join(ProtocolCategory, Protocol.protocol_id == ProtocolCategory.protocol_id)
            .join(Category, Category.category_id == ProtocolCategory.category_id)
            .filter(Protocol.protocol_id == id)
        )
    
    try:
        protocol = query.first()
        
        if not protocol:
            return jsonify({'message':'No se encuentra el protocolo'}), 404
        
        contents = Content.query.filter(Content.protocol_id==id).order_by(asc(Content.order)).all()
        
        content = [{
            'content_id':c.content_id,
            'content':c.content,
            'order':c.order,
            'image':c.image,
            'document':c.document,
            'active':c.active,
            'protocol_id': protocol.protocol_id
        } for c in contents]
        
        response ={
                'protocol_id': protocol.protocol_id,
                'title': protocol.title,
                'summary': protocol.summary,
                'author': protocol.author,
                'active': protocol.active,
                'category_name': protocol.category_name,
                'created_date': protocol.created_date,
                'content': content
            }
        
        return response, 200
    except Exception as e:
        return jsonify({'message': f'Ocurrió un error: {str(e)}'}), 500


@protocol_routes.put('/<id>')
def update(id):
    token_valid = check_token(request.headers, group='Administrador')
    if not token_valid:
        return jsonify({'message': 'No tiene permisos'}), 403
    
    id = validate_uuid(id)
    if not id:
        return jsonify({"message": "Ingrese un id válido"}), 400
    
    try:
        protocol = Protocol.query.get(id)
        
        if not protocol:
            return jsonify({'message':'El protocolo que desea actulizar no existe'}), 404
            
        data = request.get_json()
        
        update_features(model=protocol, data=data)   
        
        db.session.commit()
        
        return jsonify({'message':'El protocolo se ha actualizado correctamente'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Ocurrió un error: {str(e)}'}), 500


@protocol_routes.delete('/<id>')
def delete(id):
    token_valid = check_token(request.headers, 'Administrador')
    if not token_valid:
        return jsonify({'message': 'No tiene permisos'}), 403
    
    id = validate_uuid(id)
    if not id:
        return jsonify({"message": "Ingrese un id válido"}), 400
    
    try:
        protocol = Protocol.query.get(id)
        
        if not protocol:
            return jsonify({'message':'El protocolo que desea dar de baja no existe'}), 404
            
        protocol.active = False
        db.session.commit()
        
        return jsonify({'message':'El protocolo se ha dado de baja correctamente'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Ocurrió un error: {str(e)}'}), 500

@protocol_routes.put('/active/<id>')
def active(id):
    
    token_valid = check_token(request.headers, group='Administrador')
    if not token_valid:
        return jsonify({'message': 'No tiene permisos'}), 403
    
    id = validate_uuid(id)
    if not id:
        return jsonify({"message": "Ingrese un id válido"}), 400
    
    try:
        protocol = Protocol.query.get(id)
        
        if not protocol:
            return jsonify({'message':'El protocolo que desea activar no existe'}), 404
            
        protocol.active = True
        db.session.commit()
        
        return jsonify({'message':'El protocolo se ha activado correctamente'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Ocurrió un error: {str(e)}'}), 500