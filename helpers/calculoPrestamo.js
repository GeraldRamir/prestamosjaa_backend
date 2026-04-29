/**
 * Lógica de fila: intereses = (tasaInteresPercent / 100) * capital
 * total = capital + avance + abono + intereses + atrasos
 */
export function calcularInteresYTotalFila({
  capital,
  avance,
  abono,
  atrasos,
  tasaInteresPercent,
}) {
  const c = Number(capital) || 0;
  const a = Number(avance) || 0;
  const b = Number(abono) || 0;
  const at = Number(atrasos) || 0;
  const t = Number(tasaInteresPercent) || 0;
  const intereses = (t / 100) * c;
  const total = c + a + b + intereses + at;
  return { intereses, total };
}
