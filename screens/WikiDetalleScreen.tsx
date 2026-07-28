import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { Image, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import BotonCerrar from '../components/BotonCerrar';
import BotonVoz from '../components/BotonVoz';
import MarcoDorado from '../components/MarcoDorado';
import { COLORES } from '../constants/colores';
import { LAYOUT } from '../constants/layout';
import { FUENTE_TITULOS } from '../constants/tipografia';
import { imagenes } from '../content/imagenes';
import { nombres } from '../content/nombres';
import { WIKI_RUNAS } from '../content/wiki';
import { useTextos } from '../hooks/useTextos';
import type { RootStackParamList } from '../navigation/types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'WikiDetalle'>;
  route: RouteProp<RootStackParamList, 'WikiDetalle'>;
};

export default function WikiDetalleScreen({ navigation, route }: Props) {
  const t = useTextos();
  const { width } = useWindowDimensions();

  const { runaId } = route.params;
  const nombre = nombres[runaId];
  const ficha = WIKI_RUNAS[runaId];

  // Lo que lee el TTS: el nombre y los significados de la ficha (sin las
  // listas de palabras clave, que sueltas suenan raras).
  const textoFicha = [
    nombre,
    `${t.wiki.derecho}. ${ficha.significado.normal}`,
    `${t.wiki.invertido}. ${ficha.significado.invertida}`,
    `${t.wiki.simbolismo}. ${ficha.simbolismo}`,
  ].join('\n\n');

  const anchoRuna = Math.min(width * 0.4, 160);

  return (
    <View style={styles.background}>
      <MarcoDorado />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.encabezado}>
          <BotonVoz texto={textoFicha} />
          <BotonCerrar onPress={() => navigation.goBack()} />
        </View>

        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.cabecera}>
            <Image
              source={imagenes[runaId]}
              style={{ width: anchoRuna, height: anchoRuna }}
              resizeMode="contain"
            />
            <Text style={styles.nombre}>{nombre}</Text>
          </View>

          <Seccion titulo={t.wiki.palabrasClave}>
            <View style={styles.chips}>
              <Text style={styles.chipEtiqueta}>{t.wiki.derecho}:</Text>
              <Text style={styles.chipTexto}>{ficha.palabrasClave.normal.join(' · ')}</Text>
            </View>
            <View style={styles.chips}>
              <Text style={styles.chipEtiqueta}>{t.wiki.invertido}:</Text>
              <Text style={styles.chipTexto}>{ficha.palabrasClave.invertida.join(' · ')}</Text>
            </View>
          </Seccion>

          <Seccion titulo={t.wiki.derecho}>
            <Text style={styles.parrafo}>{ficha.significado.normal}</Text>
          </Seccion>

          <Seccion titulo={t.wiki.invertido}>
            <Text style={styles.parrafo}>{ficha.significado.invertida}</Text>
          </Seccion>

          <Seccion titulo={t.wiki.simbolismo}>
            <Text style={styles.parrafo}>{ficha.simbolismo}</Text>
          </Seccion>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function Seccion({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <View style={styles.seccion}>
      <Text style={styles.seccionTitulo}>{titulo}</Text>
      {children}
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
    paddingTop: LAYOUT.aireTop,
    paddingBottom: 14,
  },
  encabezado: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: LAYOUT.aire,
  },
  scroll: {
    paddingHorizontal: LAYOUT.aire,
    paddingTop: 8,
    paddingBottom: 32,
  },
  cabecera: {
    alignItems: 'center',
    gap: 14,
  },
  nombre: {
    fontFamily: FUENTE_TITULOS,
    color: COLORES.oroClaro,
    fontSize: 34,
    textAlign: 'center',
  },
  seccion: {
    marginTop: 24,
  },
  seccionTitulo: {
    color: COLORES.oroClaro,
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  parrafo: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 15,
    lineHeight: 23,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 6,
    gap: 6,
  },
  chipEtiqueta: {
    color: 'rgba(255, 255, 255, 0.55)',
    fontSize: 14,
    fontWeight: '600',
  },
  chipTexto: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 14,
    flexShrink: 1,
  },
});
