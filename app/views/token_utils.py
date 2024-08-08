import tiktoken

# Inicializa el codificador para el modelo específico
encoder = tiktoken.get_encoding("cl100k_base")

def count_tokens(text):
    tokens = encoder.encode(text)
    return len(tokens)
