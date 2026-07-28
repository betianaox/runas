import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';

import { fechaDeHoy } from '../lib/fecha';

const CLAVE_ALMACENAMIENTO = 'runas:wikiDesbloqueada';

// Si la Wiki está abierta HOY. Se abre entera mirando un video corto y se
// vuelve a cerrar cuando cambia el día calendario — mismo modelo "por día" que
// las gemas (ver GemasContext), con el mismo anti-cheat de reloj sin servidor.
interface DesbloqueoGuardado {
  fecha: string;
  desbloqueada: boolean;
}

interface DesbloqueoWikiContextValor {
  desbloqueada: boolean;
  desbloquear: () => void;
}

const DesbloqueoWikiContext = createContext<DesbloqueoWikiContextValor | null>(null);

export function DesbloqueoWikiProvider({ children }: { children: ReactNode }) {
  const [desbloqueada, setDesbloqueada] = useState(false);
  const fechaVigente = useRef(fechaDeHoy());

  useEffect(() => {
    (async () => {
      const hoy = fechaDeHoy();
      const guardado = await AsyncStorage.getItem(CLAVE_ALMACENAMIENTO);

      if (guardado) {
        const estado: DesbloqueoGuardado = JSON.parse(guardado);
        if (estado.fecha === hoy || hoy < estado.fecha) {
          fechaVigente.current = estado.fecha;
          setDesbloqueada(estado.desbloqueada);
          return;
        }
      }

      // No había nada guardado, o pasó un día real: se vuelve a bloquear.
      fechaVigente.current = hoy;
      setDesbloqueada(false);
      await AsyncStorage.setItem(
        CLAVE_ALMACENAMIENTO,
        JSON.stringify({ fecha: hoy, desbloqueada: false }),
      );
    })();
  }, []);

  const desbloquear = () => {
    setDesbloqueada(true);
    AsyncStorage.setItem(
      CLAVE_ALMACENAMIENTO,
      JSON.stringify({ fecha: fechaVigente.current, desbloqueada: true }),
    );
  };

  return (
    <DesbloqueoWikiContext.Provider value={{ desbloqueada, desbloquear }}>
      {children}
    </DesbloqueoWikiContext.Provider>
  );
}

export function useDesbloqueoWiki(): DesbloqueoWikiContextValor {
  const contexto = useContext(DesbloqueoWikiContext);
  if (!contexto) {
    throw new Error('useDesbloqueoWiki debe usarse dentro de <DesbloqueoWikiProvider>');
  }
  return contexto;
}
