from flask_mail import Message
from src.services.mail import mail
from decouple import config


def registerMail(id, email):
    msg = Message('Complete su registro',
                recipients=[email])  
    msg.body = f'Ya puede crear su cuenta para poder leer los protocolos de seguridad. Por favor ingrese a la siguiente página para completar su registro: {config("FRONTEND_URL")}/register/{id}'
    try:
        mail.send(msg)
    except Exception as e:
        raise e 
    return 

def passwordMail(id, email):
    msg = Message('Reestablezca su contraseña',
                recipients=[email])  
    msg.body = f'Para poder cambiar su contraseña ingrese a la siguiente página: {config("FRONTEND_URL")}/resetPassword/{id}'
    try:
        mail.send(msg)
    except Exception as e:
        print(e)
        raise e 
    return
