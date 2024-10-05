from flask import request, jsonify
from bson.objectid import ObjectId
import os
import json
import dotenv
import google.generativeai as genai
from dotenv import load_dotenv
from datetime import datetime 
from .check_up_call import check_up_call

load_dotenv()

# Configure the API key
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)

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

def add_journal_entry():
    from app import mongo 
    try:
        data = request.json
        if not data or 'text' not in data:
            return jsonify({'error': 'No journal entry text provided'}), 400

        text = data['text']
        date = data.get('date', datetime.today().strftime('%Y-%m-%d'))
        title = data.get('title', f"Entry {mongo.db.journal.count_documents({}) + 1}")

        depression_score = analyze_journal_entry(text)
        print(f"Depression score: {depression_score}")

        journal_entry = {
            'date': date,
            'title': title,
            'text': text,
            'score': depression_score
        }

        result = mongo.db.journal.insert_one(journal_entry)
        inserted_id = str(result.inserted_id)
        print(f"Inserted ID: {inserted_id}")

        if float(depression_score) > 7:
            print("Depression score exceeds threshold. Initiating check-up call.")
            check_up_call()

        # Create a new dictionary with the string ID for the response
        response_entry = journal_entry.copy()
        response_entry['_id'] = inserted_id

        return jsonify({
            'entry_id': inserted_id,
            'entry': response_entry
        }), 201

    except Exception as e:
        print(f"Error in add_journal_entry: {str(e)}")
        return jsonify({'error': 'Failed to store journal entry'}), 500

def get_journal_entry(entry_id):
    from app import mongo 
    try:
        if not ObjectId.is_valid(entry_id):
            return jsonify({'error': 'Invalid entry ID'}), 400

        journal_entry = mongo.db.journal.find_one({'_id': ObjectId(entry_id)})
        if journal_entry:
            journal_entry['_id'] = str(journal_entry['_id'])
            return jsonify(journal_entry), 200
        else:
            return jsonify({'error': 'Journal entry not found'}), 404
    except Exception as e:
        print(f"Error fetching journal entry: {str(e)}")
        return jsonify({'error': 'Failed to fetch journal entry'}), 500

def get_journal_entries():
    from app import mongo
    try:
        journal_entries = list(mongo.db.journal.find({}))
        for entry in journal_entries:
            entry['_id'] = str(entry['_id'])

        return jsonify({
            'entries': journal_entries
        }), 200
    except Exception as e:
        print(f"Error fetching journal entries: {str(e)}")
        return jsonify({'error': 'Failed to fetch journal entries'}), 500

def analyze_journal_entry(text):
    print(f"Analyzing journal entry: {text}")
    try:
        chat_session = model.start_chat(
            history=[
                {
                    "role": "user",
                    "parts": [
                        f"""You are an AI trained to analyze journal entries for signs of depression.
Provide a numerical score between 0 and 10 based on the severity of depression signs present in the text.
Only provide the numerical score without any additional text.

Journal Entry:
{{
    "text": "{text}"
}}
"""
                    ],
                },
            ]
        )
        
        response = chat_session.send_message("Please provide the depression score. Return a score only")
        response_text = response._result.candidates[0].content.parts[0].text.strip()
        print(f"Response from Gemini: {response_text}")
        
        score = int(response_text)
        print(f"Parsed score: {score}")
        return score
    
    except ValueError as e:
        print(f"Error converting score to integer: {str(e)}")
        return 0
    except Exception as e:
        print(f"Error analyzing journal entry: {str(e)}")
        return 0