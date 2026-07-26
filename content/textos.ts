import type { Tema } from './types';
import type { IdiomaConcreto } from './paquete';

// Textos de interfaz (botones, títulos, placeholders) por idioma. Separados
// del contenido de las lecturas: esto es "chrome" de la app. Portugués e
// italiano caen a español hasta que se traduzcan.
export interface Textos {
  home: {
    pregunta: string;
    consejoDelDia: string;
    bienvenidoTitulo: string;
    bienvenidoPregunta: string;
    nombrePlaceholder: string;
    continuar: string;
  };
  pregunta: {
    titulo: string;
    chips: Record<Tema, string>;
    placeholder: string;
    tirar: string;
    hacerOtra: string;
    hintCorta: string;
  };
  overlaySinGemas: {
    titulo: string;
    texto: string;
    verVideo: string;
    cargando: string;
    ahoraNo: string;
  };
  avisoCorta: {
    titulo: string;
    texto: string;
    escribirMas: string;
    tirarIgual: string;
  };
  consejoDelDia: {
    titulo: string;
    volver: string;
  };
  ajustes: {
    titulo: string;
    seccionIdioma: string;
    seccionSobre: string;
    idiomaAuto: string;
    disclaimer: string;
  };
}

const es: Textos = {
  home: {
    pregunta: 'Pregunta',
    consejoDelDia: 'Consejo del día',
    bienvenidoTitulo: 'Bienvenido a Runas',
    bienvenidoPregunta: '¿Cómo te llamas?',
    nombrePlaceholder: 'Tu nombre',
    continuar: 'Continuar',
  },
  pregunta: {
    titulo: '¿Sobre qué quieres preguntar?',
    chips: { amor: 'Amor', trabajo: 'Trabajo', dinero: 'Dinero', general: 'General' },
    placeholder: 'Escribe tu pregunta...',
    tirar: 'Tirar las runas',
    hacerOtra: 'Hacer otra pregunta',
    hintCorta: 'Escribe una pregunta un poco más larga para poder leerla.',
  },
  overlaySinGemas: {
    titulo: 'Te quedan 0 gemas',
    texto: 'Ver un video corto para ganar una gema',
    verVideo: '🎬 Ver video',
    cargando: 'Cargando video…',
    ahoraNo: 'Ahora no',
  },
  avisoCorta: {
    titulo: 'Tu pregunta es muy corta',
    texto:
      'Cuéntanos un poco más sobre lo que quieres saber y las runas te responderán con más precisión.',
    escribirMas: 'Escribir más',
    tirarIgual: 'Tirar igual',
  },
  consejoDelDia: {
    titulo: 'Consejo del día',
    volver: 'Volver',
  },
  ajustes: {
    titulo: 'Ajustes',
    seccionIdioma: 'Idioma',
    seccionSobre: 'Sobre la app',
    idiomaAuto: 'Automático (idioma del sistema)',
    disclaimer:
      'Runas es una aplicación de entretenimiento. No es adivinación ni predicción del futuro, ' +
      'y las interpretaciones que ofrece no constituyen asesoramiento profesional (médico, legal, ' +
      'financiero ni psicológico) ni reemplazan el criterio de cada persona. Es un espacio para la ' +
      'reflexión, no una fuente de certezas.',
  },
};

const en: Textos = {
  home: {
    pregunta: 'Ask a question',
    consejoDelDia: 'Daily advice',
    bienvenidoTitulo: 'Welcome to Runas',
    bienvenidoPregunta: "What's your name?",
    nombrePlaceholder: 'Your name',
    continuar: 'Continue',
  },
  pregunta: {
    titulo: 'What would you like to ask about?',
    chips: { amor: 'Love', trabajo: 'Work', dinero: 'Money', general: 'General' },
    placeholder: 'Type your question...',
    tirar: 'Cast the runes',
    hacerOtra: 'Ask another question',
    hintCorta: 'Write a slightly longer question so we can read it.',
  },
  overlaySinGemas: {
    titulo: 'You have 0 gems left',
    texto: 'Watch a short video to earn a gem',
    verVideo: '🎬 Watch video',
    cargando: 'Loading video…',
    ahoraNo: 'Not now',
  },
  avisoCorta: {
    titulo: 'Your question is very short',
    texto:
      'Tell us a little more about what you want to know and the runes will answer more precisely.',
    escribirMas: 'Write more',
    tirarIgual: 'Cast anyway',
  },
  consejoDelDia: {
    titulo: 'Daily advice',
    volver: 'Back',
  },
  ajustes: {
    titulo: 'Settings',
    seccionIdioma: 'Language',
    seccionSobre: 'About',
    idiomaAuto: 'Automatic (system language)',
    disclaimer:
      'Runas is an entertainment app. It is not fortune-telling or prediction of the future, ' +
      'and the interpretations it offers do not constitute professional advice (medical, legal, ' +
      'financial, or psychological), nor do they replace your own judgment. It is a space for ' +
      'reflection, not a source of certainties.',
  },
};

const pt: Textos = {
  home: {
    pregunta: 'Fazer uma pergunta',
    consejoDelDia: 'Conselho do dia',
    bienvenidoTitulo: 'Bem-vindo ao Runas',
    bienvenidoPregunta: 'Como você se chama?',
    nombrePlaceholder: 'Seu nome',
    continuar: 'Continuar',
  },
  pregunta: {
    titulo: 'Sobre o que você quer perguntar?',
    chips: { amor: 'Amor', trabajo: 'Trabalho', dinero: 'Dinheiro', general: 'Geral' },
    placeholder: 'Escreva sua pergunta...',
    tirar: 'Lançar as runas',
    hacerOtra: 'Fazer outra pergunta',
    hintCorta: 'Escreva uma pergunta um pouco mais longa para podermos lê-la.',
  },
  overlaySinGemas: {
    titulo: 'Você tem 0 gemas',
    texto: 'Assista a um vídeo curto para ganhar uma gema',
    verVideo: '🎬 Assistir vídeo',
    cargando: 'Carregando vídeo…',
    ahoraNo: 'Agora não',
  },
  avisoCorta: {
    titulo: 'Sua pergunta é muito curta',
    texto:
      'Conte um pouco mais sobre o que você quer saber e as runas vão responder com mais precisão.',
    escribirMas: 'Escrever mais',
    tirarIgual: 'Lançar mesmo assim',
  },
  consejoDelDia: {
    titulo: 'Conselho do dia',
    volver: 'Voltar',
  },
  ajustes: {
    titulo: 'Configurações',
    seccionIdioma: 'Idioma',
    seccionSobre: 'Sobre',
    idiomaAuto: 'Automático (idioma do sistema)',
    disclaimer:
      'Runas é um aplicativo de entretenimento. Não é adivinhação nem previsão do futuro, ' +
      'e as interpretações que oferece não constituem aconselhamento profissional (médico, ' +
      'jurídico, financeiro ou psicológico), nem substituem o seu próprio julgamento. É um ' +
      'espaço para reflexão, não uma fonte de certezas.',
  },
};

const textos: Record<IdiomaConcreto, Textos> = { es, en, pt, it: es };

export function obtenerTextos(idioma: IdiomaConcreto): Textos {
  return textos[idioma] ?? es;
}
