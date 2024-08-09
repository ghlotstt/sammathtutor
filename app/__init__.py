from flask import Flask
from dotenv import load_dotenv
import os

def create_app():
    # Cargar las variables de entorno desde .env
    load_dotenv()

    app = Flask(__name__)

    # Configurar la secret_key desde las variables de entorno
    app.secret_key = os.getenv('SECRET_KEY')

    # Importar rutas
    with app.app_context():
        from . import routes

    return app
