export default function Header() {
  return (
    <header className="relative overflow-hidden rounded-xl mb-4">
      <div className="h-28 md:h-40">
        <img
          src="/header.jpg"
          alt="Agenda Capital"
          className="h-full w-full object-cover"
        />
      </div>
    </header>
  );
}
