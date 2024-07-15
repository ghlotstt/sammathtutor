/*
document.addEventListener("DOMContentLoaded", function() {
    const voiceIcon = document.getElementById("voice-icon");
    const userInput = document.getElementById("user-input");
    
    let recognitionActive = false;
    let socket;
    let recognition; // Declarar reconocimiento fuera de la función para reiniciarlo correctamente

    function startRecognition() {
        if (!socket || socket.readyState === WebSocket.CLOSED) {
            socket = new WebSocket('ws://localhost:8080');

            socket.onopen = function() {
                console.log('WebSocket connection established');
            };

            socket.onclose = function() {
                console.log('WebSocket connection closed');
            };

            socket.onerror = function(error) {
                console.error('WebSocket error:', error);
            };

            socket.onmessage = function(event) {
                console.log('Received from server:', event.data);
                userInput.value = event.data;
            };
        }

        recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = 'en-US';
        recognition.interimResults = false;

        recognition.onstart = function() {
            console.log('Voice recognition started.');
            voiceIcon.classList.add('active'); // Añadir clase activa
        };

        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            console.log('Recognized text:', transcript);
            userInput.value = transcript;
            // Envía el mensaje después de reconocer la voz

            // Enviar el audio al servidor WebSocket
            if (socket && socket.readyState === WebSocket.OPEN) {
                socket.send(transcript);
            } else {
                console.error('WebSocket is not open. Ready state:', socket.readyState);
            }
        };

        recognition.onerror = function(event) {
            console.error('Recognition error:', event.error);
            if (event.error === 'no-speech') {
                restartRecognition();
            }
        };

        recognition.onend = function() {
            console.log('Voice recognition ended.');
            voiceIcon.classList.remove('active'); // Quitar clase activa
            if (recognitionActive) {
                restartRecognition();
            }
        };

        recognition.start();
        recognitionActive = true;
    }

    function restartRecognition() {
        if (recognitionActive) {
            console.log('Restarting recognition...');
            recognition.stop(); // Asegurarse de detener antes de reiniciar
            setTimeout(() => {
                if (recognitionActive) {
                    startRecognition();
                }
            }, 1000); // Esperar un segundo antes de reiniciar para evitar errores de estado
        }
    }

    voiceIcon.addEventListener("click", function() {
        if (recognitionActive) {
            recognitionActive = false;
            recognition.stop();
        } else {
            recognitionActive = true;
            startRecognition();
        }
    });
});
*/

//=======================================================================

document.addEventListener("DOMContentLoaded", function() {
    const voiceIcon = document.getElementById("voice-icon");
    const userInput = document.getElementById("user-input");
    const sendIcon = document.getElementById("send-icon");
    const outputArea = document.getElementById("output-area");

    let recognitionActive = false;
    let socket;
    let recognition;
    let imageReady = false;
    let conversationHistory = [];

    function startRecognition() {
        if (!socket || socket.readyState === WebSocket.CLOSED) {
            socket = new WebSocket('ws://localhost:8080');

            socket.onopen = function() {
                console.log('WebSocket connection established');
            };

            socket.onclose = function() {
                console.log('WebSocket connection closed');
            };

            socket.onerror = function(error) {
                console.error('WebSocket error:', error);
            };

            socket.onmessage = function(event) {
                console.log('Received from server:', event.data);
                userInput.value = event.data;
            };
        }

        recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = 'en-US';
        recognition.interimResults = false;

        recognition.onstart = function() {
            console.log('Voice recognition started.');
            voiceIcon.classList.add('active');
        };

        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            console.log('Recognized text:', transcript);
            userInput.value = transcript;
        };

        recognition.onerror = function(event) {
            console.error('Recognition error:', event.error);
            if (event.error === 'no-speech') {
                console.log('No speech detected.');
            }
        };

        recognition.onend = function() {
            console.log('Voice recognition ended.');
            voiceIcon.classList.remove('active');
            if (recognitionActive) {
                recognitionActive = false;
                if (userInput.value.trim() !== "") {
                    //sendMessage();
                    setTimeout(sendMessage, 1000);
                }
            }
        };


        /*recognition.onend = function() {
            console.log('Voice recognition ended.');
            voiceIcon.classList.remove('active');
            if (recognitionActive) {
                recognitionActive = false;
                if (userInput.value.trim() !== "") {
                    // Añadir un retraso más largo y verificar si la frase parece completa
                    setTimeout(() => {
                        if (isPhraseComplete(finalTranscript)) {
                            sendMessage();
                        } else {
                            startRecognition(); // Reactivar si no parece completa
                        }
                    }, 1000);
                }
            }
        };*/

        recognition.start();
        recognitionActive = true;
    }

    function stopRecognition() {
        if (recognitionActive) {
            recognitionActive = false;
            recognition.stop();
        }
    }

    function sendMessage() {
        const userMessage = userInput.value;
        if (userMessage.trim() === "" && !imageReady) return;

        const userMessageElement = document.createElement("div");
        userMessageElement.innerHTML = `<span style="color: #007bff; font-weight: bold;">User:</span> ${userMessage}`;
        userMessageElement.classList.add("user-message");
        outputArea.appendChild(userMessageElement);
        scrollToBottom();

        const formData = new FormData();
        formData.append("question", userMessage);
        formData.append("type", "text");
        formData.append("conversation_history", JSON.stringify(conversationHistory));

        fetch("/ask_arithmetic", {
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log("Response Data:", data);
            //const assistantMessage = data.answer;
            const assistantMessage = formatAssistantMessage(data.answer);  
            conversationHistory = data.conversation_history;

            renderMathMessage(assistantMessage);
            // Reactivar el reconocimiento de voz después de que el modelo haya respondido
            startRecognition();
        })
        .catch(error => {
            console.error("Error:", error);
            // Reactivar el reconocimiento de voz incluso si hay un error
            startRecognition();
        });

        userInput.value = "";
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

    function renderMathMessage(message) {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = message;
        MathJax.typesetPromise([tempDiv]).then(() => {
            const renderedMessage = tempDiv.innerHTML;
            const assistantMessageElement = document.createElement("div");
            assistantMessageElement.innerHTML = `<span style="color: #8b4513; font-weight: bold;">Assistant:</span> ${renderedMessage}`;
            assistantMessageElement.classList.add("assistant-message");
            outputArea.appendChild(assistantMessageElement);
            scrollToBottom();
        });
    }

    function scrollToBottom() {
        outputArea.scrollTop = outputArea.scrollHeight;
    }

    voiceIcon.addEventListener("click", function() {
        if (recognitionActive) {
            stopRecognition();
        } else {
            startRecognition();
        }
    });

    // Enviar el mensaje al presionar Enter en el área de prompt
    userInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            sendMessage();
        }
    });
});










