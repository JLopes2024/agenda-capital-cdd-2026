export default function Footer() {
  return (
    <footer className="mt-8 border-t border-black/10 dark:border-white/10 px-4 py-6 text-xs text-slate-600 dark:text-slate-400">
      
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 text-center sm:grid-cols-3 sm:text-left">
        
        {/* COLUNA 1 – LOGO */}
        <div className="flex flex-col items-center sm:items-start gap-2">
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
        </div>

        {/* COLUNA 2 – DESCRIÇÃO */}
        <div className="flex flex-col items-center sm:items-start gap-1">
          <p className="font-medium">Agenda Capital 2026</p>
          <p>
            Uso interno e informativo. <br />
            Datas e horários sujeitos a alterações.
          </p>
        </div>

        {/* COLUNA 3 – DIREITOS */}
        <div className="flex flex-col items-center sm:items-end gap-1 opacity-80">
          <p>Missão São Paulo – Capital</p>
          <p>© 2026</p>
        </div>

      </div>
    </footer>
  );
}
