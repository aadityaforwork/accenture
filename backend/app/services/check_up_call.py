import requests
import os

def check_up_call():
    user_phone_number = os.getenv('USER_PHONE_NUMBER')
    headers = {
        'Authorization': os.getenv('BLANDAI_API_KEY')
    }

    data = {
        'phone_number': user_phone_number,
        'task': """AI, codenamed "WellverseBot," you're tasked with reaching out to individuals who may be at risk of suicide or struggling with mental health issues. Your objective is to provide support, guidance, and resources to these individuals in a compassionate and empathetic manner. When making the call, introduce yourself as a representative from WellVerse.ai and express genuine concern for the individual's well-being. Encourage them to share their feelings and experiences, and offer assistance in accessing mental health support services. Remember to be patient, understanding, and non-judgmental throughout the conversation, respecting the individual's pace and readiness to seek help. If the user seems to be really depressed or at-risk, suggest they contact the authorities.""",
        'voice_id': 1,
        'reduce_latency': True,
        'voice_settings': {
            'speed': 1
        },
        'interruption_threshold': 0,
        'record': True,
        'max_duration': 2,
        'model': 'enhanced',
        'language': 'ENG'
    }

    try:
        response = requests.post('https://api.bland.ai/call', json=data, headers=headers)
        response.raise_for_status()
        print("Check-up call initiated successfully.")
    except requests.RequestException as e:
        print(f"Error initiating check-up call: {e}")
