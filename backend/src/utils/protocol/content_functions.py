from sqlalchemy import desc, asc

from src.services.db import db
from src.apps.protocols.models import Content

def update_order(protocol_id, new_order, old_order=0, content_id=None, action='sumar'):
    if action=='sumar':
        content = db.session.query(Content).filter(
            Content.protocol_id == protocol_id,
            Content.order >= new_order
        ).order_by(asc(Content.order)).all()
    else:
        content = db.session.query(Content).filter(
            Content.protocol_id == protocol_id,
            Content.order <= new_order
        ).order_by(desc(Content.order)).all()
    
    num = 1 if action == 'sumar' else -1
    
    for c in content:
        if c.content_id == content_id:
            continue
        if (action == 'sumar' and c.order >= old_order) or (action == 'restar' and c.order <= old_order):
            break
        c.order = c.order + num
        
def fix_order(protocol_id, order, content_id=None, action='sumar'):
    content = db.session.query(Content).filter(
            Content.protocol_id == protocol_id,
            Content.order >= order
    ).order_by(asc(Content.order)).all()
    
    num = 1 if action == 'sumar' else -1
    
    for c in content:
        if c.content_id == content_id:
            continue
        c.order = c.order + num

