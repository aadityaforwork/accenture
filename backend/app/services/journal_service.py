from flask import jsonify
from datetime import datetime
import openai
import os
from .check_up_call import check_up_call

# Global list to store journal entries
journal_entries = []

def add_journal_entry(request):
    data = request.json
    if not data or 'text' not in data:
        return jsonify({"error": "No journal entry text provided"}), 400

    text = data['text']
    date = data.get('date', datetime.today().strftime('%Y-%m-%d'))
    title = data.get('title', f"Entry {len(journal_entries) + 1}")

    print(f"Received journal entry: {title} on {date}")

    # Analyze journal entry for depression signs
    depression_score = analyze_journal_entry(text)

    # Create and store the journal entry
    entry = {
        'date': date,
        'title': title,
        'text': text,
        'score': depression_score
    }
    journal_entries.append(entry)
    print(f"Journal Entry Added: {entry}")

    # Trigger check-up call if depression score exceeds threshold
    try:
        if float(depression_score) > 7:
            print("Depression score exceeds threshold. Initiating check-up call.")
            check_up_call()
    except ValueError:
        print("Invalid depression score received.")

    return jsonify({"message": "Journal entry added", "entry": entry}), 201

def get_journal_entries():
    return jsonify({"entries": journal_entries})

def analyze_journal_entry(text):
    """
    Analyze the journal entry and return a depression score (0-10).
    """
    openai.api_key = os.getenv('OPENAI_API_KEY')
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "Analyze the following journal entry for signs of depression. Provide a numerical score between 0 and 10, where 10 indicates high risk of depression. Only provide the numerical score."},
                {"role": "user", "content": text}
            ]
        )
        print("OpenAI Response:", response)
        score = float(response.choices[0].message['content'].strip())
        return score
    except Exception as e:
        print(f"Error analyzing journal entry: {e}")
        return 0
