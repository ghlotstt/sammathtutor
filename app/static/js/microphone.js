
/*const voiceIcon = document.getElementById('voice-icon');
let mediaRecorder;
let audioChunks = [];
let silenceTimeout;
let mediaStream;
let analyser;
let audioContext;
let dataArray;




const MIN_DECIBELS = -45; // Umbral mínimo de decibelios para considerar que hay sonido
const SILENCE_DURATION = 2000; // Duración del silencio en milisegundos

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
            mediaRecorder.start();
            audioChunks = [];

            mediaRecorder.ondataavailable = (e) => {
                audioChunks.push(e.data);
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                sendAudio(audioBlob);
            };

            // Configuración del analizador de audio
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const audioStreamSource = audioContext.createMediaStreamSource(stream);
            analyser = audioContext.createAnalyser();
            analyser.minDecibels = MIN_DECIBELS;
            audioStreamSource.connect(analyser);
            analyser.fftSize = 2048;
            const bufferLength = analyser.frequencyBinCount;
            dataArray = new Uint8Array(bufferLength);

            detectSound();
        })
        .catch(error => {
            console.error('Error accessing audio input:', error);
        });
}

function stopRecording() {
    if (mediaRecorder) {
        mediaRecorder.stop();
        mediaRecorder = null;
    }

    if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
        mediaStream = null;
    }

    if (audioContext) {
        audioContext.close();
        audioContext = null;
    }

    clearTimeout(silenceTimeout);

    // Asegurarse de que el icono del micrófono se desactive
    voiceIcon.classList.remove('active');

    console.log('Recording stopped');
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

function detectSound() {
    analyser.getByteFrequencyData(dataArray);
    let soundDetected = false;

    for (let i = 0; i < dataArray.length; i++) {
        if (dataArray[i] > 0) {
            soundDetected = true;
            break;
        }
    }

    if (!soundDetected) {
        if (!silenceTimeout) {
            silenceTimeout = setTimeout(() => {
                console.log('Timeout de silencio alcanzado, deteniendo grabación...');
                stopRecording();
            }, SILENCE_DURATION);
        }
    } else {
        clearTimeout(silenceTimeout);
        silenceTimeout = null;
    }

    if (mediaRecorder && mediaRecorder.state === 'recording') {
        requestAnimationFrame(detectSound);
    }
}*/


// ============= Funciona bien hasta llevar la transcripcion a user input=============

/*document.addEventListener("DOMContentLoaded", function() {
    const voiceIcon = document.getElementById('voice-icon');
    const userInput = document.getElementById("user-input");
    let mediaRecorder;
    let audioChunks = [];
    let silenceTimeout;
    let mediaStream;
    let analyser;
    let audioContext;
    let dataArray;

    const MIN_DECIBELS = -45; // Umbral mínimo de decibelios para considerar que hay sonido
    const SILENCE_DURATION = 2000; // Duración del silencio en milisegundos

    voiceIcon.addEventListener('click', () => {
        voiceIcon.classList.toggle('active');

        if (voiceIcon.classList.contains('active')) {
            console.log('Microphone is active');
            voiceIcon.style.color = 'red'; // Cambia el color del icono a rojo
            startRecording();
        } else {
            console.log('Microphone is inactive');
            voiceIcon.style.color = ''; // Restaura el color original del icono
            stopRecording();
        }
    });

    function startRecording() {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                mediaStream = stream;
                mediaRecorder = new MediaRecorder(stream);
                mediaRecorder.start();
                audioChunks = [];

                mediaRecorder.ondataavailable = (e) => {
                    audioChunks.push(e.data);
                };

                mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                    sendAudio(audioBlob);
                };

                // Configuración del analizador de audio
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const audioStreamSource = audioContext.createMediaStreamSource(stream);
                analyser = audioContext.createAnalyser();
                analyser.minDecibels = MIN_DECIBELS;
                audioStreamSource.connect(analyser);
                analyser.fftSize = 2048;
                const bufferLength = analyser.frequencyBinCount;
                dataArray = new Uint8Array(bufferLength);

                detectSound();
            })
            .catch(error => {
                console.error('Error accessing audio input:', error);
            });
    }

    function stopRecording() {
        if (mediaRecorder) {
            mediaRecorder.stop();
            mediaRecorder = null;
        }

        if (mediaStream) {
            mediaStream.getTracks().forEach(track => track.stop());
            mediaStream = null;
        }

        if (audioContext) {
            audioContext.close();
            audioContext = null;
        }

        clearTimeout(silenceTimeout);

        // Asegurarse de que el icono del micrófono se desactive
        voiceIcon.classList.remove('active');
        voiceIcon.style.color = ''; // Restaura el color original del icono

        console.log('Recording stopped');
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
            userInput.value = data.transcription; // Mostrar la transcripción en el campo user-input
        })
        .catch(error => {
            console.error('Error transcribing audio:', error);
        });
    }

    function detectSound() {
        analyser.getByteFrequencyData(dataArray);
        let soundDetected = false;

        for (let i = 0; i < dataArray.length; i++) {
            if (dataArray[i] > 0) {
                soundDetected = true;
                break;
            }
        }

        if (!soundDetected) {
            if (!silenceTimeout) {
                silenceTimeout = setTimeout(() => {
                    console.log('Timeout de silencio alcanzado, deteniendo grabación...');
                    stopRecording();
                }, SILENCE_DURATION);
            }
        } else {
            clearTimeout(silenceTimeout);
            silenceTimeout = null;
        }

        if (mediaRecorder && mediaRecorder.state === 'recording') {
            requestAnimationFrame(detectSound);
        }
    }
});*/
//=====================================================================



