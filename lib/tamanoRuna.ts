// Los PNG de origen en assets/runas/ son de 160x160 — pasado ese tamaño
// ya se nota pixelado. Nunca usar un tamaño fijo en las pantallas: siempre
// calcular a partir del ancho disponible, con este tope (misma lección que
// con Vigía).
export const TAM_MAXIMO_RUNA = 150;

export function calcularTamanoRuna(
  anchoPantalla: number,
  cantidadEnFila: number,
  paddingHorizontal: number,
  gapEntreRunas: number,
): number {
  const anchoDisponible =
    anchoPantalla - paddingHorizontal * 2 - gapEntreRunas * (cantidadEnFila - 1);
  return Math.min(TAM_MAXIMO_RUNA, anchoDisponible / cantidadEnFila);
}
