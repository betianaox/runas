import type { ImageSourcePropType } from 'react-native';
import type { RunaId } from './types';

// require() necesita rutas estáticas — no se puede armar dinámicamente con
// el id, así que va una entrada por runa.
export const imagenes: Record<RunaId, ImageSourcePropType> = {
  fehu: require('../assets/runas/fehu.webp'),
  uruz: require('../assets/runas/uruz.webp'),
  thurisaz: require('../assets/runas/thurisaz.webp'),
  ansuz: require('../assets/runas/ansuz.webp'),
  raidho: require('../assets/runas/raidho.webp'),
  kaunaz: require('../assets/runas/kaunaz.webp'),
  gebo: require('../assets/runas/gebo.webp'),
  wunju: require('../assets/runas/wunju.webp'),
  hagalaz: require('../assets/runas/hagalaz.webp'),
  naudiz: require('../assets/runas/naudiz.webp'),
  isa: require('../assets/runas/isa.webp'),
  jera: require('../assets/runas/jera.webp'),
  eihwaz: require('../assets/runas/eihwaz.webp'),
  perthu: require('../assets/runas/perthu.webp'),
  algiz: require('../assets/runas/algiz.webp'),
  sowulo: require('../assets/runas/sowulo.webp'),
  teiwaz: require('../assets/runas/teiwaz.webp'),
  berkana: require('../assets/runas/berkana.webp'),
  ehwaz: require('../assets/runas/ehwaz.webp'),
  mannaz: require('../assets/runas/mannaz.webp'),
  laguz: require('../assets/runas/laguz.webp'),
  ingwaz: require('../assets/runas/ingwaz.webp'),
  dagaz: require('../assets/runas/dagaz.webp'),
  othala: require('../assets/runas/othala.webp'),
};
