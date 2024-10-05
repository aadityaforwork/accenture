from flask import jsonify
import requests
import os
from textblob import TextBlob

def get_call_records():
    authorization_token = os.getenv('BLANDAI_API_KEY')
    url = "https://api.bland.ai/v1/calls"
    headers = {"authorization": authorization_token}

    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        calls = response.json().get('calls', [])
        return jsonify({"calls": calls})
    except requests.RequestException as e:
        print(f"Error fetching call records: {e}")
        return jsonify({"error": "Failed to fetch call records"}), 500

def analyze_call_data(request):
    data = request.json
    if not data or 'call_id' not in data:
        return jsonify({"error": "Missing call_id"}), 400

    call_id = data['call_id']
    authorization_token = os.getenv('BLANDAI_API_KEY')

    print(f"Analyzing call ID: {call_id}")

    # Fetch call details and recording
    call_details = fetch_call_details(call_id, authorization_token)
    call_recording = fetch_call_recording(call_id, authorization_token)

    # Extract transcript
    transcript = call_details.get("concatenated_transcript", "No transcript available")

    # Perform sentiment analysis
    sentiment = analyze_sentiment(transcript)

    response_payload = {
        "call_details": call_details,
        "call_recording": call_recording,
        "transcript": transcript,
        "sentiment": sentiment
    }

    print(f"Sentiment Analysis: {sentiment}")
    return jsonify(response_payload)

def fetch_call_details(call_id, authorization_token):
    url = f"https://api.bland.ai/v1/calls/{call_id}"
    headers = {"authorization": authorization_token}
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        print(f"Error fetching call details for {call_id}: {e}")
        return {}

def fetch_call_recording(call_id, authorization_token):
    url = f"https://api.bland.ai/v1/calls/{call_id}/recording"
    headers = {"authorization": authorization_token}
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        print(f"Error fetching call recording for {call_id}: {e}")
        return {}

def analyze_sentiment(text):
    analysis = TextBlob(text)
    sentiment = {
        "polarity": analysis.sentiment.polarity,       # Range: [-1.0, 1.0]
        "subjectivity": analysis.sentiment.subjectivity  # Range: [0.0, 1.0]
    }
    return sentiment
