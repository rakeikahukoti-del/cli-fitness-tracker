import { useState } from "react"
import WorkoutForm from "./components/WorkoutForm"
import WorkoutList from "./components/WorkoutList"
import SummaryCard from "./components/SummaryCard"
import "./App.css"

function App() {
  const [workouts, setWorkouts] = useState([])

  const [selectedLift, setSelectedLift] = useState("all")

  function addWorkout(newWorkout) {
    setWorkouts([...workouts, newWorkout])
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