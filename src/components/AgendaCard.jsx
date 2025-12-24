import { useState } from "react";

export default function AgendaCard({
  titulo,
  endereco,
  cidade,
  data,
  horario_inicio,
  horario_fim,
  publico,
  quantidade,
  pregador,
  status,
  anastasis = "", // valor padrão vazio
}) {
  const [expanded, setExpanded] = useState(false);

  // Formata data DD/MM/YYYY
  const formattedDate = data ? new Date(data).toLocaleDateString("pt-BR") : "";
  const formattedTime =
    horario_inicio && horario_fim
      ? `${horario_inicio} - ${horario_fim}`
      : horario_inicio || horario_fim || "";

  // Cores do card baseado no status
  const statusColors = {
    PREVISTA:
      "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    CONCLUIDA:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
    DEFAULT:
      "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300",
  };

  // Cores para Anastasis
  const anastasisColors = {
    ok: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
    "em liberação": "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    vazio: "bg-violet-200 text-slate-700 dark:bg-slate-800/30 dark:text-red-300",
    DEFAULT: "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300",
  };

  const statusClass = statusColors[status] || statusColors.DEFAULT;

  // Define texto e classe de Anastasis
  const anastasisText = anastasis ? `Anastasis: ${anastasis}` : "Aguardando Anastasis";
  const anastasisClass =
    anastasisColors[anastasis.toLowerCase()] || anastasisColors.vazio;

  return (
    <div
      className="rounded-lg border border-black/10 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-zinc-900 cursor-pointer transition hover:shadow-md"
      onClick={() => setExpanded(!expanded)}
    >
      {/* Cabeçalho compacto */}
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
          {titulo}
        </h2>

        <div className="flex gap-1">
          {status && (
            <span
              className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${statusClass}`}
            >
              {status}
            </span>
          )}

          <span
            className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${anastasisClass}`}
          >
            {anastasisText}
          </span>
        </div>
      </div>

      {formattedDate && (
        <p className="text-[10px] text-slate-500 dark:text-slate-400">{formattedDate}</p>
      )}

      {/* Detalhes expansíveis */}
      <div
        className={`overflow-hidden transition-all duration-300 ${
          expanded ? "max-h-[500px] mt-1" : "max-h-0"
        }`}
      >
        {formattedTime && <p className="text-[10px]">Horário: {formattedTime}</p>}
        {endereco && <p className="text-[10px]">Endereço: {endereco}</p>}
        {cidade && <p className="text-[10px]">Cidade: {cidade}</p>}
        {publico && <p className="text-[10px]">Público: {publico}</p>}
        {quantidade && <p className="text-[10px]">Qtd. estimada: {quantidade}</p>}
        {pregador && <p className="text-[10px]">Pregador: {pregador}</p>}
      </div>
    </div>
  );
}
