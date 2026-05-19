function WorkoutList({ workouts }) {
  if (workouts.length === 0) {
    return (
      <p style={{ color: "#d1d5db" }}>
        No workouts logged yet.
      </p>
    )
  }

  return (
    <div>
      <h2
        style={{
          color: "#f9fafb",
          marginBottom: "1rem"
        }}
      >
        Previous Workouts
      </h2>

      <div
        style={{
          display: "grid",
          gap: "1rem"
        }}
      >
        {workouts.map((workout, index) => (
          <div
            key={index}
            style={{
              backgroundColor: "#1f2937",
              border: workout.isPR
                ? "1px solid #22c55e"
                : "1px solid #374151",
              padding: "1.5rem",
              borderRadius: "12px"
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "0.75rem"
              }}
            >
              <h3
                style={{
                  margin: 0,
                  color: "#f9fafb",
                  textTransform: "capitalize"
                }}
              >
                {workout.lift}
              </h3>

              {workout.isPR && (
                <span
                  style={{
                    color: "#22c55e",
                    fontWeight: "bold",
                    fontSize: "1rem"
                  }}
                >
                  🏆 PR
                </span>
              )}
            </div>

            <p style={textStyle}>
              Date: {workout.date}
            </p>

            <p style={textStyle}>
              {workout.weight}kg × {workout.reps} reps × {workout.sets} sets
            </p>

            <p style={textStyle}>
              Volume: {workout.volume.toLocaleString()}kg
            </p>

            {workout.isPR && (
              <div
                style={{
                  marginTop: "1rem",
                  color: "#22c55e"
                }}
              >
                <p style={{ margin: 0 }}>
                  {workout.previousMax === 0
                    ? `First ${workout.lift} PR`
                    : `+${workout.improvement}kg (${workout.improvementPercent.toFixed(1)}%)`}
                </p>

                <p style={{ marginTop: "0.35rem" }}>
                  Next target: {workout.nextTarget}kg
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

const textStyle = {
  color: "#e5e7eb",
  margin: "0.6rem 0",
  fontWeight: "600",
  lineHeight: "1.5"
}

export default WorkoutList