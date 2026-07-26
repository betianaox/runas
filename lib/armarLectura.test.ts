import { describe, expect, it } from 'vitest';
import { nombres } from '../content/nombres';
import type { Modo, Tema } from '../content/types';
import type { AnalisisPregunta } from './analizarPregunta';
import { armarLectura } from './armarLectura';

const TEMAS: Tema[] = ['amor', 'trabajo', 'dinero', 'general'];

// Análisis neutro por defecto; los tests sobreescriben lo que les importa.
function analisis(modo: Modo, extra: Partial<AnalisisPregunta> = {}): AnalisisPregunta {
  return {
    senal: 'rica',
    temaTexto: 'general',
    modo,
    tono: 'neutro',
    tiempo: 'presente',
    mencionaTercero: false,
    ...extra,
  };
}

describe('armarLectura', () => {
  it.each(TEMAS)('arma los dos párrafos para %s, en cualquier modo', (tema) => {
    const lecturaCerrada = armarLectura(tema, analisis('cerrada'));
    const lecturaAbierta = armarLectura(tema, analisis('abierta'));

    expect(lecturaCerrada).not.toBeNull();
    expect(lecturaAbierta).not.toBeNull();
    expect(lecturaCerrada!.parrafoIndividual.length).toBeGreaterThan(20);
    expect(lecturaCerrada!.parrafoIntegrador.length).toBeGreaterThan(20);
    expect(lecturaCerrada!.runas).toHaveLength(3);
  });

  it.each(TEMAS)('%s: no repite runa dentro de la misma tirada', (tema) => {
    const lectura = armarLectura(tema, analisis('abierta'))!;
    const ids = lectura.runas.map((r) => r.id);
    expect(new Set(ids).size).toBe(3);
  });

  it.each(TEMAS)('%s: el párrafo individual menciona las 3 runas por su nombre', (tema) => {
    const lectura = armarLectura(tema, analisis('cerrada'))!;
    for (const runa of lectura.runas) {
      expect(lectura.parrafoIndividual).toContain(nombres[runa.id]);
    }
  });

  it.each(TEMAS)('%s: no deja placeholders {runaN}/{fragN} sin reemplazar', (tema) => {
    const lectura = armarLectura(tema, analisis('cerrada'))!;
    expect(lectura.parrafoIntegrador).not.toMatch(/\{runa\d\}|\{frag\d\}/);
  });

  it('un tono sin contenido propio cae a neutro sin romperse', () => {
    // 'impulso' en cerrada de un tema con pocas semillas: nunca debe quedar vacío.
    const lectura = armarLectura('dinero', analisis('cerrada', { tono: 'impulso' }))!;
    expect(lectura.parrafoIntegrador.length).toBeGreaterThan(20);
  });

  it('inserta una frase de eco cuando la pregunta menciona un tercero', () => {
    const lectura = armarLectura('amor', analisis('abierta', { mencionaTercero: true }))!;
    const mencionaOtro = /otra persona|alguien más|vínculo con otra/i.test(
      lectura.parrafoIntegrador,
    );
    expect(mencionaOtro).toBe(true);
  });

  it('inserta eco temporal cuando la pregunta mira al pasado y no hay tercero', () => {
    const lectura = armarLectura(
      'general',
      analisis('abierta', { tiempo: 'pasado', mencionaTercero: false }),
    )!;
    expect(/hacia atrás|ya pasó|dejaste atrás/i.test(lectura.parrafoIntegrador)).toBe(true);
  });
});
