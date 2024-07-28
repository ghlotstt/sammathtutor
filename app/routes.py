'''
from flask import render_template, request, jsonify, current_app as app
import asyncio
from app.views.arithmetic import ask_gpt4_async
import os
import json
from werkzeug.utils import secure_filename
import base64
import requests

@app.route('/')
@app.route('/index')
def index():
    return render_template('index.html')

@app.route('/mathematics')
def mathematics():
    return render_template('subjects/math.html')

@app.route('/arithmetic')
def arithmetic():
    return render_template('subjects/arithmetic.html')




@app.route('/ask_arithmetic', methods=['POST'])
def ask_arithmetic():
    data = request.form
    question = data.get("question")
    conversation_history = data.get("conversation_history")
    if conversation_history:
        conversation_history = json.loads(conversation_history)
    else:
        conversation_history = []

    file = request.files.get("file")
    image_description = None

    if file:
        image_data = file.read()
        print(f"Received file: {file.filename}, size: {len(image_data)} bytes")
        
        # Llamar al modelo de AI para que describa la imagen
        image_description = describe_image(image_data)

    print("Received question:", question)
    print("Conversation history:", conversation_history)

    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    answer, conversation_history = loop.run_until_complete(ask_gpt4_async(question, conversation_history, image_description))
    
    return jsonify({"answer": answer, "conversation_history": conversation_history})

#============ Implementation description image ==========================

@app.route('/describe_image', methods=['POST'])
def describe_image_route():
    file = request.files.get("file")
    if file:
        image_data = file.read()
        print(f"Received file for description: {file.filename}, size: {len(image_data)} bytes")
        description = describe_image(image_data)
        return jsonify({"description": description})
    return jsonify({"error": "No file provided"}), 400

def describe_image(image_data):
    
    api_key = os.getenv("OPENAI_API_KEY")

    # Codificar la imagen a base64
    base64_image = base64.b64encode(image_data).decode('utf-8')

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }

    payload = {
        "model": "gpt-4o",
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "What’s in this image?"
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{base64_image}"
                        }
                    }
                ]
            }
        ],
        "max_tokens": 300
    }

    response = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)
    response_data = response.json()

    # Asegurarse de que la respuesta tiene el formato correcto
    if 'choices' in response_data and len(response_data['choices']) > 0:
        description = response_data['choices'][0]['message']['content']
    else:
        description = "I'm sorry, but I couldn't describe the image."

    return description

'''
'''
from flask import render_template, request, jsonify, send_file, current_app as app
import asyncio
from app.views.arithmetic import ask_gpt4_async
from app.views.voice_handler import generate_speech  # Importar la nueva función de TTS
import os
import json
from werkzeug.utils import secure_filename
import base64
import requests
from flask import send_file
'''

''''''
from flask import render_template, request, jsonify, send_file, current_app as app
import asyncio
from app.views.arithmetic import ask_gpt4_async
import os
import json
from werkzeug.utils import secure_filename
import base64
import requests
from pathlib import Path
import shutil
from app.views.voice_handler import generate_speech  # Importar la función generate_speech
from app.views.openai_stt_handler import transcribe_audio

@app.route('/')
@app.route('/index')
def index():
    return render_template('index.html')

@app.route('/mathematics')
def mathematics():
    return render_template('subjects/math.html')

@app.route('/arithmetic')
def arithmetic():
    return render_template('subjects/arithmetic.html')

@app.route('/ask_arithmetic', methods=['POST'])
def ask_arithmetic():
    data = request.form
    question = data.get("question")
    conversation_history = data.get("conversation_history")
    if conversation_history:
        conversation_history = json.loads(conversation_history)
    else:
        conversation_history = []

    file = request.files.get("file")
    image_description = None

    if file:
        image_data = file.read()
        print(f"Received file: {file.filename}, size: {len(image_data)} bytes")
        
        # Llamar al modelo de AI para que describa la imagen
        image_description = describe_image(image_data)

    print("Received question:", question)
    print("Conversation history:", conversation_history)

    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    answer, conversation_history = loop.run_until_complete(ask_gpt4_async(question, conversation_history, image_description))
    
    # Generar el audio
    audio_filename = generate_speech(answer)
    audio_url = f"/static/audio/{audio_filename}"
    
    return jsonify({"answer": answer, "audio_file": audio_url, "conversation_history": conversation_history})

#============= Add audio =======================


from app.views.audio_recorder import iniciar_grabacion_con_silencio


@app.route('/transcribe_audio', methods=['POST'])
def transcribe_audio_route():
    print("==> transcribe_audio_route() called")
    file = request.files.get("audio")
    if not file:
        print("==> No audio file provided")
        return jsonify({"error": "No audio file provided"}), 400
    
    audio_data = file.read()
    print(f"==> Audio data size: {len(audio_data)} bytes")

    transcription = None
    try:
        print("==> Starting transcription process...")
        transcription = asyncio.run(transcribe_audio(audio_data))
        print(f"==> Transcription result from API: {transcription}")


        '''
        if transcription:
            # Integrar la transcripción en el modelo GPT-4o
            conversation_history = request.form.get("conversation_history", "[]")
            conversation_history = json.loads(conversation_history)

            # Llamar a GPT-4o con la transcripción
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            answer, conversation_history = loop.run_until_complete(ask_gpt4_async(transcription, conversation_history))

            return jsonify({"transcription": transcription, "answer": answer, "conversation_history": conversation_history})
        else:
            return jsonify({"error": "No transcription obtained."})
    except Exception as e:
        print(f"==> Error during transcription: {e}")
        return jsonify({"error": str(e)}), 500
    '''
        
        if transcription:
            return jsonify({"transcription": transcription})
        else:
            return jsonify({"error": "No transcription obtained."})
    except Exception as e:
        print(f"==> Error during transcription: {e}")
        return jsonify({"error": str(e)}), 500

#=================================================


@app.route('/describe_image', methods=['POST'])
def describe_image_route():
    file = request.files.get("file")
    if file:
        image_data = file.read()
        print(f"Received file for description: {file.filename}, size: {len(image_data)} bytes")
        description = describe_image(image_data)
        return jsonify({"description": description})
    return jsonify({"error": "No file provided"}), 400


@app.route('/send_message', methods=['POST'])
def send_message():
    data = request.json
    message = data.get("message", "")
    conversation_history = []  # Puedes gestionar un historial de conversación aquí si es necesario

    if message:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        answer, conversation_history = loop.run_until_complete(ask_gpt4_async(message, conversation_history))
        return jsonify({"reply": answer})
    else:
        return jsonify({"error": "No message provided."}), 400


def describe_image(image_data):
    api_key = os.getenv("OPENAI_API_KEY")

    # Codificar la imagen a base64
    base64_image = base64.b64encode(image_data).decode('utf-8')

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }

    payload = {
        "model": "gpt-4o",
        #"model": "gpt-4o-mini",
        
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "What’s in this image?"
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{base64_image}"
                        }
                    }
                ]
            }
        ],
        "max_tokens": 300
    }

    response = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)
    response_data = response.json()

    # Asegurarse de que la respuesta tiene el formato correcto
    if 'choices' in response_data and len(response_data['choices']) > 0:
        description = response_data['choices'][0]['message']['content']
    else:
        description = "I'm sorry, but I couldn't describe the image."

    return description



