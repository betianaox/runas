import { paqueteEn } from './en';
import { paqueteEs } from './es';
import { paquetePt } from './pt';
import type { IdiomaConcreto, PaqueteContenido } from './paquete';

// Selector de contenido por idioma. Español, inglés y portugués escritos; el
// italiano cae a español hasta que se traduzca, así la app nunca queda sin
// contenido si se elige un idioma todavía incompleto.
const paquetes: Record<IdiomaConcreto, PaqueteContenido> = {
  es: paqueteEs,
  en: paqueteEn,
  pt: paquetePt,
  it: paqueteEs,
};

export function obtenerContenido(idioma: IdiomaConcreto): PaqueteContenido {
  return paquetes[idioma] ?? paqueteEs;
}
