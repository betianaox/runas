import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import type { IdiomaConcreto } from '../content/paquete';

const CLAVE_ALMACENAMIENTO = 'runas:idioma';

// "auto" = seguir el idioma del sistema. La preferencia se guarda tal cual; el
// contenido se sirve según el idioma *concreto* que devuelve resolverIdioma().
export type Idioma = 'auto' | 'es' | 'en' | 'pt' | 'it';

// Traduce la preferencia a un idioma concreto servible. 'auto' cae a español
// por ahora; cuando reconstruyamos para publicar, acá se leerá el idioma del
// sistema (expo-localization) y se mapeará a es/en/pt/it con fallback a es.
export function resolverIdioma(idioma: Idioma): IdiomaConcreto {
  return idioma === 'auto' ? 'es' : idioma;
}

interface IdiomaContextValor {
  idioma: Idioma;
  idiomaConcreto: IdiomaConcreto;
  establecerIdioma: (idioma: Idioma) => void;
}

const IdiomaContext = createContext<IdiomaContextValor | null>(null);

export function IdiomaProvider({ children }: { children: ReactNode }) {
  const [idioma, setIdioma] = useState<Idioma>('auto');

  useEffect(() => {
    AsyncStorage.getItem(CLAVE_ALMACENAMIENTO).then((guardado) => {
      if (guardado) {
        setIdioma(guardado as Idioma);
      }
    });
  }, []);

  const establecerIdioma = (nuevoIdioma: Idioma) => {
    setIdioma(nuevoIdioma);
    AsyncStorage.setItem(CLAVE_ALMACENAMIENTO, nuevoIdioma);
  };

  return (
    <IdiomaContext.Provider
      value={{ idioma, idiomaConcreto: resolverIdioma(idioma), establecerIdioma }}
    >
      {children}
    </IdiomaContext.Provider>
  );
}

export function useIdioma(): IdiomaContextValor {
  const contexto = useContext(IdiomaContext);
  if (!contexto) {
    throw new Error('useIdioma debe usarse dentro de <IdiomaProvider>');
  }
  return contexto;
}
