from transformers import AutoTokenizer, AutoModelForCausalLM
import torch

MODEL_NAME = "microsoft/DialoGPT-small"

tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForCausalLM.from_pretrained(MODEL_NAME)

def generate_response(prompt: str, chat_history_ids=None, max_length=100):
    """
    Generates a conversational response. Supports multi-turn memory.
    """
    new_input_ids = tokenizer.encode(prompt + tokenizer.eos_token, return_tensors="pt")
    
    # Append to chat history if exists
    if chat_history_ids is not None:
        input_ids = torch.cat([chat_history_ids, new_input_ids], dim=-1)
    else:
        input_ids = new_input_ids

    # Generate response
    chat_history_ids = model.generate(input_ids, max_length=max_length, pad_token_id=tokenizer.eos_token_id)
    
    # Decode only the newly generated part
    response = tokenizer.decode(chat_history_ids[:, input_ids.shape[-1]:][0], skip_special_tokens=True)
    
    return response, chat_history_ids
