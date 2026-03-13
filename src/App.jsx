import { useEffect, useMemo, useState } from "react";
import Papa from "papaparse";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AgendaCard from "./components/AgendaCard";
import SkeletonCard from "./components/SkeletonCard";
import EmptyState from "./components/EmptyState";
import DatasTravadas from "./components/DatasTravadas";

function App() {
  const [loading, setLoading] = useState(true);
  const [agenda, setAgenda] = useState([]);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  // 🔎 filtros
  const [statusFiltro, setStatusFiltro] = useState("TODOS");

  const csvUrl =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vRnaM_JWWdPDCv8Bt166hr2khhTb1QBtURYWpi9D1YFbyNnBdgC11H4jNdy2gYjRzJhY-DOnEA4-gTM/pub?output=csv";

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const parseDateBr = (dateStr) => {
    if (!dateStr) return "";
    const [d, m, y] = dateStr.split("/");
    if (!d || !m || !y) return "";
    return `${y}-${m}-${d}`;
  };

  const monthLabelPt = (isoDate) => {
    if (!isoDate) return "Sem data";
    const [y, m] = isoDate.split("-");
    if (!y || !m) return "Sem data";
    const map = {
      "01": "Janeiro",
      "02": "Fevereiro",
      "03": "Março",
      "04": "Abril",
      "05": "Maio",
      "06": "Junho",
      "07": "Julho",
      "08": "Agosto",
      "09": "Setembro",
      "10": "Outubro",
      "11": "Novembro",
      "12": "Dezembro",
    };
    return `${map[m] || "Mês inválido"} ${y}`;
  };

  useEffect(() => {
    async function fetchAgenda() {
      setLoading(true);
      try {
        const res = await fetch(csvUrl);
        if (!res.ok) throw new Error("Erro ao carregar CSV");

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
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .trim()
              .replace(/[:]/g, "")
              .replace(/\s+/g, "_");

            normalized[cleanKey] = item[key]?.trim() || "";
          });

          const pregador = Object.keys(normalized)
            .filter((k) => k.includes("pregador"))
            .map((k) => normalized[k])
            .filter(Boolean)
            .join(", ");

          const endereco = normalized["local_do_evento"] || "";
          const cep = normalized["informe_o_cep"] || "";
          const enderecoCompleto = [endereco, cep ? `CEP: ${cep}` : ""]
            .filter(Boolean)
            .join(" • ");

          const dataISO = parseDateBr(normalized["data"]);

          return {
            id: `${normalized["nome_do_evento"] || "evento"}-${index}`,
            titulo: normalized["nome_do_evento"] || "Sem título",
            data: dataISO,
            mes: monthLabelPt(dataISO), // ✅ novo: mês para separar
            horario_inicio: normalized["horario_inicio"] || "",
            horario_fim: normalized["horario_encerramento"] || "",
            cidade: normalized["informe_a_cidade"] || "",
            endereco: enderecoCompleto,
            pregador,
            status: normalized["status"] || "",
            anastasis: normalized["anastasis"] || "",
            observar: normalized["obs"] || "",
            ministerio:
              normalized[
                "agora_precisamos_que_voce_sinalize_o_que_e_o_seu_evento"
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

  // 📊 contadores por status
  const statusCount = useMemo(() => {
    const base = { PREVISTA: 0, CONFIRMADA: 0, CONCLUIDA: 0 };
    agenda.forEach((a) => {
      const key = a.status
        ?.normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toUpperCase();
      if (base[key] !== undefined) base[key]++;
    });
    return base;
  }, [agenda]);

  // 🔍 agenda filtrada (somente status)
  const agendaFiltrada = agenda.filter((item) => {
    const statusOk =
      statusFiltro === "TODOS" ||
      item.status
        ?.normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toUpperCase() === statusFiltro;

    return statusOk;
  });

  // ✅ agrupa por mês e já ordena pelos meses e datas
  const gruposPorMes = useMemo(() => {
    const sorted = [...agendaFiltrada].sort((a, b) =>
      (a.data || "").localeCompare(b.data || "")
    );

    const groups = new Map();
    sorted.forEach((item) => {
      const key = item.mes || "Sem data";
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(item);
    });

    return Array.from(groups.entries()); // [ [mes, items], ... ]
  }, [agendaFiltrada]);

  return (
    <div className="min-h-screen bg-gray-200 text-slate-900 dark:bg-black dark:text-slate-100 flex flex-col">
      {/* Toggle tema */}
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="fixed top-3 right-3 z-50 rounded-full bg-black/80 text-white px-3 py-2 text-sm shadow-lg dark:bg-white/10"
      >
        🧑‍🚀
      </button>

      <div className="px-3 pt-3">
        <Header />
      </div>

      <DatasTravadas />

      {/* 🔘 FILTROS */}
      <div className="px-3 mt-3 space-y-2">
        {/* status chips */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {[
            { k: "TODOS", label: "📋 Todos", show: true },
            {
              k: "PREVISTA",
              label: `🟡 Previstas (${statusCount.PREVISTA})`,
              show: statusCount.PREVISTA > 0,
            },
            {
              k: "CONFIRMADA",
              label: `🔵 Confirmadas (${statusCount.CONFIRMADA})`,
              show: statusCount.CONFIRMADA > 0,
            },
            {
              k: "CONCLUIDA",
              label: `🟢 Concluídas (${statusCount.CONCLUIDA})`,
              show: statusCount.CONCLUIDA > 0,
            },
          ]
            .filter((s) => s.show)
            .map((s) => (
              <button
                key={s.k}
                onClick={() => setStatusFiltro(s.k)}
                className={`whitespace-nowrap px-3 py-1 rounded-full text-xs font-medium border transition
                  ${
                    statusFiltro === s.k
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-transparent border-slate-300 text-slate-700 dark:border-slate-600 dark:text-slate-300"
                  }
                `}
              >
                {s.label}
              </button>
            ))}
        </div>
      </div>

      <main className="flex-1 px-3 mt-3">
        {loading ? (
          Array.from({ length: 7 }).map((_, i) => <SkeletonCard key={i} />)
        ) : agendaFiltrada.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-6">
            {gruposPorMes.map(([mes, itens]) => (
              <section key={mes} className="space-y-3">
                {/* ✅ título do mês */}
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-300">
                  {mes}
                </h2>

                <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                  {itens.map((item) => (
                    <AgendaCard key={item.id} {...item} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
