import { useEffect, useState } from "react";
import { getAgenda } from "./services/agendaService";
import AgendaCard from "./components/AgendaCard";

function App() {
  const [agenda, setAgenda] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState("todos"); // novo estado

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

  if (loading) return <p>🔄 Carregando agenda...</p>;
  if (error) return <p>⚠️ Erro ao carregar agenda</p>;

  const filteredAgenda =
    filter === "todos" ? agenda : agenda.filter((item) => item.status === filter);

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>Agenda Capital</h1>

      <div style={{ margin: "20px 0", textAlign: "center" }}>
        <button onClick={() => setFilter("todos")} style={{ margin: "0 5px" }}>Todos</button>
        <button onClick={() => setFilter("concluida")} style={{ margin: "0 5px" }}>Concluídas</button>
        <button onClick={() => setFilter("prevista")} style={{ margin: "0 5px" }}>Previstas</button>
      </div>

      {filteredAgenda.map((item) => (
        <AgendaCard key={item.id} item={item} />
      ))}

      {filteredAgenda.length === 0 && <p>Nenhuma tarefa encontrada.</p>}
    </div>
  );
}

export default App;
