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

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const parseDateBr = (dateStr) => {
    if (!dateStr) return "";
    const [d, m, y] = dateStr.split("/");
    return `${y}-${m}-${d}`;
  };

  useEffect(() => {
    async function fetchAgenda() {
      setLoading(true);
      try {
        const res = await fetch(csvUrl);
        const csvText = await res.text();
        const parsed = Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
        });

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
            cidade: normalized["informe_a_cidade"] || "",

            pregador,
            status: normalized["status"] || "",
            anastasis: normalized["anastasis"] || "",
            observar: normalized["obs"] || "",

            ministerio:
              normalized[
                "agora_precisamos_que_voce_sinalize_o_que_e_o_seu_evento"
              ] || "",

            musica_recursos:
              normalized[
                "se_voce_marcou_ministerio_de_musica_na_secao_anterior_marque_o_que_estara_disponivel_no_local_para_ser_usado_pelo_ministerio"
              ] || "",

            musica_instrumentos:
              normalized[
                "descreva_brevemente_a_quantidade_dos_instrumentos_que_estarao_disponiveis_no_local_do_evento_para_uso_por_favor_por_exemplo_caixas_microfones_partes_da_bateria_etc"
              ] || "",

            quantidade_intercessao:
              normalized[
                "marque_aqui_a_quantidade_de_pessoas_que_serao_necessarias_para_a_intercessao"
              ] || "",

            tema:
              normalized[
                "o_encontro_possui_um_tema_geral_se_sim_coloque_o_tema_aqui"
              ] || "",

            palavra_base:
              normalized[
                "ainda_sobre_o_tema_qual_e_a_palavra_biblica_de_base"
              ] || "",
          };
        });

        setAgenda(formatted);
      } catch (e) {
        console.error(e);
        setAgenda([]);
      }
      setLoading(false);
    }

    fetchAgenda();
  }, [csvUrl]);

  return (
    <div className="min-h-screen bg-gray-200 text-slate-900 dark:bg-black dark:text-slate-100 flex flex-col">
      <button
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
          <EmptyState />
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
