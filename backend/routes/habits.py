from datetime import date as date_type
from flask import Blueprint, request, jsonify
from storage import delete_log, get_logs, get_record, merge_record, save_log

habits_bp = Blueprint('habits', __name__)


def valid_identity(user_id, date_value=None):
    if not user_id or not str(user_id).strip():
        return "User ID is required"
    if date_value is not None:
        try:
            date_type.fromisoformat(date_value)
        except (TypeError, ValueError):
            return "Date must be a valid YYYY-MM-DD date"
    return None


@habits_bp.route('/api/habits/log', methods=['POST'])
def log_habit():
    data = request.get_json(silent=True) or {}
    user_id, date_value = data.get("user_id"), data.get("date")
    error = valid_identity(user_id, date_value)
    if error:
        return jsonify({"error": error}), 400
    data["user_id"] = str(user_id)
    save_log(str(user_id), date_value, data)
    return jsonify({"success": True, "message": "Daily log saved", "entry": data}), 200


@habits_bp.route('/api/habits/history', methods=['GET'])
def get_history():
    user_id = request.args.get("user_id")
    error = valid_identity(user_id)
    if error:
        return jsonify({"error": error}), 400
    try:
        limit = min(max(int(request.args.get("limit", 30)), 1), 365)
    except ValueError:
        return jsonify({"error": "Limit must be a number"}), 400
    return jsonify(get_logs(str(user_id), limit))


@habits_bp.route('/api/habits/log/<date_value>', methods=['DELETE'])
def remove_log(date_value):
    user_id = request.args.get("user_id")
    error = valid_identity(user_id, date_value)
    if error:
        return jsonify({"error": error}), 400
    if not delete_log(str(user_id), date_value):
        return jsonify({"error": "Log not found"}), 404
    return jsonify({"success": True})


@habits_bp.route('/api/habits/settings', methods=['GET', 'PATCH'])
def manage_settings():
    data = request.get_json(silent=True) or {}
    user_id = request.args.get("user_id") if request.method == 'GET' else data.get("user_id")
    error = valid_identity(user_id)
    if error:
        return jsonify({"error": error}), 400
    if request.method == 'GET':
        return jsonify(get_record("user_settings", str(user_id)))
    data.pop("user_id", None)
    return jsonify({"success": True, "settings": merge_record("user_settings", str(user_id), data)})


@habits_bp.route('/api/habits/badges', methods=['GET', 'POST'])
def manage_badges():
    data = request.get_json(silent=True) or {}
    user_id = request.args.get("user_id") if request.method == 'GET' else data.get("user_id")
    error = valid_identity(user_id)
    if error:
        return jsonify({"error": error}), 400
    if request.method == 'GET':
        return jsonify(get_record("user_badges", str(user_id)))
    data.pop("user_id", None)
    return jsonify({"success": True, "badges": merge_record("user_badges", str(user_id), data)})
