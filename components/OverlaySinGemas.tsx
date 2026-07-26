import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { useGemas } from '../context/GemasContext';
import { useAnuncioRecompensado } from '../hooks/useAnuncioRecompensado';

interface Props {
  visible: boolean;
  onCerrar: () => void;
}

export default function OverlaySinGemas({ visible, onCerrar }: Props) {
  const { ganarGema } = useGemas();
  const { listo, mostrar } = useAnuncioRecompensado();

  const onVerVideo = () => {
    if (!listo) {
      return;
    }
    onCerrar();
    mostrar(ganarGema);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCerrar}>
      <View style={styles.overlayFondo}>
        <View style={styles.overlayCard}>
          <Text style={styles.overlayTitulo}>Te quedan 0 gemas</Text>
          <Text style={styles.overlayTexto}>Ver un video corto para ganar una gema</Text>
          <Pressable
            style={[styles.botonVideo, !listo && styles.botonVideoDeshabilitado]}
            onPress={onVerVideo}
            disabled={!listo}
          >
            <Text style={styles.botonVideoTexto}>
              {listo ? '🎬 Ver video' : 'Cargando video…'}
            </Text>
          </Pressable>
          <Pressable onPress={onCerrar}>
            <Text style={styles.overlayCerrar}>Ahora no</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlayFondo: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  overlayCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 28,
    width: '100%',
    alignItems: 'center',
    gap: 16,
  },
  overlayTitulo: {
    fontSize: 20,
    fontWeight: '700',
  },
  overlayTexto: {
    fontSize: 15,
    textAlign: 'center',
    color: '#333',
  },
  botonVideo: {
    backgroundColor: '#2E7D32',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 24,
    marginTop: 4,
  },
  botonVideoDeshabilitado: {
    opacity: 0.4,
  },
  botonVideoTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  overlayCerrar: {
    color: '#666',
    fontSize: 14,
    marginTop: 4,
  },
});
