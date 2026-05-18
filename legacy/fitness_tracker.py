import sqlite3
from datetime import datetime

exercises = ["bench press", "deadlift", "squat"]


def setup_database():
    conn = sqlite3.connect("fitness_tracker.db")
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS workouts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT,
            lift TEXT,
            weight INTEGER,
            reps INTEGER,
            sets INTEGER
        )
    """)

    conn.commit()
    conn.close()


def get_connection():
    return sqlite3.connect("fitness_tracker.db")


def save_workout(date, lift, weight, reps, sets):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO workouts (date, lift, weight, reps, sets)
        VALUES (?, ?, ?, ?, ?)
    """, (date, lift, weight, reps, sets))

    conn.commit()
    conn.close()


def load_workouts():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""SELECT date, lift, weight, reps, sets FROM workouts ORDER BY date""")

    rows = cursor.fetchall()

    conn.close()

    workouts = []

    for row in rows:
        workouts.append({
            "date": row[0],
            "lift": row[1],
            "weight": row[2],
            "reps": row[3],
            "sets": row[4],
            "volume": row[2] * row[3] * row[4]
        })

    return workouts


def add_workout():
    while True:
        print("--------------------------------")
        print("ADDING NEW WORKOUT")
        print("--------------------------------")
        print("\nEnter new workout. Type 'done' when finished\n")

        while True:
            workout_date = input("Date (DD-MM-YYYY): ").strip()

            if workout_date.lower() == "done":
                break

            try:
                datetime.strptime(workout_date, "%d-%m-%Y")
                break

            except ValueError:
                print("Invalid date, try again\n")

        if workout_date.lower() == "done":
            print(f"\nReturning to menu...\n")
            break

        while True:
            workout_lift = str(
                input("Lift (Bench Press, Deadlift, Squat): ")).lower().strip()

            if workout_lift in exercises:
                break

            else:
                print("Invalid option, try again\n")

        while True:
            try:
                workout_weight = int(input("Weight (kg): "))

                if (workout_weight > 0) and (workout_weight <= 400):
                    break

                else:
                    print("Invalid value, try again (1-400)\n")

            except ValueError:
                print("Please enter a valid value\n")

        while True:
            try:
                workout_reps = int(input("Reps: "))

                if (workout_reps > 0) and (workout_reps <= 100):
                    break

                else:
                    print("Invalid value, try again (1-100)\n")

            except ValueError:
                print("Please enter a valid value\n")

        while True:
            try:
                workout_sets = int(input("Sets: "))

                if (workout_sets > 0) and (workout_sets <= 10):
                    break

                else:
                    print("Invalid value, try again (1-10)\n")

            except ValueError:
                print("Please enter a valid value\n")

        save_workout(workout_date, workout_lift,
                     workout_weight, workout_reps, workout_sets)
        print("\nWorkout saved\n")


def view_workouts():
    filter_lift = input(
        "\nFilter by lift (bench press / squat / deadlift / all): ").lower().strip()

    conn = get_connection()
    cursor = conn.cursor()

    if filter_lift == "all":
        cursor.execute(
            """SELECT date, lift, weight, reps, sets FROM workouts """)
        
    elif filter_lift not in exercises and filter_lift != "all":
        print("\nInvalid filter.\n")
        return

    else:
        cursor.execute(
            """SELECT date, lift, weight, reps, sets FROM workouts WHERE lift = ?""", (filter_lift,))

    rows = cursor.fetchall()

    conn.close()

    if len(rows) == 0:
        print("\nNo workouts found.\n")

    else:
        for row in rows:
            date, lift, weight, reps, sets = row

            print(
                f"\n{date} | " f"{lift.title()} | " f"{weight}kg x {reps} reps x {sets} sets")
        print("")


def get_total_sessions():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""SELECT COUNT(*) FROM workouts""")
    total = cursor.fetchone()[0]

    conn.close()

    return total


def get_total_dates():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""SELECT COUNT(DISTINCT date) FROM workouts""")
    total = cursor.fetchone()[0]

    conn.close()

    return total


def get_total_volume():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""SELECT SUM(weight * reps * sets) FROM workouts""")
    total = cursor.fetchone()[0]

    conn.close()

    return total


