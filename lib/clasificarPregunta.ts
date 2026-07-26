import type { Modo, Tema } from '../content/types';

// Palabras clave por tema. "general" no tiene lista propia: es lo que
// queda cuando ningún otro tema junta al menos una coincidencia.
const palabrasClaveTema: Record<Exclude<Tema, 'general'>, string[]> = {
  amor: [
    'amor', 'pareja', 'relacion', 'mi ex', ' ex ', 'enamor', 'corazon',
    'siento por', 'sentimientos', 'casamiento', 'casarme', 'noviazgo',
    'novio', 'novia', 'me quiere', 'me ama', 'extraño', 'extrano', 'celos',
    'infiel', 'separacion', 'separarme', 'divorcio', 'volver con',
  ],
  trabajo: [
    'trabajo', 'laboral', 'jefe', 'jefa', 'empleo', 'renunciar', 'renuncia',
    'entrevista', 'puesto', 'oficina', 'compañero', 'compañera',
    'proyecto', 'emprendimiento', 'emprender', 'carrera', 'ascenso',
    'changa', 'curro', 'renunciar',
  ],
  dinero: [
    'dinero', 'plata', 'deuda', 'deudas', 'ahorro', 'ahorrar', 'inversion',
    'invertir', 'prestamo', 'sueldo', 'gastar', 'gasto', 'compra',
    'economico', 'economica', 'finanzas', 'guita', 'negocio', 'ganancia',
  ],
};

// Marcas de que la pregunta busca un resultado o un sí/no concreto
// ("¿va a volver?", "¿me conviene?"), en vez de una reflexión abierta
// ("¿qué necesito ver de esto?"). Es una señal barata: no cambia el
// contenido de las runas, solo qué apertura/consejo se elige para
// acompañarlas — así que no hace falta que sea perfecta.
const marcasModoCerrada = [
  'va a', 'voy a', 'vuelve', 'volvera', 'volveremos', 'regresa', 'regresara',
  'conviene', 'deberia', 'debo', 'tengo que', 'funciona', 'funcionara',
  'me quiere', 'me ama', 'es correcto', 'es buena idea', 'sirve',
  'lograre', 'conseguire', 'es el indicado', 'es la indicada', 'si o no',
];

const DIACRITICOS = /[̀-ͯ]/g;

export function normalizar(texto: string): string {
  const sinTildes = texto.toLowerCase().normalize('NFD').replace(DIACRITICOS, '');
  return ` ${sinTildes} `; // bordes con espacios para matchear palabras sueltas, no substrings de otras palabras
}

export function clasificarTema(pregunta: string): Tema {
  const texto = normalizar(pregunta);
  let mejorTema: Tema = 'general';
  let mejorPuntaje = 0;

  for (const [tema, palabras] of Object.entries(palabrasClaveTema)) {
    const puntaje = palabras.filter((palabra) => texto.includes(normalizar(palabra).trim())).length;
    if (puntaje > mejorPuntaje) {
      mejorPuntaje = puntaje;
      mejorTema = tema as Tema;
    }
  }

  return mejorTema;
}

export function clasificarModo(pregunta: string): Modo {
  const texto = normalizar(pregunta);
  const esCerrada = marcasModoCerrada.some((marca) => texto.includes(normalizar(marca).trim()));
  return esCerrada ? 'cerrada' : 'abierta';
}

export interface Clasificacion {
  tema: Tema;
  modo: Modo;
}

export function clasificarPregunta(pregunta: string): Clasificacion {
  return {
    tema: clasificarTema(pregunta),
    modo: clasificarModo(pregunta),
  };
}
