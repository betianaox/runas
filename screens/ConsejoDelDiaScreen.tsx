import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ContadorGemas from '../components/ContadorGemas';
import MarcoDorado from '../components/MarcoDorado';
import { FUENTE_TITULOS } from '../constants/tipografia';
import { useIdioma } from '../context/IdiomaContext';
import { useTextos } from '../hooks/useTextos';
import { imagenes } from '../content/imagenes';
import { nombres } from '../content/nombres';
import type { ConsejoDelDia } from '../lib/armarConsejoDelDia';
import { obtenerConsejoDelDia } from '../lib/persistenciaConsejoDelDia';
import { calcularTamanoRuna } from '../lib/tamanoRuna';
import type { RootStackParamList } from '../navigation/types';

const PADDING_HORIZONTAL = 24;

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ConsejoDelDia'>;
};

export default function ConsejoDelDiaScreen({ navigation }: Props) {
  const [consejo, setConsejo] = useState<ConsejoDelDia | null>(null);
  const { idiomaConcreto } = useIdioma();
  const t = useTextos();
  const { width } = useWindowDimensions();
  const tamRuna = calcularTamanoRuna(width, 1, PADDING_HORIZONTAL, 0);

  useEffect(() => {
    obtenerConsejoDelDia(idiomaConcreto).then(setConsejo);
  }, [idiomaConcreto]);

  return (
    <View style={styles.background}>
      <MarcoDorado />
      <SafeAreaView style={styles.safeArea}>
        <ContadorGemas />

        <View style={styles.contenido}>
          <Text style={styles.titulo}>{t.consejoDelDia.titulo}</Text>

          {consejo && (
            <>
              <Image
                source={imagenes[consejo.runa.id]}
                style={[
                  { width: tamRuna, height: tamRuna },
                  consejo.runa.posicion === 'invertida' && styles.imagenRunaInvertida,
                ]}
                resizeMode="contain"
              />
              <Text style={styles.nombreRuna}>{nombres[consejo.runa.id]}</Text>

              <Text style={styles.textoConsejo}>{consejo.texto}</Text>
            </>
          )}

          <Pressable style={styles.botonVolver} onPress={() => navigation.goBack()}>
            <Text style={styles.botonVolverTexto}>{t.consejoDelDia.volver}</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#0C2F58',
  },
  safeArea: {
    flex: 1,
  },
  contenido: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: PADDING_HORIZONTAL,
    gap: 20,
  },
  titulo: {
    color: '#D9B94A',
    fontSize: 26,
    fontWeight: '700',
  },
  imagenRunaInvertida: {
    transform: [{ rotate: '180deg' }],
  },
  nombreRuna: {
    fontFamily: FUENTE_TITULOS,
    color: '#D9B94A',
    fontSize: 34,
  },
  textoConsejo: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  botonVolver: {
    backgroundColor: '#C9A227',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginTop: 12,
  },
  botonVolverTexto: {
    color: '#1a1a2e',
    fontSize: 16,
    fontWeight: '700',
  },
});
