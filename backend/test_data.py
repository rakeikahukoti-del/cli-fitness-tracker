import sqlite3

DB_PATH = "../data/fitness_tracker.db"

conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

test_workouts = [
    ("2026-05-01", "bench press", 80, 5, 5),
    ("2026-05-02", "bench press", 85, 5, 5),
    ("2026-05-03", "bench press", 90, 3, 5),

    ("2026-05-04", "squat", 120, 5, 5),
    ("2026-05-05", "squat", 125, 5, 5),

    ("2026-05-06", "deadlift", 140, 5, 5),
    ("2026-05-07", "deadlift", 150, 3, 5)
]

cursor.executemany("""
    INSERT INTO workouts (date, lift, weight, reps, sets)
    VALUES (?, ?, ?, ?, ?)
""", test_workouts)

conn.commit()
conn.close()

print("Test data inserted.")