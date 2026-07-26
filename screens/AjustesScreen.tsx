import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import MarcoDorado from '../components/MarcoDorado';
import { useIdioma, type Idioma } from '../context/IdiomaContext';
import type { RootStackParamList } from '../navigation/types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Ajustes'>;
};

const IDIOMAS: { id: Idioma; etiqueta: string }[] = [
  { id: 'auto', etiqueta: 'Español — automático' },
  { id: 'en', etiqueta: 'English' },
  { id: 'pt', etiqueta: 'Português' },
  { id: 'it', etiqueta: 'Italiano' },
];

const TEXTO_DISCLAIMER =
  'Runas es una aplicación de entretenimiento. No es adivinación ni predicción del futuro, ' +
  'y las interpretaciones que ofrece no constituyen asesoramiento profesional (médico, legal, ' +
  'financiero ni psicológico) ni reemplazan el criterio de cada persona. Es un espacio para la ' +
  'reflexión, no una fuente de certezas.';

export default function AjustesScreen({ navigation }: Props) {
  const { idioma, establecerIdioma } = useIdioma();

  return (
    <View style={styles.background}>
      <MarcoDorado />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.encabezado}>
          <Text style={styles.titulo}>Ajustes</Text>
          <Pressable style={styles.botonCerrar} onPress={() => navigation.goBack()} hitSlop={12}>
            <Text style={styles.botonCerrarTexto}>✕</Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.seccionTitulo}>Idioma</Text>
          <View style={styles.listaIdiomas}>
            {IDIOMAS.map((opcion) => {
              const seleccionado = opcion.id === idioma;
              return (
                <Pressable
                  key={opcion.id}
                  style={[styles.opcionIdioma, seleccionado && styles.opcionIdiomaSeleccionada]}
                  onPress={() => establecerIdioma(opcion.id)}
                >
                  <Text style={styles.opcionIdiomaTexto}>{opcion.etiqueta}</Text>
                  {seleccionado && <Text style={styles.opcionIdiomaCheck}>✓</Text>}
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.seccionTitulo}>Sobre la app</Text>
          <Text style={styles.disclaimer}>{TEXTO_DISCLAIMER}</Text>
        </ScrollView>
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
  encabezado: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  titulo: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
  },
  botonCerrar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  botonCerrarTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  scroll: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    gap: 12,
  },
  seccionTitulo: {
    color: '#D9B94A',
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 12,
  },
  listaIdiomas: {
    gap: 10,
  },
  opcionIdioma: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  opcionIdiomaSeleccionada: {
    borderColor: '#C9A227',
    backgroundColor: 'rgba(201, 162, 39, 0.15)',
  },
  opcionIdiomaTexto: {
    color: '#fff',
    fontSize: 16,
  },
  opcionIdiomaCheck: {
    color: '#D9B94A',
    fontSize: 16,
    fontWeight: '700',
  },
  disclaimer: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 14,
    lineHeight: 21,
  },
});
