document.addEventListener("DOMContentLoaded", function() {
    const sendIcon = document.getElementById("send-icon");
    const userInput = document.getElementById("user-input");
    const outputArea = document.getElementById("output-area");
    const fileInput = document.getElementById("file-input");
    const attachIcon = document.getElementById("attach-icon");

    console.log("sendIcon:", sendIcon); // Log para verificar el ícono de envío
    console.log("userInput:", userInput); // Log para verificar el campo de entrada del usuario
    console.log("outputArea:", outputArea); // Log para verificar el área de salida
    console.log("fileInput:", fileInput); // Log para verificar el campo de archivo
    console.log("attachIcon:", attachIcon); // Log para verificar el ícono de adjuntar

    if (!sendIcon || !userInput || !outputArea || !fileInput || !attachIcon) {
        console.error("Some elements are missing. Please check the HTML structure.");
        return;
    }

    let conversationHistory = [];
    

    function sendMessage() {
        const userMessage = userInput.value;
        console.log("User message:", userMessage);  // Log para verificar el mensaje del usuario
        if (userMessage.trim() === "" && fileInput.files.length === 0) return;

        

        const formData = new FormData();
        formData.append("question", userMessage);
        formData.append("conversation_history", JSON.stringify(conversationHistory));

        /*if (fileInput.files.length > 0) {
            formData.append("file", fileInput.files[0]);
            // Reset file input
            fileInput.value = "";
        }*/

        let isImage = false;

        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            formData.append("file", file);
            formData.append("type", "image");
            isImage = true;

            // Mostrar la imagen en la UI
            const fileReader = new FileReader();
            fileReader.onload = function(e) {
                const imgContainer = document.createElement("div");
                imgContainer.classList.add("user-image-container");
                const imgElement = document.createElement("img");
                imgElement.src = e.target.result;
                imgElement.classList.add("user-image");
                outputArea.appendChild(imgElement);
                outputArea.appendChild(imgContainer);
            };
            fileReader.readAsDataURL(file);

            // Reset file input
            fileInput.value = "";
            
        } 

        // Mostrar el mensaje en la UI con 'User' estilizado
        const messageElement = document.createElement("div");
        messageElement.innerHTML = `<span style="color: #007bff; font-weight: bold;">User:</span> ${userMessage}`;
        messageElement.classList.add("user-message");
        outputArea.appendChild(messageElement);

        

        fetch("/ask_arithmetic", {
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            const assistantMessage = data.answer;
            conversationHistory = data.conversation_history;

            // Mostrar el mensaje en la UI con 'Assistant' estilizado
            const assistantMessageElement = document.createElement("div");
            assistantMessageElement.innerHTML = `<span style="color: #8b4513; font-weight: bold;">Assistant:</span> ${assistantMessage}`;
            assistantMessageElement.classList.add("assistant-message");
            outputArea.appendChild(assistantMessageElement);

            console.log("Assistant message:", assistantMessage);  // Log para la respuesta del asistente
        })
        .catch(error => {
            console.error("Error:", error);  // Log para errores
        });

        userInput.value = ""; // Limpiar el campo de entrada
    }

    attachIcon.addEventListener("click", function() {
        fileInput.click();
    });

    sendIcon.addEventListener("click", function() {
        console.log("Send icon clicked");  // Log para el ícono de envío
        sendMessage();
    });

    userInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            console.log("Enter key pressed");  // Log para la tecla Enter
            sendMessage();
        }
    });
});
