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
         make it similar to this:\\n\n          
         {{\\n\\\n            
         \"step: 1,\\n\\\n            
         \"topic: \\\"Go for a run everyday\\\"\\n\\\n            
         \"related_content\\\" : add articles from web here\\n}}
         """,
                ],
            },
            {
                "role": "model",
                "parts": [
                    '```json\n{"step": "1", "topic": "Schedule a Badminton Session", "related_content": "Book a badminton court for 1 hour every weekday evening. This will provide you with a structured activity to look forward to and will help you release stress through physical exertion."}, {"step": "2", "topic": "Movie Night", "related_content": "Plan a movie night every weekend. Choose a genre you enjoy, like action, comedy, or drama, and invite a friend or family member to join you. This will help you unwind and connect with others."}, {"step": "3", "topic": "Mindfulness Meditation", "related_content": "Dedicate 10 minutes each morning to mindfulness meditation. Focus on your breath and observe your thoughts without judgment. This practice can help you manage stress and improve your focus."}, {"step": "4", "topic": "Skill Development", "related_content": "Enroll in a badminton coaching class to improve your skills. This will give you a sense of accomplishment and boost your confidence."}, {"step": "5", "topic": "Work-Life Balance", "related_content": "Set clear boundaries between work and personal life. Avoid checking work emails outside of work hours and make time for activities you enjoy."}, {"step": "6", "topic": "Positive Self-Talk", "related_content": "Challenge negative thoughts about your abilities. Replace them with positive affirmations, such as \\"I am capable and valuable.\\" This will help you build self-esteem."}, {"step": "7", "topic": "Connect with Peers", "related_content": "Organize a badminton tournament with your colleagues. This will allow you to socialize and build camaraderie outside of work."}, {"step": "8", "topic": "Goal Setting", "related_content": "Set achievable goals for your career. This will give you a sense of purpose and direction. Focus on your strengths and seek opportunities for growth."}, {"step": "9", "topic": "Seek Professional Help", "related_content": "If you are struggling to manage your stress, consider seeking professional help from a therapist or counselor. They can provide you with coping mechanisms and strategies for managing anxiety."}, {"step": "10", "topic": "Celebrate Success", "related_content": "Acknowledge your achievements, both big and small. This will help you stay motivated and appreciate your progress. Treat yourself to a movie night or a badminton session as a reward."}\n\n```',
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
        return f"Error decoding JSON: {e}"