def get_most_trained_lift():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT lift, COUNT(*)
        FROM workouts
        GROUP BY lift
        ORDER BY COUNT(*) DESC
        LIMIT 1
    """)

    result = cursor.fetchone()
    conn.close()
    return result


def get_best_volume_session():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT date, lift, weight * reps * sets AS volume
        FROM workouts
        ORDER BY volume DESC
        LIMIT 1
    """)

    result = cursor.fetchone()
    conn.close()
    return result


def get_volume_per_lift():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """SELECT lift, SUM(weight * reps * sets) FROM workouts GROUP BY lift""")
    results = cursor.fetchall()

    conn.close()

    return results


def get_max_lifts():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""SELECT lift, MAX(weight) FROM workouts GROUP BY lift""")
    results = cursor.fetchall()

    conn.close()

    return results


def get_daily_breakdown():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT date, SUM(weight * reps * sets), COUNT(*)
        FROM workouts
        GROUP BY date
        ORDER BY date
    """)

    results = cursor.fetchall()
    conn.close()
    return results


def view_summary():
    workouts = load_workouts()

    if len(workouts) == 0:
        print("\nNo workouts recorded.\n")

    else:
        total_sessions = get_total_sessions()
        days_trained = get_total_dates()
        total_volume = get_total_volume()
        average_volume = total_volume / total_sessions

        most_trained_lift = get_most_trained_lift()
        best_volume_session = get_best_volume_session()
        volume_per_lift = get_volume_per_lift()
        max_lifts = get_max_lifts()
        daily_breakdown = get_daily_breakdown()

        print("\nOverview")
        print(f"Sessions logged: {total_sessions}")
        print(f"Days trained: {days_trained}")
        print(f"Total volume: {total_volume:,}kg")
        print(f"Average volume per session: {average_volume:,.2f}kg")

        print("\nMost Trained Lift")
        print(
            f"{most_trained_lift[0].title()} — {most_trained_lift[1]} session(s)")

        print("\nBest Volume Session")
        print(
            f"{best_volume_session[0]} | "
            f"{best_volume_session[1].title()} | "
            f"{best_volume_session[2]:,}kg"
        )

        print("\nVolume Per Lift")
        for lift, volume in volume_per_lift:
            print(f"{lift.title()}: {volume:,}kg")

        print("\nMax Lifts")
        for lift, max_weight in max_lifts:
            print(f"{lift.title()}: {max_weight}kg")

        print("\nDaily Breakdown")
        for date, volume, sessions in daily_breakdown:
            print(f"{date}: {volume:,}kg | {sessions} session(s)")

        print("")


def reset_workouts():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM workouts")
    cursor.execute("DELETE FROM sqlite_sequence WHERE name='workouts'")

    conn.commit()
    conn.close()


setup_database()

while True:
    print("--------------------------------")
    print("CLI FITNESS TRACKER")
    print("--------------------------------\n")

    print("1. Add New Workout")
    print("2. View Previous Workouts")
    print("3. View Overall Summary")
    print("4. Reset Statistics")
    print("5. Exit Program\n")

    user_input = input("Enter Value (1-5): ")

    # ADDING A NEW WORKOUT
    if user_input.strip() == "1":
        add_workout()

    # VIEWING PREVIOUS WORKOUTS
    elif user_input.strip() == "2":
        print("--------------------------------")
        print("PREVIOUS WORKOUTS")
        print("--------------------------------")

        view_workouts()

    # VIEWING SUMMARY
    elif user_input.strip() == "3":
        print("--------------------------------")
        print("WORKOUT SUMMARY")
        print("--------------------------------")

        view_summary()

    # RESETTING STATISTICS
    elif user_input.strip() == "4":
        print("--------------------------------")
        print("RESETTING STATISTICS")
        print("--------------------------------")

        user_choice = input("\nAre you sure (yes/no): ").lower().strip()

        if user_choice == "yes":
            reset_workouts()
            print("\nRESET SUCCESSFUL\n")

        else:
            print("\nRESET CANCELLED\n")

    # EXITING PROGRAM
    elif user_input.strip() == "5":
        print("--------------------------------")
        print("EXITING PROGRAM")
        print("--------------------------------")

        break

    else:
        print("Invalid response, try again\n")
