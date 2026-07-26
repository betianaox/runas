import { paqueteEs } from './es';
import type { IdiomaConcreto, PaqueteContenido } from './paquete';

// Selector de contenido por idioma. Por ahora solo el español está escrito;
// inglés, portugués e italiano caen a español hasta que se traduzcan, así la
// app nunca queda sin contenido si se elige un idioma todavía incompleto.
const paquetes: Record<IdiomaConcreto, PaqueteContenido> = {
  es: paqueteEs,
  en: paqueteEs,
  pt: paqueteEs,
  it: paqueteEs,
};

export function obtenerContenido(idioma: IdiomaConcreto): PaqueteContenido {
  return paquetes[idioma] ?? paqueteEs;
}
