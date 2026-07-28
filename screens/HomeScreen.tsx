import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ContadorGemas from '../components/ContadorGemas';
import OverlaySinGemas from '../components/OverlaySinGemas';
import { COLORES } from '../constants/colores';
import { FUENTE_TITULOS } from '../constants/tipografia';
import { useGemas } from '../context/GemasContext';
import { useTextos } from '../hooks/useTextos';
import type { RootStackParamList } from '../navigation/types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

export default function HomeScreen({ navigation }: Props) {
  const { gemas } = useGemas();
  const t = useTextos();
  const [mostrarOverlaySinGemas, setMostrarOverlaySinGemas] = useState(false);

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

            <Pressable style={styles.boton} onPress={() => navigation.navigate('Wiki')}>
              <Text style={styles.botonTexto}>{t.home.wiki}</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>

      <OverlaySinGemas
        visible={mostrarOverlaySinGemas}
        onCerrar={() => setMostrarOverlaySinGemas(false)}
      />
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
    // Home no tiene marco dorado: padding chico, pegado al borde de pantalla.
    paddingTop: 10,
    paddingHorizontal: 24,
  },
  botonAjustes: {
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
    // Botón transparente: translúcido oscuro + borde dorado + texto marfil,
    // en vez del navy sólido anterior.
    backgroundColor: 'rgba(12, 47, 88, 0.66)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORES.oro,
    paddingVertical: 18,
    alignItems: 'center',
  },
  botonTexto: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
