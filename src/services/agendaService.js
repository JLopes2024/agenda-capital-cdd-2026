export async function getAgenda() {
  const response = await fetch("/src/data/agenda.json");

  if (!response.ok) {
    throw new Error("Erro ao carregar agenda");
  }

  return response.json();
}
