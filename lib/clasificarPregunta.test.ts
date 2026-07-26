import { describe, expect, it } from 'vitest';
import { clasificarModo, clasificarPregunta, clasificarTema } from './clasificarPregunta';

describe('clasificarTema', () => {
  it('detecta amor con o sin tildes', () => {
    expect(clasificarTema('¿Va a volver mi ex?')).toBe('amor');
    expect(clasificarTema('¿Voy a encontrar el amor este año?')).toBe('amor');
  });

  it('detecta trabajo', () => {
    expect(clasificarTema('¿Me conviene renunciar a mi trabajo?')).toBe('trabajo');
  });

  it('detecta dinero', () => {
    expect(clasificarTema('¿Voy a poder pagar mis deudas?')).toBe('dinero');
  });

  it('cae en general si no hay coincidencias', () => {
    expect(clasificarTema('¿Qué energía me rodea hoy?')).toBe('general');
  });
});

describe('clasificarModo', () => {
  it('detecta preguntas cerradas', () => {
    expect(clasificarModo('¿Va a volver mi ex?')).toBe('cerrada');
    expect(clasificarModo('¿Me conviene cambiar de trabajo?')).toBe('cerrada');
  });

  it('detecta preguntas abiertas', () => {
    expect(clasificarModo('¿Qué necesito saber sobre esta etapa?')).toBe('abierta');
    expect(clasificarModo('¿Cómo estoy en el amor ahora mismo?')).toBe('abierta');
  });
});

describe('clasificarPregunta', () => {
  it('combina tema y modo', () => {
    expect(clasificarPregunta('¿Va a volver mi ex?')).toEqual({ tema: 'amor', modo: 'cerrada' });
  });
});
