import { useState, useEffect } from "react";

export default function DatasTravadas() {
  const [aberto, setAberto] = useState(true);

  useEffect(() => {
    const salvo = localStorage.getItem("datasTravadasAberto");
    if (salvo !== null) {
      setAberto(salvo === "true");
    }
  }, []);

  const toggle = () => {
    const novoEstado = !aberto;
    setAberto(novoEstado);
    localStorage.setItem("datasTravadasAberto", String(novoEstado));
  };

  return (
    <div className="px-3 mt-3">
      <div
        className="
          rounded-xl
          border border-red-600/30 dark:border-red-500/30
          bg-red-100 dark:bg-red-500/10
          text-red-900 dark:text-red-200
        "
      >
        {/* Cabeçalho / Toggle */}
        <button
          onClick={toggle}
          style={{ WebkitTapHighlightColor: "transparent" }}
          className="
            w-full
            flex items-center justify-between
            px-4 py-3
            text-left
            text-sm font-semibold
            transition
            hover:bg-red-200/60 dark:hover:bg-red-500/10
            focus:outline-none
            focus:ring-0
            active:outline-none
            active:ring-0
            select-none
          "
        >
          <span className="flex items-center gap-2">
            ⚠️ Datas bloqueadas para missões externas
          </span>

          <span className="text-xs opacity-70">
            {aberto ? "ocultar ▲" : "mostrar ▼"}
          </span>
        </button>

        {/* Conteúdo colapsável */}
        {aberto && (
          <div className="px-4 pb-3 text-sm leading-relaxed">
            <p className="mb-2">
              As datas abaixo não estão disponíveis para agendamentos externos:
            </p>
            <p className="font-medium tracking-wide">
              21/02 · 21/03 · 18/04 · 16/05 · 27/06 · 25/07
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
