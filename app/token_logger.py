'''
import sqlite3

def log_tokens_to_db(prompt_tokens, completion_tokens, total_tokens):
    try:
        conn = sqlite3.connect('tokens.db')
        cursor = conn.cursor()
        
        # Crear tabla si no existe
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS token_usage (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                prompt_tokens INTEGER,
                completion_tokens INTEGER,
                total_tokens INTEGER,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Insertar registros de tokens
        cursor.execute('''
            INSERT INTO token_usage (prompt_tokens, completion_tokens, total_tokens)
            VALUES (?, ?, ?)
        ''', (prompt_tokens, completion_tokens, total_tokens))
        
        conn.commit()
        print("Tokens successfully logged to the database.")
    except Exception as e:
        print(f"Error logging tokens to the database: {e}")
    finally:
        conn.close()

def calculate_cost():
    try:
        conn = sqlite3.connect('tokens.db')
        cursor = conn.cursor()
        cursor.execute('SELECT SUM(total_tokens) FROM token_usage')
        total_tokens = cursor.fetchone()[0]
        conn.close()

        # Asumiendo un costo de $0.0001 por token
        cost_per_token = 0.0001
        total_cost = total_tokens * cost_per_token if total_tokens else 0
        return total_cost
    except Exception as e:
        print(f"Error calculating cost: {e}")
        return 0
'''