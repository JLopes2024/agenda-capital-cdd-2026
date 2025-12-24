export default function Footer() {
  return (
    <footer className="mt-6 flex flex-col items-center gap-2 py-4 text-sm text-slate-600 dark:text-slate-400">
      
      {/* LOGO LIGHT */}
      <img
        src="/simbolo-preto.png"
        alt="Agenda Capital"
        className="h-10 dark:hidden"
      />

      {/* LOGO DARK */}
      <img
        src="/simbolo-cinza.png"
        alt="Agenda Capital"
        className="hidden h-10 dark:block"
      />

    </footer>
  );
}
