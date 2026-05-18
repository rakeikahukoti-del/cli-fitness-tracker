import { useEffect, useState } from "react"
import WorkoutForm from "./components/WorkoutForm"
import WorkoutList from "./components/WorkoutList"
import SummaryCard from "./components/SummaryCard"
import "./App.css"

const API_URL = "http://localhost:5050"

function App() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [workouts, setWorkouts] = useState([])
  const [selectedLift, setSelectedLift] = useState("all")

  async function fetchWorkouts() {
    setLoading(true)
    setError("")

    try {
      const response = await fetch(`${API_URL}/workouts`)

      if (!response.ok) {
        throw new Error("Failed to fetch workouts")
      }

      const data = await response.json()
      const workoutsWithPR = addPRData(data)

      setWorkouts(workoutsWithPR)
    } catch (error) {
      setError("Could not load workouts. Make sure backend is running.")
      console.log("Error fetching workouts:", error)
    } finally {
      setLoading(false)
    }
  }

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
    if (lift === "bench press") {
      return weight + 2.5
    }

    if (lift === "squat") {
      return weight + 5
    }

    if (lift === "deadlift") {
      return weight + 5
    }

    return weight + 2.5
  }

  function addPRData(workoutsData) {
    const maxes = {}

    return workoutsData.map(workout => {
      const previousMax = maxes[workout.lift] || 0

      const isPR = workout.weight > previousMax

      const improvement = isPR
        ? workout.weight - previousMax
        : 0

      const improvementPercent =
        isPR && previousMax > 0
          ? (improvement / previousMax) * 100
          : 0

      const nextTarget = isPR
        ? getNextTarget(workout.lift, workout.weight)
        : null

      if (workout.weight > previousMax) {
        maxes[workout.lift] = workout.weight
      }

      return {
        ...workout,
        isPR,
        previousMax,
        improvement,
        improvementPercent,
        nextTarget
      }
    })
  }

  async function addWorkout(newWorkout) {
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

    const workoutToSave = {
      ...newWorkout,
      isPR,
      previousMax,
      improvement,
      improvementPercent,
      nextTarget
    }

    try {
      const response = await fetch(`${API_URL}/workouts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(workoutToSave)
      })

      if (!response.ok) {
        throw new Error("Failed to save workout")
      }

      const savedWorkout = await response.json()

      const savedWorkoutWithPR = {
        ...savedWorkout,
        isPR,
        previousMax,
        improvement,
        improvementPercent,
        nextTarget
      }

      setWorkouts([...workouts, savedWorkoutWithPR])
    } catch (error) {
      setError("Could not save workout. Make sure backend is running.")
      console.log("Error saving workout:", error)
    }
  }

  async function resetWorkouts() {
    const confirmReset = window.confirm(
      "Are you sure you want to delete all workouts?"
    )

    if (!confirmReset) {
      return
    }

    try {
      const response = await fetch(`${API_URL}/workouts`, {
        method: "DELETE"
      })

      if (!response.ok) {
        throw new Error("Failed to reset workouts")
      }

      setWorkouts([])
    } catch (error) {
      console.log("Error resetting workouts:", error)
    }
  }

  useEffect(() => {
    fetchWorkouts()
  }, [])

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

      {loading && <p>Loading workouts...</p>}

      {error && (
        <p style={{ color: "red", fontWeight: "bold" }}>
          {error}
        </p>
      )}
      
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
      <button onClick={resetWorkouts}>
        Reset All Workouts
      </button>
      <WorkoutList workouts={filteredWorkouts} />
    </div>
  )
}

export default App