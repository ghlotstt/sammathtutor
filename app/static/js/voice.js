/*document.addEventListener("DOMContentLoaded", function() {
    const voiceIcon = document.getElementById("voice-icon");
    const userInput = document.getElementById("user-input");
    const sendIcon = document.getElementById("send-icon");
    const outputArea = document.getElementById("output-area");

    let recognitionActive = false;
    let socket;
    let recognition;
    let imageReady = false;
    let conversationHistory = [];
    let finalTranscript = '';
    //let autoRestartRecognition = false; // Variable para controlar el reinicio automático

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
            finalTranscript = event.results[0][0].transcript;
            console.log('Recognized text:', finalTranscript);
            userInput.value = finalTranscript;
        };

        

        recognition.onerror = function(event) {
            console.error('Recognition error:', event.error);
            if (event.error === 'no-speech') {
                console.log('No speech detected.');
                if (autoRestartRecognition) {
                    startRecognition();
                }
            }
        };

        


        recognition.onend = function() {
            console.log('Voice recognition ended.');
            voiceIcon.classList.remove('active');
            if (recognitionActive) {
                recognitionActive = false;
                if (userInput.value.trim() !== "") {
                    setTimeout(sendMessage, 1000);
                } else {
                    // Reactivar el reconocimiento de voz si no hay entrada de voz
                    startRecognition();
                }
            }
        };



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


        stopRecognition(); // Detener el reconocimiento antes de enviar la solicitud

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
            //startRecognition();
            setTimeout(startRecognition, 2000); // Reactivar el reconocimiento de voz después de un retraso
        })
        .catch(error => {
            console.error("Error:", error);
            // Reactivar el reconocimiento de voz incluso si hay un error
            //startRecognition();
            setTimeout(startRecognition, 2000); // Reactivar el reconocimiento de voz incluso si hay un error
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
            autoRestartRecognition = false; // Desactivar reinicio automático
            stopRecognition();
        } else {
            autoRestartRecognition = true; // Activar reinicio automático
            startRecognition();
        }
    });

    // Enviar el mensaje al presionar Enter en el área de prompt
    userInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            sendMessage();
        }
    });
});*/

//==================================================================

