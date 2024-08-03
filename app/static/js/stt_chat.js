// stt_chat.js

/*document.addEventListener("DOMContentLoaded", function() {
    const userInput = document.getElementById("user-input");
    const sendIcon = document.getElementById("send-icon");

    document.addEventListener('transcriptionReceived', function(event) {
        const transcription = event.detail;
        userInput.value = transcription; // Mostrar la transcripción en el campo user-input
        console.log('Transcription received and set to user-input:', transcription);
        sendTranscription();
    });

    function sendTranscription() {
        sendIcon.click(); // Simular el clic en el ícono de enviar
    }

});*/



/*document.addEventListener("DOMContentLoaded", function() {
    console.log("stt_chat.js loaded");

    const userInput = document.getElementById("user-input");
    const voiceIcon = document.getElementById('voice-icon');

    let mediaRecorder; 
    let mediaStream;   
    let audioContext;  
    let silenceTimeout;

    async function transcribeAudio(audioBlob) {
        console.log('Transcribing audio...');
        const formData = new FormData();
        formData.append('audio', audioBlob, 'audio.webm');

        try {
            const response = await fetch('/transcribe_audio', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                userInput.value = data.transcription;
                console.log('Transcription received:', data.transcription);

                // Asegurarse de que sendMessage esté disponible
                if (typeof window.sendMessage === 'function') {
                    console.log('Calling sendMessage with:', data.transcription);
                    window.sendMessage(data.transcription);
                } else {
                    console.error('sendMessage is not a function');
                }
            } else {
                console.error('Error transcribing audio:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    voiceIcon.addEventListener('click', () => {
        voiceIcon.classList.toggle('active');

        if (voiceIcon.classList.contains('active')) {
            console.log('Microphone is active');
            startRecording();
        } else {
            console.log('Microphone is inactive');
            stopRecording();
        }
    });

    function startRecording() {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                mediaStream = stream;
                mediaRecorder = new MediaRecorder(stream);
                let audioChunks = [];

                mediaRecorder.start();

                mediaRecorder.ondataavailable = (e) => {
                    audioChunks.push(e.data);
                };

                mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                    transcribeAudio(audioBlob);
                    voiceIcon.classList.remove('active');
                };

                setTimeout(() => {
                    mediaRecorder.stop();
                }, 5000); // Graba durante 5 segundos o ajusta según sea necesario
            })
            .catch(error => {
                console.error('Error accessing audio input:', error);
            });
    }

    function stopRecording() {
        console.log("stopRecording called"); 
        if (mediaRecorder) {
            console.log("Stopping mediaRecorder"); 
            mediaRecorder.stop();
            mediaRecorder = null;
        }

        if (mediaStream) {
            console.log("Stopping mediaStream tracks"); 
            mediaStream.getTracks().forEach(track => track.stop());
            mediaStream = null;
        }

        if (audioContext) {
            console.log("Closing audioContext"); 
            audioContext.close();
            audioContext = null;
        }

        clearTimeout(silenceTimeout);

        // Asegurarse de que el icono del micrófono se desactive
        voiceIcon.classList.remove('active');

        console.log('Recording stopped');
    }
});
*/












