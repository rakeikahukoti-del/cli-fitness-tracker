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

    if (
      formData.date === "" ||
      formData.lift === "" ||
      formData.weight === "" ||
      formData.reps === "" ||
      formData.sets === ""
    ) {
      alert("Please fill in all fields.")
      return
    }

    if (
      Number(formData.weight) <= 0 ||
      Number(formData.reps) <= 0 ||
      Number(formData.sets) <= 0
    ) {
      alert("Weight, reps, and sets must be greater than 0.")
      return
    }

    onAddWorkout({
      ...formData,
      weight: Number(formData.weight),
      reps: Number(formData.reps),
      sets: Number(formData.sets),
      volume:
        Number(formData.weight) *
        Number(formData.reps) *
        Number(formData.sets)
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
                required
                />
            </div>

            <div>
                <label>Lift:    </label>
                <select
                name="lift"
                value={formData.lift}
                onChange={handleChange}
                required
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
                required
                min="1"
                />
            </div>

            <div>
                <label>Reps:    </label>
                <input
                type="number"
                name="reps"
                value={formData.reps}
                onChange={handleChange}
                required
                min="1"
                />
            </div>

            <div>
                <label>Sets:    </label>
                <input
                type="number"
                name="sets"
                value={formData.sets}
                onChange={handleChange}
                required
                min="1"
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