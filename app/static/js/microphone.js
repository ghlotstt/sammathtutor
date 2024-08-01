// app/static/js/microphone.js

const voiceIcon = document.getElementById('voice-icon');
let mediaRecorder;
let audioChunks = [];

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
            mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
            mediaRecorder.start();
            audioChunks = [];

            mediaRecorder.ondataavailable = (e) => {
                audioChunks.push(e.data);
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                sendAudio(audioBlob);
            };
        })
        .catch(error => {
            console.error('Error accessing audio input:', error);
        });
}

function stopRecording() {
    if (mediaRecorder) {
        mediaRecorder.stop();
    }
}

function sendAudio(audioBlob) {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'audio.webm');

    fetch('/transcribe_audio', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Transcription:', data.transcription);
    })
    .catch(error => {
        console.error('Error transcribing audio:', error);
    });
}
