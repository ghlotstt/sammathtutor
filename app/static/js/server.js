// server.js

/*// Cargar las variables de entorno desde el archivo .env
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

console.log('WebSocket server started on port 8080');*/

// server.js

/*require('dotenv').config();
const express = require('express');
const multer = require('multer');
const upload = multer();
const { transcribeAudio } = require('./openai_stt_handler');

const app = express();
const port = 3000;

// Ruta para transcribir audio usando la API de OpenAI STT
app.post('/transcribe_audio', upload.single('audio'), async (req, res) => {
    try {
        const audioFile = req.file;
        if (audioFile) {
            const transcription = await transcribeAudio(audioFile.buffer);
            res.json({ transcription });
        } else {
            res.status(400).json({ error: 'No audio file provided' });
        }
    } catch (error) {
        console.error('Error during transcription:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});*/

