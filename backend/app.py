from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
from datetime import datetime
from pymongo import MongoClient
from pymongo.errors import PyMongoError

app = Flask(__name__)
CORS(app)

FILE_NAME = "locations.json"
MONGO_URI = os.environ.get("MONGODB_URI")
mongo_client = None
mongo_db = None
if MONGO_URI:
    try:
        mongo_client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
        mongo_db = mongo_client.get_default_database()
    except PyMongoError as e:
        print("Warning: could not connect to MongoDB:", e)


@app.route("/")
def home():
    return "Location Tracker Backend Running"


@app.route("/location", methods=["POST"])
def receive_location():
    data = request.json

    user = data.get("user")
    lat = data.get("lat")
    lng = data.get("lng")
    device_name = data.get("device_name", "Unknown")
    device_type = data.get("device_type", "Unknown")

    new_data = {
        "user": user,
        "latitude": lat,
        "longitude": lng,
        "device_name": device_name,
        "device_type": device_type,
        "timestamp": datetime.now().isoformat(),
        "ip_address": request.remote_addr
    }
    # If MongoDB is configured, store to collection, otherwise fallback to JSON file
    if mongo_db:
        try:
            mongo_db.locations.insert_one(new_data)
        except PyMongoError as e:
            print("Mongo insert error:", e)
            # fallback to file
            _append_to_file(new_data)
    else:
        _append_to_file(new_data)

    return jsonify({
        "message": "Location received successfully"
    })


@app.route("/locations", methods=["GET"])
def get_locations():
    # If MongoDB is configured, read from collection
    if mongo_db:
        try:
            docs = list(mongo_db.locations.find({}, {'_id': 0}).sort('timestamp', -1))
            return jsonify(docs)
        except PyMongoError as e:
            print("Mongo read error:", e)

    if os.path.exists(FILE_NAME):
        with open(FILE_NAME, "r") as file:
            locations = json.load(file)
    else:
        locations = []

    return jsonify(locations)


def _append_to_file(item):
    if os.path.exists(FILE_NAME):
        with open(FILE_NAME, "r") as file:
            try:
                locations = json.load(file)
            except:
                locations = []
    else:
        locations = []

    locations.append(item)

    with open(FILE_NAME, "w") as file:
        json.dump(locations, file, indent=4)


@app.route("/clear-locations", methods=["POST"])
def clear_locations():
    # Clear MongoDB collection or file
    if mongo_db:
        try:
            mongo_db.locations.delete_many({})
        except PyMongoError as e:
            return jsonify({"error": str(e)}), 500
    else:
        with open(FILE_NAME, "w") as file:
            json.dump([], file)

    return jsonify({"message": "Locations cleared"})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)