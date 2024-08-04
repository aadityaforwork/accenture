from flask import Blueprint, request, jsonify
from ..services.roadmap_service import generate_roadmap

bp = Blueprint('roadmap', __name__, url_prefix='/roadmap')

@bp.route('', methods=['POST'])
def roadmap():
    data = request.json
    problem = data.get('problem')
    interests = data.get('interests')
    response = generate_roadmap(problem, interests)
    return jsonify(response)
