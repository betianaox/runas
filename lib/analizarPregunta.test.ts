import { describe, expect, it } from 'vitest';
import { analizarPregunta } from './analizarPregunta';

describe('analizarPregunta — señal / validez', () => {
  it('marca inválidas las entradas de ruido o vacías', () => {
    for (const basura of ['', '  ', 'x', 'aa', '??', '...', 'aaaa', '1 2 3']) {
      expect(analizarPregunta(basura).senal).toBe('invalida');
    }
  });

  it('acepta una sola palabra si es un tema real', () => {
    expect(analizarPregunta('amor').senal).toBe('rica');
    expect(analizarPregunta('dinero').senal).toBe('rica');
  });

  it('marca flaca lo válido pero escueto y sin señal', () => {
    expect(analizarPregunta('hola como estas').senal).toBe('flaca');
    expect(analizarPregunta('asdf').senal).toBe('flaca');
  });

  it('marca rica una consulta con varias palabras', () => {
    expect(analizarPregunta('qué me depara este año que arranca').senal).toBe('rica');
  });
});

describe('analizarPregunta — tono', () => {
  it('detecta preocupación', () => {
    expect(analizarPregunta('tengo miedo de que no funcione').tono).toBe('preocupacion');
  });

  it('detecta impulso', () => {
    expect(analizarPregunta('tengo muchas ganas de empezar algo nuevo').tono).toBe('impulso');
  });

  it('la preocupación pesa más que el impulso en una pregunta mixta', () => {
    expect(analizarPregunta('tengo ganas pero también miedo').tono).toBe('preocupacion');
  });

  it('cae en neutro sin marcas', () => {
    expect(analizarPregunta('cómo viene el mes').tono).toBe('neutro');
  });
});

describe('analizarPregunta — tiempo', () => {
  it('detecta futuro', () => {
    expect(analizarPregunta('¿me va a ir bien?').tiempo).toBe('futuro');
  });

  it('detecta pasado', () => {
    expect(analizarPregunta('¿por qué mi ex se fue así?').tiempo).toBe('pasado');
  });

  it('cae en presente sin marca temporal', () => {
    expect(analizarPregunta('cómo estoy hoy en el amor').tiempo).toBe('presente');
  });
});

describe('analizarPregunta — tercero', () => {
  it('detecta la mención de otra persona por vínculo', () => {
    expect(analizarPregunta('¿mi jefe confía en mí?').mencionaTercero).toBe(true);
    expect(analizarPregunta('¿volveré con mi ex?').mencionaTercero).toBe(true);
  });

  it('no marca tercero cuando la pregunta es solo sobre uno mismo', () => {
    expect(analizarPregunta('¿qué necesito trabajar de mí?').mencionaTercero).toBe(false);
  });
});
