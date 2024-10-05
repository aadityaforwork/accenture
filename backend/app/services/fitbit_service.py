import requests
from flask import jsonify
import os
from datetime import datetime, timedelta
import google.generativeai as genai
import json

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

    # Analyze data using GenAI
    genai.configure(api_key=os.getenv('GEMINI_API_KEY'))
    model = genai.models.get_model('chat-bison@001')

    prompt_atrisk = f"Based on the statistics provided in the heart and steps dataset, decide whether the user is at risk of mental health episodes or not. Return a JSON object with 'atrisk' as key and 1 or 0 as value. Heart dataset: {heart_data} Steps dataset: {steps_data}"
    response_atrisk = model.predict(prompt_atrisk)
    try:
        atrisk = json.loads(response_atrisk.result).get('atrisk', 0)
    except json.JSONDecodeError:
        atrisk = 0

    prompt_heartrate = f"Based on this heart dataset provided by the user's wearable, return a motivational and realistic text reply about the user's progress. Acknowledge any anomalies indicating risk. Indicate how close they are to self-harm in percentage (50% is normal). Keep the text under 40 words. Heart Dataset: {heart_data}"
    response_heartrate = model.predict(prompt_heartrate).result

    prompt_steps = f"Based on this steps dataset provided by the user's wearable, return a motivational and realistic text reply about the user's progress. Acknowledge any anomalies indicating risk. Indicate how close they are to self-harm in percentage (50% is normal). Keep the text under 40 words. Steps Dataset: {steps_data}"
    response_steps = model.predict(prompt_steps).result

    payload = {
        "heart_data": heart_data,
        "steps_data": steps_data,
        "atrisk": atrisk,
        "heart_text": response_heartrate,
        "steps_text": response_steps,
        "peak_heart_rate": peak_heart_rate,
        "steps_today": steps_today
    }

    print("Payload:", payload)
    return jsonify(payload)
