from flask import jsonify
import openai
import json
import os
from .check_up_call import check_up_call

def analyze_history(request):
    data = request.json
    if not data:
        return jsonify({"error": "No JSON data provided"}), 400

    urls = [item.get('url') for item in data if item.get('url')]
    if not urls:
        return jsonify({"error": "No URLs provided"}), 400

    print("URLs to analyze:", urls)

    # Define the prompt for OpenAI
    prompt = "You are a mental health watchlist bot. Given a list of URLs, determine if the user is at risk. Return a JSON object: {'atrisk': 1} if at risk, or {'atrisk': 0} if not."

    user_content = "Search History: " + str(urls)

    # Call OpenAI's ChatCompletion
    openai.api_key = os.getenv('OPENAI_API_KEY')

    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": prompt},
                {"role": "user", "content": user_content},
            ]
        )
        print("OpenAI Response:", response)
        gpt_response = json.loads(response.choices[0].message['content'])
    except (json.JSONDecodeError, KeyError, IndexError) as e:
        print(f"Error parsing OpenAI response: {e}")
        gpt_response = {"atrisk": 0}

    if gpt_response.get('atrisk') == 1:
        print("User is at risk")
        check_up_call()
        return jsonify({"Risk": 1})
    else:
        print("User is not at risk")
        return jsonify({"Risk": 0})
