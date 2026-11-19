// Strings that only exist in this redesign (the original site's content.ts does not have them)
export const EXTRA = {
  es: {
    problems: {
      eyebrow: 'EL PROBLEMA',
      title: 'Cada mensaje que no respondes es una venta que cierra alguien más.',
      accentWords: 3,
      cards: [
        { title: 'Mensajes fuera de horario', text: 'Un cliente escribe de noche o en fin de semana. Nadie responde hasta el día siguiente, y para entonces ya llamó a otro.' },
        { title: 'Seguimientos que no ocurren', text: 'Alguien pide información, tu equipo se ocupa y el seguimiento se olvida.' },
        { title: 'Datos copiados a mano', text: 'Tu equipo escribe la misma información en mensajes, hojas de cálculo y tu CRM, una y otra vez.' },
        { title: 'Sistemas que no se hablan', text: 'Tu agenda, tu correo, tu CRM y los datos de tus clientes viven en lugares distintos, y las cosas se pierden en el camino.' },
      ],
    },
    // Before / after comparison, shown under the problem cards
    contrast: {
      without: {
        title: 'Hoy, sin automatización',
        items: [
          'Tus clientes esperan horas por una respuesta.',
          'El seguimiento depende de que alguien se acuerde.',
          'Tu equipo copia datos de un sistema a otro.',
          'Te enteras de los problemas cuando ya es tarde.',
        ],
      },
      with: {
        title: 'Con ElevateBiz',
        items: [
          'Cada cliente recibe respuesta en segundos, 24/7.',
          'Cada prospecto recibe seguimiento automático.',
          'La información pasa sola entre tus sistemas.',
          'Ves todo tu negocio en un solo lugar.',
        ],
      },
    },
    priceNote: 'Planes desde $300 USD. El precio final depende de lo que construyamos para ti.',
    enterprise: {
      eyebrow: 'PARA EMPRESAS',
      title: 'Hecho a la medida de tu operación.',
      accentWords: 3,
      intro: 'Más allá del servicio al cliente: automatizamos procesos internos y construimos software a la medida para equipos grandes.',
      cards: [
        { title: 'Automatización de procesos internos', text: 'Reportes, facturación, aprobaciones, captura de datos y el paso de información entre áreas, funcionando por sí solos.' },
        { title: 'Software y agentes de IA a la medida', text: 'Aplicaciones web y móviles, herramientas internas, tableros y agentes de IA diseñados para tu operación, no adaptados de una plantilla.' },
        { title: 'Integraciones', text: 'Conectamos tu CRM, tu ERP, tus bases de datos y las herramientas que tu equipo ya usa, para que la información fluya sin copiar y pegar.' },
      ],
      stackLabel: 'Nuestra tecnología',
      button: 'Cuéntanos tu proyecto',
    },
    stats: { eyebrow: 'NUESTRO IMPACTO', title: 'IA en acción.', accentWords: 2, note: 'Medido en los agentes de IA que construimos.' },
    how: {
      eyebrow: 'CÓMO FUNCIONA',
      title: 'Así de simple.',
      sub: 'Desde nuestra primera conversación hasta un negocio más inteligente y eficiente.',
      steps: [
        { tag: 'DESCUBRE', title: 'Hablemos de tu negocio', text: 'Una llamada de 45 minutos para entender tus necesidades y oportunidades.' },
        { tag: 'CREA', title: 'Construimos tu solución', text: 'Diseñamos e implementamos la automatización por ti.' },
        { tag: 'CRECE', title: 'Recupera tu tiempo', text: 'Automatiza el trabajo repetitivo y enfócate en lo que importa.' },
      ],
    },
    services: [
      { line1: 'Agentes de IA', line2: 'para tus clientes' },
      { line1: 'Automatización', line2: 'de procesos' },
      { line1: 'Software', line2: 'a la medida' },
      { line1: 'Marketing digital', line2: 'con IA' },
    ],
    closing: {
      eyebrow: 'EMPIEZA HOY',
      title: 'Recupera tu tiempo.',
      accent: 'Haz crecer tu negocio.',
      sub: 'Agenda una llamada gratis de 45 minutos y en 1 a 2 semanas está funcionando. Oferta de lanzamiento: sin contrato, cancelas cuando quieras.',
      button: 'Agendar consulta gratis',
      tagline: 'Automatización e inteligencia artificial para negocios que quieren crecer.',
      contact: 'CONTACTO',
      rights: 'Todos los derechos reservados.',
      privacy: 'Política de privacidad',
      cookies: 'Configuración de cookies',
      demo: 'Sitio de demostración · En desarrollo',
    },
    mission: {
      eyebrow: 'NUESTRA MISIÓN',
      bold: 'IA',
      italic: 'para todos',
      subtitle:
        'Creemos que la IA no debería ser solo para grandes empresas con grandes presupuestos. La hacemos simple, útil y al alcance de cada dueño de negocio.',
      cards: [
        { title: 'Quitamos la complejidad', text: 'Incluso de nuestras palabras. Elegimos un lenguaje claro en lugar de tecnicismos, para que cada dueño de negocio entienda lo que construimos.' },
        { title: 'Nos encargamos de lo técnico', text: 'Para que no tengas que preocuparte por lo complejo de la tecnología. Tú solo disfruta los resultados.' },
        { title: 'Estamos a tu lado', text: 'Porque emprender es difícil y hermoso, y queremos hacerlo más ligero.' },
        { title: 'Tu propio asesor tecnológico', text: 'Que te recomienda lo mejor para tu negocio, como tener un ingeniero en tu equipo.' },
      ],
    },
    menuOpen: 'Abrir menú',
    menuClose: 'Cerrar menú',
    eyebrows: {
      mission: 'NUESTRA MISIÓN',
      services: 'SERVICIOS',
      how: 'CÓMO FUNCIONA',
      routing: 'AUTOMÁTICO',
      platform: 'LA PLATAFORMA',
      clients: 'LO QUE DICEN NUESTROS CLIENTES',
      faq: 'FAQ',
    },
    platformTitle: 'Todo tu negocio, en un solo lugar.',
    platformTabs: ['Para dueños', 'Para tus clientes'],
    platformPoints: [
      [
        'Conversaciones, reservas y seguimiento en un solo panel.',
        'Alertas cuando un cliente necesita a una persona.',
        'Resumen semanal de lo que la IA resolvió por ti.',
      ],
      [
        'Respuestas inmediatas, sin esperas.',
        'Reservar en segundos desde el chat.',
        'Recordatorios claros antes de cada cita.',
      ],
    ],
    mockTitle: 'Agenda de esta semana',
    mockRows: [
      { who: 'María G.', what: 'Limpieza dental', when: 'Jue 3:00 PM', st: 'Confirmada' },
      { who: 'Carlos R.', what: 'Consulta inicial', when: 'Vie 10:30 AM', st: 'Pendiente' },
      { who: 'Lucía P.', what: 'Revisión', when: 'Vie 12:00 PM', st: 'Confirmada' },
      { who: 'Andrés M.', what: 'Blanqueamiento', when: 'Sáb 9:00 AM', st: 'Nueva' },
    ],
    mockNote: 'Datos de ejemplo',
    clientsTitle: 'Negocios que respiran tranquilos.',
    clientsNote: 'Testimonios de ejemplo: reemplazar por reales.',
    quotes: [
      {
        company: 'Bright Smile Dental',
        text: 'Antes perdíamos pacientes por no contestar a tiempo. Ahora la agenda se llena sola, incluso de noche.',
        role: 'DUEÑA, CLÍNICA DENTAL',
      },
      {
        company: 'Local Bites Co.',
        text: 'Las reservas llegan mientras cerramos y nos enteramos por la mañana. Eso es tranquilidad.',
        role: 'DUEÑO, RESTAURANTE',
      },
      {
        company: 'Urban Fit Studio',
        text: 'Dejé de contestar mensajes a todas horas. Mi equipo se enfoca en los clientes que ya están en el estudio.',
        role: 'FUNDADORA, ESTUDIO DE FITNESS',
      },
    ],
    exampleName: 'Nombre de ejemplo',
    prev: 'Anterior',
    next: 'Siguiente',
    chat: {
      open: 'Abrir chat',
      close: 'Cerrar chat',
      title: 'Asistente de IA de ElevateBiz',
      hello:
        '¡Bienvenido a ElevateBiz! 👋 Puedo resolver tus dudas sobre nuestros servicios de automatización y marketing con IA. ¿En qué te ayudo hoy?',
      placeholder: 'Escribe tu mensaje...',
      send: 'Enviar',
      chips: ['¿Cuánto cuesta?', '¿Qué tan rápido empiezo?', 'Quiero agendar una llamada'],
      reply:
        'Gracias por tu mensaje. Esta es una vista previa del asistente: un asesor te responderá pronto. Mientras tanto, puedes agendar una llamada gratis.',
      cta: 'Agenda una llamada gratis',
    },
    newsletterSent: '¡Gracias! Un asesor te contactará pronto.',
    langLabel: 'Idioma',
  },
  en: {
    problems: {
      eyebrow: 'THE PROBLEM',
      title: "Every message you don't answer is a sale someone else closes.",
      accentWords: 3,
      cards: [
        { title: 'Messages after hours', text: 'A customer writes at night or on the weekend. Nobody replies until the next day, and by then they have called someone else.' },
        { title: 'Follow-up that never happens', text: 'Someone asks for information, your team gets busy, and the follow-up is forgotten.' },
        { title: 'Copying data by hand', text: 'Your team types the same information into messages, spreadsheets and your CRM, again and again.' },
        { title: "Systems that don't talk", text: 'Your calendar, inbox, CRM and customer data live in different places, so things fall through the cracks.' },
      ],
    },
    // Before / after comparison, shown under the problem cards
    contrast: {
      without: {
        title: 'Today, without automation',
        items: [
          'Your customers wait hours for a reply.',
          'Follow-up depends on someone remembering.',
          'Your team copies data from one system to another.',
          'You find out about problems when it is already late.',
        ],
      },
      with: {
        title: 'With ElevateBiz',
        items: [
          'Every customer gets an answer in seconds, 24/7.',
          'Every lead is followed up automatically.',
          'Information moves between your systems on its own.',
          'You see your whole business in one place.',
        ],
      },
    },
    priceNote: 'Plans start at $300 USD. The final price depends on what we build for you.',
    enterprise: {
      eyebrow: 'FOR ENTERPRISES',
      title: 'Built around how your company runs.',
      accentWords: 3,
      intro: 'Beyond customer service: we automate internal processes and build custom software for larger teams.',
      cards: [
        { title: 'Internal process automation', text: 'Reports, invoicing, approvals, data entry and handoffs between departments, running on their own.' },
        { title: 'Custom software and AI agents', text: 'Web and mobile apps, internal tools, dashboards and AI agents designed for your operation, not adapted from a template.' },
        { title: 'Integrations', text: 'We connect your CRM, ERP, databases and the tools your team already uses, so information flows without copy-paste.' },
      ],
      stackLabel: 'Our stack',
      button: 'Talk to us about your project',
    },
    stats: { eyebrow: 'OUR IMPACT', title: 'AI at work.', accentWords: 2, note: 'Measured across the AI agents we build.' },
    how: {
      eyebrow: 'HOW IT WORKS',
      title: "It's that simple.",
      sub: 'From our first conversation to a smarter, more efficient business.',
      steps: [
        { tag: 'DISCOVER', title: "Let's talk about your business", text: 'A 45-minute call to understand your needs and opportunities.' },
        { tag: 'CREATE', title: 'We build your solution', text: 'We design and implement the automation for you.' },
        { tag: 'GROW', title: 'Get your time back', text: 'Automate repetitive work and focus on what matters.' },
      ],
    },
    services: [
      { line1: 'AI customer', line2: 'agents' },
      { line1: 'Process', line2: 'automation' },
      { line1: 'Custom', line2: 'software' },
      { line1: 'AI-powered', line2: 'digital marketing' },
    ],
    closing: {
      eyebrow: 'START TODAY',
      title: 'Get your time back.',
      accent: 'Grow your business.',
      sub: 'Book a free 45-minute call and be live in 1 to 2 weeks. Launch offer: no contract, cancel anytime.',
      button: 'Book free consultation',
      tagline: 'Automation and artificial intelligence for businesses that want to grow.',
      contact: 'CONTACT',
      rights: 'All rights reserved.',
      privacy: 'Privacy Policy',
      cookies: 'Cookie settings',
      demo: 'Demo site · In development',
    },
    mission: {
      eyebrow: 'OUR MISSION',
      bold: 'AI',
      italic: 'for everyone',
      subtitle:
        "We believe AI shouldn't be reserved for big tech companies with big budgets. We make it simple, useful, and within reach of every business owner.",
      cards: [
        { title: 'We remove the complexity', text: 'Even from our words. We choose plain language over tech talk, so every business owner understands what we build.' },
        { title: 'We handle the technical side', text: "So you don't have to worry about how complex the technology is. Just enjoy the results." },
        { title: 'We stay by your side', text: "Because building a business is hard and beautiful, and we're here to make it lighter." },
        { title: 'Your own tech advisor', text: "Recommending what's best for your business, like having an engineer on your team." },
      ],
    },
    menuOpen: 'Open menu',
    menuClose: 'Close menu',
    eyebrows: {
      mission: 'OUR MISSION',
      services: 'SERVICES',
      how: 'HOW IT WORKS',
      routing: 'AUTOMATIC',
      platform: 'THE PLATFORM',
      clients: 'WHAT OUR CLIENTS SAY',
      faq: 'FAQ',
    },
    platformTitle: 'Your whole business, in one place.',
    platformTabs: ['For owners', 'For your customers'],
    platformPoints: [
      [
        'Conversations, bookings and follow-up in a single panel.',
        'Alerts when a customer needs a person.',
        'A weekly summary of what the AI handled for you.',
      ],
      [
        'Instant replies, no waiting.',
        'Book in seconds from the chat.',
        'Clear reminders before every appointment.',
      ],
    ],
    mockTitle: "This week's schedule",
    mockRows: [
      { who: 'Maria G.', what: 'Teeth cleaning', when: 'Thu 3:00 PM', st: 'Confirmed' },
      { who: 'Carlos R.', what: 'First visit', when: 'Fri 10:30 AM', st: 'Pending' },
      { who: 'Lucia P.', what: 'Check-up', when: 'Fri 12:00 PM', st: 'Confirmed' },
      { who: 'Andres M.', what: 'Whitening', when: 'Sat 9:00 AM', st: 'New' },
    ],
    mockNote: 'Sample data',
    clientsTitle: 'Businesses that breathe easy.',
    clientsNote: 'Sample testimonials: replace with real ones.',
    quotes: [
      {
        company: 'Bright Smile Dental',
        text: "We used to lose patients by not answering in time. Now the calendar fills itself, even at night.",
        role: 'OWNER, DENTAL CLINIC',
      },
      {
        company: 'Local Bites Co.',
        text: 'Bookings come in while we are closed and we find out in the morning. That is peace of mind.',
        role: 'OWNER, RESTAURANT',
      },
      {
        company: 'Urban Fit Studio',
        text: 'I stopped answering messages at all hours. My team focuses on the clients already in the studio.',
        role: 'FOUNDER, FITNESS STUDIO',
      },
    ],
    exampleName: 'Sample name',
    prev: 'Previous',
    next: 'Next',
    chat: {
      open: 'Open chat',
      close: 'Close chat',
      title: 'ElevateBiz AI Assistant',
      hello:
        'Welcome to ElevateBiz! 👋 I can answer your questions about our AI automation and marketing services. How can I help you today?',
      placeholder: 'Write your message...',
      send: 'Send',
      chips: ['What does it cost?', 'How fast can I start?', 'I want to book a call'],
      reply:
        'Thanks for your message. This is a preview of the assistant: an advisor will reply soon. Meanwhile, you can book a free call.',
      cta: 'Book a free call',
    },
    newsletterSent: 'Thanks! An advisor will contact you soon.',
    langLabel: 'Language',
  },
}

// Which page section each top-level menu group leads to
export const NAV_TARGETS = ['#servicios', '#como-funciona', '#demo', '#clientes', '#contacto']

// Photos of the services carousel, in the same order as svc1…svc5 in content.js
// Same order as the services: AI customer agents, process automation, custom software, digital marketing
export const SERVICE_PHOTOS = [
  { src: '/images/svc-bookings.webp', pos: '68% 50%' },
  { src: '/images/svc-custom-automation.webp', pos: '50% 50%' },
  { src: '/images/svc-ai-ready.webp', pos: '50% 50%' },
  { src: '/images/svc-marketing.webp', pos: '56% 50%' },
  { src: '/images/svc-customer-service.webp', pos: '62% 40%' },
]
