export default function AgendaCard({
  titulo,
  endereco,
  cidade,
  data,
  horaInicio,
  horaFim,
  pregador,
  anastasis,
  missao,
}) {
  const isOk = anastasis === "ok";

  return (
    <div className="rounded-xl border border-black/5 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-zinc-900">
      <h2 className="mb-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
        {titulo}
      </h2>

      <p className="text-xs text-slate-500 dark:text-slate-400">
        {data}
      </p>
       <p className="text-xs text-slate-500 dark:text-slate-400">
        {horaInicio}
      </p>

      <p className="text-xs">{endereco}</p>
      <p className="text-xs">{cidade}</p>
      {pregador && <p className="text-xs">Pregador: {pregador}</p>}
      {missao && <p className="text-xs">Missão: {missao}</p>}

      <div className="mt-3 flex items-center justify-between">
        <span
          className={`text-xs font-medium ${
            status === "done"
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-amber-600 dark:text-amber-400"
          }`}
        >
          {status === "done" ? "Concluído" : status || "Previsto"}
        </span>

        <span className="group relative inline-block">
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide
              ${isOk
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                : "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300"
              }`}
          >
            {isOk ? "Anastasis OK" : "Em liberação"}
          </span>
          <span className="absolute bottom-full left-1/2 mb-1 w-52 -translate-x-1/2 rounded bg-black px-2 py-1 text-[10px] text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            {isOk
              ? "Já temos missionário(a) escolhido(a) no Anastasis"
              : "Aguardando missionário(a) ser liberado(a) no Anastasis"}
          </span>
        </span>
      </div>
    </div>
  );
}
