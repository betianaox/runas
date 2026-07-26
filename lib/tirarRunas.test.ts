import { describe, expect, it } from 'vitest';
import { tirarTresRunas, tirarUnaRuna } from './tirarRunas';

const SIMETRICAS = ['gebo', 'ingwaz', 'dagaz', 'isa'];

describe('tirarRunas', () => {
  it('las runas simétricas nunca salen invertidas (tirarUnaRuna)', () => {
    for (let i = 0; i < 200; i++) {
      const runa = tirarUnaRuna();
      if (SIMETRICAS.includes(runa.id)) {
        expect(runa.posicion).toBe('normal');
      }
    }
  });

  it('las runas simétricas nunca salen invertidas (tirarTresRunas)', () => {
    for (let i = 0; i < 200; i++) {
      for (const runa of tirarTresRunas()) {
        if (SIMETRICAS.includes(runa.id)) {
          expect(runa.posicion).toBe('normal');
        }
      }
    }
  });

  it('tirarTresRunas no repite runa', () => {
    const runas = tirarTresRunas();
    const ids = runas.map((r) => r.id);
    expect(new Set(ids).size).toBe(3);
  });
});
