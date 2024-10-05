import os
import google.generativeai as genai
import dotenv
import json
dotenv.load_dotenv()

# Configure the API key
API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=API_KEY)

generation_config = {
    "temperature": 0.5,
    "top_p": 0.95,
    "top_k": 64,
    "max_output_tokens": 8192,
    "response_mime_type": "application/json",
}

model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    generation_config=generation_config,
)


def generate_roadmap(problem, interests):
    chat_session = model.start_chat(
        history=[
            {
                "role": "user",
                "parts": [
                    f"""You are a roadmap generator. Based on user's mental state and current user's thoughts , generate a detailed 10 step roadmap for him/her to follow in order for him/ her to get better .\n          Encourage the user on their interests in order to divert their mind from their mental distress and help them get better using this step by step roadmap:\\n\\n\n         
          User's Problem Input : \\\{problem}\\n\n          
          User's Interests : \\\{interests}\\n\\n\n          \n          
          Give 10 step program to tackle his problem and also inculcate his/her interests. \n          
          MAKE IT SO THAT YOU ARE ASSIGNING HIM TASKS TO PERFORM , NOT SOMETHING JUST MOTIVATIONAL\\n\\n\\n\n   
          
                
         Return the response in the following JSON format:
         [
        {{
            "step": "1",
            "topic": "Go for a run every day",
            "related_content": "Add articles from the web here"
        }},
        ...
    ]
         """,
                ],
            },
            {
                "role": "model",
                "parts": [
                    "hello",
                ],
            },
        ]
    )
    response = chat_session.send_message("Return the response in JSON structure")
    response_text = response._result.candidates[0].content.parts[0].text
    formatted_response = f"[{response_text}]"


    # Convert the string to a Python list of dictionaries
    try:
        json_data = json.loads(formatted_response)
        return json_data
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON: {e}")  # Log the error
        return None