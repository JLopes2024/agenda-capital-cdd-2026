export async function getAgenda() {
  try {
    const response = await fetch("/src/data/agenda.json");
    if (!response.ok) throw new Error("Erro ao carregar agenda");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}
