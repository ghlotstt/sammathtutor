from flask import render_template, request, jsonify, current_app as app
import asyncio
from app.views.arithmetic import ask_gpt4_async

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
