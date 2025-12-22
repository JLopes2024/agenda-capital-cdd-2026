function AgendaCard({ item }) {
  const statusColor = item.status === "concluida" ? "#4CAF50" : "#FF9800";

  return (
    <div
      style={{
        border: `2px solid ${statusColor}`,
        borderRadius: "8px",
        padding: "15px",
        margin: "10px 0",
        backgroundColor: "#f9f9f9",
      }}
    >
      <h2 style={{ color: statusColor }}>{item.titulo}</h2>
      <p><strong>Data:</strong> {item.data}</p>
      <p><strong>Status:</strong> {item.status}</p>
      <p><strong>Categoria:</strong> {item.categoria}</p>
    </div>
  );
}

export default AgendaCard;
