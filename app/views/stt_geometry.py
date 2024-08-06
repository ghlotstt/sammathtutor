import openai
import os
import tempfile
from flask import request, jsonify
from dotenv import load_dotenv
from openai import OpenAI


load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

# Crear una instancia del cliente OpenAI
client = OpenAI()

#def transcribe_audio():

def transcribe_audio_geometry():
    try:
        audio_file = request.files['audio']

        # Guardar el archivo temporalmente
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_audio_file:
            audio_file.save(temp_audio_file.name)
            temp_audio_file_path = temp_audio_file.name
            print(f"Audio data saved to temp file: {temp_audio_file_path}")

        try:
            # Abrir el archivo temporal y enviarlo a la API de OpenAI
            with open(temp_audio_file_path, "rb") as audio_file:
                response = client.audio.transcriptions.create(
                    model="whisper-1",
                    file=audio_file,
                    #response_format="json"
                )
                print(f"API response: {response}")

                # Verificar y obtener la transcripción de la respuesta
                #transcription = response.get('text', None)
                
                transcription = response.text if hasattr(response, 'text') else None
                
                if transcription is None:
                    print("No transcription found in response.")
                    transcription = "No transcription available."
                else:
                    print(f"Transcription found: {transcription}")

        finally:
            os.remove(temp_audio_file_path)
            print(f"Temp file {temp_audio_file_path} deleted.")

        return jsonify({"transcription": transcription})
    except Exception as e:
        print(f"Error in transcribe_audio: {e}")
        return jsonify({"error": str(e)}), 500