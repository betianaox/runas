import AsyncStorage from '@react-native-async-storage/async-storage';

import { armarConsejoDelDia, type ConsejoDelDia } from './armarConsejoDelDia';
import { fechaDeHoy } from './fecha';

const CLAVE_ALMACENAMIENTO = 'runas:consejoDelDia';

interface ConsejoGuardado extends ConsejoDelDia {
  fecha: string;
}

// Se fija una vez por día calendario: si ya se tiró hoy, devuelve lo mismo
// (mismo criterio anti-atraso-de-reloj que las gemas — ver GemasContext).
export async function obtenerConsejoDelDia(): Promise<ConsejoDelDia> {
  const hoy = fechaDeHoy();
  const guardado = await AsyncStorage.getItem(CLAVE_ALMACENAMIENTO);

  if (guardado) {
    const estado: ConsejoGuardado = JSON.parse(guardado);
    if (estado.fecha === hoy || hoy < estado.fecha) {
      return { runa: estado.runa, texto: estado.texto };
    }
  }

  const nuevo = armarConsejoDelDia();
  await AsyncStorage.setItem(
    CLAVE_ALMACENAMIENTO,
    JSON.stringify({ fecha: hoy, runa: nuevo.runa, texto: nuevo.texto }),
  );
  return nuevo;
}
