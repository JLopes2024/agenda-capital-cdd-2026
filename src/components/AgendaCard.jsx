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
  anastasis,
  observacoes,
  status
}) {
  // Formata data DD/MM/YYYY
  const formattedDate = data ? new Date(data).toLocaleDateString("pt-BR") : "";
  const formattedTime =
    horario_inicio && horario_fim
      ? `${horario_inicio} - ${horario_fim}`
      : horario_inicio || horario_fim || "";

  // Define cores do card baseado no status
  const statusColors = {
    PREVISTA: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    CONCLUIDA: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
    DEFAULT: "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300",
  };

  const statusClass = statusColors[status] || statusColors.DEFAULT;

  return (
    <div className="rounded-xl border border-black/5 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-zinc-900">
      <h2 className="mb-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
        {titulo}
      </h2>

      {formattedDate && <p className="text-xs text-slate-500 dark:text-slate-400">{formattedDate}</p>}
      {formattedTime && <p className="text-xs text-slate-500 dark:text-slate-400">{formattedTime}</p>}
      {endereco && <p className="text-xs">{endereco}</p>}
      {cidade && <p className="text-xs">{cidade}</p>}
      {publico && <p className="text-xs">Público: {publico}</p>}
      {quantidade && <p className="text-xs">Qtd. estimada: {quantidade}</p>}
      {pregador && <p className="text-xs">Pregador: {pregador}</p>}
      {anastasis && <p className="text-xs">Anastasis: {anastasis}</p>}
      {observacoes && <p className="text-xs">Observações: {observacoes}</p>}

      {status && (
        <span className={`mt-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${statusClass}`}>
          {status}
        </span>
      )}
    </div>
  );
}
