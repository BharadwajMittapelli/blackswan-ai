# app/config.py
import os
from dotenv import load_dotenv

load_dotenv()

def load_google_api_key() -> str:
    """Safely loads the Google API key from the environment."""
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        raise ValueError(
            "GOOGLE_API_KEY is missing. Please set it in your environment or .env file. "
            "You can get an API key at https://aistudio.google.com/app/apikey"
        )
    return api_key

# Validate on import
GOOGLE_API_KEY = load_google_api_key()
