import { useState } from "react"

function WorkoutForm({ onAddWorkout }) {
  const [formData, setFormData] = useState({
    date: "",
    lift: "bench press",
    weight: "",
    reps: "",
    sets: ""
  })

  function handleChange(event) {
    const { name, value } = event.target

    setFormData({
      ...formData,
      [name]: value
    })
  }

  function handleSubmit(event) {
    event.preventDefault()

    onAddWorkout({
        ...formData,
        weight: Number(formData.weight),
        reps: Number(formData.reps),
        sets: Number(formData.sets),
        volume: Number(formData.weight) * Number(formData.reps) * Number(formData.sets)
        })

    setFormData({
      date: "",
      lift: "bench press",
      weight: "",
      reps: "",
      sets: ""
    })
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
        <h2>Add Workout</h2>

        <div style={{ display: "grid", gap: "1rem", maxWidth: "400px" }}>
            <div>
                <label>Date:    </label>
                <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                style={{ padding: "0.5rem", marginTop: "0.25rem" }}
                />
            </div>

            <div>
                <label>Lift:    </label>
                <select
                name="lift"
                value={formData.lift}
                onChange={handleChange}
                style={{ padding: "0.5rem", marginTop: "0.25rem" }}
                >
                <option value="bench press">Bench Press</option>
                <option value="squat">Squat</option>
                <option value="deadlift">Deadlift</option>
                </select>
            </div>

            <div>
                <label>Weight:  </label>
                <input
                type="float"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                style={{ padding: "0.5rem", marginTop: "0.25rem" }}
                />
            </div>

            <div>
                <label>Reps:    </label>
                <input
                type="number"
                name="reps"
                value={formData.reps}
                onChange={handleChange}
                style={{ padding: "0.5rem", marginTop: "0.25rem" }}
                />
            </div>

            <div>
                <label>Sets:    </label>
                <input
                type="number"
                name="sets"
                value={formData.sets}
                onChange={handleChange}
                style={{ padding: "0.5rem", marginTop: "0.25rem" }}
                />
            </div>

        </div>
        

        <button type="submit" style={{ marginTop: "1rem" }}>
            Save Workout
        </button>
    </form>
  )
}

export default WorkoutForm