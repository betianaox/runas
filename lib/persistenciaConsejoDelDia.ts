import AsyncStorage from '@react-native-async-storage/async-storage';

import type { IdiomaConcreto } from '../content/paquete';
import { armarConsejoDelDia, type ConsejoDelDia } from './armarConsejoDelDia';
import { fechaDeHoy } from './fecha';

const CLAVE_ALMACENAMIENTO = 'runas:consejoDelDia';

interface ConsejoGuardado extends ConsejoDelDia {
  fecha: string;
  idioma: IdiomaConcreto;
}

// Se fija una vez por día calendario: si ya se tiró hoy, devuelve lo mismo
// (mismo criterio anti-atraso-de-reloj que las gemas — ver GemasContext).
// Si cambió el idioma desde la última vez, se regenera para no dejar el texto
// del consejo en el idioma anterior.
export async function obtenerConsejoDelDia(idioma: IdiomaConcreto): Promise<ConsejoDelDia> {
  const hoy = fechaDeHoy();
  const guardado = await AsyncStorage.getItem(CLAVE_ALMACENAMIENTO);

  if (guardado) {
    const estado: ConsejoGuardado = JSON.parse(guardado);
    const mismoDia = estado.fecha === hoy || hoy < estado.fecha;
    if (mismoDia && estado.idioma === idioma) {
      return { runa: estado.runa, texto: estado.texto };
    }
  }

  const nuevo = armarConsejoDelDia(idioma);
  await AsyncStorage.setItem(
    CLAVE_ALMACENAMIENTO,
    JSON.stringify({ fecha: hoy, idioma, runa: nuevo.runa, texto: nuevo.texto }),
  );
  return nuevo;
}
