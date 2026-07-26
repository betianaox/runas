import { Pressable, StyleSheet, Text, View } from 'react-native';

interface Props {
  etiqueta: string;
  onAceptar: () => void;
  onDescartar: () => void;
}

// Sugerencia suave cuando el texto de la pregunta parece de otro tema que el
// del chip elegido. No cambia nada solo: propone, y la persona decide.
export default function SugerenciaTema({ etiqueta, onAceptar, onDescartar }: Props) {
  return (
    <View style={styles.contenedor}>
      <Text style={styles.texto} numberOfLines={2}>
        Tu pregunta parece de {etiqueta}.
      </Text>
      <View style={styles.acciones}>
        <Pressable onPress={onAceptar} hitSlop={8}>
          <Text style={styles.cambiar}>Cambiar</Text>
        </Pressable>
        <Pressable onPress={onDescartar} hitSlop={8}>
          <Text style={styles.descartar}>✕</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(201, 162, 39, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(201, 162, 39, 0.5)',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    gap: 12,
    marginTop: -8,
  },
  texto: {
    flex: 1,
    color: '#fff',
    fontSize: 13,
  },
  acciones: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  cambiar: {
    color: '#E6C65A',
    fontSize: 14,
    fontWeight: '700',
  },
  descartar: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
    fontWeight: '700',
  },
});
