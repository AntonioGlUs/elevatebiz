import {getInputProps} from 'remotion';

// The video exists in Spanish (default) and English. The language comes from the render props:
//   remotion render … --props='{"lang":"en"}'
// Each language has its own voice-over, so it also has its own scene cuts and cues (in seconds).
export const LANG = getInputProps().lang === 'en' ? 'en' : 'es';

const es = {
  audio: 'voiceover.mp3',
  // Scene cuts, measured from the pauses in the voice-over (38.8 s). The last scene holds a little after the voice ends.
  cuts: [0, 4.33, 10.29, 14.96, 19.07, 22.92, 27.59, 33.29, 40],
  // Moments inside each scene, in seconds from the start of that scene
  cue: {
    s1: 0.1,
    s2: 0.18,
    s2Swap: 2.3, // "…y encuentra"
    s2Highlight: 3.9, // "oportunidades"
    s3Brand: 0.2,
    s3: 1.0,
    s3Serve: 2.67, // just before "para atender a tus clientes"
    s4: 0.21,
    s4Wait: 2.13,
    s5: 0.19,
    s5Leave: 2.0,
    s6: 0.2,
    s6Reply: 2.1,
    s6Always: 3.4,
    s7Cards: [0.2, 1.2, 2.0],
    s7: 3.0,
    s8Brand: 0.25,
    s8A: 1.0,
    s8B: 2.67,
    s8C: 3.67,
    s8Line: 4.4,
  },
  // Captions. em = italic teal
  s1: [{t: 'La'}, {t: 'inteligencia artificial', em: true}, {t: 'está cambiando la forma de trabajar de las empresas.'}],
  s2a: [{t: 'Automatiza lo'}, {t: 'repetitivo.', em: true}],
  s2b: [{t: 'Y encuentra, en segundos,'}, {t: 'oportunidades', em: true}, {t: 'que antes nadie veía.'}],
  s3: [{t: 'Implementamos'}, {t: 'inteligencia artificial', em: true}, {t: 'para atender a tus clientes.'}],
  s4a: [{t: 'Tu cliente escribe'}, {t: 'ahora.', em: true}],
  s4b: [{t: 'Y espera respuesta'}, {t: 'ahora.', em: true}],
  s5: [{t: 'Cada minuto sin respuesta es una'}, {t: 'venta que se va', em: true}, {t: 'con la competencia.'}],
  s6a: [{t: 'Con inteligencia artificial, tu negocio responde'}, {t: 'al instante,', em: true}],
  s6b: [{t: 'a cualquier hora.', em: true}],
  s7: [{t: 'Mientras tu equipo se enfoca en'}, {t: 'lo importante.', em: true}],
  s8a: 'Atiende al instante.',
  s8b: 'Vende más.',
  s8c: 'Tu tiempo vuelve a ser tuyo.',
  // Text inside the 3D scenes
  ai: 'IA',
  tasksTitle: 'TAREAS REPETITIVAS',
  tasks: ['Responder mensajes', 'Agendar citas', 'Enviar recordatorios', 'Capturar datos'],
  opportunity: 'Oportunidad',
  incomingCall: 'Llamada entrante',
  business: 'Tu negocio',
  initials: 'TN',
  online: 'en línea',
  message: 'Mensaje',
  customer: 'Hola, ¿tienen citas disponibles hoy?',
  reply: '¡Hola! Sí, hoy tenemos espacio a las 4:00 p.m. ¿Te lo reservo?',
  waiting: 'Esperando respuesta',
  noReply: 'Sin respuesta',
  saleLost: 'Venta perdida',
  answered: 'Respondido al instante',
  always: 'Día y noche · 24/7',
  services: ['Resuelve dudas', 'Agenda citas', 'Da seguimiento'],
};

const en = {
  audio: 'voiceover-en.mp3',
  // Measured from the pauses in the English voice-over (39.2 s)
  cuts: [0, 3.52, 9.33, 14.53, 18.83, 22.85, 27.8, 33.8, 40],
  cue: {
    s1: 0.1,
    s2: 0.22,
    s2Swap: 2.25, // "…and finds"
    s2Highlight: 4.0, // "opportunities"
    s3Brand: 0.26,
    s3: 1.0,
    s3Serve: 3.2, // just before "serving your customers"
    s4: 0.26,
    s4Wait: 2.27,
    s5: 0.26,
    s5Leave: 2.0,
    s6: 0.25,
    s6Reply: 2.5,
    s6Always: 3.85,
    s7Cards: [0.2, 1.3, 2.4],
    s7: 3.66,
    s8Brand: 0.2,
    s8A: 1.37,
    s8B: 2.77,
    s8C: 3.73,
    s8Line: 4.5,
  },
  s1: [{t: 'Artificial intelligence', em: true}, {t: 'is changing the way businesses work.'}],
  s2a: [{t: 'It automates the'}, {t: 'repetitive work.', em: true}],
  s2b: [{t: 'And finds, in seconds,'}, {t: 'opportunities', em: true}, {t: 'no one saw before.'}],
  s3: [{t: 'We put'}, {t: 'artificial intelligence', em: true}, {t: 'to work serving your customers.'}],
  s4a: [{t: 'Your customer is writing'}, {t: 'now.', em: true}],
  s4b: [{t: 'And expects an answer'}, {t: 'now.', em: true}],
  s5: [{t: 'Every minute without a reply is a'}, {t: 'sale that goes', em: true}, {t: 'to the competition.'}],
  s6a: [{t: 'With artificial intelligence, your business responds'}, {t: 'instantly,', em: true}],
  s6b: [{t: 'at any hour.', em: true}],
  s7: [{t: 'While your team focuses on'}, {t: 'what matters.', em: true}],
  s8a: 'Respond instantly.',
  s8b: 'Sell more.',
  s8c: 'Your time is yours again.',
  ai: 'AI',
  tasksTitle: 'REPETITIVE TASKS',
  tasks: ['Reply to messages', 'Book appointments', 'Send reminders', 'Enter data'],
  opportunity: 'Opportunity',
  incomingCall: 'Incoming call',
  business: 'Your business',
  initials: 'YB',
  online: 'online',
  message: 'Message',
  customer: 'Hi, do you have any appointments today?',
  reply: 'Hi! Yes, we have an opening today at 4:00 p.m. Shall I book it?',
  waiting: 'Waiting for a reply',
  noReply: 'No reply',
  saleLost: 'Sale lost',
  answered: 'Answered instantly',
  always: 'Day and night · 24/7',
  services: ['Answers questions', 'Books appointments', 'Follows up'],
};

export const T = LANG === 'en' ? en : es;
