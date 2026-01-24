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

// ✅ cores do chip de dias (semânticas)
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

// ✅ calcula dias e devolve texto + "tipo" pra cor
const getDaysInfo = (isoDate) => {
  if (!isoDate) return { text: "", kind: "DEFAULT", diffDays: null };

  const eventDate = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(eventDate.getTime()))
    return { text: "", kind: "DEFAULT", diffDays: null };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffDays = Math.round((eventDate - today) / (1000 * 60 * 60 * 24));

  // texto
  let text = "";
  if (diffDays > 1) text = `⏳ Faltam ${diffDays} dias`;
  else if (diffDays === 1) text = `⏳ Falta 1 dia`;
  else if (diffDays === 0) text = `📍 Hoje`;
  else text = `✅ Encerrado`;

  // cor (regra simples e clara)
  let kind = "OK";
  if (diffDays < 0) kind = "PASSOU";
  else if (diffDays === 0) kind = "HOJE";
  else if (diffDays <= 3) kind = "URGENTE";
  else if (diffDays <= 10) kind = "PROXIMO";
  else kind = "OK";

  return { text, kind, diffDays };
};

// ---------------- COMPONENT ----------------
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
  palavra_base,
}) {
  const [expanded, setExpanded] = useState(false);

  // ✅ banner de copiar
  const [showCopyBanner, setShowCopyBanner] = useState(false);
  const [copiadoSel, setCopiadoSel] = useState(null);

  const nomeBase = useMemo(() => slugify(titulo), [titulo]);

  // data
  const formattedDate = useMemo(() => {
    if (!data) return "";
    const [y, m, d] = String(data).split("-").map(Number);
    if (!y || !m || !d) return "";
    return new Date(y, m - 1, d).toLocaleDateString("pt-BR");
  }, [data]);

  // ✅ faltam X dias + cor
  const daysInfo = useMemo(() => getDaysInfo(data), [data]);
  const diasChipClass = DAYS_CHIP[daysInfo.kind] || DAYS_CHIP.DEFAULT;

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

  const mapsUrl = useMemo(
    () => makeMapsUrl(cidade, endereco),
    [cidade, endereco]
  );

  // --------- COPIAR SELECIONADOS ---------
  const COPY_FIELDS = useMemo(
    () => [
      { key: "titulo", label: "Título", emoji: "📌", value: titulo },
      { key: "status", label: "Status", emoji: "🏷️", value: status },
      {
        key: "anastasis",
        label: "Anastasis",
        emoji: "🟢",
        value: anastasis || "Aguardando Anastasis",
      },
      { key: "data", label: "Data", emoji: "📅", value: formattedDate },
      { key: "horario", label: "Horário", emoji: "⏰", value: formattedTime },
      { key: "cidade", label: "Cidade", emoji: "🏙️", value: cidade },
      { key: "endereco", label: "Endereço", emoji: "📍", value: endereco },
      { key: "maps", label: "Link Maps", emoji: "🗺️", value: mapsUrl },
      { key: "pregador", label: "Pregador(a)", emoji: "🎤", value: pregador },
      { key: "obs", label: "Observações", emoji: "📝", value: observar },
    ],
    [
      titulo,
      status,
      anastasis,
      formattedDate,
      formattedTime,
      cidade,
      endereco,
      mapsUrl,
      pregador,
      observar,
    ]
  );

  // default: selecionado por default (do jeito que você pediu)
  const defaultSelected = useMemo(() => {
    const base = Object.fromEntries(COPY_FIELDS.map((f) => [f.key, false]));

    base.titulo = true;
    base.data = true;
    base.horario = true;
    base.endereco = true;
    base.pregador = true;
    base.obs = true;

    return base;
  }, [COPY_FIELDS]);

  const [selected, setSelected] = useState(defaultSelected);

  // se o card trocar (ou lista rerender), garante default não “fica velho”
  // (sem usar useEffect pra não mexer no seu fluxo)
  useMemo(() => {
    setSelected((prev) => {
      const hasAny = Object.values(prev || {}).some(Boolean);
      return hasAny ? prev : defaultSelected;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nomeBase]);

  const toggleField = (key) => {
    setSelected((s) => ({ ...s, [key]: !s[key] }));
  };

  const marcarTudo = () => {
    setSelected(Object.fromEntries(COPY_FIELDS.map((f) => [f.key, true])));
  };

  const desmarcarTudo = () => {
    setSelected(Object.fromEntries(COPY_FIELDS.map((f) => [f.key, false])));
  };

  const textoSelecionado = useMemo(() => {
    const linhas = [];

    COPY_FIELDS.forEach((f) => {
      if (!selected?.[f.key]) return;
      if (!f.value) return;
      linhas.push(`${f.emoji} ${f.label}: ${f.value}`);
    });

    return linhas.join("\n");
  }, [COPY_FIELDS, selected]);

  const copiarSelecionados = async () => {
    const texto = textoSelecionado.trim();
    if (!texto) {
      setCopiadoSel("vazio");
      setTimeout(() => setCopiadoSel(null), 1200);
      return;
    }

    const ok = await copyToClipboard(texto);
    setCopiadoSel(ok ? "ok" : "erro");
    setTimeout(() => setCopiadoSel(null), 1200);
  };

  // ---------------- RENDER ----------------
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
        {/* Título + chip dias */}
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

      {/* AÇÕES */}
      <div className="mt-2 flex gap-3 text-xs flex-wrap">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setExpanded((v) => !v);
          }}
          className="text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 rounded"
        >
          {expanded ? "Menos informações" : "Mais informações"}
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowCopyBanner((v) => !v);
          }}
          className="text-blue-700 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 rounded"
        >
          {showCopyBanner ? "Fechar copiar" : "Copiar informações"}
        </button>

        {mapsUrl && (
          <a
            href={mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="text-emerald-700 hover:text-emerald-800 dark:text-emerald-300 dark:hover:text-emerald-200 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 rounded"
            onClick={(e) => e.stopPropagation()}
          >
            Abrir no Maps
          </a>
        )}
      </div>

      {/* ✅ BANNERZINHO DE COPIAR */}
      {showCopyBanner && (
        <div
          className="mt-3 rounded-2xl border border-zinc-200/70 bg-white/80 p-3 text-xs shadow-md backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-zinc-800/70 dark:bg-zinc-950/40"
          onClick={(e) => e.stopPropagation()}
          role="region"
          aria-label="Selecionar informações para copiar"
        >
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <p className="font-semibold text-[12px] text-zinc-900 dark:text-zinc-50">
              📋 Selecione o que copiar
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setSelected(
                    Object.fromEntries(COPY_FIELDS.map((f) => [f.key, true]))
                  )
                }
                className="px-2 py-1 rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-800 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30"
              >
                Marcar tudo
              </button>
              <button
                type="button"
                onClick={() =>
                  setSelected(
                    Object.fromEntries(COPY_FIELDS.map((f) => [f.key, false]))
                  )
                }
                className="px-2 py-1 rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-800 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30"
              >
                Limpar
              </button>
            </div>
          </div>

          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {COPY_FIELDS.map((f) => {
              const disabled = !f.value;
              return (
                <label
                  key={f.key}
                  className={`flex items-center gap-2 rounded-xl border px-2 py-1 transition
                    ${
                      disabled
                        ? "opacity-50 border-zinc-200/50 dark:border-zinc-800/40"
                        : "border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:border-zinc-700 dark:hover:bg-zinc-900/60"
                    }
                    bg-white dark:bg-zinc-900`}
                >
                  <input
                    type="checkbox"
                    className="accent-blue-600 dark:accent-blue-400"
                    checked={!!selected?.[f.key]}
                    onChange={() =>
                      !disabled &&
                      setSelected((s) => ({ ...s, [f.key]: !s[f.key] }))
                    }
                    disabled={disabled}
                  />
                  <span className="truncate text-zinc-800 dark:text-zinc-200">
                    {f.emoji} {f.label}
                  </span>
                </label>
              );
            })}
          </div>

          <div className="mt-3 flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={copiarSelecionados}
              className="px-3 py-1.5 rounded-xl bg-blue-600 text-white shadow-sm hover:bg-blue-700 active:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
            >
              {copiadoSel === "ok"
                ? "Copiado ✅"
                : copiadoSel === "vazio"
                ? "Nada selecionado 😅"
                : "Copiar selecionados"}
            </button>
          </div>

          <div className="mt-2 rounded-xl border border-zinc-200 bg-zinc-50 p-2 text-[11px] text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-100">
            <p className="font-semibold mb-1">Prévia:</p>
            <pre className="whitespace-pre-wrap font-mono">
              {textoSelecionado || "Selecione campos acima para montar o texto..."}
            </pre>
          </div>
        </div>
      )}

      {expanded && (
        <div className="mt-2 text-xs space-y-1 text-zinc-800 dark:text-zinc-200">
          {cidade && <p>🏙️ {cidade}</p>}
          {endereco && <p>📌 {endereco}</p>}
          {pregador && <p>🎤 {pregador}</p>}
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
