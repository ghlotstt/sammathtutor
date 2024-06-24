document.addEventListener("DOMContentLoaded", function() {
    console.log("Marked.js loaded:", typeof marked); // Debería imprimir "function"
    const sendIcon = document.getElementById("send-icon");
    const userInput = document.getElementById("user-input");
    const outputArea = document.getElementById("output-area");
    const fileInput = document.getElementById("file-input");
    const attachIcon = document.getElementById("attach-icon");

    let conversationHistory = [];
    let imageReady = false;
    let loadingIndicator = null;

    function scrollToBottom() {
        outputArea.scrollTop = outputArea.scrollHeight;
    }

    
    function formatAssistantMessage(message) {
        console.log("Original Assistant Message:", message); // Log para verificar el mensaje original
        let formattedMessage;
        try {
            formattedMessage = marked.parse(message);
        } catch (error) {
            console.error("Error while parsing message with marked:", error);
            formattedMessage = message; // Fallback to raw message if parsing fails
        }
        console.log("Formatted Assistant Message:", formattedMessage); // Log para verificar el mensaje formateado
        return formattedMessage;
    }

    function sendMessage() {
        const userMessage = userInput.value;
        if (userMessage.trim() === "" && fileInput.files.length === 0 && !imageReady) return;

        const formData = new FormData();
        let isImage = false;

        if (imageReady) {
            const file = fileInput.files[0];
            formData.append("file", file);
            formData.append("type", "image");
            formData.append("question", userMessage);
            formData.append("conversation_history", JSON.stringify(conversationHistory));
            isImage = true;
            imageReady = false;
        } else {
            formData.append("question", userMessage);
            formData.append("type", "text");
            formData.append("conversation_history", JSON.stringify(conversationHistory));

            const messageElement = document.createElement("div");
            messageElement.innerHTML = `<span style="color: #007bff; font-weight: bold;">User:</span> ${userMessage}`;
            messageElement.classList.add("user-message");
            outputArea.appendChild(messageElement);
            //scrollToBottom();
            setTimeout(scrollToBottom, 100); // Asegurarse de que se desplace hacia abajo después de un breve retraso

        }

        fetch("/ask_arithmetic", {
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log("Response Data:", data); // Log para verificar los datos de respuesta
            //const assistantMessage = data.answer;
            const assistantMessage = formatAssistantMessage(data.answer);
            conversationHistory = data.conversation_history;

            const assistantMessageElement = document.createElement("div");
            assistantMessageElement.innerHTML = `<span style="color: #8b4513; font-weight: bold;">Assistant:</span> ${assistantMessage}`;
            assistantMessageElement.classList.add("assistant-message");
            outputArea.appendChild(assistantMessageElement);
            scrollToBottom();

            // Remover el indicador de carga
            if (loadingIndicator) {
                loadingIndicator.remove();
                loadingIndicator = null;
            }
        })
        .catch(error => {
            console.error("Error:", error);
            if (loadingIndicator) {
                loadingIndicator.remove();
                loadingIndicator = null;
            }
        });

        userInput.value = "";
        sendIcon.classList.remove("blink"); // Asegurarse de que la clase de parpadeo se elimine
    
    }

    attachIcon.addEventListener("click", function() {
        fileInput.click();
    });

    fileInput.addEventListener("change", function() {
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];

            const fileReader = new FileReader();
            fileReader.onload = function(e) {
                const imgContainer = document.createElement("div");
                imgContainer.classList.add("user-image-container");

                const imgElement = document.createElement("img");
                imgElement.src = e.target.result;
                imgElement.classList.add("user-image");

                loadingIndicator = document.createElement("div");
                //loadingIndicator.classList.add("loading-indicator");
                loadingIndicator.classList.add("spinner");

                imgContainer.appendChild(imgElement);
                imgContainer.appendChild(loadingIndicator);
                outputArea.appendChild(imgContainer);
                //scrollToBottom();
                setTimeout(scrollToBottom, 100); // Asegurarse de que se desplace hacia abajo después de un breve retraso


                sendIcon.disabled = true; // Deshabilitar el botón de envío

                // Simular carga completa después de 3 segundos
                setTimeout(function() {
                    loadingIndicator.remove();
                    loadingIndicator = null;
                    sendIcon.disabled = false; // Habilitar el botón de envío
                    sendIcon.classList.add("blink"); // Añadir clase de parpadeo
                    scrollToBottom(); // Desplazarse hacia abajo después de que el indicador de carga se haya removido
                }, 3000);

                imageReady = true;
            };
            fileReader.readAsDataURL(file);
        }
    });

    sendIcon.addEventListener("click", function() {
        sendIcon.classList.remove("blink"); // Quitar clase de parpadeo al enviar
        sendMessage();
    });

    userInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            sendIcon.classList.remove("blink"); // Quitar clase de parpadeo al enviar
            sendMessage();
        }
    });
});
