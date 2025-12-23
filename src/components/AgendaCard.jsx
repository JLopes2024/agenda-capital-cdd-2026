export default function AgendaCard({ titulo, data, status }) {
  return (
    <div className="card">
      <h2>{titulo}</h2>
      <span>{data}</span>

      <div className={`status ${status}`}>
        {status === "done" ? "Concluída" : "Prevista"}
      </div>
    </div>
  );
}
