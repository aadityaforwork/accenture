import requests
from flask import jsonify, request, redirect
import os
from datetime import datetime, timedelta
import google.generativeai as genai
import json
generation_config = {
    "temperature": 0.5,
    "top_p": 0.95,
    "top_k": 64,
    "max_output_tokens": 8192,
    "response_mime_type": "application/json",
}
def fetch_fitbit_data(request):
    access_token = os.getenv('FITBIT_ACCESS_TOKEN')
    user_id = request.form.get('user_id')
    if not access_token or not user_id:
        return jsonify({"error": "Missing access_token or user_id"}), 400
    print(f"Access Token: {access_token}, User ID: {user_id}")

    # Fetch heart rate data
    heart_url = f'https://api.fitbit.com/1/user/{user_id}/activities/heart/date/today/today.json'
    heart_response = requests.get(heart_url, headers={'Authorization': f'Bearer {access_token}'})
    if heart_response.status_code != 200:
        return jsonify({"error": "Failed to fetch heart data"}), heart_response.status_code
    heart_data = heart_response.json()

    # Fetch steps data for the last month
    current_date = datetime.now().strftime("%Y-%m-%d")
    last_month_date = (datetime.now() - timedelta(days=30)).strftime("%Y-%m-%d")
    steps_url = f'https://api.fitbit.com/1/user/{user_id}/activities/steps/date/{last_month_date}/{current_date}.json'
    steps_response = requests.get(steps_url, headers={'Authorization': f'Bearer {access_token}'})
    print(steps_response.text)
    if steps_response.status_code != 200:
        return jsonify({"error": "Failed to fetch steps data"}), steps_response.status_code
    steps_data = steps_response.json()

    # Extract relevant data
    try:
        steps_today = steps_data['activities-steps'][-1]['value']
    except (KeyError, IndexError):
        steps_today = None

    try:
        heart_zones = heart_data['activities-heart'][0]['value']['heartRateZones']
        peak_heart_rate = next((zone['max'] for zone in heart_zones if zone['name'] == 'Peak'), None)
    except (KeyError, IndexError, StopIteration):
        peak_heart_rate = None

    model = genai.GenerativeModel(
        model_name="gemini-1.5-flash",
        generation_config=generation_config,
    )

    # Prompt for 'atrisk' assessment
    prompt_atrisk = f"""
    Based on the statistics provided in the heart and steps dataset, decide whether the user is at risk of mental health episodes or not.
    Return a JSON object with 'atrisk' as key and 1 or 0 as value.
    Heart dataset: {heart_data}
    Steps dataset: {steps_data}
    """

    # Start a chat session with the prompt
    chat_session_atrisk = model.start_chat(
        history=[]
    )

    # Since we've provided the prompt in the history, we can send an empty message or proceed directly
    response_atrisk = chat_session_atrisk.send_message(prompt_atrisk)

    # Extract the response text
    response_text_atrisk = response_atrisk._result.candidates[0].content.parts[0].text.strip()

    # Parse the JSON to get 'atrisk' value
    try:
        atrisk = json.loads(response_text_atrisk).get('atrisk', 0)
    except json.JSONDecodeError:
        atrisk = 0

    # Prompt for heart rate motivational message
    prompt_heartrate = f"""
    Based on this heart dataset provided by the user's wearable, return a motivational and realistic text reply about the user's progress.
    Acknowledge any anomalies indicating risk.
    Indicate how close they are to self-harm in percentage (50% is normal).
    Keep the text under 40 words.
    Heart Dataset: {heart_data}
    """

    # Start a chat session for heart rate
    chat_session_heartrate = model.start_chat(
        history=[]
    )

    # # Get the response
    response_heartrate = chat_session_heartrate.send_message(prompt_heartrate)

    # # Extract the response text
    response_heartrate_text = response_heartrate._result.candidates[0].content.parts[0].text.strip()

    # Prompt for steps motivational message
    prompt_steps = f"""
    Based on this steps dataset provided by the user's wearable, return a motivational and realistic text reply about the user's progress.
    Acknowledge any anomalies indicating risk.
    Indicate how close they are to self-harm in percentage (50% is normal).
    Keep the text under 40 words.
    Steps Dataset: {steps_data}
    """

    # Start a chat session for steps
    chat_session_steps = model.start_chat(
    history=[]
    )

    # Get the response
    response_steps = chat_session_steps.send_message(prompt_steps)

    # # Extract the response text
    response_steps = response_steps._result.candidates[0].content.parts[0].text.strip()


    payload = {
        "heart_data": heart_data,
        "steps_data": steps_data,
        "atrisk": atrisk,
        "heart_text": response_heartrate_text,
        "steps_text": response_steps,
        "peak_heart_rate": peak_heart_rate,
        "steps_today": steps_today
    }

    print("Payload:", payload)
    return jsonify(payload)
def fitbit_callback(request):
    code = request.args.get('code')
    if not code:
        return jsonify({"error": "Authorization code missing"}), 400

    # Step 2: Exchange authorization code for access token
    token_url = "https://api.fitbit.com/oauth2/token"
    data = {
        'client_id': "23RR77",
        'grant_type': 'authorization_code',
        'redirect_uri': "http://localhost:5000/callback",
        'code': code
    }
    headers = {
        'Authorization': f'Bearer {os.getenv("FITBIT_ACCESS_TOKEN")}',
        'Content-Type': 'application/x-www-form-urlencoded'
    }

    response = requests.post(token_url, data=data, headers=headers)
    
    if response.status_code == 200:
        token_data = response.json()
        access_token = token_data.get('access_token')
        refresh_token = token_data.get('refresh_token')
        user_id = token_data.get('user_id')

        # Optionally, store access_token and refresh_token in a database for future use

        # Redirect to the frontend with the user_id and access_token
        return redirect(f'http://localhost:3000/dashboard?access_token={access_token}&user_id={user_id}')

    else:
        print(f"Failed to exchange code for access token: {response.text}")
        return jsonify({"error": "Failed to exchange code for access token"}), response.status_code
