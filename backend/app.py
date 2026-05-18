import sqlite3

from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def get_connection():
    return sqlite3.connect("../data/fitness_tracker.db")

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
        workout = {
            "id": row[0],
            "date": row[1],
            "lift": row[2],
            "weight": row[3],
            "reps": row[4],
            "sets": row[5],
            "volume": row[3] * row[4] * row[5]
        }

        workouts.append(workout)

    return jsonify(workouts)


if __name__ == "__main__":
    app.run(debug=True)