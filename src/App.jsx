import AgendaCard from "./components/AgendaCard";
import { getAgenda } from "./services/agendaService";

function App() {
  const agenda = getAgenda();

  return (
    <div className="container">
      <header>
        <h1>Agenda Capital</h1>
        <p>Agenda pública • 2026</p>
      </header>

      <section className="agenda-list">
        {agenda.map((item) => (
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
