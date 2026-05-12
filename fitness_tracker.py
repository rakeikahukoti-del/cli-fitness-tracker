import os
import sqlite3
from datetime import datetime
from collections import Counter

user_workout = "user_workout.txt"
headers = ["date", "lift", "weight", "reps", "sets"]
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



def save_workout(date, lift, weight, reps, sets):
    conn = sqlite3.connect("fitness_tracker.db")
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO workouts (date, lift, weight, reps, sets)
        VALUES (?, ?, ?, ?, ?)
    """, (date, lift, weight, reps, sets))

    conn.commit()
    conn.close()



def load_workouts():
    conn = sqlite3.connect("fitness_tracker.db")
    cursor = conn.cursor()

    cursor.execute("""
        SELECT date, lift, weight, reps, sets
        FROM workouts
    """)

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
        print("\nEnter new workout. Type 'done' to print summary\n")

        while True:
            workout_date = input("Date (DD-MM-YYYY): ").strip()

            if workout_date.lower() == "done":
                break

            try:
                datetime.strptime(workout_date, "%d-%m-%Y")
                # file.write(workout_date + ",")
                break

            except ValueError:
                print("Invalid date, try again\n")

        if workout_date.lower() == "done":
            print(f"\nReturning to menu...\n")
            break

        while True:
            workout_lift = str(input("Lift (Bench Press, Deadlift, Squat): ")).lower().strip()

            if workout_lift in exercises:
                # file.write(workout_lift + ",")
                break

            else:
                print("Invalid option, try again\n")

        while True:
            try:
                workout_weight = int(input("Weight (kg): "))

                if (workout_weight > 0) and (workout_weight <= 400):
                    # file.write(str(workout_weight) + ",")
                    break

                else:
                    print("Invalid value, try again (1-400)\n")

            except ValueError:
                print("Please enter a valid value\n")

        while True:
            try:
                workout_reps = int(input("Reps: "))

                if (workout_reps > 0) and (workout_reps <= 100):
                    # file.write(str(workout_reps) + ",")
                    break

                else:
                    print("Invalid value, try again (1-100)\n")

            except ValueError:
                print("Please enter a valid value\n")

        while True:
            try:
                workout_sets = int(input("Sets: "))

                if (workout_sets > 0) and (workout_sets <= 10):
                    # file.write(str(workout_sets) + "\n")
                    break

                else:
                    print("Invalid value, try again (1-10)\n")

            except ValueError:
                print("Please enter a valid value\n")

        save_workout(workout_date,workout_lift,workout_weight,workout_reps,workout_sets)
        print("\nWorkout saved\n")



def view_workouts():
    print("--------------------------------")
    print("PREVIOUS WORKOUTS")
    print("--------------------------------")

    workouts = load_workouts()

    if len(workouts) == 0:
        print("\nNo workout recorded\n")

    else:
        for w in workouts:
            print(
                f"\n{w['date']} | "
                f"{w['lift'].title()} | "
                f"{w['weight']}kg x {w['reps']} reps x {w['sets']} sets"
            )

        print("")



def view_summary():
    print("--------------------------------")
    print("WORKOUT SUMMARY")
    print("--------------------------------")

    workouts = load_workouts()

    if len(workouts) == 0:
        print("\nNo workouts recorded.\n")

    else:
        total_volume = 0
        total_volume_by_lift = {}
        max_by_lift = {}
        dates = set()
        lift_count = Counter()
        volume_by_date = {}
        sessions_by_date = {}
        best_session = workouts[0]

        for w in workouts:
            lift = w["lift"]
            volume = w["volume"]
            date = w["date"]

            volume_by_date[date] = volume_by_date.get(date, 0) + volume
            sessions_by_date[date] = sessions_by_date.get(date, 0) + 1

            total_volume += volume
            dates.add(w["date"])

            total_volume_by_lift[lift] = total_volume_by_lift.get(lift, 0) + volume
            lift_count[lift] += 1

            if w["weight"] > max_by_lift.get(lift, 0):
                max_by_lift[lift] = w["weight"]

            if volume > best_session["volume"]:
                best_session = w

        average_volume = total_volume / len(workouts)
        most_trained_lift = lift_count.most_common(1)[0]       

        print(f"\nSessions logged: {len(workouts)}")
        print(f"Days trained: {len(dates)}")
        print(f"Total volume: {total_volume:,}kg")
        print(f"Average volume per session: {average_volume:,.2f}kg")

        print("\nMost trained lift:")
        print(f"    - {most_trained_lift[0].title()} ({most_trained_lift[1]} sessions)")

        print("\nBest volume session:")
        print(
            f"{best_session['date']} | "
            f"{best_session['lift'].title()} | "
            f"{best_session['volume']:,}kg"
        )

        print("\nVolume per lift:")
        for lift, volume in total_volume_by_lift.items():
            print(f"    - {lift.title()}: {volume:,}kg")

        print("\nMax lifts:")
        for lift, max_weight in max_by_lift.items():
            print(f"    - {lift.title()}: {max_weight}kg") 

        print("\nDaily Breakdown:")
        for date in sorted(volume_by_date.keys()):
            volume = volume_by_date[date]
            sessions = sessions_by_date[date]
            print(f"{date}: {volume:,}kg | {sessions} session(s)")

        print("")


def reset_workouts():
    conn = sqlite3.connect("fitness_tracker.db")
    cursor = conn.cursor()

    cursor.execute("DELETE FROM workouts")
    cursor.execute("DELETE FROM sqlite_sequence WHERE name='workouts'")

    conn.commit()
    conn.close()


while True:
    setup_database()

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
        view_workouts()            



    # VIEWING SUMMARY
    elif user_input.strip() == "3":
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
