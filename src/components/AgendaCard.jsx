export default function AgendaCard({
  titulo,
  endereco,
  cidade,
  data,
  horaInicio,
  horaFim,
  pregador,
  status,
  missao,
}) {
  return (
    <div className="rounded-xl border border-black/5 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-zinc-900">
      <h2 className="mb-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
        {titulo}
      </h2>

      <p className="text-xs text-slate-500 dark:text-slate-400">
        {data} {horaInicio && `- ${horaInicio}`} {horaFim && `às ${horaFim}`}
      </p>

      <p className="text-xs">{endereco}</p>
      <p className="text-xs">{cidade}</p>
      {pregador && <p className="text-xs">Pregador: {pregador}</p>}
      {missao && <p className="text-xs">Missão: {missao}</p>}

      <span className={`text-xs font-medium ${status === "done" ? "text-emerald-600" : "text-amber-600"}`}>
        {status === "done" ? "Concluído" : status || "Previsto"}
      </span>
    </div>
  );
}
