import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AvisoPreguntaCorta from '../components/AvisoPreguntaCorta';
import ContadorGemas from '../components/ContadorGemas';
import SugerenciaTema from '../components/SugerenciaTema';
import MarcoDorado from '../components/MarcoDorado';
import OverlaySinGemas from '../components/OverlaySinGemas';
import { FUENTE_TITULOS } from '../constants/tipografia';
import { useGemas } from '../context/GemasContext';
import { imagenes } from '../content/imagenes';
import { nombres } from '../content/nombres';
import type { Tema } from '../content/types';
import { analizarPregunta } from '../lib/analizarPregunta';
import { armarLectura, type Lectura } from '../lib/armarLectura';
import { calcularTamanoRuna } from '../lib/tamanoRuna';
import { tirarUnaRuna, type RunaTirada } from '../lib/tirarRunas';

const TEMAS: { id: Tema; etiqueta: string }[] = [
  { id: 'amor', etiqueta: 'Amor' },
  { id: 'trabajo', etiqueta: 'Trabajo' },
  { id: 'dinero', etiqueta: 'Dinero' },
  { id: 'general', etiqueta: 'General' },
];

const PADDING_HORIZONTAL = 24;
const GAP_RUNAS = 16;
const INTERVALO_SORTEO_MS = 90;
const DEMORAS_REVELADO_MS = [1100, 1700, 2400];

