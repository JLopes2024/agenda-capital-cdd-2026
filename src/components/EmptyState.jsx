export default function EmptyState({ filter }) {
  const messages = {
    all: {
      title: "Nenhum compromisso encontrado",
      subtitle: "Quando houver atividades cadastradas, elas aparecerão aqui."
    },
    done: {
      title: "Nenhuma atividade concluída",
      subtitle: "As atividades finalizadas aparecerão aqui."
    },
    pending: {
      title: "Nenhuma atividade prevista",
      subtitle: "Você não possui compromissos futuros no momento."
    }
  };

  const content = messages[filter];

  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-black/10 bg-white p-6 text-center dark:border-white/10 dark:bg-slate-800">
      <span className="text-3xl">📭</span>

      <h2 className="text-sm font-semibold">
        {content.title}
      </h2>

      <p className="max-w-xs text-xs opacity-70">
        {content.subtitle}
      </p>
    </div>
  );
}
