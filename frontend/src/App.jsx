import { useState } from "react"
import WorkoutForm from "./components/WorkoutForm"
import WorkoutList from "./components/WorkoutList"
import SummaryCard from "./components/SummaryCard"
import "./App.css"


function App() {
  const [workouts, setWorkouts] = useState([])

  const [selectedLift, setSelectedLift] = useState("all")

  function getPreviousMax(lift) {
    const liftWorkouts = workouts.filter(
      workout => workout.lift === lift
    )

    if (liftWorkouts.length === 0) {
      return 0
    }

    return Math.max(
      ...liftWorkouts.map(workout => workout.weight)
    )
  }

  function getNextTarget(lift, weight) {
    if (lift === "bench press") return weight + 2.5
    if (lift === "squat") return weight + 5
    if (lift === "deadlift") return weight + 5

    return weight + 2.5
  }

  function addWorkout(newWorkout) {
    const previousMax = getPreviousMax(newWorkout.lift)
    const isPR = newWorkout.weight > previousMax

    const improvement = isPR ? newWorkout.weight - previousMax : 0

    const improvementPercent =
      isPR && previousMax > 0
        ? (improvement / previousMax) * 100
        : 0

    const nextTarget = isPR
      ? getNextTarget(newWorkout.lift, newWorkout.weight)
      : null

    const workoutWithPR = {
      ...newWorkout,
      isPR,
      previousMax,
      improvement,
      improvementPercent,
      nextTarget
    }

    setWorkouts([...workouts, workoutWithPR])
  }

  const totalSessions = workouts.length

  const totalVolume = workouts.reduce(
    (sum, workout) => sum + workout.volume,
    0
  )

  const maxLift =
    workouts.length > 0
      ? Math.max(...workouts.map(workout => workout.weight))
      : 0

  const filteredWorkouts =
    selectedLift === "all"
      ? workouts
      : workouts.filter(workout => workout.lift === selectedLift)

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial"}}>
      <h1>Fitness Tracker</h1>

      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "2rem"
        }}
      >
        <SummaryCard
          title="Total Sessions"
          value={totalSessions}
        />

        <SummaryCard
          title="Total Volume"
          value={`${totalVolume.toLocaleString()}kg`}
        />

        <SummaryCard
          title="Max Lift"
          value={`${maxLift}kg`}
        />
      </div>

      <WorkoutForm onAddWorkout={addWorkout} />

      <div style={{ marginBottom: "1rem" }}>
        <h2>Filter Workouts</h2>

        <button onClick={() => setSelectedLift("all") }>All</button>
        <button onClick={() => setSelectedLift("bench press")}>Bench Press</button>
        <button onClick={() => setSelectedLift("squat")}>Squat</button>
        <button onClick={() => setSelectedLift("deadlift")}>Deadlift</button>
      </div>

      <p>Showing: {selectedLift === "all" ? "All Workouts" : selectedLift}</p>
      <WorkoutList workouts={filteredWorkouts} />
    </div>
  )
}

export default App