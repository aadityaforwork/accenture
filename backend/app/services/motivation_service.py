import openai
import os

def get_motivational_quote():
    """
    Generate a motivational quote using OpenAI.
    """
    openai.api_key = os.getenv('OPENAI_API_KEY')
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "Generate a short motivational quote about the gift of life."}
        ]
    )
    quote = response.choices[0].message['content'].strip()
    return quote
