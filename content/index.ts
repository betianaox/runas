import { paqueteEn } from './en';
import { paqueteEs } from './es';
import { paqueteIt } from './it';
import { paquetePt } from './pt';
import type { IdiomaConcreto, PaqueteContenido } from './paquete';

// Selector de contenido por idioma. Los cuatro idiomas están escritos.
const paquetes: Record<IdiomaConcreto, PaqueteContenido> = {
  es: paqueteEs,
  en: paqueteEn,
  pt: paquetePt,
  it: paqueteIt,
};

export function obtenerContenido(idioma: IdiomaConcreto): PaqueteContenido {
  return paquetes[idioma] ?? paqueteEs;
}
