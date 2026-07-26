import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import { ImageBackground, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ContadorGemas from '../components/ContadorGemas';
import OverlaySinGemas from '../components/OverlaySinGemas';
import { FUENTE_TITULOS } from '../constants/tipografia';
import { useGemas } from '../context/GemasContext';
import { useUsuario } from '../context/UsuarioContext';
import { useTextos } from '../hooks/useTextos';
import type { RootStackParamList } from '../navigation/types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

export default function HomeScreen({ navigation }: Props) {
  const { gemas } = useGemas();
  const { nombre, establecerNombre } = useUsuario();
  const t = useTextos();
  const [mostrarOverlaySinGemas, setMostrarOverlaySinGemas] = useState(false);
  const [nombreIngresado, setNombreIngresado] = useState('');

  const onContinuarBienvenida = () => {
    if (!nombreIngresado.trim()) {
      return;
    }
    establecerNombre(nombreIngresado);
  };

  const onPresionarPregunta = () => {
    if (gemas > 0) {
      navigation.navigate('Pregunta');
    } else {
      setMostrarOverlaySinGemas(true);
    }
  };

  return (
    <ImageBackground
      source={require('../assets/bg-home.webp')}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.filaSuperior}>
          <ContadorGemas />
          <Pressable
            style={styles.botonAjustes}
            onPress={() => navigation.navigate('Ajustes')}
            hitSlop={8}
          >
            <Text style={styles.botonAjustesTexto}>⚙</Text>
          </Pressable>
        </View>

        <View style={styles.contenidoCentral}>
          <Text style={styles.titulo}>Runas</Text>

          <View style={styles.botonera}>
            <Pressable style={styles.boton} onPress={onPresionarPregunta}>
              <Text style={styles.botonTexto}>{t.home.pregunta}</Text>
            </Pressable>

            <Pressable
              style={styles.boton}
              onPress={() => navigation.navigate('ConsejoDelDia')}
            >
              <Text style={styles.botonTexto}>{t.home.consejoDelDia}</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>

      <OverlaySinGemas
        visible={mostrarOverlaySinGemas}
        onCerrar={() => setMostrarOverlaySinGemas(false)}
      />

      <Modal visible={!nombre} transparent animationType="fade">
        <View style={styles.overlayFondo}>
          <View style={styles.overlayCard}>
            <Text style={styles.overlayTitulo}>{t.home.bienvenidoTitulo}</Text>
            <Text style={styles.overlayTexto}>{t.home.bienvenidoPregunta}</Text>
            <TextInput
              style={styles.inputNombre}
              placeholder={t.home.nombrePlaceholder}
              placeholderTextColor="rgba(0,0,0,0.4)"
              value={nombreIngresado}
              onChangeText={setNombreIngresado}
              autoFocus
              maxLength={30}
            />
            <Pressable
              style={[styles.botonContinuar, !nombreIngresado.trim() && styles.botonDeshabilitado]}
              onPress={onContinuarBienvenida}
              disabled={!nombreIngresado.trim()}
            >
              <Text style={styles.botonContinuarTexto}>{t.home.continuar}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  filaSuperior: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  botonAjustes: {
    marginTop: 10,
    marginRight: 28,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  botonAjustesTexto: {
    color: '#fff',
    fontSize: 20,
  },
  contenidoCentral: {
    flex: 1,
    justifyContent: 'center',
    gap: 40,
  },
  titulo: {
    fontFamily: FUENTE_TITULOS,
    fontWeight: 'normal',
    fontStyle: 'normal',
    color: '#0C2F58',
    fontSize: 96,
    textAlign: 'center',
    textShadowColor: '#F0C868',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 30,
  },
  botonera: {
    paddingHorizontal: 24,
    gap: 16,
  },
  boton: {
    backgroundColor: '#0C2F58',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
  },
  botonTexto: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
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
  botonContinuar: {
    backgroundColor: '#C9A227',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 24,
    marginTop: 4,
    width: '100%',
    alignItems: 'center',
  },
  botonDeshabilitado: {
    opacity: 0.4,
  },
  botonContinuarTexto: {
    color: '#1a1a2e',
    fontSize: 16,
    fontWeight: '700',
  },
  inputNombre: {
    width: '100%',
    backgroundColor: '#F2F2F2',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#1a1a2e',
  },
});