/*document.addEventListener("DOMContentLoaded", function() {
    const voiceIcon = document.getElementById('voice-icon');
    const userInput = document.getElementById("user-input");
    const outputArea = document.getElementById("output-area");
    let mediaRecorder;
    let audioChunks = [];
    let silenceTimeout;
    let mediaStream;
    let analyser;
    let audioContext;
    let dataArray;

    const MIN_DECIBELS = -45; // Umbral mínimo de decibelios para considerar que hay sonido
    const SILENCE_DURATION = 2000; // Duración del silencio en milisegundos

    voiceIcon.addEventListener('click', () => {
        voiceIcon.classList.toggle('active');

        if (voiceIcon.classList.contains('active')) {
            console.log('Microphone is active');
            voiceIcon.style.color = 'red'; // Cambia el color del icono a rojo
            startRecording();
        } else {
            console.log('Microphone is inactive');
            voiceIcon.style.color = ''; // Restaura el color original del icono
            stopRecording();
        }
    });

    function startRecording() {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                mediaStream = stream;
                mediaRecorder = new MediaRecorder(stream);
                mediaRecorder.start();
                audioChunks = [];

                mediaRecorder.ondataavailable = (e) => {
                    audioChunks.push(e.data);
                };

                mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                    sendAudio(audioBlob);
                };

                // Configuración del analizador de audio
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const audioStreamSource = audioContext.createMediaStreamSource(stream);
                analyser = audioContext.createAnalyser();
                analyser.minDecibels = MIN_DECIBELS;
                audioStreamSource.connect(analyser);
                analyser.fftSize = 2048;
                const bufferLength = analyser.frequencyBinCount;
                dataArray = new Uint8Array(bufferLength);

                detectSound();
            })
            .catch(error => {
                console.error('Error accessing audio input:', error);
            });
    }

    function stopRecording() {
        if (mediaRecorder) {
            mediaRecorder.stop();
            mediaRecorder = null;
        }

        if (mediaStream) {
            mediaStream.getTracks().forEach(track => track.stop());
            mediaStream = null;
        }

        if (audioContext) {
            audioContext.close();
            audioContext = null;
        }

        clearTimeout(silenceTimeout);

        // Asegurarse de que el icono del micrófono se desactive
        voiceIcon.classList.remove('active');
        voiceIcon.style.color = ''; // Restaura el color original del icono

        console.log('Recording stopped');
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
            userInput.value = data.transcription; // Mostrar la transcripción en el campo user-input

            // Llamar directamente a sendMessage con la transcripción
            if (typeof window.sendMessage === 'function') {
                console.log('Calling sendMessage with:', data.transcription);
                window.sendMessage(data.transcription);
            } else {
                console.error('sendMessage is not a function');
            }
        })
        .catch(error => {
            console.error('Error transcribing audio:', error);
        });
    }

    function detectSound() {
        analyser.getByteFrequencyData(dataArray);
        let soundDetected = false;

        for (let i = 0; i < dataArray.length; i++) {
            if (dataArray[i] > 0) {
                soundDetected = true;
                break;
            }
        }

        if (!soundDetected) {
            if (!silenceTimeout) {
                silenceTimeout = setTimeout(() => {
                    console.log('Timeout de silencio alcanzado, deteniendo grabación...');
                    stopRecording();
                }, SILENCE_DURATION);
            }
        } else {
            clearTimeout(silenceTimeout);
            silenceTimeout = null;
        }

        if (mediaRecorder && mediaRecorder.state === 'recording') {
            requestAnimationFrame(detectSound);
        }
    }

    function scrollToBottom(element) {
        element.scrollTop = element.scrollHeight;
    }
});*/


