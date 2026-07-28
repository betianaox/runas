import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { FUENTE_TITULOS } from './constants/tipografia';
import { DesbloqueoWikiProvider } from './context/DesbloqueoWikiContext';
import { GemasProvider } from './context/GemasContext';
import { IdiomaProvider } from './context/IdiomaContext';
import type { RootStackParamList } from './navigation/types';
import AjustesScreen from './screens/AjustesScreen';
import ConsejoDelDiaScreen from './screens/ConsejoDelDiaScreen';
import HomeScreen from './screens/HomeScreen';
import PreguntaScreen from './screens/PreguntaScreen';
import WikiDetalleScreen from './screens/WikiDetalleScreen';
import WikiScreen from './screens/WikiScreen';

SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [assetsListos, setAssetsListos] = useState(false);
  const [fuentesListas, fuenteError] = useFonts({
    [FUENTE_TITULOS]: require('./assets/fonts/MetalGothic-DemoVersion-Regular.ttf'),
  });

  useEffect(() => {
    Asset.loadAsync(require('./assets/bg-home.webp'))
      .catch(() => {})
      .finally(() => setAssetsListos(true));
  }, []);

  const isReady = assetsListos && (fuentesListas || !!fuenteError);

  console.log(
    'DEBUG fuente:',
    'fuentesListas=', fuentesListas,
    'fuenteError=', fuenteError,
    'isLoaded=', Font.isLoaded(FUENTE_TITULOS),
  );

  const onLayout = useCallback(() => {
    if (isReady) {
      SplashScreen.hideAsync();
    }
  }, [isReady]);

  if (!isReady) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <IdiomaProvider>
        <GemasProvider>
          <DesbloqueoWikiProvider>
            <View style={{ flex: 1 }} onLayout={onLayout}>
              <NavigationContainer>
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="Home" component={HomeScreen} />
                  <Stack.Screen name="Pregunta" component={PreguntaScreen} />
                  <Stack.Screen name="ConsejoDelDia" component={ConsejoDelDiaScreen} />
                  <Stack.Screen name="Wiki" component={WikiScreen} />
                  <Stack.Screen name="WikiDetalle" component={WikiDetalleScreen} />
                  <Stack.Screen name="Ajustes" component={AjustesScreen} />
                </Stack.Navigator>
              </NavigationContainer>
              <StatusBar style="dark" />
            </View>
          </DesbloqueoWikiProvider>
        </GemasProvider>
      </IdiomaProvider>
    </SafeAreaProvider>
  );
}
