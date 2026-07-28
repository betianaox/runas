import type { ImageSourcePropType } from 'react-native';
import type { RunaId } from './types';

// Arte "bloqueado" (name-r.webp) que se muestra en la Wiki en lugar de la
// runa real mientras todavía no se destapó. require() necesita rutas
// estáticas, así que va una entrada por runa (igual que en imagenes.ts).
export const imagenesBloqueadas: Record<RunaId, ImageSourcePropType> = {
  fehu: require('../assets/runas/fehu-r.webp'),
  uruz: require('../assets/runas/uruz-r.webp'),
  thurisaz: require('../assets/runas/thurisaz-r.webp'),
  ansuz: require('../assets/runas/ansuz-r.webp'),
  raidho: require('../assets/runas/raidho-r.webp'),
  kaunaz: require('../assets/runas/kaunaz-r.webp'),
  gebo: require('../assets/runas/gebo-r.webp'),
  wunju: require('../assets/runas/wunju-r.webp'),
  hagalaz: require('../assets/runas/hagalaz-r.webp'),
  naudiz: require('../assets/runas/naudiz-r.webp'),
  isa: require('../assets/runas/isa-r.webp'),
  jera: require('../assets/runas/jera-r.webp'),
  eihwaz: require('../assets/runas/eihwaz-r.webp'),
  perthu: require('../assets/runas/perthu-r.webp'),
  algiz: require('../assets/runas/algiz-r.webp'),
  sowulo: require('../assets/runas/sowulo-r.webp'),
  teiwaz: require('../assets/runas/teiwaz-r.webp'),
  berkana: require('../assets/runas/berkana-r.webp'),
  ehwaz: require('../assets/runas/ehwaz-r.webp'),
  mannaz: require('../assets/runas/mannaz-r.webp'),
  laguz: require('../assets/runas/laguz-r.webp'),
  ingwaz: require('../assets/runas/ingwaz-r.webp'),
  dagaz: require('../assets/runas/dagaz-r.webp'),
  othala: require('../assets/runas/othala-r.webp'),
};
