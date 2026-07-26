import { TestIds } from 'react-native-google-mobile-ads';

// Unidad de anuncio recompensado.
//
// Por ahora usamos SIEMPRE el ID de test de Google, también en builds de
// release, para poder probar la app en dispositivos reales sin arriesgar la
// cuenta de AdMob por tráfico inválido (tocar nuestros propios anuncios reales).
//
// TODO (antes de publicar en Play): cambiar a la unidad real
// 'ca-app-pub-5829308591228932/2019796278' cuando saquemos la versión de
// producción, por ejemplo condicionando por una variable de build.
export const AD_UNIT_ID_RECOMPENSADO = TestIds.REWARDED;
