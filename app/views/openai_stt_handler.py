'''
import openai
import os
from flask import request, jsonify
from dotenv import load_dotenv
from pathlib import Path

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

def transcribe_audio():
    audio_file = request.files['audio']
    client = openai.OpenAI()
    response = client.audio.transcriptions.create(
        model="whisper-1",
        file=audio_file,
        response_format="text"
    )
    transcription = response['text']
    return jsonify({"transcription": transcription})
'''

# openai_stt_handler.py
'''
import openai
import os
from dotenv import load_dotenv

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")

async def transcribe_audio(audio_data):
    response = await openai.Audio.transcriptions.create(
        model="whisper-1",
        file=audio_data,
        response_format="text"
    )
    return response['text']
'''


'''

import openai
import os
from flask import request, jsonify
from dotenv import load_dotenv
from pathlib import Path

from openai import OpenAI
client = OpenAI()

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

def transcribe_audio(audio_data):
    client = openai.OpenAI()
    audio_file = open(audio_data, "rb")
    response = client.audio.transcriptions.create(
        model="whisper-1",
        file=audio_file,
        response_format="text"
    )
    transcription = response['text']
    return transcription

'''
#===============================================
'''
import openai
import os
from dotenv import load_dotenv

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")

async def transcribe_audio(audio_data):
    # Asegúrate de que el archivo de audio se guarda correctamente antes de enviarlo a la API
    with open("/tmp/audio.wav", "wb") as audio_file:
        audio_file.write(audio_data)
    
    audio_file = open("/tmp/audio.wav", "rb")
    try:
        response = openai.Audio.transcriptions.create(
            model="whisper-1",
            file=audio_file,
            response_format="text"
        )
        transcription = response['text']
    except Exception as e:
        print(f"Error during transcription: {str(e)}")
        transcription = ""
    
    audio_file.close()
    return transcription
'''

#=======================================================
'''
import openai
import os
import tempfile
from dotenv import load_dotenv

from openai import OpenAI
client = OpenAI()

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")

async def transcribe_audio(audio_data):
    # Crear un archivo temporal en una ubicación accesible
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_audio_file:
        temp_audio_file.write(audio_data)
        temp_audio_file_path = temp_audio_file.name
    
    # Abre el archivo temporal para la transcripción
    with open(temp_audio_file_path, "rb") as audio_file:
        try:
            response = client.audio.transcriptions.create(
                model="whisper-1",
                file=audio_file,
                response_format="text"
            )
            transcription = response['text']
        except Exception as e:
            print(f"Error during transcription: {str(e)}")
            transcription = ""

    # Elimina el archivo temporal
    os.remove(temp_audio_file_path)
    
    return transcription
'''


#=====================================================================

'''
import openai
import os
import tempfile
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

# Crear una instancia del cliente OpenAI
client = OpenAI()

# Establecer la clave de API
openai.api_key = os.getenv("OPENAI_API_KEY")

async def transcribe_audio(audio_data):
    # Crear un archivo temporal en una ubicación accesible
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_audio_file:
        temp_audio_file.write(audio_data)
        temp_audio_file_path = temp_audio_file.name
    
    try:
        # Abre el archivo temporal para la transcripción
        with open(temp_audio_file_path, "rb") as audio_file:
            response = client.audio.transcriptions.create(
                model="whisper-1",
                file=audio_file,
                response_format="text"
            )
            transcription = response['text'] if 'text' in response else ''
    except Exception as e:
        print(f"Error during transcription: {str(e)}")
        transcription = ""
    finally:
        # Elimina el archivo temporal
        os.remove(temp_audio_file_path)
    
    return transcription
'''

#======================================================
'''
import openai
import os
import tempfile
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

# Crear una instancia del cliente OpenAI
client = OpenAI()

# Establecer la clave de API
openai.api_key = os.getenv("OPENAI_API_KEY")

async def transcribe_audio(audio_data):
    # Crear un archivo temporal en una ubicación accesible
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_audio_file:
        temp_audio_file.write(audio_data)
        temp_audio_file_path = temp_audio_file.name
    
    try:
        # Abre el archivo temporal para la transcripción
        with open(temp_audio_file_path, "rb") as audio_file:
            response = client.audio.transcriptions.create(
                model="whisper-1",
                file=audio_file,
                response_format="text"
            )
            transcription = response['text'] if 'text' in response else ''
    except Exception as e:
        print(f"Error during transcription: {str(e)}")
        transcription = ""
    finally:
        # Elimina el archivo temporal
        os.remove(temp_audio_file_path)
    
    return transcription
'''
#================================================


import openai
import os
import tempfile
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

# Crear una instancia del cliente OpenAI
client = OpenAI()

# Establecer la clave de API
openai.api_key = os.getenv("OPENAI_API_KEY")

async def transcribe_audio(audio_data):
    print("Starting transcription process...")
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_audio_file:
        temp_audio_file.write(audio_data)
        temp_audio_file_path = temp_audio_file.name
        print(f"Audio data written to temp file: {temp_audio_file_path}")
    
    try:
        with open(temp_audio_file_path, "rb") as audio_file:
            response = client.audio.transcriptions.create(
                model="whisper-1",
                file=audio_file,
                response_format="json"
            )
            print(f"API response: {response}")

            # Asegúrate de que la estructura de respuesta es correcta
            if 'text' in response:
                transcription = response['text']
            elif hasattr(response, 'text'):
                transcription = response.text
            else:
                transcription = None

            print(f"Transcription result from API: {transcription}")
    except Exception as e:
        print(f"Error during transcription: {str(e)}")
        transcription = None
    finally:
        os.remove(temp_audio_file_path)
        print(f"Temp file {temp_audio_file_path} deleted.")

    return transcription