/*document.addEventListener("DOMContentLoaded", function() {
    const voiceIcon = document.getElementById("voice-icon");
    const userInput = document.getElementById("user-input");
    const sendIcon = document.getElementById("send-icon");
    const outputArea = document.getElementById("output-area");
    const imageInput = document.getElementById("image-input"); // Asegúrate de tener un input para la imagen

    let recognitionActive = false;
    let socket;
    let recognition;
    let imageReady = false;
    let conversationHistory = [];
    let finalTranscript = '';
    let autoRestartRecognition = false; // Variable para controlar el reinicio automático

    function initializeWebSocket() {
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
    }

    function startRecognition() {
        if (!recognitionActive) {
            initializeWebSocket();

            recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
            recognition.lang = 'en-US';
            recognition.interimResults = false;

            recognition.onstart = function() {
                console.log('Voice recognition started.');
                voiceIcon.classList.add('active');
            };

            recognition.onresult = function(event) {
                finalTranscript = event.results[0][0].transcript;
                console.log('Recognized text:', finalTranscript);
                userInput.value = finalTranscript;
            };

            recognition.onerror = function(event) {
                console.error('Recognition error:', event.error);
                if (event.error === 'no-speech' || event.error === 'network') {
                    console.log('No speech detected or network error.');
                    if (autoRestartRecognition) {
                        startRecognition();
                    }
                }
            };

            recognition.onend = function() {
                console.log('Voice recognition ended.');
                voiceIcon.classList.remove('active');
                if (recognitionActive) {
                    recognitionActive = false;
                    if (userInput.value.trim() !== "") {
                        setTimeout(sendMessage, 1000);
                    } else if (autoRestartRecognition) {
                        startRecognition(); // Reiniciar si no hay entrada de voz
                    }
                }
            };

            recognition.start();
            recognitionActive = true;
        }
    }

    function stopRecognition() {
        if (recognitionActive) {
            recognitionActive = false;
            if (recognition) {
                recognition.stop();
            }
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

        stopRecognition(); // Detener el reconocimiento antes de enviar la solicitud

        fetch("/ask_arithmetic", {
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log("Response Data:", data);
            const assistantMessage = formatAssistantMessage(data.answer);
            conversationHistory = data.conversation_history;

            renderMathMessage(assistantMessage);

            if (data.audio_file) {
                const audioUrl = `${data.audio_file}?t=${new Date().getTime()}`;
                console.log("Playing audio file:", audioUrl);  // Verifica la URL del archivo de audio
                playAudio(audioUrl);
            } else {
                setTimeout(startRecognition, 2000); // Reactivar el reconocimiento de voz después de un retraso
            }
        })
        .catch(error => {
            console.error("Error:", error);
            setTimeout(startRecognition, 2000); // Reactivar el reconocimiento de voz incluso si hay un error
        });

        userInput.value = "";
    }

    function playAudio(audioFilePath) {
        stopRecognition(); // Asegúrate de detener el reconocimiento de voz antes de reproducir el audio
        const audio = new Audio(audioFilePath);
        audio.play();
        audio.addEventListener('ended', function() {
            console.log('Audio playback ended.');
            setTimeout(startRecognition, 1000); // Reactivar el reconocimiento de voz después de un breve retraso
        });
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
            autoRestartRecognition = false; // Desactivar reinicio automático
            stopRecognition();
        } else {
            autoRestartRecognition = true; // Activar reinicio automático
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

// Manejo de carga de imágenes
imageInput.addEventListener("change", function() {
    const file = imageInput.files[0];
    if (file) {
        stopRecognition(); // Detener el reconocimiento antes de enviar la imagen
        const formData = new FormData();
        formData.append("file", file);

        fetch("/describe_image", {
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log("Image Description Response Data:", data);
            const imageDescription = data.description;
            userInput.value = imageDescription;
            const userMessageElement = document.createElement("div");
            userMessageElement.innerHTML = `<span style="color: #007bff; font-weight: bold;">User:</span> ${imageDescription}`;
            userMessageElement.classList.add("user-message");
            outputArea.appendChild(userMessageElement);
            scrollToBottom();

            // Simulate sending message with image description
            sendMessage();
        })
        .catch(error => {
            console.error("Error:", error);
            setTimeout(startRecognition, 2000); // Reactivar el reconocimiento de voz incluso si hay un error
        });
    }
});*/


