from flask import Blueprint, request, jsonify, send_from_directory
from sqlalchemy import desc
import os

from src.apps.protocols.models import Content
from src.services.db import db
from src.utils.protocol.content_functions import update_order, fix_order
from src.utils.employee.auth_functions import check_token
from src.utils.general_functions import validate_uuid, update_features
from src.utils.upload_functions import get_file_path, delete_file

content_routes = Blueprint(name='content_routes', import_name=__name__)

@content_routes.post('/')
def post():
    token_valid = check_token(request.headers, 'Administrador')
    if not token_valid:
        return jsonify({'message': 'No tiene permisos'}), 403
    
    protocol_id = request.form.get('protocol_id')
    content = request.form.get('content')
    order = int(request.form.get('order')) if request.form.get('order') != 'NaN' else 0
    
    protocol_id = validate_uuid(protocol_id)
    if not protocol_id:
        return jsonify({"message": "Ingrese un id válido"}), 400
    
    try:
        if order == 0:
            last_content = db.session.query(Content).filter_by(protocol_id=protocol_id).order_by(desc(Content.order)).first()
            if not last_content:
                order = 1
            else:
                order = last_content.order + 1
        else:
            fix_order(protocol_id, order)
    
        image_path = get_file_path(request.files.get('image'), order)
        document_path = get_file_path(request.files.get('document'), order)
        
        new_content = Content(protocol_id = protocol_id,
                          order = order,
                          image = image_path,
                          document = document_path,
                          content = content)
        db.session.add(new_content)
        db.session.commit()  
        
        return jsonify({'message': 'Contenido creado correctamente'}), 201
    except Exception as e:
        print(e)
        db.session.rollback()
        return jsonify({'message': f'Ocurrió un error: {str(e)}'}), 500

@content_routes.put('/<id>')
def update(id):
    
    token_valid = check_token(request.headers, 'Administrador')
    if not token_valid:
        return jsonify({'message': 'No tiene permisos'}), 403
    
    content_id = validate_uuid(id)
    if not content_id:
        return jsonify({"message": "Ingrese un id válido"}), 400
   
    new_content = request.form.get('content')
    order = int(request.form.get('order'))
    del_image = False if request.form.get('deleteImage') == 'false' else True
    del_document = False if request.form.get('deleteDocument') == 'false' else True
    
    try:
        content = Content.query.get(content_id)
        
        if not content:
            return jsonify({'message':'El contenido que desea actulizar no existe'}), 404
        
        if order:
            if order < content.order:
                update_order(content.protocol_id, order, content.order, content_id, 'sumar')
            else:
                update_order(content.protocol_id, order, content.order, content_id, 'restar')

        if del_image:
            delete_file(content.image)
        
        if del_document:
            delete_file(content.document)
            
        if request.files.get('image'):
            image_path = get_file_path(request.files.get('image'), order)
        
        if request.files.get('document'):
            document_path = get_file_path(request.files.get('document'), order)
        
        data = {
            'order': order,
            'content': new_content,
            'image': content.image if not request.files.get('image') else image_path,
            'document':content.document if not request.files.get('document') else document_path,
        }
        
        update_features(model=content, data=data)       
        
        db.session.commit()
        
        return jsonify({'message':'El contenido se ha actualizado correctamente'}), 200
    except Exception as e:
        print(e)
        db.session.rollback()
        return jsonify({'message': f'Ocurrió un error: {str(e)}'}), 500

@content_routes.delete('/<id>')
def delete(id):
    token_valid = check_token(request.headers, 'Administrador')
    if not token_valid:
        return jsonify({'message': 'No tiene permisos'}), 403
    
    content_id = validate_uuid(id)
    if not content_id:
        return jsonify({"message": "Ingrese un id válido"}), 400
    
    try:
        content = Content.query.get(content_id)
        
        if not content:
            return jsonify({'message':'El contenido que desea dar de baja no existe'}), 404
        
        fix_order(content.protocol_id, content.order, content_id, action='restar')
            
        content.active = False
        db.session.commit()
        
        return jsonify({'message':'El contenido se ha dado de baja correctamente'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Ocurrió un error: {str(e)}'}), 500

@content_routes.put('/active/<id>')
def active(id):
    token_valid = check_token(request.headers, 'Administrador')
    if not token_valid:
        return jsonify({'message': 'No tiene permisos'}), 403
    
    content_id = validate_uuid(id)
    if not content_id:
        return jsonify({"message": "Ingrese un id válido"}), 400
    
    try:
        content = Content.query.get(content_id)
        
        if not content:
            return jsonify({'message':'El contenido que desea activar no existe'}), 404
        
        fix_order(content.protocol_id, content.order, content_id, action='sumar')
        
        content.active = True
        db.session.commit()
        
        return jsonify({'message':'El contenido se ha activado correctamente'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Ocurrió un error: {str(e)}'}), 500
    
@content_routes.get('/<filename>')
def get_image(filename):
    basedir = os.path.join(os.getcwd(), 'uploads')
    return send_from_directory(basedir, filename)
