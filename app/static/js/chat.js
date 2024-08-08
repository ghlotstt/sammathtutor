
import { scrollToBottom, formatAssistantMessage } from './utils.js';

document.addEventListener("DOMContentLoaded", function() {
    console.log("chat.js loaded");
    const sendIcon = document.getElementById("send-icon");
    const userInput = document.getElementById("user-input");
    const outputArea = document.getElementById("output-area");
    const fileInput = document.getElementById("file-input");
    const attachIcon = document.getElementById("attach-icon");

    let conversationHistory = [];
    let imageReady = false;
    let loadingIndicator = null;
    let isVoiceInput = false;
    let currentAudio = null; // Variable para mantener la referencia al objeto de audio actual


    function generateAndPlayAudio(text) {
        console.log(`generateAndPlayAudio called with text: ${text}`); // Log para verificar que se llama la función
        fetch('/generate_speech', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: text })
        })
        .then(response => {
            console.log(`Response status: ${response.status}`); // Log para verificar el estado de la respuesta
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(`TTS response: ${JSON.stringify(data)}`); // Log para verificar los datos de respuesta
            if (data.audio_file) {
                const audioPath = `/static/audio/${data.audio_file}?t=${new Date().getTime()}`; // Añadir un parámetro de consulta único
                console.log(`Playing audio file: ${audioPath}`); // Log para verificar que se está reproduciendo el audio
                
                // Detener el audio anterior si existe
                if (currentAudio) {
                    currentAudio.pause();
                    currentAudio.currentTime = 0; // Reiniciar el tiempo del audio anterior
                }
    
                // Crear un nuevo objeto de audio y reproducirlo
                currentAudio = new Audio(audioPath);
                currentAudio.play();
            } else {
                console.error('Audio generation failed:', data.error);
            }
        })
        .catch(error => {
            console.error('Error generating audio:', error); // Log para errores
        });
    }

    function renderMathMessage(rawMessage) {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = rawMessage;
        MathJax.typesetPromise([tempDiv]).then(() => {
            const renderedMessage = tempDiv.innerHTML;
            const assistantMessageElement = document.createElement("div");
            assistantMessageElement.innerHTML = `<span style="color: #8b4513; font-weight: bold;">Assistant:</span> ${formatAssistantMessage(renderedMessage)}`;
            assistantMessageElement.classList.add("assistant-message");
            outputArea.appendChild(assistantMessageElement);
            scrollToBottom(outputArea);
            if (isVoiceInput) {
                console.log("Voice input detected, generating audio..."); // Verificar detección de entrada de voz
                generateAndPlayAudio(renderedMessage);
                isVoiceInput = false; // Resetear la variable después de generar el audio
            }
        });
    }

    function sendMessage(message) {
        console.log("Sending message:", message);
        const userMessage = message || userInput.value;
        console.log("User message:", userMessage);

        if (userMessage.trim() === "" && fileInput.files.length === 0 && !imageReady) {
            console.log("Empty message, nothing to send.");
            return;
        }

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
            setTimeout(() => scrollToBottom(outputArea), 100);
        }

        fetch("/ask_arithmetic", {
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log("Response Data:", data);
            const assistantMessage = data.answer;
            conversationHistory = data.conversation_history;
            renderMathMessage(assistantMessage);

            //=====Implementation count tokens =========================


            // Mostrar los conteos de tokens en la interfaz
            const tokenInfo = document.createElement("div");
            tokenInfo.innerHTML = `
                <span style="color: #28a745; font-weight: bold;">Token Count:</span>
                <br><span style="color: #17a2b8;">Question Tokens:</span> ${data.question_token_count}
                <br><span style="color: #17a2b8;">Answer Tokens:</span> ${data.answer_token_count}
            `;
            tokenInfo.classList.add("token-info");
            outputArea.appendChild(tokenInfo);
            setTimeout(() => scrollToBottom(outputArea), 100);

            //===========================================================

            
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
        sendIcon.classList.remove("blink");
    }

    window.sendMessage = sendMessage;

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
                loadingIndicator.classList.add("spinner");

                imgContainer.appendChild(imgElement);
                imgContainer.appendChild(loadingIndicator);
                outputArea.appendChild(imgContainer);
                setTimeout(() => scrollToBottom(outputArea), 100);

                sendIcon.disabled = true;

                setTimeout(function() {
                    loadingIndicator.remove();
                    loadingIndicator = null;
                    sendIcon.disabled = false;
                    sendIcon.classList.add("blink");
                    scrollToBottom(outputArea);
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
        sendIcon.classList.remove("blink");
        sendMessage();
    });

    userInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            sendIcon.classList.remove("blink");
            sendMessage();
        }
    });

    document.addEventListener('transcriptionReceived', function(event) {
        const transcription = event.detail;
        console.log("Transcription received:", transcription);
        userInput.value = transcription;
        isVoiceInput = true; // Asegurar que `isVoiceInput` se establezca en `true`
        sendMessage(transcription);
    });
});















