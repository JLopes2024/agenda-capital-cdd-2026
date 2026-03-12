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
  "":
    "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  DEFAULT:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
};

const DAYS_CHIP = {
  URGENTE: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  PROXIMO:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  OK: "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300",
  HOJE: "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300",
  PASSOU:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  DEFAULT: "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200",
};

const slugify = (s) =>
  (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.top = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
    return true;
  }
};

const padTime = (t) => {
  if (t == null || t === "") return "";

  if (typeof t === "number") {
    const totalMinutes = Math.round(t * 24 * 60);
    const h = Math.floor(totalMinutes / 60) % 24;
    const m = totalMinutes % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  }

  const s = String(t).trim();

  if (s.includes("T")) {
    const d = new Date(s);
    if (!Number.isNaN(d.getTime())) {
      return `${String(d.getHours()).padStart(2, "0")}:${String(
        d.getMinutes()
      ).padStart(2, "0")}`;
    }
  }

  const match = s.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (match) {
    const [, h, m] = match;
    return `${String(h).padStart(2, "0")}:${m}`;
  }

  return "";
};

const makeMapsUrl = (cidade, endereco) => {
  const q = [endereco, cidade].filter(Boolean).join(", ");
  if (!q) return "";
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    q
  )}`;
};

const getDaysInfo = (isoDate) => {
  if (!isoDate) return { text: "", kind: "DEFAULT", diffDays: null };

  const eventDate = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(eventDate.getTime()))
    return { text: "", kind: "DEFAULT", diffDays: null };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffDays = Math.round((eventDate - today) / (1000 * 60 * 60 * 24));

  let text = "";
  if (diffDays > 1) text = `⏳ Faltam ${diffDays} dias`;
  else if (diffDays === 1) text = `⏳ Falta 1 dia`;
  else if (diffDays === 0) text = `📍 Hoje`;
  else text = `✅ Encerrado`;

  let kind = "OK";
  if (diffDays < 0) kind = "PASSOU";
  else if (diffDays === 0) kind = "HOJE";
  else if (diffDays <= 3) kind = "URGENTE";
  else if (diffDays <= 10) kind = "PROXIMO";

  return { text, kind, diffDays };
};

export default function AgendaCard({
  titulo,
  cidade,
  endereco,
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
}) {
  const [expanded, setExpanded] = useState(false);

  const nomeBase = useMemo(() => slugify(titulo), [titulo]);

  const formattedDate = useMemo(() => {
    if (!data) return "";
    const [y, m, d] = String(data).split("-").map(Number);
    if (!y || !m || !d) return "";
    return new Date(y, m - 1, d).toLocaleDateString("pt-BR");
  }, [data]);

  const daysInfo = useMemo(() => getDaysInfo(data), [data]);
  const diasChipClass = DAYS_CHIP[daysInfo.kind] || DAYS_CHIP.DEFAULT;

  const timeIni = useMemo(() => padTime(horario_inicio), [horario_inicio]);
  const timeFim = useMemo(() => padTime(horario_fim), [horario_fim]);

  const formattedTime =
    timeIni || timeFim ? `${timeIni || "--:--"} - ${timeFim || "--:--"}` : "";

  const statusClass =
    STATUS_COLORS[(status || "").toUpperCase()] || STATUS_COLORS.DEFAULT;

  const anastasisKey = (anastasis || "").toLowerCase();
  const anastasisClass =
    ANASTASIS_COLORS[anastasisKey] || ANASTASIS_COLORS.DEFAULT;

  const mapsUrl = useMemo(
    () => makeMapsUrl(cidade, endereco),
    [cidade, endereco]
  );

  return (
    <div className="relative rounded-xl border border-zinc-200/70 bg-white p-3 shadow-sm transition hover:shadow-md dark:border-zinc-800/70 dark:bg-zinc-900/60">
      <div
        className={`absolute left-0 top-0 h-full w-1 rounded-l-xl ${statusClass}`}
      />

      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full text-left"
      >
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-sm font-semibold truncate text-zinc-900 dark:text-zinc-50">
            {titulo}
          </h2>

          {!!daysInfo.text && (
            <span
              className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] ${diasChipClass}`}
            >
              {daysInfo.text}
            </span>
          )}
        </div>

        <div className="mt-1 flex gap-1 flex-wrap">
          {status && (
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] ${statusClass}`}
            >
              {status}
            </span>
          )}

          <span
            className={`px-2 py-0.5 rounded-full text-[10px] ${anastasisClass}`}
          >
            {anastasis || "Aguardando Anastasis"}
          </span>

          {ministerio && (
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300">
              {ministerio}
            </span>
          )}

          {tema && (
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300">
              📖 {tema}
            </span>
          )}
        </div>

        {(formattedDate || timeIni || timeFim) && (
          <p className="mt-1 text-[10px] text-zinc-600 dark:text-zinc-400">
            {formattedDate && `📅 ${formattedDate}`}
            {(timeIni || timeFim) && ` • ⏰ ${formattedTime}`}
          </p>
        )}

        {(cidade || endereco) && (
          <p className="mt-1 text-[10px] text-zinc-600 dark:text-zinc-400 truncate">
            📍 {[endereco, cidade].filter(Boolean).join(" • ")}
          </p>
        )}
      </button>

      <div className="mt-2 flex gap-3 text-xs flex-wrap">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setExpanded((v) => !v);
          }}
          className="text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white underline-offset-4 hover:underline"
        >
          {expanded ? "Menos informações" : "Mais informações"}
        </button>

        {mapsUrl && (
          <a
            href={mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="text-emerald-700 hover:text-emerald-800 dark:text-emerald-300 dark:hover:text-emerald-200 underline-offset-4 hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            Abrir no Maps
          </a>
        )}
      </div>

      {expanded && (
        <div className="mt-2 text-xs space-y-1 text-zinc-800 dark:text-zinc-200">
          {cidade && <p>🏙️ {cidade}</p>}
          {endereco && <p>📌 {endereco}</p>}
          {pregador && <p>🎤 {pregador}</p>}
          {tema && <p>📖 Tema: {tema}</p>}
          {quantidade_intercessao && (
            <p>🙏 Pessoas necessárias: {quantidade_intercessao}</p>
          )}
          {observar && (
            <p className="text-zinc-500 dark:text-zinc-400">🎯 {observar}</p>
          )}
        </div>
      )}
    </div>
  );
}
