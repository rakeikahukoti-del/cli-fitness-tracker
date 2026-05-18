from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

DB_PATH = "../data/fitness_tracker.db"


def get_connection():
    return sqlite3.connect(DB_PATH)


@app.route("/")
def home():
    return jsonify({"message": "Fitness Tracker API running"})


@app.route("/workouts", methods=["GET"])
def get_workouts():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT id, date, lift, weight, reps, sets
        FROM workouts
        ORDER BY date
    """)

    rows = cursor.fetchall()
    conn.close()

    workouts = []

    for row in rows:
        workouts.append({
            "id": row[0],
            "date": row[1],
            "lift": row[2],
            "weight": row[3],
            "reps": row[4],
            "sets": row[5],
            "volume": row[3] * row[4] * row[5]
        })

    return jsonify(workouts)


@app.route("/workouts", methods=["POST"])
def add_workout():
    data = request.get_json()

    date = data["date"]
    lift = data["lift"]
    weight = int(data["weight"])
    reps = int(data["reps"])
    sets = int(data["sets"])

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO workouts (date, lift, weight, reps, sets)
        VALUES (?, ?, ?, ?, ?)
    """, (date, lift, weight, reps, sets))

    conn.commit()
    workout_id = cursor.lastrowid
    conn.close()

    return jsonify({
        "id": workout_id,
        "date": date,
        "lift": lift,
        "weight": weight,
        "reps": reps,
        "sets": sets,
        "volume": weight * reps * sets
    }), 201


if __name__ == "__main__":
    app.run(debug=True, port=5050)