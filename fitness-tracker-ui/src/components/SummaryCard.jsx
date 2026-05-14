function SummaryCard({ title, value }) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        padding: "1rem",
        borderRadius: "12px",
        minWidth: "180px"
      }}
    >
      <p style={{ margin: 0 }}>{title}</p>
      <h2 style={{ margin: "0.5rem 0 0" }}>{value}</h2>
    </div>
  )
}

export default SummaryCard