'''
import openai
import os
from dotenv import load_dotenv
from pathlib import Path

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")

def generate_speech(text, filename="output.mp3"):
    client = openai.OpenAI()
    speech_file_path = Path(__file__).parent / filename
    response = client.audio.speech.create(
        model="tts-1",
        voice="alloy",
        input=text,
    )
    with open(speech_file_path, "wb") as audio_file:
        audio_file.write(response.content)
    return str(speech_file_path)
'''

import openai
import os
from dotenv import load_dotenv
from pathlib import Path
import shutil

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")

def generate_speech(text, filename="output.mp3"):
    client = openai.OpenAI()
    speech_file_path = Path(__file__).parent / filename
    response = client.audio.speech.create(
        model="tts-1",
        voice="alloy",
        input=text,
    )
    with open(speech_file_path, "wb") as audio_file:
        audio_file.write(response.content)
    
    # Mueve el archivo a la carpeta `static/audio`
    audio_directory = Path("app/static/audio")
    audio_directory.mkdir(parents=True, exist_ok=True)
    final_audio_path = audio_directory / speech_file_path.name
    shutil.move(speech_file_path, final_audio_path)
    
    return final_audio_path.name  # Devuelve solo el nombre del archivo