/*document.addEventListener("DOMContentLoaded", function() {
    const voiceIcon = document.getElementById("voice-icon");
    const userInput = document.getElementById("user-input");
    const sendIcon = document.getElementById("send-icon");
    const outputArea = document.getElementById("output-area");
    const imageInput = document.getElementById("image-input"); // Asegúrate de tener un input para la imagen

    let recognitionActive = false;
    let socket;
    let recognition;
    let imageReady = false;
    let conversationHistory = [];
    let finalTranscript = '';
    let autoRestartRecognition = false; // Variable para controlar el reinicio automático

    function initializeWebSocket() {
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
    }

    function startRecognition() {
        if (!recognitionActive) {
            initializeWebSocket();

            recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
            recognition.lang = 'en-US';
            recognition.interimResults = false;

            recognition.onstart = function() {
                console.log('Voice recognition started.');
                voiceIcon.classList.add('active');
            };

            recognition.onresult = function(event) {
                finalTranscript = event.results[0][0].transcript;
                console.log('Recognized text:', finalTranscript);
                userInput.value = finalTranscript;
            };

            recognition.onerror = function(event) {
                console.error('Recognition error:', event.error);
                if (event.error === 'no-speech' || event.error === 'network') {
                    console.log('No speech detected or network error.');
                    if (autoRestartRecognition) {
                        startRecognition();
                    }
                }
            };

            recognition.onend = function() {
                console.log('Voice recognition ended.');
                voiceIcon.classList.remove('active');
                if (recognitionActive) {
                    recognitionActive = false;
                    if (userInput.value.trim() !== "") {
                        setTimeout(sendMessage, 1000);
                    } else if (autoRestartRecognition) {
                        startRecognition(); // Reiniciar si no hay entrada de voz
                    }
                }
            };

            recognition.start();
            recognitionActive = true;
        }
    }

    function stopRecognition() {
        if (recognitionActive) {
            recognitionActive = false;
            if (recognition) {
                recognition.stop();
            }
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

        if (imageReady) {
            const imageFile = imageInput.files[0];
            if (imageFile) {
                formData.append("file", imageFile);
                imageReady = false;
            }
        }


        stopRecognition(); // Detener el reconocimiento antes de enviar la solicitud

        fetch("/ask_arithmetic", {
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log("Response Data:", data);
            const assistantMessage = formatAssistantMessage(data.answer);
            conversationHistory = data.conversation_history;

            renderMathMessage(assistantMessage);

            if (data.audio_file) {
                console.log("Playing audio file:", data.audio_file);  // Verifica la URL del archivo de audio
                playAudio(data.audio_file);
            } else {
                setTimeout(startRecognition, 2000); // Reactivar el reconocimiento de voz después de un retraso
            }
        })
        .catch(error => {
            console.error("Error:", error);
            setTimeout(startRecognition, 2000); // Reactivar el reconocimiento de voz incluso si hay un error
        });

        userInput.value = "";
    }

    function playAudio(audioFilePath) {
        stopRecognition(); // Asegúrate de detener el reconocimiento de voz antes de reproducir el audio
        const audio = new Audio(audioFilePath);
        audio.play();
        audio.addEventListener('ended', function() {
            console.log('Audio playback ended.');
            setTimeout(startRecognition, 1000); // Reactivar el reconocimiento de voz después de un breve retraso
        });
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
            autoRestartRecognition = false; // Desactivar reinicio automático
            stopRecognition();
        } else {
            autoRestartRecognition = true; // Activar reinicio automático
            startRecognition();
        }
    });

    // Enviar el mensaje al presionar Enter en el área de prompt
    userInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            sendMessage();
        }
    });

    // Evento para el input de la imagen
    imageInput.addEventListener("change", function() {
        imageReady = true;
    });
    
});*/

//====================================================================

