import type { Modo, Tema, Tiempo, Tono } from '../content/types';
import { clasificarModo, clasificarTema, normalizar } from './clasificarPregunta';

// Cuánta "señal" trae la pregunta escrita:
//  - invalida: ruido de teclado o vacío (bloquea la tirada).
//  - flaca:    válida pero muy escueta (deja tirar, pero avisa antes).
//  - rica:     trae tema, tono, mención de alguien o suficientes palabras.
export type Senal = 'invalida' | 'flaca' | 'rica';

export interface AnalisisPregunta {
  senal: Senal;
  temaTexto: Tema; // tema detectado SOLO del texto (independiente del chip)
  modo: Modo;
  tono: Tono;
  tiempo: Tiempo;
  mencionaTercero: boolean;
}

// Estado emocional de quien pregunta. Preocupación pesa más que impulso: si
// alguien escribe "tengo muchas ganas pero me da miedo", conviene recibirlo
// desde la contención antes que desde el envión.
const marcasPreocupacion = [
  'miedo', 'angustia', 'no se', 'no puedo', 'perdi', 'duda', 'dudas',
  'ansiedad', 'ansiosa', 'ansioso', 'triste', 'tristeza', 'sufro', 'sufrir',
  'preocupa', 'preocupada', 'preocupado', 'asusta', 'sola', 'solo', 'vacio',
  'vacia', 'llorar', 'desesper', 'no aguanto', 'cansada', 'cansado', 'agotada',
  'agotado', 'harta', 'harto', 'confundida', 'confundido', 'perdida', 'perdido',
];
const marcasImpulso = [
  'quiero', 'ilusion', 'ganas', 'empezar', 'arrancar', 'oportunidad', 'deseo',
  'sueño', 'suenio', 'ilusionada', 'ilusionado', 'entusiasmo', 'entusiasmada',
  'entusiasmado', 'feliz', 'contenta', 'contento', 'esperanza', 'animo',
  'animarme', 'decidida', 'decidido', 'nueva etapa', 'empiezo',
];

// Orientación temporal. Futuro pesa más que pasado ante una pregunta mixta,
// porque una consulta suele apuntar a "qué va a pasar" aunque arranque
// contando algo que ya ocurrió.
const marcasFuturo = [
  'va a', 'voy a', 'sera', 'seremos', 'vendra', 'conviene', 'deberia', 'debo',
  'tengo que', 'futuro', 'mañana', 'manana', 'proximo', 'proxima', 'adelante',
  'lograre', 'conseguire', 'algun dia', 'llegara', 'pasara', 'volvera',
];
const marcasPasado = [
  'fue', 'era', 'paso', 'pasado', 'antes', 'mi ex', 'lo que hice', 'habia',
  'tuve', 'estuvo', 'termino', 'se fue', 'dejo', 'arrepiento', 'arrepentida',
  'arrepentido', 'ya no', 'solia', 'perdi', 'lo que paso',
];

// Mención de un tercero. A propósito NO incluye "él/ella" sueltos ni el
// artículo "el": son demasiado comunes y darían falsos positivos. Nos
// apoyamos en posesivos de vínculo y en referencias explícitas a una persona.
const marcasTercero = [
  'mi ex', 'mi pareja', 'mi novio', 'mi novia', 'mi jefe', 'mi jefa',
  'mi socio', 'mi socia', 'mi amigo', 'mi amiga', 'mi marido', 'mi esposa',
  'mi esposo', 'mi madre', 'mi padre', 'mi hermano', 'mi hermana',
  'mi companero', 'mi compañera', 'mi compañero', 'esa persona', 'esta persona',
  'esa chica', 'ese chico', 'alguien', 'con el', 'con ella',
];

function contieneAlguna(textoNormalizado: string, marcas: string[]): boolean {
  return marcas.some((marca) => textoNormalizado.includes(normalizar(marca).trim()));
}

function detectarTono(textoNormalizado: string): Tono {
  if (contieneAlguna(textoNormalizado, marcasPreocupacion)) {
    return 'preocupacion';
  }
  if (contieneAlguna(textoNormalizado, marcasImpulso)) {
    return 'impulso';
  }
  return 'neutro';
}

function detectarTiempo(textoNormalizado: string): Tiempo {
  if (contieneAlguna(textoNormalizado, marcasFuturo)) {
    return 'futuro';
  }
  if (contieneAlguna(textoNormalizado, marcasPasado)) {
    return 'pasado';
  }
  return 'presente';
}

// Piso liviano de validez: no intenta detectar gibberish (imposible sin un
// modelo), solo descarta lo evidente para no dejar tirar con un carácter suelto.
function esInvalida(textoCrudo: string): boolean {
  const texto = textoCrudo.trim();
  if (texto.length < 3) {
    return true;
  }
  const soloLetras = texto.replace(/[^a-záéíóúñü]/gi, '');
  if (soloLetras.length < 3) {
    return true; // "??", "1 2", "...ok" → no llega a tres letras
  }
  const sinEspacios = texto.replace(/\s/g, '').toLowerCase();
  if (new Set(sinEspacios).size === 1) {
    return true; // "aaaa", "!!!!"
  }
  return false;
}

export function analizarPregunta(pregunta: string): AnalisisPregunta {
  const textoNormalizado = normalizar(pregunta);
  const temaTexto = clasificarTema(pregunta);
  const modo = clasificarModo(pregunta);
  const tono = detectarTono(textoNormalizado);
  const tiempo = detectarTiempo(textoNormalizado);
  const mencionaTercero = contieneAlguna(textoNormalizado, marcasTercero);

  let senal: Senal;
  if (esInvalida(pregunta)) {
    senal = 'invalida';
  } else {
    const palabras = pregunta.trim().split(/\s+/).filter(Boolean);
    const traeSeñal =
      palabras.length >= 4 ||
      temaTexto !== 'general' ||
      modo === 'cerrada' ||
      tono !== 'neutro' ||
      mencionaTercero;
    senal = traeSeñal ? 'rica' : 'flaca';
  }

  return { senal, temaTexto, modo, tono, tiempo, mencionaTercero };
}
