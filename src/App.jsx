import { useState } from "react";
import AgendaCard from "./components/AgendaCard";
import { getAgenda } from "./services/agendaService";

function App() {
  const agenda = getAgenda();
  const [filter, setFilter] = useState("all");

  const filteredAgenda = agenda.filter((item) => {
    if (filter === "all") return true;
    return item.status === filter;
  });

  return (
    <div className="container">
      <header>
        <h1>Agenda Capital</h1>
        <p>Agenda pública • 2026</p>
      </header>

      {/* FILTROS */}
      <div className="filters">
        <button
          className={filter === "all" ? "active" : ""}
          onClick={() => setFilter("all")}
        >
          Todos
        </button>

        <button
          className={filter === "done" ? "active" : ""}
          onClick={() => setFilter("done")}
        >
          Concluídas
        </button>

        <button
          className={filter === "pending" ? "active" : ""}
          onClick={() => setFilter("pending")}
        >
          Previstas
        </button>
      </div>

      <section className="agenda-list">
        {filteredAgenda.map((item) => (
          <AgendaCard
            key={item.id}
            titulo={item.titulo}
            data={item.data}
            status={item.status}
          />
        ))}
      </section>
    </div>
  );
}

export default App;
