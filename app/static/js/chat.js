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
        // Convert line breaks to <br> tags
        message = message.replace(/\n/g, "<br>");
        // Convert numbered lists
        message = message.replace(/(\d+\.)\s/g, "$1&nbsp;");
        // Convert bullet points
        message = message.replace(/-\s/g, "&nbsp;&nbsp;&nbsp;&nbsp;- ");
        // Ensure consistent formatting for sections and lists
        message = message.replace(/(\*\*.+?\*\*)/g, "<strong>$1</strong>");
        message = message.replace(/<strong>\*\*(.+?)\*\*<\/strong>/g, "<strong>$1</strong>");
        message = message.replace(/###\s/g, "<h3>").replace(/(<br>)+/g, "<br>");
        return `<div>${message}</div>`;
    }

    function renderMathMessage(rawMessage) {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = rawMessage;
        MathJax.typesetPromise([tempDiv]).then(() => {
            const renderedMessage = tempDiv.innerHTML;
            const assistantMessageElement = document.createElement("div");
            //assistantMessageElement.innerHTML = `<span style="color: #8b4513; font-weight: bold;">Assistant:</span> ${renderedMessage}`;
            assistantMessageElement.innerHTML = `<span style="color: #8b4513; font-weight: bold;">Assistant:</span> ${formatAssistantMessage(renderedMessage)}`;
            assistantMessageElement.classList.add("assistant-message");
            outputArea.appendChild(assistantMessageElement);
            scrollToBottom();
        });
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
            const assistantMessage = data.answer;  
            conversationHistory = data.conversation_history;


             // Llamar a la función de renderizado en lugar de insertar directamente el mensaje
             renderMathMessage(assistantMessage);

            // nota eta parte si se descomenta se tiene que eliminar lafincion `renderMathMessage(assistantMessage);` y la funcion completa arriba de `renderMathMessage`
            /* 
            const assistantMessageElement = document.createElement("div");
            assistantMessageElement.innerHTML = `<span style="color: #8b4513; font-weight: bold;">Assistant:</span> ${assistantMessage}`;
            //assistantMessageElement.innerHTML = `<span style="color: #8b4513; font-weight: bold;">Assistant:</span> ${formatAssistantMessage(assistantMessage)}`;
            assistantMessageElement.classList.add("assistant-message");
            outputArea.appendChild(assistantMessageElement);
            scrollToBottom();*/
            //MathJax.typeset();
           

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
                describeImage(file).then(description => {
                    sendMessage(description);
                });
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
