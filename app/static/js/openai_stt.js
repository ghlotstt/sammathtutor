// openai_stt.js

/*function sendAudioForTranscription(audioBlob) {
    console.log("Enviando audio blob para transcripción:", audioBlob);
    const formData = new FormData();
    formData.append("audio", audioBlob, "audio.wav");

    fetch("/transcribe_audio_openai", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log("Transcription Data:", data);
        if (data.transcription) {
            document.getElementById("user-input").value = data.transcription;
            sendMessage();
        } else {
            console.error("No transcription received");
        }
    })
    .catch(error => {
        console.error("Error:", error);
    });
}*/






