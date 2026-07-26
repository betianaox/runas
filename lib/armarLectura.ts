import { aperturasAbiertas, aperturasCerradas } from '../content/aperturas';
import { conectores } from '../content/conectores';
import { consejos } from '../content/consejos';
import { ecoTercero, ecoTiempo } from '../content/eco';
import { amor } from '../content/fragmentos/amor';
import { dinero } from '../content/fragmentos/dinero';
import { general } from '../content/fragmentos/general';
import { trabajo } from '../content/fragmentos/trabajo';
import { nombres } from '../content/nombres';
import type { FragmentosDeTema, Modo, Tema, Tono } from '../content/types';
import type { AnalisisPregunta } from './analizarPregunta';
import { tirarTresRunas, type RunaTirada } from './tirarRunas';

const bancoDeFragmentos: Partial<Record<Tema, FragmentosDeTema>> = {
  amor,
  trabajo,
  dinero,
  general,
};

// Verbos para variar cómo se presenta cada runa en el párrafo individual,
// para no repetir siempre "trae" tres veces seguidas.
const VERBOS_INDIVIDUAL = ['trae', 'aporta', 'señala', 'suma', 'indica', 'muestra'];

function elegirAlAzar<T>(lista: readonly T[]): T {
  return lista[Math.floor(Math.random() * lista.length)];
}

function mezclar<T>(lista: readonly T[]): T[] {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

// Elige del sub-pool del tono pedido; si está vacío o no existe, cae a 'neutro'.
// 'neutro' siempre tiene contenido, así que esto nunca devuelve una lista vacía
// mientras el pool base exista.
function porTono(pool: Record<Tono, string[]>, tono: Tono): string[] {
  const delTono = pool[tono];
  return delTono && delTono.length > 0 ? delTono : pool.neutro;
}

// Elige dos variantes distintas del mismo fragmento (una para el párrafo
// individual, otra para el integrador) así no se lee el mismo texto dos
// veces seguidas para la misma runa.
function elegirDosVariantes(variantes: readonly string[]): [string, string] {
  const indiceA = Math.floor(Math.random() * variantes.length);
  let indiceB = Math.floor(Math.random() * variantes.length);
  if (variantes.length > 1) {
    while (indiceB === indiceA) {
      indiceB = Math.floor(Math.random() * variantes.length);
    }
  }
  return [variantes[indiceA], variantes[indiceB]];
}

function completarConector(
  plantilla: string,
  runas: [RunaTirada, RunaTirada, RunaTirada],
  fragmentos: [string, string, string],
): string {
  return plantilla
    .replace('{runa1}', nombres[runas[0].id])
    .replace('{runa2}', nombres[runas[1].id])
    .replace('{runa3}', nombres[runas[2].id])
    .replace('{frag1}', fragmentos[0])
    .replace('{frag2}', fragmentos[1])
    .replace('{frag3}', fragmentos[2]);
}

// Frase de eco opcional (máximo una): prioriza la mención de un tercero por
// ser lo más personal; si no hay, usa la marca temporal fuerte. '' si no
// corresponde ninguna.
function elegirEco(analisis: AnalisisPregunta): string {
  if (analisis.mencionaTercero) {
    return elegirAlAzar(ecoTercero);
  }
  if (analisis.tiempo !== 'presente') {
    return elegirAlAzar(ecoTiempo[analisis.tiempo]);
  }
  return '';
}

export interface Lectura {
  tema: Tema;
  modo: Modo;
  runas: [RunaTirada, RunaTirada, RunaTirada];
  parrafoIndividual: string;
  parrafoIntegrador: string;
}

// null = todavía no hay contenido escrito para ese tema.
// El `tema` sale del chip (qué banco de significados usar); el `analisis`
// aporta cómo la persona formuló la pregunta (modo/tono/tiempo/tercero), que
// es lo que dirige qué apertura, consejo y eco la acompañan.
export function armarLectura(tema: Tema, analisis: AnalisisPregunta): Lectura | null {
  const { modo, tono } = analisis;
  const fragmentosDelTema = bancoDeFragmentos[tema];
  const poolAperturas = modo === 'abierta' ? aperturasAbiertas[tema] : aperturasCerradas;
  const poolConsejos = consejos[tema]?.[modo];

  if (!fragmentosDelTema || !poolAperturas || !poolConsejos) {
    return null;
  }

  const aperturasDisponibles = porTono(poolAperturas, tono);
  const consejosDisponibles = porTono(poolConsejos, tono);

  const runas = tirarTresRunas();
  const versiones = runas.map((runa) =>
    elegirDosVariantes(fragmentosDelTema[runa.id][runa.posicion]),
  );
  const fragmentosIndividuales = versiones.map((v) => v[0]) as [string, string, string];
  const fragmentosCombinados = versiones.map((v) => v[1]) as [string, string, string];

  const verbos = mezclar(VERBOS_INDIVIDUAL).slice(0, 3);
  const parrafoIndividual = runas
    .map((runa, i) => `${nombres[runa.id]} ${verbos[i]} ${fragmentosIndividuales[i]}.`)
    .join(' ');

  const apertura = elegirAlAzar(aperturasDisponibles);
  const eco = elegirEco(analisis);
  const conector = elegirAlAzar(conectores);
  const consejo = elegirAlAzar(consejosDisponibles);
  const oracionCombinada = completarConector(conector, runas, fragmentosCombinados);
  const parrafoIntegrador = [apertura, eco, oracionCombinada, consejo]
    .filter((parte) => parte.length > 0)
    .join(' ');

  return {
    tema,
    modo,
    runas,
    parrafoIndividual,
    parrafoIntegrador,
  };
}
