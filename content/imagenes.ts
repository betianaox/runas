import type { ImageSourcePropType } from 'react-native';
import type { RunaId } from './types';

// require() necesita rutas estáticas — no se puede armar dinámicamente con
// el id, así que va una entrada por runa.
export const imagenes: Record<RunaId, ImageSourcePropType> = {
  fehu: require('../assets/runas/fehu.png'),
  uruz: require('../assets/runas/uruz.png'),
  thurisaz: require('../assets/runas/thurisaz.png'),
  ansuz: require('../assets/runas/ansuz.png'),
  raidho: require('../assets/runas/raidho.png'),
  kaunaz: require('../assets/runas/kaunaz.png'),
  gebo: require('../assets/runas/gebo.png'),
  wunju: require('../assets/runas/wunju.png'),
  hagalaz: require('../assets/runas/hagalaz.png'),
  naudiz: require('../assets/runas/naudiz.png'),
  isa: require('../assets/runas/isa.png'),
  jera: require('../assets/runas/jera.png'),
  eihwaz: require('../assets/runas/eihwaz.png'),
  perthu: require('../assets/runas/perthu.png'),
  algiz: require('../assets/runas/algiz.png'),
  sowulo: require('../assets/runas/sowulo.png'),
  teiwaz: require('../assets/runas/teiwaz.png'),
  berkana: require('../assets/runas/berkana.png'),
  ehwaz: require('../assets/runas/ehwaz.png'),
  mannaz: require('../assets/runas/mannaz.png'),
  laguz: require('../assets/runas/laguz.png'),
  ingwaz: require('../assets/runas/ingwaz.png'),
  dagaz: require('../assets/runas/dagaz.png'),
  othala: require('../assets/runas/othala.png'),
};
