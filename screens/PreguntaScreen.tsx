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
import BotonCerrar from '../components/BotonCerrar';
import BotonVoz from '../components/BotonVoz';
import ContadorGemas from '../components/ContadorGemas';
import MarcoDorado from '../components/MarcoDorado';
import OverlaySinGemas from '../components/OverlaySinGemas';
import { COLORES } from '../constants/colores';
import { LAYOUT } from '../constants/layout';
import { FUENTE_TITULOS } from '../constants/tipografia';
import { useGemas } from '../context/GemasContext';
import { useIdioma } from '../context/IdiomaContext';
import { useTextos } from '../hooks/useTextos';
import { imagenes } from '../content/imagenes';
import { nombres } from '../content/nombres';
import type { Tema } from '../content/types';
import { analizarPregunta } from '../lib/analizarPregunta';
import { armarLectura, type Lectura } from '../lib/armarLectura';
import { calcularTamanoRuna } from '../lib/tamanoRuna';
import { tirarUnaRuna, type RunaTirada } from '../lib/tirarRunas';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

// General primero y como default: si la pregunta no permite detectar un tema,
// se queda en general (respuesta genérica) en vez de contestar de amor a algo
// que no lo es. El autoajuste solo cambia el chip cuando detecta otro tema.
const TEMAS: Tema[] = ['general', 'amor', 'trabajo', 'dinero'];

const PADDING_HORIZONTAL = 24;
const GAP_RUNAS = 16;
const INTERVALO_SORTEO_MS = 90;
const DEMORAS_REVELADO_MS = [1100, 1700, 2400];

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Pregunta'>;
};

