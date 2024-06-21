from flask import render_template, current_app as app
from flask import request, jsonify


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



@app.route('/chat', methods=['POST'])
def chat():
    user_message = request.json.get('message')
    # Aquí puedes integrar tu lógica de IA para responder
    response_message = "This is a dynamic response from the arithmetic tutor."
    return jsonify({'message': response_message})
