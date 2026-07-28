import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import BotonCerrar from '../components/BotonCerrar';
import MarcoDorado from '../components/MarcoDorado';
import OverlayDesbloquearWiki from '../components/OverlayDesbloquearWiki';
import { COLORES } from '../constants/colores';
import { LAYOUT } from '../constants/layout';
import { imagenes } from '../content/imagenes';
import { imagenesBloqueadas } from '../content/imagenesBloqueadas';
import { nombres } from '../content/nombres';
import type { RunaId } from '../content/types';
import { useDesbloqueoWiki } from '../context/DesbloqueoWikiContext';
import { useTextos } from '../hooks/useTextos';
import type { RootStackParamList } from '../navigation/types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Wiki'>;
};

const RUNAS: RunaId[] = Object.keys(nombres) as RunaId[];
const COLUMNAS = 3;
const PADDING = LAYOUT.aire;
const GAP = 12;
// Cuántas runas se ven gratis, como muestra del día. El resto se abre
// mirando un video (destraba TODA la Wiki por hoy, no runa por runa).
const RUNAS_GRATIS = 2;

export default function WikiScreen({ navigation }: Props) {
  const t = useTextos();
  const { width } = useWindowDimensions();
  const { desbloqueada } = useDesbloqueoWiki();
  const [mostrarDesbloqueo, setMostrarDesbloqueo] = useState(false);

  const anchoItem = Math.floor((width - PADDING * 2 - GAP * (COLUMNAS - 1)) / COLUMNAS);

  return (
    <View style={styles.background}>
      <MarcoDorado />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.encabezado}>
          <Text style={styles.titulo}>{t.wiki.titulo}</Text>
          <BotonCerrar onPress={() => navigation.goBack()} />
        </View>

        {!desbloqueada && (
          <Pressable style={styles.botonDesbloquear} onPress={() => setMostrarDesbloqueo(true)}>
            <Text style={styles.botonDesbloquearTexto} numberOfLines={2}>
              {t.wiki.desbloquearBoton}
            </Text>
          </Pressable>
        )}

        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.grilla}>
            {RUNAS.map((runaId, indice) => {
              const gratis = indice < RUNAS_GRATIS;
              const accesible = desbloqueada || gratis;
              return (
                <Pressable
                  key={runaId}
                  style={[styles.item, { width: anchoItem }]}
                  onPress={() =>
                    accesible
                      ? navigation.navigate('WikiDetalle', { runaId })
                      : setMostrarDesbloqueo(true)
                  }
                >
                  <Image
                    source={accesible ? imagenes[runaId] : imagenesBloqueadas[runaId]}
                    style={{ width: anchoItem, height: anchoItem }}
                    resizeMode="contain"
                  />
                  <Text style={styles.itemNombre} numberOfLines={1}>
                    {accesible ? nombres[runaId] : '?'}
                  </Text>
                  {gratis && !desbloqueada && (
                    <Text style={styles.itemGratis} numberOfLines={1}>
                      {t.wiki.gratis}
                    </Text>
                  )}
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      </SafeAreaView>

      <OverlayDesbloquearWiki
        visible={mostrarDesbloqueo}
        onCerrar={() => setMostrarDesbloqueo(false)}
      />
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
  titulo: {
    color: COLORES.marfil,
    fontSize: 24,
    fontWeight: '700',
  },
  botonDesbloquear: {
    marginTop: 14,
    marginHorizontal: LAYOUT.aire,
    backgroundColor: 'rgba(12, 47, 88, 0.66)',
    borderWidth: 1,
    borderColor: COLORES.oro,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  botonDesbloquearTexto: {
    color: COLORES.marfil,
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  scroll: {
    paddingHorizontal: PADDING,
    paddingTop: 16,
    paddingBottom: 28,
  },
  grilla: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GAP,
  },
  item: {
    marginBottom: 16,
    alignItems: 'center',
  },
  itemNombre: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 6,
  },
  itemGratis: {
    color: COLORES.oroClaro,
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 2,
  },
});