/*document.addEventListener("DOMContentLoaded", function() {
    const voiceIcon = document.getElementById("voice-icon");
    const userInput = document.getElementById("user-input");
    const sendIcon = document.getElementById("send-icon");
    const outputArea = document.getElementById("output-area");
    const imageInput = document.getElementById("image-input");

    let recognitionActive = false;
    let recognition;
    let imageReady = false;
    let conversationHistory = [];
    let finalTranscript = '';
    let autoRestartRecognition = false;
    let mediaRecorder;
    let audioChunks = [];
    let mediaStream; // Declarar mediaStream

    function startRecognition() {
        if (!recognitionActive) {
            console.log("Iniciando reconocimiento de voz...");
            recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
            recognition.lang = 'en-US';
            recognition.interimResults = false;

            recognition.onstart = function() {
                console.log('Voice recognition started.');
                voiceIcon.classList.add('active');
                startRecording();
            };

            recognition.onresult = function(event) {
                finalTranscript = event.results[0][0].transcript;
                console.log('Recognized text:', finalTranscript);
                userInput.value = finalTranscript;
            };

            recognition.onerror = function(event) {
                console.error('Recognition error:', event.error);
                if (event.error === 'no-speech' || event.error === 'network') {
                    console.log('No speech detected or network error.');
                    if (autoRestartRecognition) {
                        startRecognition();
                    }
                }
            };

            recognition.onend = async function() {
                console.log('Voice recognition ended.');
                voiceIcon.classList.remove('active');
                if (recognitionActive) {
                    recognitionActive = false;
                    try {
                        const audioBlob = await getAudioBlob();
                        if (audioBlob) {
                            console.log("Sending audio blob for transcription...");
                            sendAudioForTranscription(audioBlob);
                        } else {
                            console.log("No audio blob available.");
                        }
                    } catch (error) {
                        console.error("Error obteniendo audio blob:", error);
                    }
                    if (userInput.value.trim() !== "") {
                        setTimeout(sendMessage, 1000);
                    } else if (autoRestartRecognition) {
                        startRecognition();
                    }
                }
            };

            recognition.start();
            recognitionActive = true;
        }
    }

    function stopRecognition() {
        if (recognitionActive) {
            console.log("Stopping voice recognition...");
            recognitionActive = false;
            if (recognition) {
                recognition.stop();
            }
            stopRecording()
                .then(() => console.log("Recording stopped successfully."))
                .catch(error => console.error("Error stopping recording:", error));
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

        if (imageReady) {
            const imageFile = imageInput.files[0];
            if (imageFile) {
                formData.append("file", imageFile);
                imageReady = false;
            }
        }

        stopRecognition();

        fetch("/ask_arithmetic", {
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log("Response Data:", data);
            const assistantMessage = formatAssistantMessage(data.answer);
            conversationHistory = data.conversation_history;

            renderMathMessage(assistantMessage);

            if (data.audio_file) {
                console.log("Playing audio file:", data.audio_file);
                playAudio(data.audio_file);
            } else {
                setTimeout(startRecognition, 2000);
            }
        })
        .catch(error => {
            console.error("Error:", error);
            setTimeout(startRecognition, 2000);
        });

        userInput.value = "";
    }

    

    function playAudio(audioFilePath) {
        stopRecognition(); // Asegúrate de detener el reconocimiento de voz antes de reproducir el audio
        const audio = new Audio(audioFilePath + '?t=' + new Date().getTime()); // Agregar un parámetro de consulta único
        audio.play();
        audio.addEventListener('ended', function() {
            console.log('Audio playback ended.');
            setTimeout(startRecognition, 1000); // Reactivar el reconocimiento de voz después de un breve retraso
        });
    }

    function formatAssistantMessage(message) {
        message = message.replace(/\n/g, "<br>");
        message = message.replace(/(\d+\.)\s/g, "$1&nbsp;");
        message = message.replace(/-\s/g, "&nbsp;&nbsp;&nbsp;&nbsp;- ");
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
            console.log("Stopping recognition and recording...");
            stopRecognition();
            getAudioBlob().then(audioBlob => {
                if (audioBlob) {
                    console.log("Sending audio blob for transcription...");
                    sendAudioForTranscription(audioBlob);
                }
            }).catch(error => console.error("Error obteniendo audio blob:", error));
        } else {
            console.log("Starting recognition and recording...");
            startRecognition();
        }
    });

    if (imageInput) {
        imageInput.addEventListener("change", function() {
            imageReady = true;
        });
    }

    function startRecording() {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                console.log("Iniciando grabación de audio...");
                mediaStream = stream; // Asignar el flujo de medios
                mediaRecorder = new MediaRecorder(stream);
                mediaRecorder.ondataavailable = event => {
                    audioChunks.push(event.data);
                    console.log("Audio chunk disponible:", event.data);
                };
                mediaRecorder.start();
            })
            .catch(error => console.error('Error accessing microphone:', error));
    }

    function stopRecording() {
        return new Promise((resolve, reject) => {
            if (!mediaRecorder) {
                console.error("No recording in progress.");
                reject('No recording in progress.');
                return;
            }
            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                audioChunks = [];
                console.log("Recording stopped. Audio blob available:", audioBlob);
                resolve(audioBlob);
            };
            console.log("Stopping audio recording...");
            mediaRecorder.stop();

            if (mediaStream) {
                mediaStream.getTracks().forEach(track => track.stop());
                mediaStream = null;
            }
            
        });
    }

    function getAudioBlob() {
        return stopRecording();
    }
});*/

//======================================================================


//============================================================






















