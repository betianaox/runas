import { obtenerContenido } from '../content';
import type { IdiomaConcreto } from '../content/paquete';
import { tirarUnaRuna, type RunaTirada } from './tirarRunas';

export interface ConsejoDelDia {
  runa: RunaTirada;
  texto: string;
}

// Tirada pura, sin persistencia — cada llamado da una runa nueva al azar.
// Para el comportamiento real ("una vez por día calendario") usar
// obtenerConsejoDelDia() de persistenciaConsejoDelDia.ts.
export function armarConsejoDelDia(idioma: IdiomaConcreto): ConsejoDelDia {
  const runa = tirarUnaRuna();
  const variantes = obtenerContenido(idioma).consejoDelDia[runa.id][runa.posicion];
  const texto = variantes[Math.floor(Math.random() * variantes.length)];
  return { runa, texto };
}
