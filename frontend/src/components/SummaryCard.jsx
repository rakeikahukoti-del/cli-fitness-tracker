function SummaryCard({ title, value }) {
  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        padding: "2rem",
        borderRadius: "18px",
        textAlign: "center",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: "0.9rem",
          fontWeight: "600",
          color: "#6b7280",
          textTransform: "uppercase",
          letterSpacing: "0.05em"
        }}
      >
        {title}
      </p>

      <h2
        style={{
          margin: "0.75rem 0 0",
          fontSize: "2.25rem",
          fontWeight: "800",
          color: "#e5e7eb"
        }}
      >
        {value}
      </h2>
    </div>
  )
}

export default SummaryCard