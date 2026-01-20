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

// ---------------- HELPERS ----------------
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

// ✅ aceita "08:00:00", "08:00", Date, ISO, número do Sheets
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

// ---------------- COMPONENT ----------------
export default function AgendaCard({
  titulo,
  cidade,
  endereco, // ✅ NOVO
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
  const [copiado, setCopiado] = useState(null);

  const nomeBase = useMemo(() => slugify(titulo), [titulo]);

  // data
  const formattedDate = useMemo(() => {
    if (!data) return "";
    const [y, m, d] = String(data).split("-").map(Number);
    if (!y || !m || !d) return "";
    return new Date(y, m - 1, d).toLocaleDateString("pt-BR");
  }, [data]);

  // horários
  const timeIni = useMemo(() => padTime(horario_inicio), [horario_inicio]);
  const timeFim = useMemo(() => padTime(horario_fim), [horario_fim]);

  const formattedTime =
    timeIni || timeFim ? `${timeIni || "--:--"} - ${timeFim || "--:--"}` : "";

  const statusClass =
    STATUS_COLORS[(status || "").toUpperCase()] || STATUS_COLORS.DEFAULT;

  const anastasisKey = (anastasis || "").toLowerCase();
  const anastasisClass =
    ANASTASIS_COLORS[anastasisKey] || ANASTASIS_COLORS.DEFAULT;

  const aguardandoAnastasis = !anastasisKey;

  const mapsUrl = useMemo(() => makeMapsUrl(cidade, endereco), [cidade, endereco]);

  // --------- WHATSAPP ---------
  const resumoWhatsApp = useMemo(() => {
    const linhas = [];

    linhas.push("📌 *AGENDA / EVENTO*");
    linhas.push("");
    if (titulo) linhas.push(`*Título:* ${titulo}`);
    if (status) linhas.push(`*Status:* ${status}`);
    linhas.push(`*Anastasis:* ${anastasis || "_Aguardando Anastasis_"}`);
    linhas.push("");
    if (formattedDate) linhas.push(`📅 *Data:* ${formattedDate}`);
    if (timeIni || timeFim) {
      linhas.push(`🕐 *Início:* ${timeIni || "--:--"}`);
      linhas.push(`🕕 *Encerramento:* ${timeFim || "--:--"}`);
    }
    if (cidade) linhas.push(`📍 *Cidade:* ${cidade}`);
    if (endereco) linhas.push(`📌 *Endereço:* ${endereco}`);
    if (mapsUrl) linhas.push(`🗺️ *Maps:* ${mapsUrl}`);
    if (pregador) linhas.push(`🎤 *Pregador(a):* ${pregador}`);
    if (ministerio) linhas.push(`🟣 *Ministério:* ${ministerio}`);
    if (tema) linhas.push(`📖 *Tema:* ${tema}`);
    if (palavra_base) linhas.push(`✝️ *Palavra base:* ${palavra_base}`);

    linhas.push("");
    linhas.push("📝 *Observações:*");
    linhas.push(observar || "Ministério de Pregação");

    return linhas.join("\n");
  }, [
    titulo,
    status,
    anastasis,
    formattedDate,
    timeIni,
    timeFim,
    cidade,
    endereco,
    mapsUrl,
    pregador,
    ministerio,
    tema,
    palavra_base,
    observar,
  ]);

  const copiarWhatsApp = async () => {
    const ok = await copyToClipboard(resumoWhatsApp);
    setCopiado(ok ? "ok" : "erro");
    setTimeout(() => setCopiado(null), 1200);
  };

  // ---------------- RENDER ----------------
  return (
    <div className="relative rounded-lg border border-black/10 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-zinc-900">
      <div className={`absolute left-0 top-0 h-full w-1 rounded-l-lg ${statusClass}`} />

      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full text-left"
      >
        <h2 className="text-sm font-semibold truncate">{titulo}</h2>

        <div className="mt-1 flex gap-1 flex-wrap">
          {status && (
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${statusClass}`}>
              {status}
            </span>
          )}
          <span className={`px-2 py-0.5 rounded-full text-[10px] ${anastasisClass}`}>
            {anastasis || "Aguardando Anastasis"}
          </span>
          {ministerio && (
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
              {ministerio}
            </span>
          )}
        </div>

        {(formattedDate || timeIni || timeFim) && (
          <p className="mt-1 text-[10px] text-slate-500 dark:text-slate-400">
            {formattedDate && `📅 ${formattedDate}`}
            {(timeIni || timeFim) && ` • ⏰ ${formattedTime}`}
          </p>
        )}

        {/* ✅ LINHA DE LOCAL NO CARD (compacta) */}
        {(cidade || endereco) && (
          <p className="mt-1 text-[10px] text-slate-500 dark:text-slate-400 truncate">
            📍 {[endereco, cidade].filter(Boolean).join(" • ")}
          </p>
        )}
      </button>

      <div className="mt-2 flex gap-3 text-xs flex-wrap">
        <button
          onClick={() => setExpanded((v) => !v)}
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          {expanded ? "Menos informações" : "Mais informações"}
        </button>

        <button
          onClick={copiarWhatsApp}
          className="text-green-700 dark:text-green-300 hover:underline"
        >
          {copiado === "ok" ? "Copiado!" : "Copiar WhatsApp"}
        </button>

        {/* ✅ ABRIR MAPS */}
        {mapsUrl && (
          <a
            href={mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="text-slate-700 dark:text-slate-200 hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            Abrir no Maps
          </a>
        )}
      </div>

      {expanded && (
        <div className="mt-2 text-xs space-y-1">
          {cidade && <p>🏙️ {cidade}</p>}
          {endereco && <p>📌 {endereco}</p>}
          {pregador && <p>🎤 {pregador}</p>}
          {quantidade_intercessao && (
            <p>🙏 Pessoas necessárias: {quantidade_intercessao}</p>
          )}
          {observar && <p className="text-slate-400">🎯 {observar}</p>}
        </div>
      )}
    </div>
  );
}