export default function PreguntaScreen() {
  const { gemas, gastarGema } = useGemas();
  const { width } = useWindowDimensions();
  const [temaElegido, setTemaElegido] = useState<Tema>('amor');
  const [pregunta, setPregunta] = useState('');
  const [lectura, setLectura] = useState<Lectura | null>(null);
  const [revelado, setRevelado] = useState([false, false, false]);
  const [vistaSorteo, setVistaSorteo] = useState<RunaTirada[]>([]);
  const [mostrarOverlaySinGemas, setMostrarOverlaySinGemas] = useState(false);
  const [mostrarAvisoCorta, setMostrarAvisoCorta] = useState(false);
  const [temaDescartado, setTemaDescartado] = useState<Tema | null>(null);

  const opacidadTexto = useRef(new Animated.Value(0)).current;
  const intervaloSorteo = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutsRevelado = useRef<ReturnType<typeof setTimeout>[]>([]);

  const limpiarAnimacion = () => {
    if (intervaloSorteo.current) {
      clearInterval(intervaloSorteo.current);
      intervaloSorteo.current = null;
    }
    timeoutsRevelado.current.forEach(clearTimeout);
    timeoutsRevelado.current = [];
  };

  useEffect(() => limpiarAnimacion, []);

  const tamRuna = calcularTamanoRuna(width, 3, PADDING_HORIZONTAL, GAP_RUNAS);

  const analisis = useMemo(() => analizarPregunta(pregunta), [pregunta]);
  const preguntaEsValida = analisis.senal !== 'invalida';
  const mostrarHintCorta = pregunta.trim().length > 0 && analisis.senal === 'invalida';

  // Sugerencia de tema: si el texto parece de otro tema que el chip elegido
  // (y no es 'general', ni uno que la persona ya descartó), la ofrecemos.
  const temaSugerido =
    analisis.temaTexto !== 'general' &&
    analisis.temaTexto !== temaElegido &&
    analisis.temaTexto !== temaDescartado
      ? analisis.temaTexto
      : null;
  const etiquetaTemaSugerido = TEMAS.find((t) => t.id === temaSugerido)?.etiqueta ?? '';

  // Paso de validación: decide si tira directo, avisa por pregunta flaca, o
  // manda al overlay de gemas. La tirada real vive en ejecutarTirada.
  const onTirarLasRunas = () => {
    if (analisis.senal === 'invalida') {
      return;
    }
    if (gemas <= 0) {
      setMostrarOverlaySinGemas(true);
      return;
    }
    if (analisis.senal === 'flaca') {
      setMostrarAvisoCorta(true);
      return;
    }
    ejecutarTirada();
  };

  const ejecutarTirada = () => {
    const resultado = armarLectura(temaElegido, analisis);
    if (!resultado) {
      return;
    }
    gastarGema();
    limpiarAnimacion();
    opacidadTexto.setValue(0);
    setRevelado([false, false, false]);
    setVistaSorteo([tirarUnaRuna(), tirarUnaRuna(), tirarUnaRuna()]);
    setLectura(resultado);

    intervaloSorteo.current = setInterval(() => {
      setVistaSorteo([tirarUnaRuna(), tirarUnaRuna(), tirarUnaRuna()]);
    }, INTERVALO_SORTEO_MS);

    DEMORAS_REVELADO_MS.forEach((demora, indice) => {
      const timeout = setTimeout(() => {
        setRevelado((actual) => {
          const siguiente = [...actual];
          siguiente[indice] = true;
          return siguiente;
        });
        if (indice === DEMORAS_REVELADO_MS.length - 1) {
          if (intervaloSorteo.current) {
            clearInterval(intervaloSorteo.current);
            intervaloSorteo.current = null;
          }
          Animated.timing(opacidadTexto, {
            toValue: 1,
            duration: 450,
            useNativeDriver: true,
          }).start();
        }
      }, demora);
      timeoutsRevelado.current.push(timeout);
    });
  };

  const onNuevaPregunta = () => {
    limpiarAnimacion();
    setLectura(null);
    setPregunta('');
    setTemaDescartado(null);
  };

  return (
    <View style={styles.background}>
      <MarcoDorado />
      <SafeAreaView style={styles.safeArea}>
        <ContadorGemas />

        {lectura ? (
          <View style={styles.resultadoContenedor}>
            <View style={styles.filaRunas}>
              {lectura.runas.map((runaFinal, indice) => {
                const yaRevelada = revelado[indice];
                const runaMostrada = yaRevelada ? runaFinal : vistaSorteo[indice] ?? runaFinal;
                return (
                  <View key={indice} style={styles.runaResultado}>
                    <Image
                      source={imagenes[runaMostrada.id]}
                      style={[
                        { width: tamRuna, height: tamRuna },
                        runaMostrada.posicion === 'invertida' && styles.imagenRunaInvertida,
                      ]}
                      resizeMode="contain"
                    />
                    <Text
                      style={[styles.nombreRuna, !yaRevelada && styles.nombreRunaOculto]}
                      numberOfLines={1}
                    >
                      {nombres[runaFinal.id]}
                    </Text>
                  </View>
                );
              })}
            </View>

            <Animated.View style={[styles.bloqueTexto, { opacity: opacidadTexto }]}>
              <ScrollView
                contentContainerStyle={styles.bloqueTextoScroll}
                showsVerticalScrollIndicator
                persistentScrollbar
                indicatorStyle="white"
              >
                <Text style={styles.textoLectura}>{lectura.parrafoIndividual}</Text>
                <Text style={styles.textoLectura}>{lectura.parrafoIntegrador}</Text>
              </ScrollView>
              <LinearGradient
                colors={['rgba(12, 47, 88, 0)', 'rgba(12, 47, 88, 0.95)']}
                style={styles.degradeInferior}
                pointerEvents="none"
              />
            </Animated.View>

            <Pressable style={styles.botonPrincipal} onPress={onNuevaPregunta}>
              <Text style={styles.botonPrincipalTexto} numberOfLines={1}>
                Hacer otra pregunta
              </Text>
            </Pressable>
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
            <Text style={styles.titulo}>¿Sobre qué quieres preguntar?</Text>

            <View style={styles.filaChips}>
              {TEMAS.map((tema) => {
                const seleccionado = tema.id === temaElegido;
                return (
                  <Pressable
                    key={tema.id}
                    onPress={() => setTemaElegido(tema.id)}
                    style={[styles.chip, seleccionado && styles.chipSeleccionado]}
                  >
                    <Text
                      style={[styles.chipTexto, seleccionado && styles.chipTextoSeleccionado]}
                      numberOfLines={1}
                    >
                      {tema.etiqueta}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <TextInput
              style={styles.input}
              placeholder="Escribe tu pregunta..."
              placeholderTextColor="rgba(255,255,255,0.5)"
              value={pregunta}
              onChangeText={setPregunta}
              multiline
              numberOfLines={4}
            />

            {mostrarHintCorta && (
              <Text style={styles.hintCorta}>
                Escribe una pregunta un poco más larga para poder leerla.
              </Text>
            )}

            {temaSugerido && (
              <SugerenciaTema
                etiqueta={etiquetaTemaSugerido}
                onAceptar={() => setTemaElegido(temaSugerido)}
                onDescartar={() => setTemaDescartado(temaSugerido)}
              />
            )}

            <Pressable
              style={[
                styles.botonPrincipal,
                styles.botonConPill,
                !preguntaEsValida && styles.botonDeshabilitado,
              ]}
              onPress={onTirarLasRunas}
              disabled={!preguntaEsValida}
            >
              <Text style={styles.botonPrincipalTexto} numberOfLines={1}>
                Tirar las runas
              </Text>
              <View style={styles.pillCosto}>
                <Text style={styles.pillCostoTexto} numberOfLines={1}>
                  💎 1
                </Text>
              </View>
            </Pressable>
          </ScrollView>
        )}
      </SafeAreaView>

      <OverlaySinGemas
        visible={mostrarOverlaySinGemas}
        onCerrar={() => setMostrarOverlaySinGemas(false)}
      />

      <AvisoPreguntaCorta
        visible={mostrarAvisoCorta}
        onEscribirMas={() => setMostrarAvisoCorta(false)}
        onTirarIgual={() => {
          setMostrarAvisoCorta(false);
          ejecutarTirada();
        }}
      />
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
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: PADDING_HORIZONTAL,
    paddingVertical: 32,
    gap: 24,
  },
  titulo: {
    color: '#D9B94A',
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },
  filaChips: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  chip: {
    flex: 1,
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
  },
  chipSeleccionado: {
    backgroundColor: '#C9A227',
    borderColor: '#C9A227',
  },
  chipTexto: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  chipTextoSeleccionado: {
    color: '#1a1a2e',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    color: '#fff',
    fontSize: 16,
    padding: 20,
    minHeight: 140,
    marginVertical: 4,
    textAlignVertical: 'top',
  },
  hintCorta: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 13,
    textAlign: 'center',
    marginTop: -8,
  },
  botonPrincipal: {
    backgroundColor: '#C9A227',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    width: '100%',
  },
  botonConPill: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  botonDeshabilitado: {
    opacity: 0.4,
  },
  botonPrincipalTexto: {
    color: '#1a1a2e',
    fontSize: 17,
    fontWeight: '700',
  },
  pillCosto: {
    backgroundColor: 'rgba(0, 0, 0, 0.18)',
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  pillCostoTexto: {
    color: '#1a1a2e',
    fontSize: 14,
    fontWeight: '700',
  },
  resultadoContenedor: {
    flex: 1,
    paddingHorizontal: PADDING_HORIZONTAL + 8,
    paddingTop: 20,
    paddingBottom: 36,
    gap: 16,
  },
  filaRunas: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  runaResultado: {
    alignItems: 'center',
    gap: 6,
  },
  imagenRunaInvertida: {
    transform: [{ rotate: '180deg' }],
  },
  nombreRuna: {
    fontFamily: FUENTE_TITULOS,
    color: '#D9B94A',
    fontSize: 30,
  },
  nombreRunaOculto: {
    opacity: 0,
  },
  bloqueTexto: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  bloqueTextoScroll: {
    flexGrow: 1,
    justifyContent: 'center',
    gap: 20,
    padding: 16,
  },
  degradeInferior: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  textoLectura: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
});