document.addEventListener("DOMContentLoaded", function() {
    const voiceIcon = document.getElementById('voice-icon');
    const userInput = document.getElementById("user-input");
    let mediaRecorder;
    let audioChunks = [];
    let silenceTimeout;
    let mediaStream;
    let analyser;
    let audioContext;
    let dataArray;

    const MIN_DECIBELS = -45;
    const SILENCE_DURATION = 2000;

    voiceIcon.addEventListener('click', () => {
        voiceIcon.classList.toggle('active');

        if (voiceIcon.classList.contains('active')) {
            console.log('Microphone is active');
            voiceIcon.style.color = 'red';
            startRecording();
        } else {
            console.log('Microphone is inactive');
            voiceIcon.style.color = '';
            stopRecording();
        }
    });

    function startRecording() {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                mediaStream = stream;
                mediaRecorder = new MediaRecorder(stream);
                mediaRecorder.start();
                audioChunks = [];

                mediaRecorder.ondataavailable = (e) => {
                    audioChunks.push(e.data);
                };

                mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                    sendAudio(audioBlob);
                };

                audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const audioStreamSource = audioContext.createMediaStreamSource(stream);
                analyser = audioContext.createAnalyser();
                analyser.minDecibels = MIN_DECIBELS;
                audioStreamSource.connect(analyser);
                analyser.fftSize = 2048;
                const bufferLength = analyser.frequencyBinCount;
                dataArray = new Uint8Array(bufferLength);

                detectSound();
            })
            .catch(error => {
                console.error('Error accessing audio input:', error);
            });
    }

    function stopRecording() {
        if (mediaRecorder) {
            mediaRecorder.stop();
            mediaRecorder = null;
        }

        if (mediaStream) {
            mediaStream.getTracks().forEach(track => track.stop());
            mediaStream = null;
        }

        if (audioContext) {
            audioContext.close();
            audioContext = null;
        }

        clearTimeout(silenceTimeout);

        voiceIcon.classList.remove('active');
        voiceIcon.style.color = '';

        console.log('Recording stopped');
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
            userInput.value = data.transcription;

            // Crear un evento personalizado para enviar la transcripción a chat.js
            const transcriptionEvent = new CustomEvent('transcriptionReceived', { detail: data.transcription });
            document.dispatchEvent(transcriptionEvent);
        })
        .catch(error => {
            console.error('Error transcribing audio:', error);
        });
    }

    function detectSound() {
        analyser.getByteFrequencyData(dataArray);
        let soundDetected = false;

        for (let i = 0; i < dataArray.length; i++) {
            if (dataArray[i] > 0) {
                soundDetected = true;
                break;
            }
        }

        if (!soundDetected) {
            if (!silenceTimeout) {
                silenceTimeout = setTimeout(() => {
                    console.log('Timeout de silencio alcanzado, deteniendo grabación...');
                    stopRecording();
                }, SILENCE_DURATION);
            }
        } else {
            clearTimeout(silenceTimeout);
            silenceTimeout = null;
        }

        if (mediaRecorder && mediaRecorder.state === 'recording') {
            requestAnimationFrame(detectSound);
        }
    }
});
