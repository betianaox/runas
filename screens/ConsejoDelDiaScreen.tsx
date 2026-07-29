import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import BotonCerrar from '../components/BotonCerrar';
import ContadorGemas from '../components/ContadorGemas';
import MarcoDorado from '../components/MarcoDorado';
import { COLORES } from '../constants/colores';
import { LAYOUT } from '../constants/layout';
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
        <View style={styles.encabezado}>
          <ContadorGemas />
          <BotonCerrar onPress={() => navigation.goBack()} />
        </View>

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

              <Text style={styles.vuelveManana}>{t.consejoDelDia.vuelveManana}</Text>
            </>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: COLORES.fondo,
  },
  safeArea: {
    flex: 1,
    // Aire respecto del marco dorado por los cuatro lados.
    paddingTop: LAYOUT.aireTop,
    paddingBottom: LAYOUT.aireTop,
    paddingHorizontal: LAYOUT.aire,
  },
  encabezado: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  contenido: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  titulo: {
    color: COLORES.oroClaro,
    fontSize: 26,
    fontWeight: '700',
  },
  imagenRunaInvertida: {
    transform: [{ rotate: '180deg' }],
  },
  nombreRuna: {
    fontFamily: FUENTE_TITULOS,
    color: COLORES.oroClaro,
    fontSize: 34,
  },
  textoConsejo: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  vuelveManana: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 13,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 4,
  },
});
