import { useEffect, useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AgendaCard from "./components/AgendaCard";
import SkeletonCard from "./components/SkeletonCard";
import EmptyState from "./components/EmptyState";
import { getAgenda } from "./services/agendaService";
import Button from "./components/Button";

function App() {
  const [loading, setLoading] = useState(true);
  const [agenda, setAgenda] = useState([]);
  const [filter, setFilter] = useState("all");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  /* Tema */
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  /* Buscar agenda do Google Sheets */
  useEffect(() => {
    async function fetchAgenda() {
      setLoading(true);
      try {
        const data = await getAgenda();
        setAgenda(data);
      } catch (error) {
        console.error("Erro ao buscar agenda:", error);
        setAgenda([]);
      } finally {
        setLoading(false);
      }
    }
    fetchAgenda();
  }, []);

  /* Filtro por missão */
  const filteredAgenda = agenda.filter((item) => {
    if (filter === "all") return true;
    return item.missao === filter;
  });

  /* Lista única de missões para criar botões de filtro */
  const missoes = Array.from(new Set(agenda.map((a) => a.missao).filter(Boolean)));

  return (
    <div className="min-h-screen bg-gray-200 text-slate-900 dark:bg-black dark:text-slate-100 flex flex-col">
      {/* BOTÃO DE TEMA */}
      <button
        aria-label="Alternar tema"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="fixed top-3 right-3 z-50 rounded-full bg-black/80 text-white px-3 py-2 text-sm shadow-lg dark:bg-white/10"
      >
        {theme === "dark" ? "☀️" : "🌙"}
      </button>

      {/* HEADER */}
      <div className="px-3 pt-3">
        <Header />
      </div>

      {/* FILTROS */}
      <main className="flex-1 px-3">
        <div className="mb-4 flex gap-2 flex-wrap">
          <Button active={filter === "all"} onClick={() => setFilter("all")}>
            Todos
          </Button>
          {missoes.map((m) => (
            <Button key={m} active={filter === m} onClick={() => setFilter(m)}>
              {m}
            </Button>
          ))}
        </div>

        {/* LISTA */}
        <section className="grid gap-3">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
          ) : filteredAgenda.length === 0 ? (
            <EmptyState filter={filter} />
          ) : (
            filteredAgenda.map((item) => (
              <AgendaCard
                key={item.id}
                titulo={item.titulo}
                endereco={item.endereco}
                cidade={item.cidade}
                data={item.data}          
                horaInicio={item.horaInicio} 
                horaFim={item.horaFim}       
                pregador={item.pregador}
              
              />
            ))
          )}
        </section>
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}

export default App;
