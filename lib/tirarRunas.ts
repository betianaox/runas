import type { Posicion, RunaId } from '../content/types';

const TODAS_LAS_RUNAS: RunaId[] = [
  'fehu', 'uruz', 'thurisaz', 'ansuz', 'raidho', 'kaunaz', 'gebo', 'wunju',
  'hagalaz', 'naudiz', 'isa', 'jera', 'eihwaz', 'perthu', 'algiz', 'sowulo',
  'teiwaz', 'berkana', 'ehwaz', 'mannaz', 'laguz', 'ingwaz', 'dagaz', 'othala',
];

// Runas simétricas: rotadas 180° se ven iguales y no tienen lectura
// invertida en la tradición del futhark. Siempre salen en posición normal.
const RUNAS_SIMETRICAS: RunaId[] = ['gebo', 'ingwaz', 'dagaz', 'isa'];

export interface RunaTirada {
  id: RunaId;
  posicion: Posicion;
}

function elegirPosicion(id: RunaId): Posicion {
  if (RUNAS_SIMETRICAS.includes(id)) {
    return 'normal';
  }
  return Math.random() < 0.5 ? 'normal' : 'invertida';
}

// 3 runas sin repetir, orientación normal/invertida al azar para cada una.
// Sin roles fijos de pasado/presente/futuro — el orden es solo el orden
// en que salieron (ver runas-arquitectura).
export function tirarTresRunas(): [RunaTirada, RunaTirada, RunaTirada] {
  const disponibles = [...TODAS_LAS_RUNAS];
  const elegidas: RunaTirada[] = [];

  for (let i = 0; i < 3; i++) {
    const indice = Math.floor(Math.random() * disponibles.length);
    const [id] = disponibles.splice(indice, 1);
    elegidas.push({ id, posicion: elegirPosicion(id) });
  }

  return elegidas as [RunaTirada, RunaTirada, RunaTirada];
}

// Para el Consejo del día: una sola runa.
export function tirarUnaRuna(): RunaTirada {
  const id = TODAS_LAS_RUNAS[Math.floor(Math.random() * TODAS_LAS_RUNAS.length)];
  return { id, posicion: elegirPosicion(id) };
}
