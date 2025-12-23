import { useEffect, useState } from "react";
import { getAgenda } from "./services/agendaService";
import AgendaCard from "./components/AgendaCard";
import SkeletonCard from "./components/SkeletonCard";

function App() {
  const [agenda, setAgenda] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState("todos");

  useEffect(() => {
    async function loadAgenda() {
      try {
        const data = await getAgenda();
        setAgenda(data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    loadAgenda();
  }, []);

  const filteredAgenda =
    filter === "todos"
      ? agenda
      : agenda.filter((item) => item.status === filter);

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "24px" }}>
      <header style={{ textAlign: "center", marginBottom: "24px" }}>
        <h1 style={{ marginBottom: "8px" }}>Agenda Capital</h1>
        <p style={{ color: "#666" }}>
          Visualização clara de agendas a partir de planilhas
        </p>
      </header>

      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <button style={btn} onClick={() => setFilter("todos")}>Todos</button>
        <button style={btn} onClick={() => setFilter("concluida")}>Concluídas</button>
        <button style={btn} onClick={() => setFilter("prevista")}>Previstas</button>
      </div>

      {loading && (
        <>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </>
      )}

      {error && <p>⚠️ Erro ao carregar agenda.</p>}

      {!loading && !error && filteredAgenda.length === 0 && (
        <p>Nenhuma agenda encontrada.</p>
      )}

      {!loading && !error &&
        filteredAgenda.map((item) => (
          <AgendaCard key={item.id} item={item} />
        ))}
    </div>
  );
}

const btn = {
  margin: "0 6px",
  padding: "8px 16px",
  border: "none",
  borderRadius: "6px",
  backgroundColor: "#1976d2",
  color: "#fff",
  cursor: "pointer"
};

export default App;
