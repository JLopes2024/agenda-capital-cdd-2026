export default function AgendaCard({ titulo, data, status }) {
  return (
<div className="bg-card-light dark:bg-card-dark rounded-xl p-4 border border-black/5 dark:border-white/10">
      <h2>{titulo}</h2>
      <span>{data}</span>
      <div className={`status ${status}`}>
        
<span className="text-success-light dark:text-success-dark">
  {status === "done" ? "Concluída" : "Prevista"}
</span>
      </div>
    </div>
  );
}
