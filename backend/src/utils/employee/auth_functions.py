from jwt import encode, decode, exceptions
from datetime import datetime, timedelta
from decouple import config

def generate_token(user):
    now = datetime.now()

    payload = {
        'id': str(user.employee_id),
        'email': user.email,
        'group_name': user.group_name,
        'state_name': user.state_name,
        'iat': now,
        'exp': now + timedelta(hours=12)
    }

    token = encode(payload=payload, key=config('JWT_KEY'), algorithm='HS256')
    
    return token
       

def check_token(headers, group=None):
    
    if 'Authorization' not in headers:
        return False

    token = headers['Authorization'].split()[1]
    try:
        payload = decode(token, config('JWT_KEY'), algorithms=['HS256'])
    except exceptions.InvalidTokenError:
        return False
    
    if (group) and (payload.get('group_name') != group):
        return False
    
    return True
    
def get_fields(headers, fields):
    data = {}
    
    token = headers['Authorization'].split()[1]
    try:
        payload = decode(token, config('JWT_KEY'), algorithms=['HS256'])
    except exceptions.InvalidTokenError:
        return False
    
    if fields == 'all':
        return payload
    
    for field in fields:
        data[field] = payload.get(field)
        
    return data
    
    
    