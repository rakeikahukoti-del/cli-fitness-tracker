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

  const inputStyle = {
    padding: "0.75rem",
    borderRadius: "8px",
    border: "1px solid #ccc",
    width: "100%",
    boxSizing: "border-box"
  }

  const buttonStyle = {
    padding: "0.75rem",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer"
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
      <h2>Add Workout</h2>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          width: "300px"
        }}
      >
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        <select
          name="lift"
          value={formData.lift}
          onChange={handleChange}
          style={inputStyle}
        >
          <option value="bench press">Bench Press</option>
          <option value="squat">Squat</option>
          <option value="deadlift">Deadlift</option>
        </select>

        <input
          type="number"
          name="weight"
          placeholder="Weight"
          value={formData.weight}
          onChange={handleChange}
          required
          min="1"
          style={inputStyle}
        />

        <input
          type="number"
          name="reps"
          placeholder="Reps"
          value={formData.reps}
          onChange={handleChange}
          required
          min="1"
          style={inputStyle}
        />

        <input
          type="number"
          name="sets"
          placeholder="Sets"
          value={formData.sets}
          onChange={handleChange}
          required
          min="1"
          style={inputStyle}
        />

        <button type="submit" style={buttonStyle}>
          Save Workout
        </button>
      </div>
    </form>
  )
}

export default WorkoutForm