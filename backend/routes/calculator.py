from flask import Blueprint, request, jsonify

# Establish Flask blueprint
calculator_bp = Blueprint('calculator', __name__)

# Define Emission Coefficient Tables
# Transport Coefficients (kg CO2 per km per person)
TRANSPORT_COEFFICIENTS = {
    'Car Petrol': 0.192, 'Car Diesel': 0.171, 'Car Electric': 0.053,
    'Bus': 0.089, 'Train': 0.041, 'Motorcycle': 0.114,
    'Bicycle': 0.000, 'Walking': 0.000,
    'Flight Short-haul': 0.255, 'Flight Long-haul': 0.195
}

# Food Emission Values (kg CO2 per day)
FOOD_COEFFICIENTS = {
    'Meat-heavy': 7.19, 'Omnivore': 5.63, 'Vegetarian': 3.81, 'Vegan': 2.89
}

# Energy Factors
ELECTRICITY_FACTOR = 0.233 # kg CO2/kWh (India grid)
HEATING_FLAT_RATE = 2.0 # kg
AC_FLAT_RATE = 1.5 # kg

@calculator_bp.route('/api/calculate/footprint', methods=['POST'])
def calculate_footprint():
    data = request.get_json(silent=True) or {}
    
    # 1. Travel Emissions
    transport_mode = data.get('transport_mode')
    try:
        distance = float(data.get('distance', 0))
        electricity_kwh = float(data.get('electricity_kwh', 0))
        passengers = int(data.get('passengers', 1))
    except (TypeError, ValueError):
        return jsonify({"error": "Distance, electricity, and passengers must be valid numbers"}), 400
    # Distance must be a non-negative number
    if distance < 0 or electricity_kwh < 0 or passengers < 1:
        return jsonify({"error": "Distance and electricity must be non-negative and passengers must be at least one"}), 400
        
    if transport_mode not in TRANSPORT_COEFFICIENTS:
        return jsonify({"error": "Choose a supported transport mode"}), 400
    travel_emissions = TRANSPORT_COEFFICIENTS[transport_mode] * distance / passengers

    # 2. Food Emissions
    diet_type = data.get('diet_type')
    if diet_type not in FOOD_COEFFICIENTS:
        return jsonify({"error": "Choose a supported diet type"}), 400
    food_emissions = FOOD_COEFFICIENTS[diet_type]
    # Applies a 10% emission penalty for food waste
    if data.get('food_waste') == True:
        food_emissions *= 1.10

    # 3. Energy Emissions
    energy_emissions = electricity_kwh * ELECTRICITY_FACTOR
    
    if data.get('heating'):
        energy_emissions += HEATING_FLAT_RATE
    if data.get('ac'):
        energy_emissions += AC_FLAT_RATE
        
    total_emissions = travel_emissions + food_emissions + energy_emissions

    # Response Structure
    return jsonify({
        "success": True,
        "travel_emissions": round(travel_emissions, 2),
        "food_emissions": round(food_emissions, 2),
        "energy_emissions": round(energy_emissions, 2),
        "total": round(total_emissions, 2),
        "breakdown": data
    })
