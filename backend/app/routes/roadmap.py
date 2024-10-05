from flask import Blueprint, request, jsonify
from bson.objectid import ObjectId
from app.services.roadmap_service import generate_roadmap


bp = Blueprint('roadmap', __name__, url_prefix='/roadmap')

@bp.route('/roadmap_quiz', methods=['POST'])
def roadmap_quiz():
    from app import mongo
    try:
        data = request.json
        if not data:
            return jsonify({'error': 'No input data provided'}), 400

        # Validate required fields
        required_fields = ['hobbies', 'mindfulness', 'socialization', 'timeInvestment']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing field: {field}'}), 400

        roadmap_entry = {
            'quiz_response': {
                'hobbies': data.get('hobbies'),
                'mindfulness': data.get('mindfulness'),
                'socialization': data.get('socialization'),
                'timeInvestment': data.get('timeInvestment')
            }
        }

        # Generate problem and interests strings for the AI model
        problem = (
            f"The user socializes {data.get('socialization')}, likes to and is willing to invest "
            f"{data.get('timeInvestment')} in mental health practices."
        )
        interests = data.get('hobbies')

        # Generate roadmap
        roadmap = generate_roadmap(problem, interests)
        if roadmap is None:
            return jsonify({'error': 'Failed to generate roadmap'}), 500

        # Add roadmap to the entry
        roadmap_entry['steps'] = roadmap

        # Store roadmap entry in MongoDB
        result = mongo.db.roadmap.insert_one(roadmap_entry)

        return jsonify({
            'roadmap_id': str(result.inserted_id),
            'roadmap': roadmap
        }), 201

    except Exception as e:
        print(f"Error inserting into MongoDB: {e}")
        return jsonify({'error': 'Failed to store roadmap'}), 500

@bp.route('/roadmap/<roadmap_id>', methods=['GET'])
def get_roadmap(roadmap_id):
    from app import mongo  # Add this line
    try:
        if not ObjectId.is_valid(roadmap_id):
            return jsonify({'error': 'Invalid roadmap ID'}), 400

        roadmap = mongo.db.roadmap.find_one({'_id': ObjectId(roadmap_id)})
        if roadmap:
            roadmap['_id'] = str(roadmap['_id'])
            return jsonify(roadmap), 200
        else:
            return jsonify({'error': 'Roadmap not found'}), 404
    except Exception as e:
        print(f"Error fetching roadmap: {e}")
        return jsonify({'error': 'Failed to fetch roadmap'}), 500
