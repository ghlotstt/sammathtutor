from flask import render_template, request, jsonify, current_app as app
import asyncio
from app.views.arithmetic import ask_gpt4_async
import os
import json
from werkzeug.utils import secure_filename

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

'''
@app.route('/ask_arithmetic', methods=['POST'])
def ask_arithmetic():
    question = request.form.get("question")
    conversation_history = request.form.get("conversation_history")
    file = request.files.get("file")

    if conversation_history:
        conversation_history = eval(conversation_history)  # Convertir de string a lista

    print("Received question:", question)  # Log para la pregunta recibida
    print("Conversation history:", conversation_history)  # Log para la historia de la conversación

    if file:
        print("Received file:", file.filename)  # Log para el archivo recibido
        # Aquí puedes manejar el archivo como sea necesario para tu aplicación

    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    answer, conversation_history = loop.run_until_complete(ask_gpt4_async(question, conversation_history))
    
    print("Generated answer:", answer)  # Log para la respuesta generada
    return jsonify({"answer": answer, "conversation_history": conversation_history})
'''

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
        filename = secure_filename(file.filename)
        image_data = file.read()
        print(f"Received file: {filename}, size: {len(image_data)} bytes")
        
        # Aquí llamas al modelo de AI para que describa la imagen
        image_description = describe_image(image_data)

    print("Received question:", question)
    print("Conversation history:", conversation_history)

    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    answer, conversation_history = loop.run_until_complete(ask_gpt4_async(question, conversation_history, image_description))
    
    return jsonify({"answer": answer, "conversation_history": conversation_history})

def describe_image(image_data):
    # Aquí iría la llamada al modelo de AI para describir la imagen
    # Por ejemplo, usando OpenAI:
    description = "This is a placeholder description of the image."
    return description