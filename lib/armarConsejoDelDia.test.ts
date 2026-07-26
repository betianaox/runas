import { describe, expect, it } from 'vitest';
import { armarConsejoDelDia } from './armarConsejoDelDia';

describe('armarConsejoDelDia', () => {
  it('devuelve una runa y un texto no vacío', () => {
    const consejo = armarConsejoDelDia('es');
    expect(consejo.runa).toBeDefined();
    expect(consejo.texto.length).toBeGreaterThan(20);
  });
});
