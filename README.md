# Runas

App de lectura de runas de la familia **Oráculos**. El usuario hace una
pregunta, elige (o deja que la app detecte) un tema, y recibe **una** lectura
combinada de tres runas. No usa ningún modelo de lenguaje en tiempo de
ejecución: las respuestas se arman con un motor propio de fragmentos +
plantillas, todo local en el dispositivo.

## Stack

- **Expo SDK 57** · React Native 0.86 · React 19.2 · TypeScript
- Navegación con React Navigation (native-stack)
- Persistencia local con AsyncStorage
- `react-native-svg` (marco dorado) · `expo-linear-gradient`
- Anuncios recompensados con AdMob (`react-native-google-mobile-ads`)
- Tests con Vitest

## Cómo correr

```bash
npm install
npm start            # Metro (dev client)
npm run android      # build nativo + instalar (correr desde PowerShell en Windows)
npm test             # tests
npm run typecheck    # tsc --noEmit
```

> En Windows, los builds nativos (`expo run:android`) deben correrse desde
> **PowerShell**, no desde Git Bash (el path-mangling de MSYS rompe la
> compilación de recursos AAPT2). Requiere `JAVA_HOME` apuntando al JBR de
> Android Studio.

### Build instalable (APK)

```bash
eas build -p android --profile preview
```

Genera un APK standalone (JS empaquetado, anda sin Metro). Ver `eas.json`.

## Cómo funciona el contenido

Cada tirada combina **3 runas** (24 runas, normal/invertida) en una sola
respuesta tejida, clasificada por:

- **Tema**: amor / trabajo / dinero / general.
- **Modo**: cerrada (busca un resultado o sí/no) vs abierta (reflexiva).
- **Tono**: preocupación / impulso / neutro.
- **Tiempo** y **mención de un tercero**, para insertar una frase de "eco".

Todo eso se detecta del texto de la pregunta (sin LLM) y dirige qué apertura,
consejo y eco acompañan a las runas. Las runas en sí salen siempre al azar
—es un oráculo honesto—; lo que cambia es cómo se enmarca la lectura.

### Idiomas

Contenido completo en **español, inglés, portugués e italiano** (es el
idioma de referencia; el italiano conviene revisarlo con un nativo antes de
publicar). El idioma "Automático" sigue el del sistema (`expo-localization`)
y cae a español si no es uno de los cuatro. La detección de la pregunta está
localizada por idioma.

## Estructura

```
content/        Bancos de contenido por idioma (es/en/pt/it) + textos de UI
  <idioma>/     fragmentos, aperturas, consejos, conectores, eco, consejo del día
  paquete.ts    Forma del paquete de contenido + selector obtenerContenido()
  textos.ts     Textos de interfaz por idioma
lib/            Motor: armarLectura, analizarPregunta, clasificación, tiradas
  bancosDeteccion.ts   Palabras clave de detección por idioma
context/        Gemas, Idioma, Usuario (React Context + AsyncStorage)
screens/        Home, Pregunta, ConsejoDelDia, Ajustes
components/      MarcoDorado, ContadorGemas, overlays, avisos
hooks/          useAnuncioRecompensado, useTextos
```

## Economía y anti-cheat

3 gemas por día (no se acumulan). Al quedarse sin gemas, la app ofrece un
video recompensado para ganar una. El reset diario (gemas y consejo del día)
usa comparación de fecha con guarda contra atraso de reloj, sin servidor —
decisión explícita por restricciones fiscales del proyecto.

## Estado

Pre-versión funcional. Pendiente para publicar en Google Play: política de
privacidad, build de producción firmado (AAB), consentimiento de anuncios
(UMP) e ícono/ficha de la tienda. Los anuncios usan el ID de **test** de
Google hasta la versión de producción.
