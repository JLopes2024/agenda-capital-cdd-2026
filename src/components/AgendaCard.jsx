import { useMemo, useState } from "react";

const STATUS_COLORS = {
  PREVISTA:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  CONCLUIDA:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  CONFIRMADA:
    "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300",
  DEFAULT: "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300",
};

const ANASTASIS_COLORS = {
  "em liberacao":
    "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  "": "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  DEFAULT:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
};

const slugify = (s) =>
  (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const downloadTxt = (filename, content) => {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();

  URL.revokeObjectURL(url);
};

const padTime = (t) => {
  if (!t) return "";
  const [h, min] = String(t).split(":");
  if (h == null) return "";
  return `${String(h).padStart(2, "0")}:${String(min ?? "00").padStart(
    2,
    "0"
  )}`;
};

export default function AgendaCard({
  titulo,
  cidade,
  data,
  horario_inicio,
  horario_fim,
  pregador,
  status,
  anastasis,
  observar,
  ministerio,
  quantidade_intercessao,
  tema,
  palavra_base,
}) {
  const [expanded, setExpanded] = useState(false);

  const nomeBase = useMemo(() => slugify(titulo) || "agenda", [titulo]);
  const contentId = `agenda-${nomeBase}`;

  // Normaliza o nome do ministério (para checagens tipo.includes)
  const tipo = useMemo(
    () =>
      (ministerio || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, ""),
    [ministerio]
  );

  // Data local (evita bug de UTC em "YYYY-MM-DD")
  const formattedDate = useMemo(() => {
    if (!data) return "";
    // se data vier "YYYY-MM-DD"
    const [y, m, d] = String(data).split("-").map(Number);
    if (!y || !m || !d) return "";
    return new Date(y, m - 1, d).toLocaleDateString("pt-BR");
  }, [data]);

  const formattedTime = useMemo(() => {
    const ini = padTime(horario_inicio);
    const fim = padTime(horario_fim);
    if (ini && fim) return `${ini} - ${fim}`;
    return ini || fim || "";
  }, [horario_inicio, horario_fim]);

  const statusKey = (status || "").trim().toUpperCase();
  const statusClass = STATUS_COLORS[statusKey] || STATUS_COLORS.DEFAULT;

  const anastasisKey = (anastasis || "").trim().toLowerCase();
  const anastasisClass =
    ANASTASIS_COLORS[anastasisKey] || ANASTASIS_COLORS.DEFAULT;

  const aguardandoAnastasis = !anastasisKey;

  // ---------- RESUMO + DOWNLOAD (GERAL) ----------
  const resumoTxt = useMemo(() => {
    const linhas = [];

    if (titulo) linhas.push(`Título: ${titulo}`);
    if (status) linhas.push(`Status: ${status}`);
    linhas.push(`Anastasis: ${anastasis || "Aguardando Anastasis"}`);
    if (ministerio) linhas.push(`Ministério: ${ministerio}`);

    if (formattedDate || formattedTime) {
      linhas.push(
        `Data/Horário: ${formattedDate || "-"}${
          formattedTime ? ` • ${formattedTime}` : ""
        }`
      );
    }

    if (cidade) linhas.push(`Cidade: ${cidade}`);
    if (pregador) linhas.push(`Pregador: ${pregador}`);

    // PREGAÇÃO
    if (tipo.includes("pregacao")) {
      if (tema) linhas.push(`Tema: ${tema}`);
      if (palavra_base) linhas.push(`Palavra base: ${palavra_base}`);
    }

    // INTERCESSÃO
    if (tipo.includes("intercessao") && quantidade_intercessao) {
      linhas.push(
        `Pessoas necessárias (intercessão): ${quantidade_intercessao}`
      );
    }

    if (observar) {
      linhas.push("");
      linhas.push(`Observações: ${observar}`);
    }

    return linhas.join("\n");
  }, [
    titulo,
    status,
    anastasis,
    ministerio,
    formattedDate,
    formattedTime,
    cidade,
    pregador,
    tipo,
    tema,
    palavra_base,
    quantidade_intercessao,
    observar,
  ]);

  const baixarResumo = () => {
    downloadTxt(`resumo-${nomeBase}.txt`, resumoTxt);
  };
  // ----------------------------------------------

  // ---------- RESUMO + DOWNLOAD (ANASTASIS) ----------
  const resumoAnastasisTxt = useMemo(() => {
    const linhas = [];
    linhas.push("RESUMO – ANASTASIS");
    linhas.push("-------------------------");

    if (titulo) linhas.push(`Evento: ${titulo}`);
    if (ministerio) linhas.push(`Ministério: ${ministerio}`);
    if (status) linhas.push(`Status: ${status}`);

    if (formattedDate || formattedTime) {
      linhas.push(
        `Data/Horário: ${formattedDate || "-"}${
          formattedTime ? ` • ${formattedTime}` : ""
        }`
      );
    }

    if (cidade) linhas.push(`Cidade: ${cidade}`);

    if (tipo.includes("pregacao")) {
      linhas.push("Tipo: Pregação");
      if (tema) linhas.push(`Tema: ${tema}`);
      if (palavra_base) linhas.push(`Palavra base: ${palavra_base}`);
    }

    if (tipo.includes("intercessao")) {
      linhas.push("Tipo: Intercessão");
      if (quantidade_intercessao) {
        linhas.push(`Pessoas necessárias: ${quantidade_intercessao}`);
      }
    }

    if (observar) {
      linhas.push("");
      linhas.push(`Observações: ${observar}`);
    }

    return linhas.join("\n");
  }, [
    titulo,
    ministerio,
    status,
    formattedDate,
    formattedTime,
    cidade,
    tipo,
    tema,
    palavra_base,
    quantidade_intercessao,
    observar,
  ]);

  const baixarResumoAnastasis = () => {
    downloadTxt(`anastasis-${nomeBase}.txt`, resumoAnastasisTxt);
  };
  // --------------------------------------------------

  return (
    <div className="relative rounded-lg border border-black/10 bg-white p-3 shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-zinc-900">
      {/* Barra lateral */}
      <div
        className={`absolute left-0 top-0 h-full w-1 rounded-l-lg ${statusClass}`}
      />

      {/* Cabeçalho clicável (melhor UX do que clicar no card inteiro) */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        aria-controls={contentId}
        className="w-full text-left"
      >
        {/* Título */}
        <h2 className="text-sm font-semibold truncate">{titulo}</h2>

        {/* Badges */}
        <div className="mt-1 flex flex-wrap gap-1">
          {status && (
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusClass}`}
            >
              {status}
            </span>
          )}

          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${anastasisClass}`}
          >
            {anastasis || "Aguardando Anastasis"}
          </span>

          {ministerio && (
            <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-semibold text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
              {ministerio}
            </span>
          )}
        </div>

        {/* Data */}
        {formattedDate && (
          <p className="mt-1 text-[10px] text-slate-500 dark:text-slate-400">
            📅 {formattedDate}
            {formattedTime && ` • ⏰ ${formattedTime}`}
          </p>
        )}
      </button>

      {/* Ações */}
      <div className="mt-2 flex items-center gap-3">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setExpanded((v) => !v);
          }}
          className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
        >
          {expanded ? "Menos informações" : "Mais informações"}
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            baixarResumo();
          }}
          className="text-xs text-emerald-700 dark:text-emerald-300 hover:underline"
          title="Baixar um arquivo .txt com o resumo deste card"
        >
          Baixar Infos
        </button>

        {aguardandoAnastasis && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              baixarResumoAnastasis();
            }}
            className="text-xs text-rose-700 dark:text-rose-300 hover:underline"
            title="Baixar informações para o Anastasis (só aparece quando estiver aguardando)"
          >
            Infos Anastasis
          </button>
        )}
      </div>

      {/* Conteúdo expansível */}
      <div
        id={contentId}
        className={`overflow-hidden transition-all duration-300 ${
          expanded ? "max-h-screen mt-2" : "max-h-0"
        }`}
      >
        {cidade && <p className="text-xs">📍 {cidade}</p>}

        {pregador && <p className="text-xs">🎤 Pregador: {pregador}</p>}

        {/* PREGAÇÃO */}
        {tipo.includes("pregacao") && (
          <>
            {tema && <p className="text-xs">📖 Tema: {tema}</p>}
            {palavra_base && (
              <p className="text-xs">✝️ Palavra base: {palavra_base}</p>
            )}
          </>
        )}

        {/* INTERCESSÃO */}
        {tipo.includes("intercessao") && quantidade_intercessao && (
          <p className="text-xs">
            🙏 Pessoas necessárias: {quantidade_intercessao}
          </p>
        )}

        {observar && (
          <p className="mt-1 text-[10px] text-slate-400">🎯 {observar}</p>
        )}
      </div>
    </div>
  );
}
