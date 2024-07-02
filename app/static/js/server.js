// server.js

// Cargar las variables de entorno desde el archivo .env
require('dotenv').config();

const WebSocket = require('ws');
const { SpeechClient } = require('@google-cloud/speech');

// Instancia del cliente de Google Cloud Speech
const client = new SpeechClient();

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (message) => {
        const audioBytes = Buffer.from(message);

        const request = {
            config: {
                encoding: 'LINEAR16',
                sampleRateHertz: 16000,
                languageCode: 'en-US',
            },
            interimResults: true, // Si deseas resultados intermedios, configúralo en true
        };

        const recognizeStream = client
            .streamingRecognize(request)
            .on('error', console.error)
            .on('data', (data) => {
                ws.send(
                    data.results[0] && data.results[0].alternatives[0]
                        ? `Transcription: ${data.results[0].alternatives[0].transcript}`
                        : `Reached transcription time limit, press Ctrl+C`
                );
            });

        recognizeStream.write(audioBytes);
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

console.log('WebSocket server started on port 8080');
