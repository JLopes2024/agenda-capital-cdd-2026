export default function Button({
  children,
  active = false,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className={`
        flex-1 rounded-lg px-3 py-2 text-sm font-medium transition
        ${
          active
            ? "bg-sky-400 text-slate-900"
            : "border border-slate-300 text-slate-700 dark:border-white/10 dark:text-slate-200 hover:bg-sky-400 hover:text-slate-900"
        }
      `}
    >
      {children}
    </button>
  );
}
