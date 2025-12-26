import { useEffect, useMemo, useState } from "react";

/**
 * AgendaCard – versão expandida
 */
export default function AgendaCard({
  titulo,
  cidade,
  estado,
  local,
  data,
  horario_inicio,
  horario_fim,
  pregador,
  pregadores = [],
  status,
  anastasis = "",
  tags = [],
  link,
  variant = "compact", // compact | full
  defaultExpanded = false,
  autoExpand = false,
  locale = "pt-BR",
  onExpand,
  onFavorite,
  requireAuth = false,
  isAuthorized = true,
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [favorite, setFavorite] = useState(false);

  /* =======================
     Datas e tempo
  ======================== */
  const eventDate = data ? new Date(data) : null;
  const now = new Date();

  const formattedDate = eventDate
    ? eventDate.toLocaleDateString(locale)
    : "";

  const formattedTime =
    horario_inicio && horario_fim
      ? `${horario_inicio} - ${horario_fim}`
      : horario_inicio || horario_fim || "";

  const eventStatusTime = useMemo(() => {
    if (!eventDate) return null;
    if (eventDate.toDateString() === now.toDateString()) return "HOJE";
    if (eventDate < now) return "ENCERRADO";
    return "FUTURO";
  }, [eventDate]);

  const countdown = useMemo(() => {
    if (!eventDate || eventDate < now) return null;
    const diff = eventDate - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    return days > 0
      ? `Faltam ${days} dias`
      : `Começa em ${hours}h`;
  }, [eventDate]);

  /* =======================
     Auto expand
  ======================== */
  useEffect(() => {
    if (autoExpand && (eventStatusTime === "HOJE" || status === "CONFIRMADA")) {
      setExpanded(true);
    }
  }, [autoExpand, eventStatusTime, status]);

  /* =======================
     Estilos
  ======================== */
  const statusColors = {
    PREVISTA: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    CONCLUIDA: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
    CONFIRMADA: "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300",
    DEFAULT: "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300",
  };

  const anastasisColors = {
    vazio: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
    "em liberação": "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    "": "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    DEFAULT: "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300",
  };

  const statusClass = statusColors[status] || statusColors.DEFAULT;
  const anastasisClass =
    anastasisColors[anastasis.toLowerCase()] || anastasisColors.DEFAULT;

  /* =======================
     Handlers
  ======================== */
  function toggleExpand() {
    setExpanded((prev) => {
      const next = !prev;
      onExpand && onExpand(next);
      return next;
    });
  }

  function toggleFavorite() {
    const next = !favorite;
    setFavorite(next);
    onFavorite && onFavorite(next);
  }

  if (requireAuth && !isAuthorized) return null;

  /* =======================
     Render
  ======================== */
  return (
    <div
      className={`relative rounded-lg border p-3 shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-zinc-900
        ${variant === "full" ? "w-full" : "w-full sm:w-auto"}
        ${eventStatusTime === "HOJE" ? "ring-2 ring-blue-500/40" : ""}
      `}
      onClick={toggleExpand}
    >
      {/* Barra lateral de status */}
      <div
        className={`absolute left-0 top-0 h-full w-1 rounded-l-lg ${statusClass}`}
      />

      {/* Cabeçalho */}
      <div className="flex items-start justify-between gap-2">
        <h2 className="text-sm font-semibold truncate">{titulo}</h2>

        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite();
          }}
          className="text-xs"
        >
          {favorite ? "⭐" : "☆"}
        </button>
      </div>

      {/* Badges */}
      <div className="mt-1 flex flex-wrap gap-1">
        {status && (
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusClass}`}>
            {status}
          </span>
        )}
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${anastasisClass}`}>
          {anastasis ? `Anastasis: ${anastasis}` : "Aguardando Anastasis"}
        </span>
        {eventStatusTime && (
          <span className="rounded-full bg-zinc-200 px-2 py-0.5 text-[10px] dark:bg-zinc-700">
            {eventStatusTime}
          </span>
        )}
      </div>

      {/* Data */}
      {formattedDate && (
        <p className="mt-1 text-[10px] text-slate-500">
          📅 {formattedDate} {formattedTime && `• ⏰ ${formattedTime}`}
        </p>
      )}

      {countdown && (
        <p className="text-[10px] text-blue-600 dark:text-blue-400">
          ⏳ {countdown}
        </p>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div className="mt-1 flex flex-wrap gap-1">
          {tags.map((tag, i) => (
            <span
              key={i}
              className="rounded bg-zinc-200 px-1.5 py-0.5 text-[9px] dark:bg-zinc-700"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Conteúdo expansível */}
      <div
        className={`overflow-hidden transition-all duration-300 ${
          expanded ? "max-h-[500px] mt-2" : "max-h-0"
        }`}
      >
        {(cidade || local) && (
          <p className="text-xs">
            📍 {cidade} {estado && `- ${estado}`} {local && `| ${local}`}
          </p>
        )}

        {(pregadores.length > 0 || pregador) && (
          <p className="text-xs truncate">
            🎤{" "}
            {pregadores.length > 0
              ? pregadores.join(", ")
              : pregador}
          </p>
        )}

        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-block text-xs text-blue-600 hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            Ver detalhes →
          </a>
        )}
      </div>

      {/* Botão explícito */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleExpand();
        }}
        className="mt-2 text-xs text-blue-600 hover:underline"
      >
        {expanded ? "Menos informações" : "Mais informações"}
      </button>
    </div>
  );
}
