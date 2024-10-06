from flask import Blueprint, request, jsonify
from ..services import (
    check_up_call,
    fetch_fitbit_data,
    analyze_history,
    add_journal_entry,
    get_journal_entries,
    analyze_call_data,
    get_motivational_quote,
    get_call_records,
)


main_bp = Blueprint('main', __name__)

@main_bp.route('/')
def index():
    return "Flask Backend for Mental Health Support"

# Fitbit Data Endpoint
@main_bp.route('/fitbit_data', methods=['POST'])
def fitbit_data():
    return fetch_fitbit_data(request)

# History Analysis Endpoint
@main_bp.route('/history', methods=['POST'])
def history():
    return analyze_history(request)

# Trigger Check-Up Call
@main_bp.route('/call', methods=['GET'])
def call():
    print('Initiating check-up call...')
    check_up_call()
    return jsonify({"Risk": 1})

# Submit Journal Entry
@main_bp.route('/journal_entry', methods=['POST'])
def journal_entry():
    return add_journal_entry()

# Get All Journal Entries
@main_bp.route('/entries', methods=['GET'])
def entries():
    return get_journal_entries()

# Get Motivational Quote
@main_bp.route('/motivational_quote', methods=['GET'])
def motivational_quote():
    try:
        quote = get_motivational_quote()
        return jsonify({"quote": quote})
    except Exception as e:
        print(f"Error generating motivational quote: {e}")
        return jsonify({"error": "Failed to generate motivational quote"}), 500

# Fetch Call Records
@main_bp.route('/call_records', methods=['GET'])
def call_records():
    return get_call_records()

# Analyze Call
@main_bp.route('/analyze_call', methods=['POST'])
def analyze_call():
    return analyze_call_data(request)
