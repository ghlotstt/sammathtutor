from flask import render_template, request, jsonify, current_app as app
import asyncio
from app.views.arithmetic import ask_gpt4_async
from app.views.algebra import ask_gpt4_algebra_async
from app.views.geometry import ask_gpt4_geometry_async  
import os
import json
from werkzeug.utils import secure_filename
import base64
import requests

from app.views.stt import transcribe_audio
from app.views.stt_algebra import transcribe_audio_algebra
from app.views.stt_geometry import transcribe_audio_geometry

from app.views.tts import generate_speech  # Asegúrate de que `tts.py` esté en el directorio correcto
from app.views.tts_algebra import generate_speech_algebra  # Asegúrate de que `tts.py` esté en el directorio correcto
from app.views.tts_geometry import generate_speech_geometry  # Asegúrate de que `tts.py` esté en el directorio correcto


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

@app.route('/algebra')
def algebra():
    return render_template('subjects/algebra.html')

@app.route('/geometry')
def geometry():
    return render_template('subjects/geometry.html')

@app.route('/trigonometry')
def trigonometry():
    return render_template('subjects/trigonometry.html')

@app.route('/calculus')
def calculus():
    return render_template('subjects/calculus.html')

@app.route('/transcribe_audio', methods=['POST'])
def transcribe_audio_route():
    return transcribe_audio()
        
@app.route('/transcribe_audio_algebra', methods=['POST'])
def transcribe_audio_algebra_route():
    return transcribe_audio_algebra()

@app.route('/transcribe_audio_geometry', methods=['POST'])
def transcribe_audio_geometry_route():
    return transcribe_audio_geometry()

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

#============ Algebra==============================

@app.route('/ask_algebra', methods=['POST'])
def ask_algebra():
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
    answer, conversation_history = loop.run_until_complete(ask_gpt4_algebra_async(question, conversation_history, image_description))
    
    return jsonify({"answer": answer, "conversation_history": conversation_history})


@app.route('/ask_geometry', methods=['POST'])
def ask_geometry():
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
    answer, conversation_history = loop.run_until_complete(ask_gpt4_geometry_async(question, conversation_history, image_description))
    
    return jsonify({"answer": answer, "conversation_history": conversation_history})



#===========================================================================

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






@app.route('/generate_speech', methods=['POST'])
def generate_speech_route():
    try:
        data = request.get_json()
        print(f"Received text for TTS: {data}")  # Verifica que los datos se reciban correctamente
        text = data.get('text')
        if not text:
            print("No text provided")
            return jsonify(error="No text provided"), 400

        audio_file = generate_speech(text)
        if audio_file:
            print(f"Generated audio file: {audio_file}")
            return jsonify(audio_file=audio_file)
        else:
            print("Failed to generate audio")
            return jsonify(error="Failed to generate speech"), 500
    except Exception as e:
        print(f"Error in generate_speech_route: {e}")
        return jsonify(error=str(e)), 500
    

@app.route('/generate_speech_algebra', methods=['POST'])
def generate_speech_algebra_route():
    try:
        data = request.get_json()
        print(f"Received text for TTS: {data}")  # Verifica que los datos se reciban correctamente
        text = data.get('text')
        if not text:
            print("No text provided")
            return jsonify(error="No text provided"), 400

        audio_file = generate_speech_algebra(text)
        if audio_file:
            print(f"Generated audio file: {audio_file}")
            return jsonify(audio_file=audio_file)
        else:
            print("Failed to generate audio")
            return jsonify(error="Failed to generate speech"), 500
    except Exception as e:
        print(f"Error in generate_speech_algebra_route: {e}")
        return jsonify(error=str(e)), 500
    

@app.route('/generate_speech_geometry', methods=['POST'])
def generate_speech_geometry_route():
    try:
        data = request.get_json()
        print(f"Received text for TTS: {data}")  # Verifica que los datos se reciban correctamente
        text = data.get('text')
        if not text:
            print("No text provided")
            return jsonify(error="No text provided"), 400

        audio_file = generate_speech_geometry(text)
        if audio_file:
            print(f"Generated audio file: {audio_file}")
            return jsonify(audio_file=audio_file)
        else:
            print("Failed to generate audio")
            return jsonify(error="Failed to generate speech"), 500
    except Exception as e:
        print(f"Error in generate_speech_geometry_route: {e}")
        return jsonify(error=str(e)), 500