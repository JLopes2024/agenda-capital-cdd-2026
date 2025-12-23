import { useEffect, useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AgendaCard from "./components/AgendaCard";
import SkeletonCard from "./components/SkeletonCard";
import { getAgenda } from "./services/agendaService";

function App() {
  const [loading, setLoading] = useState(true);
  const [agenda, setAgenda] = useState([]);
  const [filter, setFilter] = useState("all");
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "dark"
  );

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    setTimeout(() => {
      setAgenda(getAgenda());
      setLoading(false);
    }, 1200);
  }, []);

  const filteredAgenda = agenda.filter((item) => {
    if (filter === "all") return true;
    return item.status === filter;
  });

  return (
    <div className="app">
      {/* BOTÃO DE TEMA */}
      <button
        className="theme-toggle"
        aria-label="Alternar tema"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        {theme === "dark" ? "☀️" : "🌙"}
      </button>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="container">
        <Header />

        {/* FILTROS */}
        <nav className="filters" aria-label="Filtro de agenda">
          <button
            className={filter === "all" ? "active" : ""}
            aria-pressed={filter === "all"}
            onClick={() => setFilter("all")}
          >
            Todos
          </button>

          <button
            className={filter === "done" ? "active" : ""}
            aria-pressed={filter === "done"}
            onClick={() => setFilter("done")}
          >
            Concluídas
          </button>

          <button
            className={filter === "pending" ? "active" : ""}
            aria-pressed={filter === "pending"}
            onClick={() => setFilter("pending")}
          >
            Previstas
          </button>
        </nav>

        {/* LISTA */}
        <section className="agenda-list">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))
            : filteredAgenda.map((item) => (
                <AgendaCard
                  key={item.id}
                  titulo={item.titulo}
                  data={item.data}
                  status={item.status}
                />
              ))}
        </section>
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}

export default App;
