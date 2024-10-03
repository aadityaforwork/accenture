from flask import Blueprint, request, jsonify
from bson.objectid import ObjectId
from app.services.roadmap_service import generate_roadmap


bp = Blueprint('roadmap', __name__, url_prefix='/roadmap')

@bp.route('/roadmap_quiz', methods=['POST'])
def roadmap_quiz():
    from app import mongo
    try:
        data = request.json
        roadmap_entry = {
            'quiz_response': {
                'hobbies': data.get('hobbies'),
                'mindfulness': data.get('mindfulness'),
                'socialization': data.get('socialization'),
                'timeInvestment': data.get('timeInvestment')
            }
        }
        
        # Generate problem and interests strings for the AI model
        problem = f"The user socializes {data.get('socialization')} , likes to and is willing to invest {data.get('timeInvestment')} in mental health practices."
        interests = data.get('hobbies')
        
        # Generate roadmap
        roadmap = generate_roadmap(problem, interests)
        
        # Add roadmap to the entry
        roadmap_entry['steps'] = roadmap
        
    # Store roadmap entry in MongoDB
        result = mongo.db.roadmap.insert_one(roadmap_entry)
    except Exception as e:
        print(f"Error inserting into MongoDB: {e}")
        return jsonify({'error': 'Failed to store roadmap'}), 500
    
    return jsonify({
        'roadmap_id': str(result.inserted_id),
        'roadmap': roadmap
    })

@bp.route('/roadmap/<roadmap_id>', methods=['GET'])
def get_roadmap(roadmap_id):
    roadmap = mongo.db.roadmap.find_one({'_id': ObjectId(roadmap_id)})
    if roadmap:
        roadmap['_id'] = str(roadmap['_id'])
        return jsonify(roadmap)
    else:
        return jsonify({'error': 'Roadmap not found'}), 404
