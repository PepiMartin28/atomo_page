from app import app
from src.services.db import db

with app.app_context():
    db.create_all()
    
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)