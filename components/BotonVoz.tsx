import { Pressable, StyleSheet, Text } from 'react-native';

import { COLORES } from '../constants/colores';
import { useVozLectura } from '../hooks/useVozLectura';

// Botón de parlante que lee un texto en voz alta (TTS del sistema). Alterna a
// "detener" mientras habla. Corta solo al salir de la pantalla (useVozLectura).
export default function BotonVoz({ texto }: { texto: string }) {
  const { hablando, alternar } = useVozLectura(texto);
  return (
    <Pressable
      style={styles.boton}
      onPress={alternar}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={hablando ? 'Detener' : 'Escuchar'}
    >
      <Text style={styles.icono}>{hablando ? '⏹' : '🔊'}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  boton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(12, 47, 88, 0.66)',
    borderWidth: 1,
    borderColor: COLORES.oro,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icono: {
    fontSize: 20,
  },
});
