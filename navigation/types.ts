import type { RunaId } from '../content/types';

export type RootStackParamList = {
  Home: undefined;
  Pregunta: undefined;
  ConsejoDelDia: undefined;
  Wiki: undefined;
  WikiDetalle: { runaId: RunaId };
  Ajustes: undefined;
};
