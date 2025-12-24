export async function getAgenda() {
  const SPREADSHEET_ID = "1QPjASXyT56DOPc8El3Jyr2PWFezpvqvJGBzNt3LBzgA";
  const GID = "934987394";
  const URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json&gid=${GID}`;

  const res = await fetch(URL);
  const text = await res.text();

  const cleanJson = text.substring(text.indexOf("{"), text.lastIndexOf("}") + 1);
  const json = JSON.parse(cleanJson);

  return json.table.rows.map((row, idx) => ({
    id: idx,
    titulo: row.c[5]?.v || "",
    endereco: row.c[6]?.v || "",
    cidade: row.c[8]?.v || "",
    data: row.c[9]?.v || "",        // mantem exatamente como na planilha
    horaInicio: row.c[10]?.v || "", // mantem como string
    horaFim: row.c[11]?.v || "",    // mantem como string
    pregador: row.c[20]?.v || "",
    status: row.c[4]?.v || "",
    missao: row.c[25]?.v || "",
  }));
}
