# test_tts.py
from tts import generate_speech

text = "This is a test message to generate speech."
filename = generate_speech(text)
print(f"Generated file: {filename}")
