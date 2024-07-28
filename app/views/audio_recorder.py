import sounddevice as sd
import numpy as np
import wavio

def iniciar_grabacion_con_silencio(duracion_maxima=30, frecuencia=44100, umbral=0.01, duracion_silencio=2):
    filename = "app_speech.wav"
    print("Iniciando grabación...")
    audio = []
    silencio_detectado = 0

    def callback(indata, frames, time, status):
        nonlocal silencio_detectado
        if status:
            print(status)
        audio.append(indata.copy())
        amplitud = np.linalg.norm(indata) / frames
        if amplitud < umbral:
            silencio_detectado += 1
        else:
            silencio_detectado = 0

        if silencio_detectado > duracion_silencio * frecuencia / frames:
            print("Silencio detectado, terminando grabación...")
            raise sd.CallbackAbort

    with sd.InputStream(samplerate=frecuencia, channels=1, callback=callback):
        try:
            sd.sleep(int(duracion_maxima * 1000))
        except sd.CallbackAbort:
            pass

    audio = np.concatenate(audio, axis=0)
    wavio.write(filename, audio, frecuencia, sampwidth=2)
    print(f"Grabación guardada en {filename}")
    return filename
