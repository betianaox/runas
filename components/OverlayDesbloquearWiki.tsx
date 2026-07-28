import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { useDesbloqueoWiki } from '../context/DesbloqueoWikiContext';
import { useAnuncioRecompensado } from '../hooks/useAnuncioRecompensado';
import { useTextos } from '../hooks/useTextos';

interface Props {
  visible: boolean;
  onCerrar: () => void;
}

// Ofrece destrabar toda la Wiki por hoy a cambio de un video corto. Solo
// desbloquea en el callback de recompensa: si se cierra el video antes de
// terminarlo, no pasa nada.
export default function OverlayDesbloquearWiki({ visible, onCerrar }: Props) {
  const { desbloquear } = useDesbloqueoWiki();
  const { listo, mostrar } = useAnuncioRecompensado();
  const t = useTextos();

  const onVerVideo = () => {
    if (!listo) {
      return;
    }
    onCerrar();
    mostrar(desbloquear);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCerrar}>
      <View style={styles.overlayFondo}>
        <View style={styles.overlayCard}>
          <Text style={styles.overlayTitulo}>{t.wiki.desbloquearTitulo}</Text>
          <Text style={styles.overlayTexto}>{t.wiki.desbloquearTexto}</Text>
          <Pressable
            style={[styles.botonVideo, !listo && styles.botonVideoDeshabilitado]}
            onPress={onVerVideo}
            disabled={!listo}
          >
            <Text style={styles.botonVideoTexto}>
              {listo ? t.overlaySinGemas.verVideo : t.overlaySinGemas.cargando}
            </Text>
          </Pressable>
          <Pressable onPress={onCerrar}>
            <Text style={styles.overlayCerrar}>{t.overlaySinGemas.ahoraNo}</Text>
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
    textAlign: 'center',
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
