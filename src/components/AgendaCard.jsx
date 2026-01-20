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

// ✅ Copiar texto (com fallback)
const copyToClipboard = async (text) => {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (e) {
    // cai no fallback
  }

  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.top = "-9999px";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  } catch (e) {
    return false;
  }
};

// ✅ CORRIGIDO: lida bem com "08:00:00" (planilha) + outros formatos
const padTime = (t) => {
  if (t == null || t === "") return "";

  // Caso venha como número (Sheets: fração do dia)
  if (typeof t === "number" && !Number.isNaN(t)) {
    const totalMinutes = Math.round(t * 24 * 60);
    const h = Math.floor(totalMinutes / 60) % 24;
    const m = totalMinutes % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  }

  const s = String(t).trim();

  // Caso venha como Date/ISO "2026-02-16T08:00:00"
  if (s.includes("T")) {
    const d = new Date(s);
    if (!Number.isNaN(d.getTime())) {
      return `${String(d.getHours()).padStart(2, "0")}:${String(
        d.getMinutes()
      ).padStart(2, "0")}`;
    }
  }

  // ✅ "08:00:00" ou "08:00"
  // pega só HH e MM e ignora segundos
  const match = s.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (match) {
    const [, hh, mm] = match;
    return `${String(hh).padStart(2, "0")}:${mm}`;
  }

  return "";
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
  const [copiado, setCopiado] = useState(null); // "anastasis" | "whats" | "erro" | null

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
    const [y, m, d] = String(data).split("-").map(Number);
    if (!y || !m || !d) return "";
    return new Date(y, m - 1, d).toLocaleDateString("pt-BR");
  }, [data]);

  // ✅ horários separados (pra mostrar no card e no WhatsApp)
  const timeIni = useMemo(() => padTime(horario_inicio), [horario_inicio]);
  const timeFim = useMemo(() => padTime(horario_fim), [horario_fim]);

  const formattedTime = useMemo(() => {
    if (timeIni && timeFim) return `${timeIni} - ${timeFim}`;
    return timeIni || timeFim || "";
  }, [timeIni, timeFim]);

  const statusKey = (status || "").trim().toUpperCase();
  const statusClass = STATUS_COLORS[statusKey] || STATUS_COLORS.DEFAULT;

  const anastasisKey = (anastasis || "").trim().toLowerCase();
  const anastasisClass =
    ANASTASIS_COLORS[anastasisKey] || ANASTASIS_COLORS.DEFAULT;

  const aguardandoAnastasis = !anastasisKey;

  // ---------- RESUMO (ANASTASIS) ----------
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

  const copiarResumoAnastasis = async () => {
    const ok = await copyToClipboard(resumoAnastasisTxt);
    setCopiado(ok ? "anastasis" : "erro");
    setTimeout(() => setCopiado(null), 1400);
  };
  // --------------------------------------

  // ---------- RESUMO (WHATSAPP) ----------
  const resumoWhatsAppTxt = useMemo(() => {
    const linhas = [];

    linhas.push("📌 *AGENDA / EVENTO*");
    linhas.push("");

    if (titulo) linhas.push(`*Título:* ${titulo}`);
    if (status) linhas.push(`*Status:* ${status}`);
    linhas.push(`*Anastasis:* ${anastasis || "Aguardando Anastasis"}`);
    linhas.push("");

    if (formattedDate) linhas.push(`📅 *Data:* ${formattedDate}`);

    // ✅ sempre tenta mostrar início/fim
    if (timeIni || timeFim) {
      linhas.push(`⏰ *Horário:* ${timeIni || "--:--"} - ${timeFim || "--:--"}`);
    }

    if (cidade) linhas.push(`📍 *Cidade:* ${cidade}`);
    if (pregador) linhas.push(`🎤 *Pregador(a):* ${pregador}`);

    if (ministerio) linhas.push(`🟣 *Ministério:* ${ministerio}`);

    if (tipo.includes("pregacao")) {
      if (tema) linhas.push(`📖 *Tema:* ${tema}`);
      if (palavra_base) linhas.push(`✝️ *Palavra base:* ${palavra_base}`);
    }

    if (tipo.includes("intercessao") && quantidade_intercessao) {
      linhas.push("");
      linhas.push(
        `🙏 *Intercessão:* ${quantidade_intercessao} pessoa(s) necessária(s)`
      );
    }

    linhas.push("");
    linhas.push("📝 *Observações:*");
    linhas.push(
      observar ||
        "Ministério de Pregação. Evento de dois dias. Se tiver tema/palavra base, atualizar assim que definido."
    );

    return linhas.join("\n");
  }, [
    titulo,
    status,
    anastasis,
    formattedDate,
    timeIni,
    timeFim,
    cidade,
    pregador,
    ministerio,
    tipo,
    tema,
    palavra_base,
    quantidade_intercessao,
    observar,
  ]);

  const copiarWhatsApp = async () => {
    const ok = await copyToClipboard(resumoWhatsAppTxt);
    setCopiado(ok ? "whats" : "erro");
    setTimeout(() => setCopiado(null), 1400);
  };
  // --------------------------------------

  return (
    <div className="relative rounded-lg border border-black/10 bg-white p-3 shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-zinc-900">
      {/* Barra lateral */}
      <div
        className={`absolute left-0 top-0 h-full w-1 rounded-l-lg ${statusClass}`}
      />

      {/* Cabeçalho clicável */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        aria-controls={contentId}
        className="w-full text-left"
      >
        <h2 className="text-sm font-semibold truncate">{titulo}</h2>

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

        {/* ✅ Data + horários no card (sempre que existir) */}
        {(formattedDate || timeIni || timeFim) && (
          <p className="mt-1 text-[10px] text-slate-500 dark:text-slate-400">
            {formattedDate && `📅 ${formattedDate}`}
            {(timeIni || timeFim) && (
              <>
                {formattedDate ? " • " : ""}
                ⏰ {timeIni || "--:--"} - {timeFim || "--:--"}
              </>
            )}
          </p>
        )}
      </button>

      {/* Ações */}
      <div className="mt-2 flex flex-wrap items-center gap-3">
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
            copiarWhatsApp();
          }}
          className="text-xs text-green-700 dark:text-green-300 hover:underline"
          title="Copiar já formatado para colar no WhatsApp"
        >
          {copiado === "whats"
            ? "Copiado!"
            : copiado === "erro"
            ? "Falhou ao copiar"
            : "Copiar WhatsApp"}
        </button>

        {aguardandoAnastasis && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              copiarResumoAnastasis();
            }}
            className="text-xs text-rose-700 dark:text-rose-300 hover:underline"
            title="Copiar informações para o Anastasis (só aparece quando estiver aguardando)"
          >
            {copiado === "anastasis"
              ? "Copiado!"
              : copiado === "erro"
              ? "Falhou ao copiar"
              : "Copiar Infos Anastasis"}
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

        {tipo.includes("pregacao") && (
          <>
            {tema && <p className="text-xs">📖 Tema: {tema}</p>}
            {palavra_base && (
              <p className="text-xs">✝️ Palavra base: {palavra_base}</p>
            )}
          </>
        )}

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
