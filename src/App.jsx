import { useEffect, useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AgendaCard from "./components/AgendaCard";
import SkeletonCard from "./components/SkeletonCard";
import { getAgenda } from "./services/agendaService";
import Button from "./components/Button";

function App() {
  const [loading, setLoading] = useState(true);
  const [agenda, setAgenda] = useState([]);
  const [filter, setFilter] = useState("all");
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "dark"
  );

  /* Tema */
  useEffect(() => {
    document.documentElement.classList.toggle(
      "dark",
      theme === "dark"
    );
    localStorage.setItem("theme", theme);
  }, [theme]);

  /* Mock loading */
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
    <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-slate-100 flex flex-col">
      {/* BOTÃO DE TEMA */}
      <button
        aria-label="Alternar tema"
        onClick={() =>
          setTheme(theme === "dark" ? "light" : "dark")
        }
        className="fixed top-3 right-3 z-50 rounded-full bg-slate-800 text-white px-3 py-2 text-sm shadow-lg dark:bg-slate-700"
      >
        {theme === "dark" ? "☀️" : "🌙"}
      </button>

      {/* HEADER */}
      <div className="px-3 pt-3">
        <Header />
      </div>

      {/* CONTEÚDO */}
      <main className="flex-1 px-3">
        {/* FILTROS */}
        <div className="mb-4 flex gap-2">
          <Button
            active={filter === "all"}
            onClick={() => setFilter("all")}
          >
            Todos
          </Button>

          <Button
            active={filter === "done"}
            onClick={() => setFilter("done")}
          >
            Concluídas
          </Button>

          <Button
            active={filter === "pending"}
            onClick={() => setFilter("pending")}
          >
            Previstas
          </Button>
        </div>

        {/* LISTA */}
        <section className="grid gap-3">
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