export default function PreguntaScreen({ navigation }: Props) {
  const { gemas, gastarGema } = useGemas();
  const { idiomaConcreto } = useIdioma();
  const t = useTextos();
  const { width } = useWindowDimensions();
  const [temaElegido, setTemaElegido] = useState<Tema>('general');
  const [pregunta, setPregunta] = useState('');
  const [lectura, setLectura] = useState<Lectura | null>(null);
  const [revelado, setRevelado] = useState([false, false, false]);
  const [vistaSorteo, setVistaSorteo] = useState<RunaTirada[]>([]);
  const [mostrarOverlaySinGemas, setMostrarOverlaySinGemas] = useState(false);
  const [mostrarAvisoCorta, setMostrarAvisoCorta] = useState(false);
  // Una vez que la persona toca un chip a mano, respetamos su elección y
  // dejamos de autoajustar el tema por lo que escribe.
  const [temaTocadoManual, setTemaTocadoManual] = useState(false);

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

  const analisis = useMemo(() => analizarPregunta(pregunta, idiomaConcreto), [pregunta, idiomaConcreto]);
  const preguntaEsValida = analisis.senal !== 'invalida';
  const mostrarHintCorta = pregunta.trim().length > 0 && analisis.senal === 'invalida';

  // Autoajuste de tema: si el texto parece de otro tema (y no es 'general'),
  // cambiamos el chip solo. Los chips siguen ahí para corregir a mano; en
  // cuanto la persona toca uno, dejamos de pisarle la elección.
  useEffect(() => {
    if (temaTocadoManual) {
      return;
    }
    if (analisis.temaTexto !== 'general' && analisis.temaTexto !== temaElegido) {
      setTemaElegido(analisis.temaTexto);
    }
  }, [analisis.temaTexto, temaTocadoManual, temaElegido]);

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
    const resultado = armarLectura(temaElegido, analisis, idiomaConcreto);
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
    // Sin gemas, "hacer otra pregunta" hace lo mismo que "tirar las runas":
    // ofrece el video en vez de mandar a un formulario que no va a poder usar.
    if (gemas <= 0) {
      setMostrarOverlaySinGemas(true);
      return;
    }
    limpiarAnimacion();
    setLectura(null);
    setPregunta('');
    setTemaTocadoManual(false);
  };

  return (
    <View style={styles.background}>
      <MarcoDorado />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.encabezado}>
          <ContadorGemas />
          {/* Cierre explícito a la Home desde el arranque de la consulta. */}
          <BotonCerrar onPress={() => navigation.popToTop()} />
        </View>

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
                colors={['rgba(12, 47, 88, 0)', 'rgba(12, 47, 88, 0.5)']}
                style={styles.degradeInferior}
                pointerEvents="none"
              />
            </Animated.View>

            <View style={styles.filaAcciones}>
              <BotonVoz
                texto={[lectura.parrafoIndividual, lectura.parrafoIntegrador].join('\n\n')}
              />
              <Pressable
                style={[styles.botonPrincipal, styles.botonPrincipalAjustable]}
                onPress={onNuevaPregunta}
              >
                <Text style={styles.botonPrincipalTexto} numberOfLines={1}>
                  {t.pregunta.hacerOtra}
                </Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
            <Text style={styles.titulo}>{t.pregunta.titulo}</Text>

            <View style={styles.filaChips}>
              {TEMAS.map((tema) => {
                const seleccionado = tema === temaElegido;
                return (
                  <Pressable
                    key={tema}
                    onPress={() => {
                      setTemaElegido(tema);
                      setTemaTocadoManual(true);
                    }}
                    style={[styles.chip, seleccionado && styles.chipSeleccionado]}
                  >
                    <Text
                      style={[styles.chipTexto, seleccionado && styles.chipTextoSeleccionado]}
                      numberOfLines={1}
                    >
                      {t.pregunta.chips[tema]}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <TextInput
              style={styles.input}
              placeholder={t.pregunta.placeholder}
              placeholderTextColor="rgba(255,255,255,0.5)"
              value={pregunta}
              onChangeText={setPregunta}
              multiline
              numberOfLines={4}
            />

            {mostrarHintCorta && <Text style={styles.hintCorta}>{t.pregunta.hintCorta}</Text>}

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
                {t.pregunta.tirar}
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
    backgroundColor: COLORES.fondo,
  },
  safeArea: {
    flex: 1,
    // Aire respecto del marco dorado, arriba y abajo (la home no lleva marco).
    paddingTop: LAYOUT.aireTop,
    paddingBottom: LAYOUT.aireTop,
  },
  encabezado: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    // Aire lateral para que el contador y la ✕ no queden sobre el marco dorado.
    paddingHorizontal: LAYOUT.aire,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: PADDING_HORIZONTAL,
    paddingVertical: 24,
    gap: 24,
  },
  titulo: {
    color: COLORES.oroClaro,
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
    // Mismo lenguaje transparente que el resto de los botones: fondo oscuro
    // translúcido y borde dorado tenue. Sin seleccionar, el borde va tenue.
    backgroundColor: 'rgba(12, 47, 88, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(201, 162, 39, 0.35)',
    alignItems: 'center',
  },
  chipSeleccionado: {
    // Seleccionado: un velo dorado y el borde pleno, sin llenarlo de oro macizo.
    backgroundColor: 'rgba(201, 162, 39, 0.18)',
    borderColor: 'rgba(201, 162, 39, 0.9)',
  },
  chipTexto: {
    color: COLORES.marfil,
    fontSize: 12,
    fontWeight: '600',
  },
  chipTextoSeleccionado: {
    color: COLORES.oroClaro,
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
    // Botón transparente: translúcido oscuro + borde dorado + texto marfil,
    // en vez del dorado sólido anterior.
    backgroundColor: 'rgba(12, 47, 88, 0.66)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORES.oro,
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    width: '100%',
  },
  filaAcciones: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  botonPrincipalAjustable: {
    flex: 1,
    width: undefined,
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
    color: COLORES.marfil,
    fontSize: 17,
    fontWeight: '700',
  },
  pillCosto: {
    backgroundColor: 'rgba(245, 239, 224, 0.14)',
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  pillCostoTexto: {
    color: COLORES.marfil,
    fontSize: 14,
    fontWeight: '700',
  },
  resultadoContenedor: {
    flex: 1,
    paddingHorizontal: PADDING_HORIZONTAL + 8,
    paddingTop: 20,
    paddingBottom: 24,
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
    color: COLORES.oroClaro,
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
    height: 28,
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
