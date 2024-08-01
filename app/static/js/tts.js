// tts.js
/*document.addEventListener("DOMContentLoaded", function() {
    console.log("tts.js loaded"); // Verificar que el archivo se carga
    const audioPlayer = new Audio();

    

    function playAudio(audioFilePath) {
        console.log("Attempting to play audio file:", audioFilePath);
        const uniqueAudioFilePath = `${audioFilePath}?t=${new Date().getTime()}`; // Para evitar la caché
        console.log("Unique audio file path:", uniqueAudioFilePath);
        audioPlayer.src = uniqueAudioFilePath;

        audioPlayer.play().then(() => {
            console.log("Audio is playing successfully.");
        }).catch(error => {
            console.error("Error playing audio:", error);
        });

        audioPlayer.addEventListener('ended', function() {
            console.log('Audio playback ended.');
            document.dispatchEvent(new CustomEvent('audioEnded'));
        });
    }

    document.addEventListener('responseReceived', function(event) {
        console.log('Event handler triggered');
        const audioFilePath = event.detail.audioFilePath;
        console.log('Received audio file path:', audioFilePath); // Este log mostrará el valor de audioFilePath
        if (audioFilePath) {
            playAudio(audioFilePath);
        } else {
            console.log('No audio file path provided.');
        }
    });
});*/








