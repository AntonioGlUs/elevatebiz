import {getInputProps} from 'remotion';

// Second version of the intro video (cinematic cut). Script approved on 2026-11-14.
// The language comes from the render props:  --props='{"lang":"en"}'
export const LANG = getInputProps().lang === 'en' ? 'en' : 'es';

// Scene cuts (seconds) and the moment each caption line starts, measured on each voice-over
// (public/voiceover-v2.mp3 and voiceover-v2-en.mp3: the ElevenLabs takes with longer pauses added between phrases).
const CUTS = [0, 4.74, 9.47, 13.3, 19.06, 23.42, 28.09, 32.59, 36.61, 43.29];
const CUTS_EN = [0, 4.38, 9.28, 13.09, 19.22, 23.56, 27.95, 32.29, 36.17, 42.52];

// Caption lines per scene. at = seconds from the start of the scene. tone = colour of the highlighted words:
// 'alert' (coral) while the video talks about the problem, 'calm' (teal) once it talks about the solution.
const es = {
  audio: 'voiceover-v2.mp3',
  cuts: CUTS,
  scenes: [
    {tone: 'alert', lines: [{at: 0.55, parts: [{t: 'Tu cliente acaba de escribirte.'}]}, {at: 2.7, parts: [{t: 'Y'}, {t: 'nadie le respondió.', em: true}]}]},
    {tone: 'alert', lines: [{at: 0.35, parts: [{t: 'Cada minuto sin respuesta es una'}, {t: 'venta que se va', em: true}, {t: 'con la competencia.'}]}]},
    {tone: 'alert', lines: [{at: 0.35, parts: [{t: 'Tu equipo'}, {t: 'pierde horas', em: true}, {t: 'capturando datos.'}]}]},
    {tone: 'alert', lines: [{at: 0.35, parts: [{t: 'Y todo depende de ti:'}]}, {at: 2.08, parts: [{t: 'el día que descansas,'}, {t: 'todo tu negocio se detiene.', em: true}]}]},
    {tone: 'calm', lines: [{at: 0.35, parts: [{t: 'ElevateBiz', em: true}, {t: 'pone la inteligencia artificial a trabajar por ti.'}]}]},
    {tone: 'calm', lines: [{at: 0.35, parts: [{t: 'Cada cliente recibe respuesta'}, {t: 'en segundos,', em: true}, {t: 'de día y de noche.'}]}]},
    {tone: 'calm', lines: [{at: 0.35, parts: [{t: 'Tus procesos'}, {t: 'avanzan solos,', em: true}, {t: 'con software hecho a tu medida.'}]}]},
    {tone: 'calm', lines: [{at: 0.35, parts: [{t: 'Y tu negocio'}, {t: 'sigue funcionando,', em: true}, {t: 'aunque tú no estés.'}]}]},
    {tone: 'calm', lines: [{at: 0.35, parts: [{t: 'Tu negocio,'}, {t: 'en piloto automático.', em: true}]}, {at: 2.68, parts: [{t: 'Agenda tu llamada hoy.'}]}]},
  ],
  // Text inside the 3D scenes
  business: 'Tu negocio',
  initials: 'TN',
  online: 'en línea',
  message: 'Mensaje',
  customer: 'Hola, ¿tienen citas disponibles hoy?',
  waiting: 'Esperando respuesta',
  noReply: 'Sin respuesta',
  saleLost: 'Venta perdida',
  competitor: 'COMPETENCIA',
  reply: '¡Hola! Sí, hoy a las 4:00 p.m. ¿Te lo reservo?',
  manual: 'captura manual',
  hours: 'h',
  you: 'TÚ',
  areas: ['Ventas', 'Clientes', 'Agenda', 'Cobros', 'Pedidos', 'Reportes'],
  stopped: 'Negocio detenido',
  answered: 'Respondido en 3 segundos',
  always: 'Día y noche · 24/7',
  stages: ['Pedido', 'Factura', 'Reporte', 'Entrega'],
  custom: 'Hecho a tu medida',
  ai: 'IA',
  resting: 'Tú · descansando',
  cta: 'Agenda tu llamada hoy',
  url: 'elevatebiz.ai',
};

// English: same scenes and texts structure, with its own voice-over and timing.
const en = {
  ...es,
  audio: 'voiceover-v2-en.mp3',
  cuts: CUTS_EN,
  scenes: [
    {tone: 'alert', lines: [{at: 0.55, parts: [{t: 'Your customer just wrote to you.'}]}, {at: 2.49, parts: [{t: 'And'}, {t: 'nobody answered.', em: true}]}]},
    {tone: 'alert', lines: [{at: 0.35, parts: [{t: 'Every minute without a reply is a'}, {t: 'sale that goes', em: true}, {t: 'to your competition.'}]}]},
    {tone: 'alert', lines: [{at: 0.35, parts: [{t: 'Your team'}, {t: 'loses hours', em: true}, {t: 'on data entry.'}]}]},
    {tone: 'alert', lines: [{at: 0.35, parts: [{t: 'And everything depends on you:'}]}, {at: 2.52, parts: [{t: 'the day you rest,'}, {t: 'your whole business stops.', em: true}]}]},
    {tone: 'calm', lines: [{at: 0.35, parts: [{t: 'ElevateBiz', em: true}, {t: 'puts artificial intelligence to work for you.'}]}]},
    {tone: 'calm', lines: [{at: 0.35, parts: [{t: 'Every customer gets an answer'}, {t: 'in seconds,', em: true}, {t: 'day and night.'}]}]},
    {tone: 'calm', lines: [{at: 0.35, parts: [{t: 'Your processes'}, {t: 'run on their own,', em: true}, {t: 'with software built around you.'}]}]},
    {tone: 'calm', lines: [{at: 0.35, parts: [{t: 'And your business'}, {t: 'keeps running,', em: true}, {t: "even when you're not there."}]}]},
    {tone: 'calm', lines: [{at: 0.35, parts: [{t: 'Your business,'}, {t: 'on autopilot.', em: true}]}, {at: 2.4, parts: [{t: 'Book your call today.'}]}]},
  ],
  business: 'Your business',
  initials: 'YB',
  online: 'online',
  message: 'Message',
  customer: 'Hi, do you have any appointments today?',
  waiting: 'Waiting for a reply',
  noReply: 'No reply',
  saleLost: 'Sale lost',
  competitor: 'COMPETITOR',
  reply: 'Hi! Yes, today at 4:00 p.m. Shall I book it?',
  manual: 'manual data entry',
  hours: 'h',
  you: 'YOU',
  areas: ['Sales', 'Customers', 'Calendar', 'Billing', 'Orders', 'Reports'],
  stopped: 'Business stopped',
  answered: 'Answered in 3 seconds',
  always: 'Day and night · 24/7',
  stages: ['Order', 'Invoice', 'Report', 'Delivery'],
  custom: 'Built around you',
  ai: 'AI',
  resting: 'You · resting',
  cta: 'Book your call today',
  url: 'elevatebiz.ai',
};

export const S = LANG === 'en' ? en : es;
