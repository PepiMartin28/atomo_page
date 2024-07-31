import uuid

def validate_uuid(value):
    try:
        return uuid.UUID(value)
    except ValueError:
        return None
    
def update_features(model, data):
    valid_attrs = set(model.__table__.columns.keys())
    for key, value in data.items():
        if key in valid_attrs:
            setattr(model, key, value)
    
    