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
