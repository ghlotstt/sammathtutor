document.addEventListener("DOMContentLoaded", function() {
    const sendButton = document.getElementById("send-button");
    const userInput = document.getElementById("user-input");
    const outputArea = document.getElementById("output-area");

    console.log("sendButton:", sendButton); // Log para verificar el botón de envío
    console.log("userInput:", userInput); // Log para verificar el campo de entrada del usuario
    console.log("outputArea:", outputArea); // Log para verificar el área de salida

    if (!sendButton || !userInput || !outputArea) {
        console.error("Some elements are missing. Please check the HTML structure.");
        return;
    }

    let conversationHistory = [];

    function sendMessage() {
        const userMessage = userInput.value;
        console.log("User message:", userMessage);  // Log para verificar el mensaje del usuario
        if (userMessage.trim() === "") return;

        // Mostrar el mensaje en la UI
        const messageElement = document.createElement("div");
        messageElement.textContent = `User: ${userMessage}`;
        messageElement.classList.add("user-message");
        outputArea.appendChild(messageElement);

        fetch("/ask_arithmetic", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                question: userMessage,
                conversation_history: conversationHistory
            })
        })
        .then(response => response.json())
        .then(data => {
            const assistantMessage = data.answer;
            conversationHistory = data.conversation_history;

            const assistantMessageElement = document.createElement("div");
            assistantMessageElement.textContent = `Assistant: ${assistantMessage}`;
            assistantMessageElement.classList.add("assistant-message");
            outputArea.appendChild(assistantMessageElement);

            console.log("Assistant message:", assistantMessage);  // Log para la respuesta del asistente
        })
        .catch(error => {
            console.error("Error:", error);  // Log para errores
        });

        userInput.value = ""; // Limpiar el campo de entrada
    }

    sendButton.addEventListener("click", function() {
        console.log("Send button clicked");  // Log para el botón de envío
        sendMessage();
    });

    userInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            console.log("Enter key pressed");  // Log para la tecla Enter
            sendMessage();
        }
    });
});
