from flask import Flask
from flask_cors import CORS
from decouple import config

from src.services.db import db
from src.services.mail import mail
from src.apps.employees.routes.employee_routes import employee_routes
from src.apps.employees.routes.stateEmployee_routes import statEemployee_routes
from src.apps.employees.routes.group_routes import group_routes
from src.apps.employees.routes.auth_routes import auth_routes
from src.apps.protocols.routes.protocols_routes import protocol_routes
from src.apps.protocols.routes.content_routes import content_routes
from src.apps.protocols.routes.category_routes import category_routes
from src.apps.logs.routes import log_routes

app = Flask(__name__)

CORS(app)

# Configuración de la base de datos
app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql://{config('MARIADB_USER')}:{config('MARIADB_PASSWORD')}@{config('MARIADB_HOST')}/{config('MARIADB_DB')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Configuración del correo
app.config['MAIL_SERVER'] = config('MAIL_SERVER')
app.config['MAIL_PORT'] = config('MAIL_PORT', cast=int)
app.config['MAIL_USE_TLS'] = config('MAIL_USE_TLS', cast=bool)
app.config['MAIL_USE_SSL'] = config('MAIL_USE_SSL', cast=bool)
app.config['MAIL_USERNAME'] = config('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = config('MAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = config('MAIL_DEFAULT_SENDER')

mail.init_app(app)

# Inicialización de la base de datos y migraciones
db.init_app(app)

# Registro de las rutas del servidor
app.register_blueprint(employee_routes, url_prefix='/api/v1/employee')
app.register_blueprint(statEemployee_routes, url_prefix='/api/v1/stateEmployee')
app.register_blueprint(group_routes, url_prefix='/api/v1/group')
app.register_blueprint(auth_routes, url_prefix='/api/v1/auth')
app.register_blueprint(protocol_routes, url_prefix='/api/v1/protocol')
app.register_blueprint(content_routes, url_prefix='/api/v1/content')
app.register_blueprint(category_routes, url_prefix='/api/v1/category')
app.register_blueprint(log_routes, url_prefix='/api/v1/logs')