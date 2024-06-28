import openai
import os
from dotenv import load_dotenv
import asyncio
import nest_asyncio
from openai import AsyncOpenAI


# Aplicar nest_asyncio
nest_asyncio.apply()

# Cargar la clave API de OpenAI desde el archivo .env
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

client = AsyncOpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
)

# Mensaje inicial del sistema enfocado en aritmética
initial_system_prompt = """
You are an arithmetic tutor. Your primary goal is to help students understand mathematical problems using the Socratic method. Always guide the student with questions that lead them to find the answers on their own. Encourage critical thinking and problem-solving skills. Avoid giving the final answer directly; instead, guide the student to the answer through carefully designed questions. If a question is not related to arithmetic, kindly remind the student to ask only arithmetic-related questions.
"""

# Función para obtener el mensaje inicial enfocado en aritmética
def get_initial_prompt():
    return """
    Sure! Let's work through an arithmetic problem step by step.

    1. Can you identify the numbers and operations in the problem?
    2. What do you think is the first step to solve this problem?
    3. Let's simplify the problem step by step. What do you get after the first operation?
    """

# Función para manejar las preguntas y respuestas
async def ask_gpt4_async(question, conversation_history, image_description=None):
    print("ask_gpt4_async called with question:", question)  # Log para la pregunta recibida

    if image_description:
        question = f"Image description: {image_description}. {question}"

    initial_prompt = get_initial_prompt()
    print("Initial prompt:", initial_prompt)  # Log para el mensaje inicial

    messages = [
        {
            "role": "system",
            "content": initial_system_prompt
        },
        {
            "role": "assistant",
            "content": initial_prompt
        }
    ]

    for entry in conversation_history:
        if "user" in entry:
            messages.append({"role": "user", "content": entry["user"]})
        if "assistant" in entry:
            messages.append({"role": "assistant", "content": entry["assistant"]})
    messages.append({"role": "user", "content": question})

    print("Messages to send:", messages)  # Log para los mensajes enviados

    response = await client.chat.completions.create(
        model="gpt-4o",
        messages=messages
    )

    answer = response.choices[0].message.content
    print("Response from OpenAI:", answer)  # Log para la respuesta recibida
    conversation_history.append({"user": question, "assistant": answer})
    
    return answer, conversation_history

