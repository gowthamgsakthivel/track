from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)

FILE_NAME = "locations.json"


@app.route("/")
def home():
    return "Location Tracker Backend Running"


@app.route("/location", methods=["POST"])
def receive_location():
    data = request.json

    user = data.get("user")
    lat = data.get("lat")
    lng = data.get("lng")

    new_data = {
        "user": user,
        "latitude": lat,
        "longitude": lng
    }

    if os.path.exists(FILE_NAME):
        with open(FILE_NAME, "r") as file:
            try:
                locations = json.load(file)
            except:
                locations = []
    else:
        locations = []

    locations.append(new_data)

    with open(FILE_NAME, "w") as file:
        json.dump(locations, file, indent=4)

    return jsonify({
        "message": "Location received successfully"
    })


@app.route("/locations", methods=["GET"])
def get_locations():
    if os.path.exists(FILE_NAME):
        with open(FILE_NAME, "r") as file:
            locations = json.load(file)
    else:
        locations = []

    return jsonify(locations)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)