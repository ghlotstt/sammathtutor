# tts.py

import openai
import os
from dotenv import load_dotenv
from pathlib import Path
import shutil
from bs4 import BeautifulSoup  # Asegúrate de tener BeautifulSoup instalado: pip install beautifulsoup4
from .token_utils import count_tokens  # Importar la función de conteo de tokens


load_dotenv()


load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")

def clean_text(text):
    soup = BeautifulSoup(text, "html.parser")
    clean_text = soup.get_text()

    # Reemplazar caracteres matemáticos con su versión de texto
    clean_text = clean_text.replace("×", "x")
    clean_text = clean_text.replace("=", " equals ")
    clean_text = clean_text.replace("+", " plus ")
    clean_text = clean_text.replace("-", " minus ")
    clean_text = clean_text.replace("*", " times ")
    clean_text = clean_text.replace("/", " divided by ")
    clean_text = clean_text.replace("²", " squared ")
    clean_text = clean_text.replace("³", " cubed ")

    return clean_text

def generate_speech(text, filename="output.mp3"):
    try:
        print("Generating speech...")
        print(f"Input text: {text}")

        cleaned_text = clean_text(text)
        print(f"Cleaned text: {cleaned_text}")

        #===================================================

        # Contar los tokens del texto limpio
        token_count = count_tokens(cleaned_text)
        print(f"Token count: {token_count}")

        #====================================================

        client = openai.OpenAI()
        response = client.audio.speech.create(
            model="tts-1",
            voice="alloy",
            #input=text,
            input=cleaned_text,
        )
        print(f"API response received: {response}")

        # Verificar si la respuesta contiene datos de audio
        if not hasattr(response, 'content'):
            print("Error: La respuesta de la API no contiene datos de audio.")
            return None

        speech_file_path = Path(__file__).parent / filename
        with open(speech_file_path, "wb") as audio_file:
            audio_file.write(response.content)
            print(f"Audio content written to {speech_file_path}")

        # Mueve el archivo a la carpeta `app/static/audio`
        #audio_directory = Path("static/audio")
        audio_directory = Path(__file__).resolve().parent.parent / "static/audio"
        audio_directory.mkdir(parents=True, exist_ok=True)
        final_audio_path = audio_directory / speech_file_path.name
        shutil.move(speech_file_path, final_audio_path)
        print(f"Audio file moved to: {final_audio_path}")

        return final_audio_path.name
    except Exception as e:
        print(f"Error in generate_speech: {e}")
        return None
