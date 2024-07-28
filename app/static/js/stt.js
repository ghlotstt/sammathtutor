document.addEventListener("DOMContentLoaded", function() {
    const voiceIcon = document.getElementById("voice-icon");
    const sendIcon = document.getElementById("send-icon");
    const userInput = document.getElementById("user-input");
    let mediaRecorder;
    let audioChunks = [];
    let isRecording = false;
    let mediaStream;
    let hasSentMessage = false;

    function toggleRecording() {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    }

    function startRecording() {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                mediaStream = stream;
                mediaRecorder = new MediaRecorder(stream);
                mediaRecorder.ondataavailable = event => {
                    audioChunks.push(event.data);
                };
                mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                    audioChunks = [];
                    sendAudioForTranscription(audioBlob);
                };
                mediaRecorder.start();
                isRecording = true;
                updateUI(true);
            })
            .catch(error => {
                console.error('Error accessing microphone:', error);
                updateUI(false);
            });
    }

    function stopRecording() {
        if (mediaRecorder) {
            mediaRecorder.stop();
            isRecording = false;
            updateUI(false);

            if (mediaStream) {
                mediaStream.getTracks().forEach(track => track.stop());
                mediaStream = null;
            }
        }
    }

    function updateUI(isRecording) {
        if (isRecording) {
            voiceIcon.classList.add('active');
        } else {
            voiceIcon.classList.remove('active');
        }
    }

    //function sendAudioForTranscription(audioBlob) {

    function sendAudioForTranscription(audioBlob) {
        if (hasSentMessage) {
            console.warn('Message already sent, ignoring duplicate request.');
            return;  // Prevent duplicate requests
        }
        console.log("Preparing to send audio for transcription...");
        console.log("Audio Blob size:", audioBlob.size);

        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.wav');
    
        fetch('/transcribe_audio', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log('Transcription response:', data);
            if (data.transcription) {
                console.log('Calling displayTranscription with:', data.transcription);
                displayTranscription(data.transcription);
            } else {
                console.error('No transcription received.');
            }
        })
        .catch(error => console.error('Error during transcription:', error));
    }

    function displayTranscription(transcription) {
        console.log("Displaying transcription...", transcription);
        
        /*if (userInput) {
            console.log("User input field found, setting value...");
            userInput.value = transcription; // Establecer el texto transcrito en el campo de entrada

            if (!hasSentMessage) {  // Solo enviar si no se ha enviado ya
                hasSentMessage = true;
                sendMessage();
            }
        } else {
            console.error("User input field not found");
        }
    }

    function sendMessage() {
        if (userInput.value.trim() !== "") {
            hasSentMessage = true;  // Asegurarse de que no se envíe duplicado
            sendIcon.click();  // Simula el clic en el icono de envío para enviar la transcripción
        }
    }

    // Reiniciar hasSentMessage cuando el usuario envíe un mensaje manualmente
    sendIcon.addEventListener("click", () => {
        hasSentMessage = false;  // Resetear la bandera al enviar un nuevo mensaje
    });

    voiceIcon.addEventListener("click", toggleRecording);
});*/

        if (userInput) {
                userInput.value = transcription; // Set the transcribed text in the input field
                sendMessage(); // Automatically send the message
            } else {
                console.error("User input field not found");
            }
        }

        function sendMessage() {
            if (userInput.value.trim() !== "" && !hasSentMessage) {
                hasSentMessage = true;  // Mark message as sent
                sendIcon.click();  // Simulate the click to send the transcription
            }
        }

        sendIcon.addEventListener("click", () => {
            hasSentMessage = false;  // Reset the flag after sending the message
        });

        voiceIcon.addEventListener("click", toggleRecording);
});

