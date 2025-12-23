function AgendaCard({ item }) {
  const isDone = item.status === "concluida";

  const statusColor = isDone ? "#2e7d32" : "#ef6c00";
  const statusLabel = isDone ? "Concluída" : "Prevista";

  return (
    <div
      style={{
        borderLeft: `6px solid ${statusColor}`,
        backgroundColor: "#fff",
        borderRadius: "8px",
        padding: "16px",
        marginBottom: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
      }}
    >
      <h2 style={{ margin: "0 0 8px 0", color: "#222" }}>
        {item.titulo}
      </h2>

      <p><strong>📅 Data:</strong> {item.data}</p>
      <p><strong>📌 Status:</strong> <span style={{ color: statusColor }}>{statusLabel}</span></p>
      <p><strong>🏷 Categoria:</strong> {item.categoria}</p>
    </div>
  );
}

export default AgendaCard;
