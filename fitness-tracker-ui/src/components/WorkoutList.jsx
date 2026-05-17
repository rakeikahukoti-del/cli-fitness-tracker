function WorkoutList({ workouts }) {
  if (workouts.length === 0) {
    return <p>No workouts logged yet.</p>
  }

  return (
    <div>
      <h2>Previous Workouts</h2>

      <div style={{ display: "grid", gap: "1rem" }}>
        {workouts.map((workout, index) => (
          <div
            key={index}
            style={{
              border: workout.isPR
                ? "2px solid green"
                : "1px solid #ddd",
              padding: "1rem",
              borderRadius: "10px"
            }}
          >
            <h3>{workout.lift}</h3>
            <p>Date: {workout.date}</p>

            <p>{workout.weight}kg × {workout.reps} reps × {workout.sets} sets</p>
            <p>Volume: {workout.volume.toLocaleString()}kg</p>

            {workout.isPR && (
              <div style={{ color: "green", fontWeight: "bold" }}>
                <p>
                  {workout.previousMax === 0
                    ? `🏆 First ${workout.lift} PR: ${workout.weight}kg`
                    : `🏆 New PR: ${workout.previousMax}kg → ${workout.weight}kg (+${workout.improvement}kg / ${workout.improvementPercent.toFixed(1)}%)`}
                </p>

                <p>Next target: {workout.nextTarget}kg</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default WorkoutList