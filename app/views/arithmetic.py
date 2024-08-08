
import openai
import os
from dotenv import load_dotenv
import asyncio
import nest_asyncio
from openai import AsyncOpenAI
from .token_utils import count_tokens  # Importar la función de conteo de tokens


# Aplicar nest_asyncio
nest_asyncio.apply()

# Cargar la clave API de OpenAI desde el archivo .env
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

client = AsyncOpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
)



#======================================================================
'''
# Mensaje inicial del sistema enfocado en aritmética
initial_system_prompt = """
You are an arithmetic tutor. Your primary goal is to help students understand mathematical problems using the Socratic method. Always guide the student with questions that lead them to find the answers on their own. Encourage critical thinking and problem-solving skills. Avoid giving the final answer directly; instead, guide the student to the answer through carefully designed questions. If a question is not related to arithmetic, kindly remind the student to ask only arithmetic-related questions. Here are some guidelines to follow:
1. Ask probing questions that encourage the student to think critically.
2. Break down complex problems into smaller, manageable steps.
3. If the student asks for the answer, respond with a question that guides them toward finding the answer themselves.
4. Provide hints or partial information that prompts the student to think and solve the next step.
5. Encourage the student to explain their reasoning and thought process.
6. Reinforce the learning objective and help the student understand the underlying concepts.
"""

'''
#========================================================================
# Mensaje inicial del sistema enfocado en aritmética
initial_system_prompt = """
You are a friendly math tutor for students aged 10 to 14. Your primary goal is to help them understand arithmetic problems using the Socratic method. Always guide the student with questions that lead them to find the answers on their own. Encourage critical thinking, logical thinking, and problem-solving skills. Avoid giving the final answer directly; instead, guide the student to the answer through carefully designed questions. If a question is not related to arithmetic, kindly remind the student to ask only arithmetic-related questions. Here are some guidelines to follow:
1. Use a friendly and approachable tone, like a helpful friend.
2. Ask simple and clear questions that encourage the student to think critically and logically.
3. Break down complex problems into smaller, easy-to-understand steps.
4. If the student asks for the answer, respond with a question that gently guides them toward finding the answer themselves.
5. Provide hints or partial information that prompts the student to think and solve the next step.
6. Encourage the student to explain their reasoning and thought process in their own words.
7. Reinforce the learning objective and help the student understand the underlying concepts in a fun and engaging way.

"""





#"""
#You are an arithmetic tutor. Your primary goal is to help students understand mathematical problems using the Socratic method. Always guide the student with questions that lead them to find the answers on their own. Encourage critical thinking and problem-solving skills. Avoid giving the final answer directly; instead, guide the student to the answer through carefully designed questions. If a question is not related to arithmetic, kindly remind the student to ask only arithmetic-related questions.
#"""


#===============================================================
'''
# Función para obtener el mensaje inicial enfocado en aritmética
def get_initial_prompt():
    return """
    Sure! Let's work through an arithmetic problem step by step.

    1. Can you identify the numbers and operations in the problem?
    2. What do you think is the first step to solve this problem?
    3. Let's simplify the problem step by step. What do you get after the first operation?
 
    """
'''
#==================================================================
# Función para obtener el mensaje inicial enfocado en aritmética
'''
def get_initial_prompt():
    return """
    Sure! Let's work through an arithmetic problem step by step.

    1. Can you identify the numbers and operations in the problem?
    2. What do you think is the first step to solve this problem?
    3. Let's simplify the problem step by step. What do you get after the first operation?
    """
'''
def get_initial_prompt():
    return """
    Sure! Let's work through an arithmetic problem step by step.

    
    Let's simplify the problem step by step. What do you get after the first operation?
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

    # Añadir recordatorio interno al mensaje del sistema
    internal_reminder = "Remember to guide the student through critical thinking without giving the final answer. Ask guiding questions and break down the problem into smaller steps."
    messages.append({"role": "system", "content": internal_reminder})

    print("Messages to send:", messages)  # Log para los mensajes enviados

    response = await client.chat.completions.create(
        model="gpt-4o",
        #model="gpt-4o-mini",
        
       
        messages=messages
    )

    answer = response.choices[0].message.content
    print("Response from OpenAI:", answer)  # Log para la respuesta recibida
    

    # Contar los tokens en la respuesta
    token_count = count_tokens(answer)
    print(f"Token count: {token_count}")
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
            model="gpt-4o",
            #model="gpt-4o-mini",
            messages=messages
        )
        answer = response.choices[0].message.content
        print("Follow-up response from OpenAI:", answer)  # Log para la respuesta de seguimiento

        # Contar los tokens en la respuesta
        token_count = count_tokens(answer)
        print(f"Token count: {token_count}")
        

    conversation_history.append({"user": question, "assistant": answer})
    
    return answer, conversation_history

   


    