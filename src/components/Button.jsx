export default function Button({ active, children, ...props }) {
  return (
    <button
      {...props}
      className={`
      focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 dark:focus:ring-offset-black
      rounded-lg px-3 py-1 text-sm font-medium transition
        ${
          active
            ? "bg-sky-500 text-white shadow"
            : "bg-white text-slate-700 border border-slate-300 hover:bg-sky-100 hover:text-slate-900 dark:bg-slate-900 dark:text-slate-300 dark:border-white/10 dark:hover:bg-sky-500/20"
        }
        active:scale-95
      `}
    >
      {children}
    </button>
  );
}
