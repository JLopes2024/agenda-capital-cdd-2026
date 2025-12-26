import { useEffect, useState } from "react";
import Papa from "papaparse";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AgendaCard from "./components/AgendaCard";
import SkeletonCard from "./components/SkeletonCard";
import EmptyState from "./components/EmptyState";

function App() {
  const [loading, setLoading] = useState(true);
  const [agenda, setAgenda] = useState([]);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  const csvUrl =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vRnaM_JWWdPDCv8Bt166hr2khhTb1QBtURYWpi9D1YFbyNnBdgC11H4jNdy2gYjRzJhY-DOnEA4-gTM/pub?output=csv";

  // Tema dark/light
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Converte data DD/MM/YYYY -> YYYY-MM-DD
  const parseDateBr = (dateStr) => {
    if (!dateStr) return "";
    const [day, month, year] = dateStr.split("/");
    return `${year}-${month}-${day}`;
  };

  // Fetch CSV
  useEffect(() => {
    async function fetchAgenda() {
      setLoading(true);
      try {
        const res = await fetch(csvUrl);
        const csvText = await res.text();
        const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });

        const formatted = parsed.data.map((item, index) => {
          const normalized = {};
          Object.keys(item).forEach((key) => {
            const cleanKey = key
              .toLowerCase()
              .trim()
              .replace(/[:]/g, "")
              .replace(/\s+/g, "_");
            normalized[cleanKey] = item[key]?.trim() || "";
          });

          // Captura automaticamente qualquer coluna que contenha "pregador"
          const pregador = Object.keys(normalized)
            .filter((k) => k.includes("pregador"))
            .map((k) => normalized[k])
            .join(", ");

          return {
            id: index,
            titulo: normalized["nome_do_evento"] || "Sem título",
            data: parseDateBr(normalized["data"]),
            horario_inicio: normalized["horario_inicio"] || "",
            horario_fim: normalized["horario_encerramento"] || "",
            endereco: normalized["endereco_do_evento"] || "",
            cidade: normalized["informe_a_cidade"] || "",
            publico: normalized["qual_e_o_publico_do_evento"] || "",
            quantidade: normalized["quantidade_de_pessoas_estimadas"] || "",
            pregador: pregador || "",
                   status: normalized["status"] || "",
            anastasis: normalized["anastasis"] || "",
            observar: normalized["observar"] || "",
          };
        });

        setAgenda(formatted);
      } catch (err) {
        console.error("Erro ao buscar agenda:", err);
        setAgenda([]);
      }
      setLoading(false);
    }

    fetchAgenda();
  }, [csvUrl]);

  return (
    <div className="min-h-screen bg-gray-200 text-slate-900 dark:bg-black dark:text-slate-100 flex flex-col">
      {/* Tema */}
      <button
        aria-label="Alternar tema"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="fixed top-3 right-3 z-50 rounded-full bg-black/80 text-white px-3 py-2 text-sm shadow-lg dark:bg-white/10"
      >
        {theme === "dark" ? "☀️" : "🌙"}
      </button>

      <div className="px-3 pt-3">
        <Header />
      </div>

      <main className="flex-1 px-3">
        {loading ? (
          Array.from({ length: 7 }).map((_, i) => <SkeletonCard key={i} />)
        ) : agenda.length === 0 ? (
          <EmptyState filter="all" />
        ) : (
          <section className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {agenda.map((item) => (
              <AgendaCard key={item.id} {...item} />
            ))}
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
