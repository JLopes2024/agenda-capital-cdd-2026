import { useEffect, useState } from "react";
import { getAgenda } from "./services/agendaService";

function App() {
  const [agenda, setAgenda] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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

  return (
    <div>
      <h1>Agenda Capital</h1>
      {agenda.map((item) => (
        <div key={item.id} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
          <h2>{item.titulo}</h2>
          <p>Data: {item.data}</p>
          <p>Status: {item.status}</p>
          <p>Categoria: {item.categoria}</p>
        </div>
      ))}
    </div>
  );
}

export default App;
