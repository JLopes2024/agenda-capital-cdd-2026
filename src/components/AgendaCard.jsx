import { useState } from "react";

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

  // Normaliza o nome do ministério
  const tipo = (ministerio || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  const formattedDate = data
    ? new Date(data).toLocaleDateString("pt-BR")
    : "";

  const formattedTime =
    horario_inicio && horario_fim
      ? `${horario_inicio} - ${horario_fim}`
      : horario_inicio || horario_fim || "";

  const statusColors = {
    PREVISTA:
      "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    CONCLUIDA:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
    CONFIRMADA:
      "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300",
    DEFAULT:
      "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300",
  };

  const anastasisColors = {
    "em liberacao":
      "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    "":
      "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    DEFAULT:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  };

  const statusClass = statusColors[status] || statusColors.DEFAULT;
  const anastasisClass =
    anastasisColors[(anastasis || "").toLowerCase()] ||
    anastasisColors.DEFAULT;

  return (
    <div
      className="relative rounded-lg border border-black/10 bg-white p-3 shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-zinc-900"
      onClick={() => setExpanded(!expanded)}
    >
      {/* Barra lateral */}
      <div
        className={`absolute left-0 top-0 h-full w-1 rounded-l-lg ${statusClass}`}
      />

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

      {/* Botão */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setExpanded(!expanded);
        }}
        className="mt-2 text-xs text-blue-600 dark:text-blue-400 hover:underline"
      >
        {expanded ? "Menos informações" : "Mais informações"}
      </button>

      {/* Conteúdo expansível */}
      <div
        className={`overflow-hidden transition-all duration-300 ${
          expanded ? "max-h-[500px] mt-2" : "max-h-0"
        }`}
      >
        {cidade && <p className="text-xs">📍 {cidade}</p>}

        {pregador && (
          <p className="text-xs">🎤 Pregador: {pregador}</p>
        )}

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
          <p className="mt-1 text-[10px] text-slate-400">
            🎯 {observar}
          </p>
        )}
      </div>
    </div>
  );
}
