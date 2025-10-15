from huggingface_hub import InferenceClient
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Get API credentials and model name
API_TOKEN = os.getenv("HF_API_TOKEN")
MODEL_NAME = os.getenv("HF_MODEL_NAME")

# Initialize Hugging Face Inference client
client = InferenceClient(api_key=API_TOKEN)


def generate_llama_response(messages, max_tokens: int = 150) -> str:
    """
    Sends chat messages to the Hugging Face Inference API (Meta LLaMA model)
    and streams the response.

    Args:
        messages (list): Conversation messages formatted for the LLM.
        max_tokens (int): Maximum number of tokens to generate.

    Returns:
        str: Generated response text.
    """
    bot_reply = ""
    try:
        output = client.chat.completions.create(
            model=MODEL_NAME,
            messages=messages,
            stream=True,
            max_tokens=max_tokens
        )

        # Stream chunks and build response text
        for chunk in output:
            if hasattr(chunk, "choices") and chunk.choices:
                delta = chunk.choices[0].delta
                if delta and hasattr(delta, "content") and delta.content:
                    bot_reply += delta.content

    except Exception as e:
        print(f"[ERROR] Hugging Face inference failed: {e}")
        bot_reply = "Sorry, something went wrong with the model."

    return bot_reply
