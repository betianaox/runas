import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

const CLAVE_ALMACENAMIENTO = 'runas:idioma';

// "auto" = seguir el idioma del sistema. Por ahora esto es solo una
// preferencia guardada — el contenido sigue sirviéndose en español hasta
// que se sumen las traducciones (ver runas-arquitectura).
export type Idioma = 'auto' | 'es' | 'en' | 'pt' | 'it';

interface IdiomaContextValor {
  idioma: Idioma;
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
    <IdiomaContext.Provider value={{ idioma, establecerIdioma }}>
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
