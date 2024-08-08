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
You are an geometry tutor. Your primary goal is to help students understand mathematical problems using the Socratic method. Always guide the student with questions that lead them to find the answers on their own. Encourage critical thinking and problem-solving skills. Avoid giving the final answer directly; instead, guide the student to the answer through carefully designed questions. If a question is not related to geometry, kindly remind the student to ask only geometry-related questions. Here are some guidelines to follow:
1. Ask probing questions that encourage the student to think critically.
2. Break down complex problems into smaller, manageable steps.
3. If the student asks for the answer, respond with a question that guides them toward finding the answer themselves.
4. Provide hints or partial information that prompts the student to think and solve the next step.
5. Encourage the student to explain their reasoning and thought process.
6. Reinforce the learning objective and help the student understand the underlying concepts.
"""

#"""
#You are an geometry tutor. Your primary goal is to help students understand mathematical problems using the Socratic method. Always guide the student with questions that lead them to find the answers on their own. Encourage critical thinking and problem-solving skills. Avoid giving the final answer directly; instead, guide the student to the answer through carefully designed questions. If a question is not related to geometry, kindly remind the student to ask only geometry-related questions.
#"""


# Función para obtener el mensaje inicial enfocado en aritmética
def get_initial_prompt():
    return """
    Sure! Let's work through an geometry problem step by step.

    1. Can you identify the numbers and operations in the problem?
    2. What do you think is the first step to solve this problem?
    3. Let's simplify the problem step by step. What do you get after the first operation?
    """

# Función para manejar las preguntas y respuestas
async def ask_gpt4_geometry_async(question, conversation_history, image_description=None):
    print("ask_gpt4_geometry_async called with question:", question)
    
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

    # Añadir recordatorio interno al mensaje del sistema
    internal_reminder = "Remember to guide the student through critical thinking without giving the final answer. Ask guiding questions and break down the problem into smaller steps."
    messages.append({"role": "system", "content": internal_reminder})

    print("Messages to send:", messages)  # Log para los mensajes enviados

    response = await client.chat.completions.create(
        #model="gpt-4o",
        model="gpt-4o-mini",
       
        messages=messages
    )

    answer = response.choices[0].message.content
    print("Response from OpenAI:", answer)  # Log para la respuesta recibida
    
    #conversation_history.append({"user": question, "assistant": answer})
    
    #return answer, conversation_history

    # Verificar si la respuesta da la solución directa y reformular si es necesario
    if any(keyword in answer.lower() for keyword in ["the answer is", "equals", "result is", "final answer", "therefore", "so the answer is"]):
        follow_up_prompt = """
        Please rephrase your response as a guiding question or hint without giving the final answer directly. 
        Use the Socratic method to ask probing questions that encourage the student to think critically.
        """
        messages.append({"role": "user", "content": follow_up_prompt})
        response = await client.chat.completions.create(
            #model="gpt-4o",
            model="gpt-4o-mini",
            messages=messages
        )
        answer = response.choices[0].message.content
        print("Follow-up response from OpenAI:", answer)  # Log para la respuesta de seguimiento

    
    conversation_history.append({"user": question, "assistant": answer})
    
    return answer, conversation_history
'''
    # Añadir lógica para asegurar que no se da una respuesta directa
    if any(keyword in answer.lower() for keyword in ["the answer is", "equals", "result is", "final answer", "therefore", "so the answer is"]):
        follow_up_prompt = """
        Remember, your goal is to help the student find the answer themselves. Please rephrase your response as a guiding question or hint without giving the final answer directly. 
        Use the Socratic method to ask probing questions that encourage the student to think critically.
        """
        
        
        #"""
        #Remember, your goal is to help the student find the answer themselves. Please rephrase your response as a guiding question or hint without giving the final answer directly.
        #"""
        
        messages.append({"role": "user", "content": follow_up_prompt})
        response = await client.chat.completions.create(
            model="gpt-4o",    
            messages=messages
        )
        answer = response.choices[0].message.content
        print("Follow-up response from OpenAI:", answer)  # Log para la respuesta de seguimiento
    
'''
    # Reforzar instrucciones en cada respuesta generada
    #answer = f"{answer}\n\nRemember, your goal is to find the answer yourself. I'm here to guide you through the process step by step."
    #answer = f"{answer}\n\nRemember, your goal is to find the answer yourself through critical thinking. I'm here to guide you through the process step by step. Let's break it down: What do you think is the next step?"


    #conversation_history.append({"user": question, "assistant": answer})
    
    #return answer, conversation_history

'''
    # Reforzar instrucciones de forma interna
    internal_reminder = "Remember to guide the student through critical thinking without giving the final answer. Ask guiding questions and break down the problem into smaller steps."

    # Generar la respuesta con el recordatorio interno (no visible para el usuario)
    messages.append({"role": "system", "content": internal_reminder})
    response = await client.chat.completions.create(
        model="gpt-4o",
        messages=messages
    )
    answer_with_internal_reminder = response.choices[0].message.content

    conversation_history.append({"user": question, "assistant": answer_with_internal_reminder})
    
    return answer_with_internal_reminder, conversation_history
'''

    