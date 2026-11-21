// Content of the "Solutions" pages (one page per button of the Solutions menu), in English and Spanish.
// To add a page: add an entry here (and its `href` in NAV_DATA in lib/content.ts). The page itself is built by
// ./view.tsx, so every solution has the same structure.
//
// No invented numbers or testimonials: only how the service works and how it helps in each business.

export type Lang = "en" | "es";
export type Text = Record<Lang, string>;

export type Solution = {
  slug: string;
  // Short name (menu button, breadcrumb, browser tab)
  name: Text;
  // Hero
  title: Text;
  subtitle: Text;
  // "Missed calls are missed revenue" band
  problemTitle: Text;
  problemText: Text;
  // What the customer is called here ("students", "patients"...), used in the shared sections
  people: Text;
  // Before and after: same number of items in each list, paired by position
  before: Text[];
  after: Text[];
  // What it does day to day
  useCases: Text[];
  // Three benefit blocks
  benefits: { title: Text; text: Text }[];
  faqs: { q: Text; a: Text }[];
  // Optional wording for this business of the shared sections (the default talks about appointments)
  lastStep?: { t: Text; d: Text }; // third step of "How it works"
  chatLine?: Text; // "Website chat" channel
  hideMarketing?: boolean; // hides the shared "Ads and email marketing" section
};


// ---------- Helpers to keep the entries below short ----------
const t = (en: string, es: string): Text => ({ en, es });

// Pairs of [English, Spanish] to a list of texts
const list = (pairs: [string, string][]): Text[] => pairs.map(([en, es]) => ({ en, es }));

// The three benefit blocks. `ask` is what customers ask about, `follow` is who gets followed up and `market` are the
// campaigns that fit this business (all bilingual).
function benefitSet(o: {
  ask: Text;
  who: Text; // "patient", "lead"... singular, lowercase
  history: Text; // what the record of each contact keeps
  market: Text;
}): Solution["benefits"] {
  return [
    {
      title: t("Support 24 hours a day, on every channel", "Atención las 24 horas, en todos los canales"),
      text: t(
        `Phone calls, WhatsApp and text messages, website chat and email. The assistant answers ${o.ask.en}, and never leaves anyone waiting.`,
        `Llamadas, WhatsApp y mensajes de texto, chat de tu sitio web y correo. El asistente responde ${o.ask.es}, y nunca deja a nadie esperando.`,
      ),
    },
    {
      title: t(`Every ${o.who.en} followed up, in an orderly system`, `Cada ${o.who.es} con seguimiento, en un sistema ordenado`),
      text: t(
        `Each contact is recorded with its history: ${o.history.en}. Your team knows who to contact next and nothing falls through the cracks.`,
        `Cada contacto queda registrado con su historial: ${o.history.es}. Tu equipo sabe a quién contactar y nada se pierde en el camino.`,
      ),
    },
    {
      title: t("Marketing that feeds the system", "Marketing que alimenta el sistema"),
      text: t(
        `${o.market.en} Your ads connect to the same system, so you know which ones bring real customers.`,
        `${o.market.es} Tus anuncios se conectan al mismo sistema, para saber cuáles traen clientes de verdad.`,
      ),
    },
  ];
}

const faqTools: Solution["faqs"][number] = {
  q: t("Can it work with the tools we already use?", "¿Puede trabajar con las herramientas que ya usamos?"),
  a: t(
    "In most cases yes. In the free consultation we review your calendar, CRM and other tools, and plan how to connect them.",
    "En la mayoría de los casos sí. En la consulta gratuita revisamos tu calendario, CRM y demás herramientas, y planeamos cómo conectarlas.",
  ),
};
const faqStart: Solution["faqs"][number] = {
  q: t("How do we start?", "¿Cómo empezamos?"),
  a: t(
    "With a free consultation. We learn how you work today and start with the channel that matters most, then grow from there.",
    "Con una consulta gratuita. Conocemos cómo trabajas hoy y empezamos por el canal más importante; después vamos creciendo.",
  ),
};
const faqPeople = (en: string, es: string): Solution["faqs"][number] => ({
  q: t("Will the AI replace my team?", "¿La IA reemplaza a mi equipo?"),
  a: t(
    `No. It handles the repetitive part (first answers, questions, scheduling, reminders) so your people can spend their time ${en}.`,
    `No. Se encarga de lo repetitivo (primeras respuestas, preguntas, agenda, recordatorios) para que tu gente dedique su tiempo ${es}.`,
  ),
});

export const SOLUTIONS: Solution[] = [
  {
    slug: "education",
    name: { en: "Education", es: "Educación" },
    title: {
      en: "Enroll more students with AI that answers 24/7",
      es: "Inscribe a más alumnos con una IA que atiende 24/7",
    },
    subtitle: {
      en: "An AI assistant for your school's admissions and customer service: it picks up calls, replies to messages and emails, qualifies every family and books the visit, day or night.",
      es: "Un asistente de IA para la atención y admisiones de tu escuela: contesta llamadas, responde mensajes y correos, califica a cada familia y agenda la visita, de día o de noche.",
    },
    problemTitle: {
      en: "Every unanswered inquiry is a student who enrolls somewhere else",
      es: "Cada consulta sin respuesta es un alumno que se inscribe en otra escuela",
    },
    problemText: {
      en: "Families ask when they have time: at night, on weekends, in the middle of the day. If nobody answers right away, they move on to the next school.",
      es: "Las familias preguntan cuando tienen tiempo: de noche, en fin de semana, a media jornada. Si nadie contesta de inmediato, pasan a la siguiente escuela.",
    },
    people: { en: "students and families", es: "alumnos y familias" },
    before: [
      { en: "Calls that go unanswered after hours", es: "Llamadas sin contestar fuera de horario" },
      { en: "Messages that wait days for a reply", es: "Mensajes que esperan días una respuesta" },
      { en: "Counselors busy with questions that are not real prospects", es: "Orientadores ocupados con consultas que no son prospectos reales" },
      { en: "Families that ask once and are never followed up", es: "Familias que preguntan una vez y nadie les da seguimiento" },
      { en: "Contacts scattered in chats, spreadsheets and notebooks", es: "Contactos dispersos en chats, hojas de cálculo y libretas" },
      { en: "Visits and calls that nobody confirms", es: "Visitas y llamadas que nadie confirma" },
    ],
    after: [
      { en: "Every call answered, day or night", es: "Cada llamada contestada, de día o de noche" },
      { en: "Instant replies by WhatsApp, chat and email", es: "Respuesta inmediata por WhatsApp, chat y correo" },
      { en: "Only qualified families reach your team", es: "Solo las familias calificadas llegan a tu equipo" },
      { en: "Automatic follow-up until they decide", es: "Seguimiento automático hasta que decidan" },
      { en: "Every contact in one organized system", es: "Cada contacto en un solo sistema ordenado" },
      { en: "Confirmations and reminders sent automatically", es: "Confirmaciones y recordatorios enviados solos" },
    ],
    useCases: [
      { en: "24/7 virtual receptionist", es: "Recepcionista virtual 24/7" },
      { en: "Inquiry qualification", es: "Calificación de consultas" },
      { en: "Visit and call scheduling", es: "Agenda de visitas y llamadas" },
      { en: "Text-back for missed calls", es: "Mensaje automático tras llamada perdida" },
      { en: "Application follow-up", es: "Seguimiento de solicitudes de inscripción" },
      { en: "Document and deadline reminders", es: "Recordatorio de documentos y fechas límite" },
      { en: "Re-engagement of families that went quiet", es: "Reactivación de familias que dejaron de responder" },
      { en: "Email and message campaigns", es: "Campañas por correo y por mensajes" },
      { en: "Reports on which ads bring students", es: "Reportes de qué anuncios traen alumnos" },
    ],
    benefits: [
      {
        title: { en: "Support 24 hours a day, on every channel", es: "Atención las 24 horas, en todos los canales" },
        text: {
          en: "Phone calls, WhatsApp and text messages, website chat and email. The assistant answers questions about programs, schedules and costs, and never leaves a family waiting.",
          es: "Llamadas, WhatsApp y mensajes de texto, chat de tu sitio web y correo. El asistente responde dudas sobre programas, horarios y costos, y nunca deja esperando a una familia.",
        },
      },
      {
        title: { en: "Every prospect followed up, in an orderly system", es: "Cada prospecto con seguimiento, en un sistema ordenado" },
        text: {
          en: "Each inquiry is recorded with its history and its status. Your team sees who to call, who is ready to enroll and who needs one more reminder.",
          es: "Cada consulta queda registrada con su historial y su estatus. Tu equipo ve a quién llamar, quién está listo para inscribirse y a quién le falta un recordatorio.",
        },
      },
      {
        title: { en: "Marketing that feeds the system", es: "Marketing que alimenta el sistema" },
        text: {
          en: "Email and message campaigns for new and past contacts, and your ads connected to the same system, so you know which ones bring real students.",
          es: "Campañas por correo y por mensajes para contactos nuevos y anteriores, y tus anuncios conectados al mismo sistema, para saber cuáles traen alumnos de verdad.",
        },
      },
    ],
    faqs: [
      {
        q: { en: "Will the AI replace our admissions staff?", es: "¿La IA reemplaza a nuestro equipo de admisiones?" },
        a: {
          en: "No. It handles the repetitive part (first answers, questions, scheduling, reminders) so your people spend their time with families who are ready to decide.",
          es: "No. Se encarga de lo repetitivo (primeras respuestas, preguntas, agenda, recordatorios) para que tu gente dedique su tiempo a las familias que ya van a decidir.",
        },
      },
      {
        q: { en: "Can it work with the system we already use?", es: "¿Puede trabajar con el sistema que ya usamos?" },
        a: {
          en: "In most cases yes. In the free consultation we review your calendar, CRM or student system and plan how to connect them.",
          es: "En la mayoría de los casos sí. En la consulta gratuita revisamos tu calendario, CRM o sistema de alumnos y planeamos cómo conectarlos.",
        },
      },
      {
        q: { en: "Does it speak English and Spanish?", es: "¿Habla español e inglés?" },
        a: {
          en: "Yes. It answers in the language the family writes or speaks, which helps with international and bilingual families.",
          es: "Sí. Responde en el idioma en que la familia escribe o habla, lo que ayuda con familias internacionales y bilingües.",
        },
      },
      {
        q: { en: "How do we start?", es: "¿Cómo empezamos?" },
        a: {
          en: "With a free consultation. We learn how your school receives inquiries today and start with the channel that matters most, then grow from there.",
          es: "Con una consulta gratuita. Conocemos cómo recibe consultas tu escuela hoy y empezamos por el canal más importante; después vamos creciendo.",
        },
      },
    ],
  },
  {
    slug: "dental-clinic",
    name: { en: "Dental Clinic", es: "Clínica dental" },
    title: {
      en: "Fill your dental chairs with AI that never misses a call",
      es: "Llena tus sillones dentales con una IA que no pierde ninguna llamada",
    },
    subtitle: {
      en: "An AI assistant for your clinic's front desk: it answers calls and messages 24/7, books and confirms appointments, reminds patients and follows up after every visit.",
      es: "Un asistente de IA para la recepción de tu clínica: contesta llamadas y mensajes 24/7, agenda y confirma citas, recuerda a los pacientes y da seguimiento después de cada visita.",
    },
    problemTitle: {
      en: "A missed call is a patient who books with the clinic next door",
      es: "Una llamada perdida es un paciente que agenda en la clínica de al lado",
    },
    problemText: {
      en: "While your team is with a patient, the phone keeps ringing. People with a toothache or a cleaning to book rarely call twice.",
      es: "Mientras tu equipo atiende a un paciente, el teléfono sigue sonando. Quien tiene dolor de muela o quiere una limpieza casi nunca llama dos veces.",
    },
    people: { en: "patients", es: "pacientes" },
    before: [
      { en: "Calls missed while the team is with a patient", es: "Llamadas perdidas mientras el equipo atiende a un paciente" },
      { en: "Messages at night that get answered the next day", es: "Mensajes de noche que se contestan al día siguiente" },
      { en: "Empty slots from last-minute cancellations", es: "Huecos vacíos por cancelaciones de último minuto" },
      { en: "Patients who forget their appointment", es: "Pacientes que olvidan su cita" },
      { en: "Treatments left unfinished with no follow-up", es: "Tratamientos sin terminar y sin seguimiento" },
      { en: "Patient information scattered across notes and chats", es: "Información de pacientes dispersa en notas y chats" },
    ],
    after: [
      { en: "Every call answered, even with a full waiting room", es: "Cada llamada contestada, incluso con la sala llena" },
      { en: "Instant replies and bookings, day or night", es: "Respuestas y citas al instante, de día o de noche" },
      { en: "Open slots refilled from a waiting list", es: "Horarios libres cubiertos desde una lista de espera" },
      { en: "Automatic reminders and confirmations", es: "Recordatorios y confirmaciones automáticos" },
      { en: "Follow-up to bring patients back to their treatment", es: "Seguimiento para que el paciente regrese a su tratamiento" },
      { en: "Every patient in one organized system", es: "Cada paciente en un solo sistema ordenado" },
    ],
    useCases: [
      { en: "24/7 virtual receptionist", es: "Recepcionista virtual 24/7" },
      { en: "New patient booking", es: "Agenda de pacientes nuevos" },
      { en: "Appointment confirmations and reminders", es: "Confirmación y recordatorio de citas" },
      { en: "Rescheduling and cancellations", es: "Reagendar y cancelar citas" },
      { en: "Answers about services, prices and insurance", es: "Respuestas sobre servicios, precios y seguros" },
      { en: "Text-back for missed calls", es: "Mensaje automático tras llamada perdida" },
      { en: "Follow-up after each visit", es: "Seguimiento después de cada visita" },
      { en: "Reminders for the six-month cleaning", es: "Recordatorio de limpieza cada seis meses" },
      { en: "Reviews requested after a good visit", es: "Solicitud de reseñas tras una buena visita" },
    ],
    benefits: [
      {
        title: { en: "A front desk that works 24 hours a day", es: "Una recepción que trabaja las 24 horas" },
        text: {
          en: "Calls, WhatsApp and text messages, website chat and email. The assistant answers questions, offers open times and books the appointment, even when the clinic is closed.",
          es: "Llamadas, WhatsApp y mensajes de texto, chat de tu sitio web y correo. El asistente responde dudas, ofrece horarios libres y agenda la cita, incluso con la clínica cerrada.",
        },
      },
      {
        title: { en: "Every patient followed up, in an orderly system", es: "Cada paciente con seguimiento, en un sistema ordenado" },
        text: {
          en: "Each contact keeps its history: appointments, treatments and pending follow-ups. Your team knows who to call and who is due to come back.",
          es: "Cada contacto conserva su historial: citas, tratamientos y seguimientos pendientes. Tu equipo sabe a quién llamar y quién ya debe regresar.",
        },
      },
      {
        title: { en: "Marketing that fills the calendar", es: "Marketing que llena la agenda" },
        text: {
          en: "Email and message campaigns (cleanings, whitening, orthodontics) and your ads connected to the same system, so you know which ones bring patients.",
          es: "Campañas por correo y por mensajes (limpiezas, blanqueamiento, ortodoncia) y tus anuncios conectados al mismo sistema, para saber cuáles traen pacientes.",
        },
      },
    ],
    faqs: [
      {
        q: { en: "Will patients know they are talking to an AI?", es: "¿Los pacientes sabrán que hablan con una IA?" },
        a: {
          en: "It introduces itself as the clinic's virtual assistant, in the tone you choose. When a case needs a person, it passes the conversation to your team.",
          es: "Se presenta como la asistente virtual de la clínica, con el tono que tú elijas. Cuando un caso necesita a una persona, pasa la conversación a tu equipo.",
        },
      },
      {
        q: { en: "Can it work with my agenda software?", es: "¿Puede trabajar con mi software de agenda?" },
        a: {
          en: "In most cases yes. In the free consultation we review the software you use and plan how to connect it.",
          es: "En la mayoría de los casos sí. En la consulta gratuita revisamos el software que usas y planeamos cómo conectarlo.",
        },
      },
      {
        q: { en: "Does it handle emergencies?", es: "¿Atiende urgencias?" },
        a: {
          en: "It recognizes urgent cases (pain, swelling, an accident) and alerts your team right away, with the patient's details.",
          es: "Reconoce los casos urgentes (dolor, inflamación, un accidente) y avisa de inmediato a tu equipo, con los datos del paciente.",
        },
      },
      {
        q: { en: "How do we start?", es: "¿Cómo empezamos?" },
        a: {
          en: "With a free consultation. We learn how your front desk works today and start with the channel that matters most, then grow from there.",
          es: "Con una consulta gratuita. Conocemos cómo funciona tu recepción hoy y empezamos por el canal más importante; después vamos creciendo.",
        },
      },
    ],
  },
  // ---------- Functions ----------
  {
    slug: "sales",
    name: t("Sales", "Ventas"),
    title: t("Answer every lead in seconds and close more sales", "Responde a cada prospecto en segundos y cierra más ventas"),
    subtitle: t(
      "An AI assistant for your sales team: it replies to new leads right away, qualifies them, books the meeting and follows up until they decide.",
      "Un asistente de IA para tu equipo de ventas: responde a los prospectos nuevos de inmediato, los califica, agenda la reunión y da seguimiento hasta que decidan.",
    ),
    problemTitle: t("The first company to answer is usually the one that makes the sale", "La primera empresa en responder suele ser la que cierra la venta"),
    problemText: t(
      "A lead who waits hours for a reply cools down, or is already talking to a competitor. Speed is the difference between a sale and a lost contact.",
      "Un prospecto que espera horas una respuesta se enfría, o ya está hablando con la competencia. La rapidez es la diferencia entre una venta y un contacto perdido.",
    ),
    people: t("leads", "prospectos"),
    before: list([
      ["Leads that wait hours for a first reply", "Prospectos que esperan horas una primera respuesta"],
      ["Reps spending time on leads that will never buy", "Vendedores gastando tiempo en prospectos que nunca comprarán"],
      ["Follow-ups forgotten after the first contact", "Seguimientos olvidados después del primer contacto"],
      ["No clear view of where each deal stands", "Sin una vista clara de en qué etapa está cada venta"],
      ["Meetings that get missed or never booked", "Reuniones que se pierden o nunca se agendan"],
      ["Leads from ads that nobody tracks", "Prospectos de anuncios que nadie rastrea"],
    ]),
    after: list([
      ["First reply in seconds, 24/7", "Primera respuesta en segundos, 24/7"],
      ["Only qualified leads reach your reps", "Solo los prospectos calificados llegan a tus vendedores"],
      ["Automatic follow-up until they answer", "Seguimiento automático hasta que respondan"],
      ["Every deal and its history in one system", "Cada venta y su historial en un solo sistema"],
      ["Meetings booked, confirmed and reminded", "Reuniones agendadas, confirmadas y recordadas"],
      ["You know which ads and channels bring real buyers", "Sabes qué anuncios y canales traen compradores reales"],
    ]),
    useCases: list([
      ["Instant reply to new leads", "Respuesta inmediata a prospectos nuevos"],
      ["Lead qualification", "Calificación de prospectos"],
      ["Meeting scheduling", "Agenda de reuniones"],
      ["Follow-up sequences", "Secuencias de seguimiento"],
      ["Text-back for missed calls", "Mensaje automático tras llamada perdida"],
      ["Quote and proposal reminders", "Recordatorios de cotizaciones y propuestas"],
      ["Reactivation of cold leads", "Reactivación de prospectos fríos"],
      ["Email and message campaigns", "Campañas por correo y por mensajes"],
      ["Reports by source and ad", "Reportes por origen y anuncio"],
    ]),
    benefits: [
      {
        title: t("Be the first to answer, every time", "Sé el primero en responder, siempre"),
        text: t(
          "Calls, WhatsApp, website chat and email get an instant reply, day or night, with the right questions to understand what each lead needs.",
          "Llamadas, WhatsApp, chat del sitio y correo reciben respuesta inmediata, de día o de noche, con las preguntas correctas para entender qué necesita cada prospecto.",
        ),
      },
      {
        title: t("A pipeline that is always up to date", "Un embudo siempre actualizado"),
        text: t(
          "Every contact, conversation and next step is recorded automatically. Your team sees who is ready to buy and who needs one more follow-up.",
          "Cada contacto, conversación y siguiente paso se registra solo. Tu equipo ve quién está listo para comprar y a quién le falta un seguimiento.",
        ),
      },
      {
        title: t("Marketing connected to sales", "Marketing conectado con ventas"),
        text: t(
          "Email and message campaigns for new and past contacts, and your ads tied to the same system, so you know which ones turn into customers.",
          "Campañas por correo y mensajes para contactos nuevos y anteriores, y tus anuncios ligados al mismo sistema, para saber cuáles se vuelven clientes.",
        ),
      },
    ],
    faqs: [
      {
        q: t("Will the AI replace my sales reps?", "¿La IA reemplaza a mis vendedores?"),
        a: t(
          "No. It handles first contact, questions and follow-up so your reps only spend time with leads that are ready to talk and to buy.",
          "No. Se encarga del primer contacto, las preguntas y el seguimiento para que tus vendedores solo atiendan a prospectos listos para hablar y comprar.",
        ),
      },
      {
        q: t("How does it qualify a lead?", "¿Cómo califica a un prospecto?"),
        a: t(
          "It asks the questions you define (need, budget, timing) and scores the answers. Qualified leads go to your team with the conversation attached.",
          "Hace las preguntas que tú definas (necesidad, presupuesto, tiempo) y puntúa las respuestas. Los calificados pasan a tu equipo con la conversación adjunta.",
        ),
      },
      faqTools,
      faqStart,
    ],
  },
  {
    slug: "operations",
    name: t("Operations", "Operaciones"),
    title: t("Take repetitive tasks off your team's plate", "Quita las tareas repetitivas de encima a tu equipo"),
    subtitle: t(
      "AI assistants and automations for the day-to-day of your business: confirmations, reminders, data entry, internal requests and customer questions handled on their own.",
      "Asistentes de IA y automatizaciones para el día a día de tu negocio: confirmaciones, recordatorios, captura de datos, solicitudes internas y preguntas de clientes resueltas solas.",
    ),
    problemTitle: t("Your team is busy with work a system could do", "Tu equipo está ocupado con trabajo que un sistema puede hacer"),
    problemText: t(
      "Copying data, sending reminders and answering the same questions add up to hours every week, and hours that your people could spend on what grows the business.",
      "Copiar datos, enviar recordatorios y contestar las mismas preguntas suman horas cada semana, horas que tu gente podría dedicar a lo que hace crecer el negocio.",
    ),
    people: t("customers and team", "clientes y equipo"),
    before: list([
      ["Hours spent copying data between tools", "Horas copiando datos entre herramientas"],
      ["Customers asking the same questions again and again", "Clientes haciendo las mismas preguntas una y otra vez"],
      ["Confirmations and reminders sent by hand", "Confirmaciones y recordatorios enviados a mano"],
      ["Requests lost in chats and email", "Solicitudes perdidas entre chats y correos"],
      ["Reports built manually every week", "Reportes armados a mano cada semana"],
      ["Mistakes from repeated manual steps", "Errores por pasos manuales repetidos"],
    ]),
    after: list([
      ["Data flows between your tools automatically", "Los datos fluyen entre tus herramientas automáticamente"],
      ["Common questions answered instantly", "Preguntas comunes respondidas al instante"],
      ["Confirmations and reminders go out on their own", "Confirmaciones y recordatorios salen solos"],
      ["Every request recorded and assigned", "Cada solicitud registrada y asignada"],
      ["Reports ready without lifting a finger", "Reportes listos sin mover un dedo"],
      ["Fewer errors and more time for real work", "Menos errores y más tiempo para el trabajo importante"],
    ]),
    useCases: list([
      ["Appointment confirmations", "Confirmación de citas"],
      ["Customer FAQ answers", "Respuestas a preguntas frecuentes"],
      ["Data entry between tools", "Captura de datos entre herramientas"],
      ["Order and status updates", "Avisos de pedido y estatus"],
      ["Internal request routing", "Canalización de solicitudes internas"],
      ["Document and payment reminders", "Recordatorios de documentos y pagos"],
      ["Automatic reports", "Reportes automáticos"],
      ["Alerts when something needs a person", "Alertas cuando algo requiere a una persona"],
      ["Handoff to your team with the full context", "Traspaso a tu equipo con todo el contexto"],
    ]),
    benefits: [
      {
        title: t("Your team focuses on what matters", "Tu equipo se enfoca en lo importante"),
        text: t(
          "Routine questions, reminders and data entry are handled by the assistant, on every channel and at any hour. Your people only step in when a case needs them.",
          "Las preguntas de rutina, los recordatorios y la captura de datos los maneja el asistente, en todos los canales y a cualquier hora. Tu gente solo interviene cuando un caso lo necesita.",
        ),
      },
      {
        title: t("Everything recorded, in order", "Todo registrado y en orden"),
        text: t(
          "Each request, customer and task has its history and its status in one system, so nothing is lost between chats and inboxes.",
          "Cada solicitud, cliente y tarea tiene su historial y su estatus en un solo sistema, para que nada se pierda entre chats y bandejas de correo.",
        ),
      },
      {
        title: t("Connected to the tools you use", "Conectado a las herramientas que usas"),
        text: t(
          "Your calendar, CRM, spreadsheets and messaging apps work together, with campaigns and reports that run by themselves.",
          "Tu calendario, CRM, hojas de cálculo y apps de mensajería trabajan juntos, con campañas y reportes que corren solos.",
        ),
      },
    ],
    faqs: [
      faqPeople("on the work that moves the business forward", "en el trabajo que hace avanzar el negocio"),
      {
        q: t("Which processes are best to automate first?", "¿Qué procesos conviene automatizar primero?"),
        a: t(
          "The ones that repeat every day and follow clear rules: confirmations, reminders, common questions and data entry. We pick them together in the consultation.",
          "Los que se repiten todos los días y siguen reglas claras: confirmaciones, recordatorios, preguntas comunes y captura de datos. Los elegimos juntos en la consulta.",
        ),
      },
      faqTools,
      faqStart,
    ],
  },
  {
    slug: "marketing",
    name: t("Marketing", "Marketing"),
    title: t("Turn your marketing into customers, with follow-up included", "Convierte tu marketing en clientes, con seguimiento incluido"),
    subtitle: t(
      "Email and message campaigns, ads connected to your system and an assistant that follows up with every contact who responds.",
      "Campañas por correo y mensajes, anuncios conectados a tu sistema y un asistente que da seguimiento a cada contacto que responde.",
    ),
    problemTitle: t("Leads from your ads go cold when nobody follows up", "Los prospectos de tus anuncios se enfrían cuando nadie les da seguimiento"),
    problemText: t(
      "You pay to get the contact. If the reply arrives hours later, or never, that investment is lost.",
      "Tú pagas por conseguir el contacto. Si la respuesta llega horas después, o nunca, esa inversión se pierde.",
    ),
    people: t("contacts", "contactos"),
    before: list([
      ["Ad leads that arrive and wait for an answer", "Prospectos de anuncios que llegan y esperan respuesta"],
      ["Campaigns sent without knowing what worked", "Campañas enviadas sin saber qué funcionó"],
      ["Contacts scattered across several tools", "Contactos dispersos en varias herramientas"],
      ["Newsletters written and sent by hand", "Boletines escritos y enviados a mano"],
      ["No follow-up after someone clicks", "Sin seguimiento después de que alguien da clic"],
      ["Unclear which ads bring paying customers", "No se sabe qué anuncios traen clientes que pagan"],
    ]),
    after: list([
      ["Every ad lead gets an instant reply", "Cada prospecto de anuncio recibe respuesta inmediata"],
      ["Clear results for each campaign", "Resultados claros de cada campaña"],
      ["All contacts in one organized system", "Todos los contactos en un solo sistema ordenado"],
      ["Email and message sequences that run on their own", "Secuencias de correo y mensajes que corren solas"],
      ["Follow-up triggered by what the person does", "Seguimiento según lo que hace la persona"],
      ["You know which ads bring real customers", "Sabes qué anuncios traen clientes reales"],
    ]),
    useCases: list([
      ["Instant reply to ad leads", "Respuesta inmediata a prospectos de anuncios"],
      ["Email campaigns", "Campañas por correo"],
      ["WhatsApp and text campaigns", "Campañas por WhatsApp y mensajes de texto"],
      ["Welcome and nurture sequences", "Secuencias de bienvenida y nutrición"],
      ["Reactivation of past customers", "Reactivación de clientes anteriores"],
      ["Review requests", "Solicitud de reseñas"],
      ["Promotion and event reminders", "Recordatorios de promociones y eventos"],
      ["Contact segmentation", "Segmentación de contactos"],
      ["Reports by campaign and ad", "Reportes por campaña y anuncio"],
    ]),
    benefits: [
      {
        title: t("Leads answered the moment they arrive", "Prospectos atendidos en el momento en que llegan"),
        text: t(
          "Ad forms, messages, calls and website chats get an immediate reply, day or night, so the interest you paid for turns into a conversation.",
          "Formularios de anuncios, mensajes, llamadas y chats del sitio reciben respuesta inmediata, de día o de noche, para que el interés que pagaste se vuelva conversación.",
        ),
      },
      {
        title: t("One system for all your contacts", "Un solo sistema para todos tus contactos"),
        text: t(
          "Every contact keeps its history: where it came from, what it answered and what comes next. You always know who to follow up with.",
          "Cada contacto conserva su historial: de dónde vino, qué respondió y qué sigue. Siempre sabes a quién darle seguimiento.",
        ),
      },
      {
        title: t("Campaigns that run on their own", "Campañas que corren solas"),
        text: t(
          "Email and message sequences that send the right follow-up at the right time, and reports that show which ads and campaigns work.",
          "Secuencias por correo y mensajes que envían el seguimiento correcto en el momento correcto, y reportes que muestran qué anuncios y campañas funcionan.",
        ),
      },
    ],
    faqs: [
      {
        q: t("Do you run my ads?", "¿Ustedes manejan mis anuncios?"),
        a: t(
          "Yes. We create and manage your Facebook, Instagram and Google ads, and connect them to your system so every lead is answered and tracked. In the consultation we review what you run today and where to start.",
          "Sí. Creamos y manejamos tus anuncios de Facebook, Instagram y Google, y los conectamos a tu sistema para que cada prospecto sea atendido y rastreado. En la consulta revisamos lo que manejas hoy y por dónde empezar.",
        ),
      },
      {
        q: t("Which channels can the campaigns use?", "¿Qué canales pueden usar las campañas?"),
        a: t(
          "Email and messages (WhatsApp and text), always with the contact's permission and following each platform's rules.",
          "Correo y mensajes (WhatsApp y texto), siempre con el permiso del contacto y siguiendo las reglas de cada plataforma.",
        ),
      },
      faqTools,
      faqStart,
    ],
  },
  {
    slug: "human-resources",
    name: t("Human Resources", "Recursos humanos"),
    title: t("Hire faster and answer your employees without the back and forth", "Contrata más rápido y atiende a tus empleados sin ir y venir"),
    subtitle: t(
      "An AI assistant for HR: it answers candidate and employee questions, screens applicants, schedules interviews and sends reminders and onboarding steps.",
      "Un asistente de IA para recursos humanos: responde dudas de candidatos y empleados, filtra solicitantes, agenda entrevistas y envía recordatorios y pasos de incorporación.",
    ),
    problemTitle: t("Good candidates do not wait for a slow reply", "Los buenos candidatos no esperan una respuesta lenta"),
    problemText: t(
      "While your team reads applications and answers the same questions, the best candidates accept another offer.",
      "Mientras tu equipo lee solicitudes y contesta las mismas preguntas, los mejores candidatos aceptan otra oferta.",
    ),
    people: t("candidates and employees", "candidatos y empleados"),
    lastStep: {
      t: t("It schedules and follows up", "Agenda y da seguimiento"),
      d: t("It books the interview, confirms it, sends reminders and keeps each candidate informed of their status.", "Agenda la entrevista, la confirma, envía recordatorios y mantiene a cada candidato al tanto de su estatus."),
    },
    chatLine: t("Answers candidates and employees from your careers page or intranet.", "Atiende a candidatos y empleados desde tu página de empleo o intranet."),
    hideMarketing: true,
    before: list([
      ["Candidates waiting days for an answer", "Candidatos esperando días una respuesta"],
      ["Hundreds of applications read one by one", "Cientos de solicitudes leídas una por una"],
      ["Interviews arranged by long email chains", "Entrevistas acordadas con largas cadenas de correos"],
      ["Employees asking HR the same questions", "Empleados haciendo a RH las mismas preguntas"],
      ["Onboarding steps forgotten", "Pasos de incorporación olvidados"],
      ["Candidate information in scattered files", "Información de candidatos en archivos dispersos"],
    ]),
    after: list([
      ["Candidates answered instantly", "Candidatos atendidos al instante"],
      ["Applicants screened against your criteria", "Solicitantes filtrados según tus criterios"],
      ["Interviews booked automatically", "Entrevistas agendadas automáticamente"],
      ["Common employee questions answered 24/7", "Preguntas comunes de empleados respondidas 24/7"],
      ["Onboarding steps and reminders sent on time", "Pasos de incorporación y recordatorios a tiempo"],
      ["Every candidate in one organized system", "Cada candidato en un solo sistema ordenado"],
    ]),
    useCases: list([
      ["Answers to candidate questions", "Respuestas a dudas de candidatos"],
      ["Applicant screening", "Filtro de solicitantes"],
      ["Interview scheduling", "Agenda de entrevistas"],
      ["Interview reminders", "Recordatorios de entrevistas"],
      ["Employee FAQ (benefits, schedules, policies)", "Preguntas de empleados (prestaciones, horarios, políticas)"],
      ["Onboarding checklists", "Listas de incorporación"],
      ["Document collection reminders", "Recordatorios para reunir documentos"],
      ["Status updates for candidates", "Avisos de estatus a candidatos"],
      ["Reactivation of past candidates", "Reactivación de candidatos anteriores"],
    ]),
    benefits: [
      {
        title: t("A faster, friendlier hiring process", "Un proceso de contratación más rápido y amable"),
        text: t(
          "Candidates get answers and an interview slot right away, by message, call or email, which keeps the best ones interested.",
          "Los candidatos reciben respuestas y un horario de entrevista de inmediato, por mensaje, llamada o correo, lo que mantiene interesados a los mejores.",
        ),
      },
      {
        title: t("HR time spent on people, not on paperwork", "El tiempo de RH, para las personas y no para el papeleo"),
        text: t(
          "Questions about benefits, schedules and policies are answered 24/7, and your team only handles the cases that need a person.",
          "Las dudas sobre prestaciones, horarios y políticas se responden 24/7, y tu equipo solo atiende los casos que requieren a una persona.",
        ),
      },
      {
        title: t("Everything in order", "Todo en orden"),
        text: t(
          "Each candidate and employee has a record with its history and its next step, so no application or request is forgotten.",
          "Cada candidato y empleado tiene un registro con su historial y su siguiente paso, para que ninguna solicitud se olvide.",
        ),
      },
    ],
    faqs: [
      {
        q: t("Does the AI decide who gets hired?", "¿La IA decide a quién se contrata?"),
        a: t(
          "No. It collects information and organizes it. The hiring decisions are always made by people.",
          "No. Reúne información y la organiza. Las decisiones de contratación siempre las toman personas.",
        ),
      },
      faqPeople("on interviews and on the people already in the company", "en las entrevistas y en las personas que ya están en la empresa"),
      faqTools,
      faqStart,
    ],
  },
  // ---------- Industries ----------
  {
    slug: "real-estate",
    name: t("Real Estate", "Bienes raíces"),
    title: t("Answer every property inquiry and book more visits", "Responde cada consulta de propiedades y agenda más visitas"),
    subtitle: t(
      "An AI assistant for your agency: it replies to every inquiry about a property, qualifies the buyer or renter, books the visit and follows up, day and night.",
      "Un asistente de IA para tu inmobiliaria: responde cada consulta de una propiedad, califica al comprador o inquilino, agenda la visita y da seguimiento, de día y de noche.",
    ),
    problemTitle: t("A buyer who gets no answer calls the next listing", "Un comprador sin respuesta llama a la siguiente propiedad"),
    problemText: t(
      "Inquiries from portals and ads arrive at any hour. The agent who answers first is usually the one who shows the property.",
      "Las consultas de portales y anuncios llegan a cualquier hora. El agente que responde primero suele ser el que enseña la propiedad.",
    ),
    people: t("buyers and renters", "compradores e inquilinos"),
    before: list([
      ["Portal and ad inquiries answered hours later", "Consultas de portales y anuncios contestadas horas después"],
      ["Agents repeating the same property details", "Agentes repitiendo los mismos datos de cada propiedad"],
      ["Visits wasted on people who cannot afford the property", "Visitas desperdiciadas con personas que no pueden pagarla"],
      ["Visits with no confirmation and no-shows", "Visitas sin confirmar y personas que no llegan"],
      ["Interested buyers forgotten after the first visit", "Compradores interesados olvidados tras la primera visita"],
      ["Leads from ads and portals that nobody tracks", "Prospectos de anuncios y portales que nadie rastrea"],
    ]),
    after: list([
      ["Instant answers about each property", "Respuestas inmediatas sobre cada propiedad"],
      ["Details, photos and prices shared automatically", "Datos, fotos y precios enviados automáticamente"],
      ["Budget and needs checked before booking", "Presupuesto y necesidades revisados antes de agendar"],
      ["Visits confirmed and reminded", "Visitas confirmadas y recordadas"],
      ["Follow-up after every visit", "Seguimiento después de cada visita"],
      ["You know which portals and ads bring buyers", "Sabes qué portales y anuncios traen compradores"],
    ]),
    useCases: list([
      ["Instant reply to property inquiries", "Respuesta inmediata a consultas de propiedades"],
      ["Buyer and renter qualification", "Calificación de compradores e inquilinos"],
      ["Visit scheduling", "Agenda de visitas"],
      ["Visit reminders", "Recordatorios de visitas"],
      ["Property information by message", "Información de la propiedad por mensaje"],
      ["Follow-up after the visit", "Seguimiento después de la visita"],
      ["Reactivation of cold leads", "Reactivación de prospectos fríos"],
      ["Campaigns for new listings", "Campañas de nuevas propiedades"],
      ["Reports by source", "Reportes por origen"],
    ]),
    benefits: benefitSet({
      ask: t("questions about each property: price, location, features and availability", "preguntas de cada propiedad: precio, ubicación, características y disponibilidad"),
      who: t("buyer", "comprador"),
      history: t("the properties they asked about, their budget and their visits", "las propiedades por las que preguntó, su presupuesto y sus visitas"),
      market: t("Email and message campaigns announce new listings and price changes to the people who are looking.", "Campañas por correo y mensajes anuncian nuevas propiedades y cambios de precio a quienes están buscando."),
    }),
    faqs: [
      faqPeople("showing properties and closing deals", "enseñando propiedades y cerrando operaciones"),
      {
        q: t("Can it answer about each property?", "¿Puede responder sobre cada propiedad?"),
        a: t(
          "Yes. We load your listings (price, location, features) and it answers from that information, and hands over to an agent when needed.",
          "Sí. Cargamos tus propiedades (precio, ubicación, características) y responde con esa información, y pasa con un agente cuando hace falta.",
        ),
      },
      faqTools,
      faqStart,
    ],
  },
  {
    slug: "nutritionist",
    name: t("Nutritionist", "Nutriólogos"),
    title: t("Fill your consultation calendar and keep clients on their plan", "Llena tu agenda de consultas y mantén a tus clientes en su plan"),
    subtitle: t(
      "An AI assistant for your practice: it answers questions, books and confirms consultations, reminds clients and follows up so they stay on their plan.",
      "Un asistente de IA para tu consultorio: responde dudas, agenda y confirma consultas, recuerda a tus clientes y da seguimiento para que sigan su plan.",
    ),
    problemTitle: t("A client who gets no answer today starts with someone else tomorrow", "Un cliente sin respuesta hoy empieza mañana con otro profesional"),
    problemText: t(
      "People decide to take care of their health on impulse. If they ask about prices or schedules and nobody replies, the motivation fades.",
      "La gente decide cuidar su salud por impulso. Si pregunta por precios u horarios y nadie responde, la motivación se enfría.",
    ),
    people: t("clients", "clientes"),
    before: list([
      ["Messages about prices and schedules answered late", "Mensajes sobre precios y horarios contestados tarde"],
      ["Consultations that are not confirmed", "Consultas que nadie confirma"],
      ["No-shows that leave empty slots", "Inasistencias que dejan horarios vacíos"],
      ["Clients who disappear after the first visit", "Clientes que desaparecen después de la primera visita"],
      ["Follow-up between appointments done by hand", "Seguimiento entre consultas hecho a mano"],
      ["Plans and notes scattered in chats", "Planes y notas dispersos en chats"],
    ]),
    after: list([
      ["Questions answered instantly, day or night", "Dudas respondidas al instante, de día o de noche"],
      ["Consultations booked and confirmed automatically", "Consultas agendadas y confirmadas automáticamente"],
      ["Reminders that reduce no-shows", "Recordatorios que reducen las inasistencias"],
      ["Follow-up that keeps clients on track", "Seguimiento que mantiene a los clientes en su plan"],
      ["Check-ins between appointments", "Mensajes de apoyo entre consultas"],
      ["Every client in one organized system", "Cada cliente en un solo sistema ordenado"],
    ]),
    useCases: list([
      ["Answers about services and prices", "Respuestas sobre servicios y precios"],
      ["New client booking", "Agenda de clientes nuevos"],
      ["Confirmations and reminders", "Confirmaciones y recordatorios"],
      ["Rescheduling", "Reagendar citas"],
      ["Follow-up after the first consultation", "Seguimiento tras la primera consulta"],
      ["Check-ins between appointments", "Mensajes de apoyo entre consultas"],
      ["Renewal reminders for plans and packages", "Recordatorios de renovación de planes y paquetes"],
      ["Review requests", "Solicitud de reseñas"],
      ["Campaigns for programs and seasonal offers", "Campañas de programas y ofertas de temporada"],
    ]),
    benefits: benefitSet({
      ask: t("questions about plans, prices, schedules and what the first consultation includes", "dudas sobre planes, precios, horarios y qué incluye la primera consulta"),
      who: t("client", "cliente"),
      history: t("consultations, plan and pending follow-ups", "consultas, plan y seguimientos pendientes"),
      market: t("Email and message campaigns for programs and seasonal offers, plus reminders that bring clients back.", "Campañas por correo y mensajes de programas y ofertas de temporada, y recordatorios que traen de vuelta a los clientes."),
    }),
    faqs: [
      {
        q: t("Does the AI give diet advice?", "¿La IA da consejos de alimentación?"),
        a: t(
          "No. It handles scheduling, reminders and general information. Nutritional guidance is always given by you.",
          "No. Se encarga de agenda, recordatorios e información general. La orientación nutricional siempre la das tú.",
        ),
      },
      faqPeople("with clients, in consultation", "con los clientes, en consulta"),
      faqTools,
      faqStart,
    ],
  },
  {
    slug: "gym",
    name: t("Gym", "Gimnasios"),
    title: t("Turn inquiries into members and keep them coming", "Convierte consultas en socios y logra que sigan asistiendo"),
    subtitle: t(
      "An AI assistant for your gym: it answers questions about plans and schedules, books trial classes, follows up with new leads and reminds members to come back.",
      "Un asistente de IA para tu gimnasio: responde dudas de planes y horarios, agenda clases de prueba, da seguimiento a prospectos y recuerda a los socios que regresen.",
    ),
    problemTitle: t("Someone who asks about a gym and gets no reply joins the one that answered", "Quien pregunta por un gimnasio y no recibe respuesta se inscribe en el que sí contestó"),
    problemText: t(
      "Motivation to start training does not last. The answer has to arrive while the person is still excited.",
      "La motivación para empezar a entrenar no dura. La respuesta tiene que llegar mientras la persona sigue entusiasmada.",
    ),
    people: t("members", "socios"),
    before: list([
      ["Questions about prices and schedules left unanswered", "Preguntas de precios y horarios sin respuesta"],
      ["Trial classes with no confirmation", "Clases de prueba sin confirmar"],
      ["Leads who visit once and are never followed up", "Prospectos que visitan una vez y nadie les da seguimiento"],
      ["Members who stop coming and nobody notices", "Socios que dejan de asistir sin que nadie lo note"],
      ["Renewals handled by hand", "Renovaciones hechas a mano"],
      ["Promotions sent to everyone the same way", "Promociones enviadas a todos de la misma forma"],
    ]),
    after: list([
      ["Instant answers about plans, schedules and prices", "Respuestas inmediatas sobre planes, horarios y precios"],
      ["Trial classes booked, confirmed and reminded", "Clases de prueba agendadas, confirmadas y recordadas"],
      ["Automatic follow-up with every lead", "Seguimiento automático a cada prospecto"],
      ["Messages for members who drop off", "Mensajes para socios que dejan de asistir"],
      ["Renewal reminders on time", "Recordatorios de renovación a tiempo"],
      ["Campaigns for the right group of members", "Campañas para el grupo de socios correcto"],
    ]),
    useCases: list([
      ["Answers about plans and schedules", "Respuestas sobre planes y horarios"],
      ["Trial class booking", "Agenda de clases de prueba"],
      ["Class reminders", "Recordatorios de clases"],
      ["Lead follow-up after a visit", "Seguimiento de prospectos tras su visita"],
      ["Membership renewal reminders", "Recordatorios de renovación de membresía"],
      ["Re-engagement of inactive members", "Reactivación de socios inactivos"],
      ["Referral requests", "Solicitud de recomendaciones"],
      ["Promotion campaigns by message and email", "Campañas de promociones por mensaje y correo"],
      ["Reports on where members come from", "Reportes de dónde vienen tus socios"],
    ]),
    benefits: benefitSet({
      ask: t("questions about plans, schedules, classes and prices", "dudas sobre planes, horarios, clases y precios"),
      who: t("member", "socio"),
      history: t("trial class, plan, attendance and renewals", "clase de prueba, plan, asistencia y renovaciones"),
      market: t("Email and message campaigns for promotions and challenges, and messages to members who stopped coming.", "Campañas por correo y mensajes de promociones y retos, y mensajes a los socios que dejaron de asistir."),
    }),
    faqs: [
      faqPeople("with members, on the training floor", "con los socios, en el gimnasio"),
      {
        q: t("Can it handle class bookings?", "¿Puede manejar reservas de clases?"),
        a: t(
          "Yes. It offers the open times, books the spot and reminds the member, and can keep a waiting list when a class is full.",
          "Sí. Ofrece los horarios disponibles, reserva el lugar y recuerda al socio, y puede llevar lista de espera cuando una clase se llena.",
        ),
      },
      faqTools,
      faqStart,
    ],
  },
  {
    slug: "spa",
    name: t("Spa", "Spa"),
    title: t("Keep your treatment calendar full, day and night", "Mantén tu agenda de tratamientos llena, de día y de noche"),
    subtitle: t(
      "An AI assistant for your spa: it answers questions about treatments and prices, books and confirms appointments, reminds clients and brings them back.",
      "Un asistente de IA para tu spa: responde dudas de tratamientos y precios, agenda y confirma citas, recuerda a tus clientes y logra que regresen.",
    ),
    problemTitle: t("Someone who wants to relax today will not wait until tomorrow for an answer", "Quien quiere relajarse hoy no espera hasta mañana una respuesta"),
    problemText: t(
      "Your team is with a client, hands busy, and the phone keeps ringing. Each call that goes unanswered is an appointment that goes elsewhere.",
      "Tu equipo está atendiendo a una clienta, con las manos ocupadas, y el teléfono sigue sonando. Cada llamada sin contestar es una cita que se va a otro lado.",
    ),
    people: t("clients", "clientes"),
    before: list([
      ["Calls missed during treatments", "Llamadas perdidas durante los tratamientos"],
      ["Messages about services left for later", "Mensajes sobre servicios que se contestan después"],
      ["No-shows and last-minute cancellations", "Inasistencias y cancelaciones de último minuto"],
      ["Clients who come once and never return", "Clientes que vienen una vez y no regresan"],
      ["Gift cards and promotions handled by hand", "Tarjetas de regalo y promociones manejadas a mano"],
      ["Client preferences in scattered notes", "Preferencias de clientes en notas dispersas"],
    ]),
    after: list([
      ["Every call and message answered, even during treatments", "Cada llamada y mensaje contestado, incluso durante tratamientos"],
      ["Appointments booked day and night", "Citas agendadas de día y de noche"],
      ["Reminders and a waiting list that refill slots", "Recordatorios y lista de espera que cubren horarios libres"],
      ["Follow-up that brings clients back", "Seguimiento que hace regresar a los clientes"],
      ["Promotions and gift cards sent automatically", "Promociones y tarjetas de regalo enviadas solas"],
      ["Every client and preference in one place", "Cada cliente y sus preferencias en un solo lugar"],
    ]),
    useCases: list([
      ["24/7 virtual receptionist", "Recepcionista virtual 24/7"],
      ["Treatment booking", "Agenda de tratamientos"],
      ["Confirmations and reminders", "Confirmaciones y recordatorios"],
      ["Rescheduling", "Reagendar citas"],
      ["Waiting list for open slots", "Lista de espera para horarios libres"],
      ["Answers about treatments and prices", "Respuestas sobre tratamientos y precios"],
      ["Post-visit follow-up", "Seguimiento después de la visita"],
      ["Reminders to rebook", "Recordatorios para volver a agendar"],
      ["Promotion and gift card campaigns", "Campañas de promociones y tarjetas de regalo"],
    ]),
    benefits: benefitSet({
      ask: t("questions about treatments, prices, packages and available times", "dudas sobre tratamientos, precios, paquetes y horarios disponibles"),
      who: t("client", "cliente"),
      history: t("treatments, preferences and the date of the last visit", "tratamientos, preferencias y fecha de la última visita"),
      market: t("Email and message campaigns for promotions, packages and gift cards, and reminders to rebook.", "Campañas por correo y mensajes de promociones, paquetes y tarjetas de regalo, y recordatorios para volver a agendar."),
    }),
    faqs: [
      faqPeople("caring for clients", "cuidando a los clientes"),
      {
        q: t("Can it fill open slots?", "¿Puede llenar horarios libres?"),
        a: t(
          "Yes. When a slot opens up, it offers it to clients on the waiting list and books it automatically.",
          "Sí. Cuando se libera un horario, lo ofrece a los clientes de la lista de espera y lo agenda automáticamente.",
        ),
      },
      faqTools,
      faqStart,
    ],
  },
  {
    slug: "restaurants",
    name: t("Restaurants", "Restaurantes"),
    title: t("Take every reservation, even in the middle of the rush", "Atiende cada reservación, incluso en plena hora pico"),
    subtitle: t(
      "An AI assistant for your restaurant: it answers calls and messages, takes reservations, answers questions about the menu and hours, and keeps guests coming back.",
      "Un asistente de IA para tu restaurante: contesta llamadas y mensajes, toma reservaciones, responde dudas del menú y los horarios, y logra que los comensales regresen.",
    ),
    problemTitle: t("A phone that rings during the rush is a table you do not fill", "Un teléfono que suena en plena hora pico es una mesa que no llenas"),
    problemText: t(
      "During service nobody can pick up the phone, and the guests who wanted to book go to the next restaurant.",
      "Durante el servicio nadie puede contestar el teléfono, y los comensales que querían reservar se van al siguiente restaurante.",
    ),
    people: t("guests", "comensales"),
    lastStep: {
      t: t("It books and follows up", "Reserva y da seguimiento"),
      d: t("It takes the reservation, confirms it, sends a reminder and invites the guest back after the visit.", "Toma la reservación, la confirma, envía un recordatorio e invita al comensal a volver después de su visita."),
    },
    chatLine: t("Turns visitors into reservations.", "Convierte visitantes en reservaciones."),
    before: list([
      ["Calls that nobody can answer during service", "Llamadas que nadie puede contestar durante el servicio"],
      ["Reservations written on paper or in chats", "Reservaciones anotadas en papel o en chats"],
      ["The same questions about hours and menu, again and again", "Las mismas preguntas de horarios y menú, una y otra vez"],
      ["No-shows that leave tables empty", "Inasistencias que dejan mesas vacías"],
      ["Group and event requests handled by hand", "Solicitudes de grupos y eventos manejadas a mano"],
      ["Guests who never hear from you again", "Comensales que no vuelven a saber de ti"],
    ]),
    after: list([
      ["Every call and message answered during service", "Cada llamada y mensaje contestado durante el servicio"],
      ["Reservations recorded in one place", "Reservaciones registradas en un solo lugar"],
      ["Menu, hours and location answered instantly", "Menú, horarios y ubicación respondidos al instante"],
      ["Confirmations that reduce no-shows", "Confirmaciones que reducen las inasistencias"],
      ["Group and event requests captured and routed", "Solicitudes de grupos y eventos recibidas y canalizadas"],
      ["Promotions and reminders that bring guests back", "Promociones y recordatorios que traen de vuelta a los comensales"],
    ]),
    useCases: list([
      ["Reservation booking", "Reservaciones"],
      ["Confirmations and reminders", "Confirmaciones y recordatorios"],
      ["Questions about menu, hours and location", "Preguntas de menú, horarios y ubicación"],
      ["Group and event requests", "Solicitudes de grupos y eventos"],
      ["Waitlist messages", "Mensajes de lista de espera"],
      ["Order and delivery questions", "Preguntas de pedidos y entregas"],
      ["Review requests after a visit", "Solicitud de reseñas después de la visita"],
      ["Promotion campaigns by message and email", "Campañas de promociones por mensaje y correo"],
      ["Birthday messages", "Mensajes de cumpleaños"],
    ]),
    benefits: benefitSet({
      ask: t("questions about the menu, hours, location and reservations", "dudas del menú, horarios, ubicación y reservaciones"),
      who: t("guest", "comensal"),
      history: t("reservations, preferences and visits", "reservaciones, preferencias y visitas"),
      market: t("Email and message campaigns for promotions, events and birthdays, so guests come back.", "Campañas por correo y mensajes de promociones, eventos y cumpleaños, para que los comensales regresen."),
    }),
    faqs: [
      faqPeople("with the guests in the dining room", "con los comensales en el salón"),
      {
        q: t("Can it take reservations for large groups?", "¿Puede tomar reservaciones de grupos grandes?"),
        a: t(
          "Yes. It collects the date, group size and special requests, and passes the request to your team for approval when you want.",
          "Sí. Recoge la fecha, el tamaño del grupo y las peticiones especiales, y pasa la solicitud a tu equipo para su aprobación cuando tú quieras.",
        ),
      },
      faqTools,
      faqStart,
    ],
  },
  {
    slug: "law-firms",
    name: t("Law Firms", "Despachos de abogados"),
    title: t("Never miss a potential client, and screen every case", "No pierdas a ningún cliente potencial y filtra cada caso"),
    subtitle: t(
      "An AI assistant for your firm: it answers calls and messages 24/7, gathers the key facts of each case, books the consultation and follows up.",
      "Un asistente de IA para tu despacho: contesta llamadas y mensajes 24/7, reúne los datos clave de cada caso, agenda la consulta y da seguimiento.",
    ),
    problemTitle: t("Someone looking for a lawyer hires the first firm that answers", "Quien busca un abogado contrata al primer despacho que contesta"),
    problemText: t(
      "People in legal trouble call several firms in a row. If the call goes to voicemail while you are in court, the case goes elsewhere.",
      "Quien tiene un problema legal llama a varios despachos seguidos. Si la llamada se va a buzón mientras estás en audiencia, el caso se va a otro lado.",
    ),
    people: t("potential clients", "clientes potenciales"),
    before: list([
      ["Calls that go to voicemail while you are in court", "Llamadas que se van a buzón mientras estás en audiencia"],
      ["Inquiries outside your practice taking up your time", "Consultas fuera de tu especialidad que te quitan tiempo"],
      ["Intake information collected by hand", "Datos del caso recopilados a mano"],
      ["Consultations arranged by long email chains", "Consultas acordadas con largas cadenas de correos"],
      ["Potential clients with no follow-up", "Clientes potenciales sin seguimiento"],
      ["Case information scattered in files and chats", "Información de casos dispersa en archivos y chats"],
    ]),
    after: list([
      ["Every call and message answered, day and night", "Cada llamada y mensaje contestado, de día y de noche"],
      ["Cases screened by practice area and urgency", "Casos filtrados por especialidad y urgencia"],
      ["Intake information gathered automatically", "Datos del caso reunidos automáticamente"],
      ["Consultations booked and confirmed", "Consultas agendadas y confirmadas"],
      ["Automatic follow-up with every inquiry", "Seguimiento automático a cada consulta"],
      ["Every contact and case in one organized system", "Cada contacto y caso en un solo sistema ordenado"],
    ]),
    useCases: list([
      ["24/7 virtual receptionist", "Recepcionista virtual 24/7"],
      ["Intake of case details", "Recepción de los datos del caso"],
      ["Screening by practice area", "Filtro por especialidad"],
      ["Consultation scheduling", "Agenda de consultas"],
      ["Text-back for missed calls", "Mensaje automático tras llamada perdida"],
      ["Document request reminders", "Recordatorios para entregar documentos"],
      ["Case status updates for clients", "Avisos de estatus del caso a clientes"],
      ["Follow-up with potential clients", "Seguimiento a clientes potenciales"],
      ["Review requests", "Solicitud de reseñas"],
    ]),
    benefits: benefitSet({
      ask: t("first questions and gathers the key facts of each case", "las primeras dudas y reúne los datos clave de cada caso"),
      who: t("potential client", "cliente potencial"),
      history: t("the type of case, urgency and consultation", "el tipo de caso, la urgencia y la consulta"),
      market: t("Email and message campaigns with updates and reminders for current and past clients.", "Campañas por correo y mensajes con novedades y recordatorios para clientes actuales y anteriores."),
    }),
    faqs: [
      {
        q: t("Does the AI give legal advice?", "¿La IA da asesoría legal?"),
        a: t(
          "No. It gathers information, answers general questions about your firm and books the consultation. Legal advice is always given by your lawyers.",
          "No. Reúne información, responde dudas generales sobre tu despacho y agenda la consulta. La asesoría legal siempre la dan tus abogados.",
        ),
      },
      {
        q: t("Is client information kept private?", "¿La información de los clientes se mantiene privada?"),
        a: t(
          "We handle it with care and review with you how it is stored and who has access. We cover this in the consultation.",
          "La manejamos con cuidado y revisamos contigo cómo se guarda y quién tiene acceso. Lo vemos en la consulta.",
        ),
      },
      faqTools,
      faqStart,
    ],
  },
  {
    slug: "online-store",
    name: t("Online Store", "Tienda en línea"),
    title: t("Answer every shopper and recover sales that would be lost", "Atiende a cada comprador y recupera ventas que se perderían"),
    subtitle: t(
      "An AI assistant for your online store: it answers product and shipping questions, tracks orders, follows up on abandoned carts and brings buyers back.",
      "Un asistente de IA para tu tienda en línea: responde dudas de productos y envíos, rastrea pedidos, da seguimiento a carritos abandonados y trae de vuelta a los compradores.",
    ),
    problemTitle: t("A shopper with an unanswered question rarely completes the purchase", "Un comprador con una duda sin respuesta rara vez termina la compra"),
    problemText: t(
      "Questions about sizes, stock or shipping come up right before paying. If the answer takes hours, the cart is abandoned.",
      "Las dudas de tallas, existencias o envíos surgen justo antes de pagar. Si la respuesta tarda horas, el carrito se abandona.",
    ),
    people: t("shoppers", "compradores"),
    lastStep: {
      t: t("It helps them buy and follows up", "Ayuda a comprar y da seguimiento"),
      d: t("It answers the last questions before paying, sends order updates and follows up after the purchase.", "Resuelve las últimas dudas antes de pagar, envía avisos del pedido y da seguimiento después de la compra."),
    },
    chatLine: t("Turns visitors into buyers.", "Convierte visitantes en compradores."),
    before: list([
      ["Product and size questions answered hours later", "Dudas de productos y tallas contestadas horas después"],
      ["\"Where is my order?\" messages handled by hand", "Mensajes de «¿dónde está mi pedido?» atendidos a mano"],
      ["Abandoned carts that nobody follows up", "Carritos abandonados a los que nadie da seguimiento"],
      ["Customers who buy once and never return", "Clientes que compran una vez y no regresan"],
      ["Returns and exchanges managed in chats", "Devoluciones y cambios manejados en chats"],
      ["Campaigns sent to everyone the same way", "Campañas enviadas a todos de la misma forma"],
    ]),
    after: list([
      ["Product and shipping questions answered instantly", "Dudas de productos y envíos respondidas al instante"],
      ["Order status sent automatically", "Estatus del pedido enviado automáticamente"],
      ["Abandoned cart reminders", "Recordatorios de carritos abandonados"],
      ["Follow-up that brings buyers back", "Seguimiento que trae de vuelta a los compradores"],
      ["Returns and exchanges guided step by step", "Devoluciones y cambios guiados paso a paso"],
      ["Campaigns based on customer behavior", "Campañas según el comportamiento del cliente"],
    ]),
    useCases: list([
      ["Product questions", "Dudas de productos"],
      ["Order tracking", "Rastreo de pedidos"],
      ["Abandoned cart reminders", "Recordatorios de carritos abandonados"],
      ["Shipping and returns information", "Información de envíos y devoluciones"],
      ["Post-purchase follow-up", "Seguimiento después de la compra"],
      ["Review requests", "Solicitud de reseñas"],
      ["Restock and promotion alerts", "Avisos de reabasto y promociones"],
      ["Email and message campaigns", "Campañas por correo y mensajes"],
      ["Handoff to your team for complex cases", "Traspaso a tu equipo en casos complejos"],
    ]),
    benefits: benefitSet({
      ask: t("questions about products, sizes, stock, shipping and returns", "dudas de productos, tallas, existencias, envíos y devoluciones"),
      who: t("shopper", "comprador"),
      history: t("what they looked at, bought and asked about", "lo que vio, compró y preguntó"),
      market: t("Email and message campaigns for abandoned carts, restocks and promotions, based on what each shopper likes.", "Campañas por correo y mensajes de carritos abandonados, reabastos y promociones, según lo que le gusta a cada comprador."),
    }),
    faqs: [
      faqPeople("on products, suppliers and growing the store", "en los productos, los proveedores y en hacer crecer la tienda"),
      {
        q: t("Can it check the status of an order?", "¿Puede consultar el estatus de un pedido?"),
        a: t(
          "Yes, when connected to your store platform. The customer asks and receives the status and tracking right away.",
          "Sí, al conectarse con la plataforma de tu tienda. El cliente pregunta y recibe de inmediato el estatus y la guía de rastreo.",
        ),
      },
      faqTools,
      faqStart,
    ],
  },
  {
    slug: "insurance",
    name: t("Insurance", "Seguros"),
    title: t("Respond to every quote request and keep clients protected", "Responde cada solicitud de cotización y mantén protegidos a tus clientes"),
    subtitle: t(
      "An AI assistant for your agency: it answers quote requests and questions, gathers the information, books the call with an advisor and reminds clients of renewals.",
      "Un asistente de IA para tu agencia: responde solicitudes de cotización y dudas, reúne la información, agenda la llamada con un asesor y recuerda las renovaciones a tus clientes.",
    ),
    problemTitle: t("Someone comparing quotes goes with the first agent who replies", "Quien compara cotizaciones se va con el primer agente que responde"),
    problemText: t(
      "People ask for several quotes at once. The one who answers first, with the right questions, usually keeps the client.",
      "La gente pide varias cotizaciones a la vez. El que responde primero, con las preguntas correctas, suele quedarse con el cliente.",
    ),
    people: t("clients", "clientes"),
    before: list([
      ["Quote requests waiting for a reply", "Solicitudes de cotización esperando respuesta"],
      ["The same data requested again and again", "Los mismos datos pedidos una y otra vez"],
      ["Renewals remembered at the last minute", "Renovaciones que se recuerdan al último minuto"],
      ["Claim questions handled by phone one by one", "Dudas de siniestros atendidas por teléfono una por una"],
      ["Leads from campaigns and referrals not followed up", "Prospectos de campañas y recomendaciones sin seguimiento"],
      ["Client records in scattered files", "Expedientes de clientes en archivos dispersos"],
    ]),
    after: list([
      ["Quote requests answered right away", "Solicitudes de cotización atendidas de inmediato"],
      ["Key information gathered automatically", "Datos clave reunidos automáticamente"],
      ["Renewal reminders sent on time", "Recordatorios de renovación a tiempo"],
      ["Common claim questions answered 24/7", "Dudas comunes de siniestros respondidas 24/7"],
      ["Every lead followed up until it decides", "Cada prospecto con seguimiento hasta que decide"],
      ["Every client and policy in one organized system", "Cada cliente y póliza en un solo sistema ordenado"],
    ]),
    useCases: list([
      ["Quote request intake", "Recepción de solicitudes de cotización"],
      ["Lead qualification", "Calificación de prospectos"],
      ["Advisor call scheduling", "Agenda de llamadas con el asesor"],
      ["Renewal reminders", "Recordatorios de renovación"],
      ["Payment reminders", "Recordatorios de pago"],
      ["Answers to common questions", "Respuestas a preguntas comunes"],
      ["Guidance on the claim process", "Guía del proceso de siniestros"],
      ["Follow-up on quotes sent", "Seguimiento de cotizaciones enviadas"],
      ["Cross-selling campaigns", "Campañas de venta cruzada"],
    ]),
    benefits: benefitSet({
      ask: t("questions about coverage, quotes, renewals and the claim process", "dudas de coberturas, cotizaciones, renovaciones y el proceso de siniestros"),
      who: t("client", "cliente"),
      history: t("policies, quotes sent and renewal dates", "pólizas, cotizaciones enviadas y fechas de renovación"),
      market: t("Email and message campaigns for renewals and for other coverage that fits each client.", "Campañas por correo y mensajes de renovaciones y de otros seguros que le convienen a cada cliente."),
    }),
    faqs: [
      {
        q: t("Does the AI sell the policies?", "¿La IA vende las pólizas?"),
        a: t(
          "No. It gathers the information, answers general questions and books the call. Your advisors recommend and close the policy.",
          "No. Reúne la información, responde dudas generales y agenda la llamada. Tus asesores recomiendan y cierran la póliza.",
        ),
      },
      faqPeople("advising clients and closing policies", "asesorando a los clientes y cerrando pólizas"),
      faqTools,
      faqStart,
    ],
  },
  {
    slug: "accounting",
    name: t("Accounting", "Contabilidad"),
    title: t("Collect documents on time and answer clients without the back and forth", "Recibe los documentos a tiempo y atiende a tus clientes sin ir y venir"),
    subtitle: t(
      "An AI assistant for your firm: it answers client questions, reminds them of deadlines and documents, books meetings and follows up on every request.",
      "Un asistente de IA para tu despacho: responde dudas de clientes, les recuerda fechas y documentos, agenda reuniones y da seguimiento a cada solicitud.",
    ),
    problemTitle: t("Chasing documents and repeating answers takes time you could bill", "Perseguir documentos y repetir respuestas consume tiempo que podrías facturar"),
    problemText: t(
      "Every deadline brings the same messages: what do I need to send, when is it due, did you receive it. An assistant can handle all of that.",
      "Cada fecha límite trae los mismos mensajes: qué debo mandar, cuándo vence, si ya lo recibieron. Un asistente puede encargarse de todo eso.",
    ),
    people: t("clients", "clientes"),
    before: list([
      ["Clients who send documents late or incomplete", "Clientes que envían documentos tarde o incompletos"],
      ["The same questions about deadlines and requirements", "Las mismas preguntas de fechas y requisitos"],
      ["Manual reminders for taxes and payments", "Recordatorios manuales de impuestos y pagos"],
      ["Meetings arranged by email chains", "Reuniones acordadas con cadenas de correos"],
      ["New client inquiries answered slowly", "Consultas de clientes nuevos contestadas con lentitud"],
      ["Client information scattered in emails and chats", "Información de clientes dispersa en correos y chats"],
    ]),
    after: list([
      ["Document requests and reminders sent automatically", "Solicitudes y recordatorios de documentos enviados solos"],
      ["Common questions answered instantly", "Preguntas comunes respondidas al instante"],
      ["Deadline and payment reminders on time", "Recordatorios de fechas y pagos a tiempo"],
      ["Meetings booked and confirmed", "Reuniones agendadas y confirmadas"],
      ["New inquiries answered and qualified", "Consultas nuevas atendidas y calificadas"],
      ["Every client and request in one organized system", "Cada cliente y solicitud en un solo sistema ordenado"],
    ]),
    useCases: list([
      ["Document request reminders", "Recordatorios para entregar documentos"],
      ["Tax deadline reminders", "Recordatorios de fechas fiscales"],
      ["Answers about requirements and fees", "Respuestas sobre requisitos y honorarios"],
      ["New client intake", "Recepción de clientes nuevos"],
      ["Meeting scheduling", "Agenda de reuniones"],
      ["Invoice and payment reminders", "Recordatorios de facturas y pagos"],
      ["Status updates on ongoing work", "Avisos del estatus de los trabajos"],
      ["Follow-up with prospects", "Seguimiento a prospectos"],
      ["Seasonal campaigns", "Campañas de temporada"],
    ]),
    benefits: benefitSet({
      ask: t("questions about requirements, deadlines, fees and what to send", "dudas de requisitos, fechas límite, honorarios y qué enviar"),
      who: t("client", "cliente"),
      history: t("documents received, pending items and deadlines", "documentos recibidos, pendientes y fechas límite"),
      market: t("Email and message campaigns with seasonal reminders (tax season, year-end close) and offers for new services.", "Campañas por correo y mensajes con recordatorios de temporada (declaraciones, cierres) y ofertas de nuevos servicios."),
    }),
    faqs: [
      {
        q: t("Does the AI give tax or accounting advice?", "¿La IA da asesoría fiscal o contable?"),
        a: t(
          "No. It handles requests, reminders and general information. The advice and the work are always done by your team.",
          "No. Se encarga de solicitudes, recordatorios e información general. La asesoría y el trabajo siempre los hace tu equipo.",
        ),
      },
      faqPeople("on the analysis and advice clients value most", "en el análisis y la asesoría que más valoran los clientes"),
      faqTools,
      faqStart,
    ],
  },
  {
    slug: "automotive",
    name: t("Automotive", "Automotriz"),
    title: t("Answer every car inquiry and fill your service bays", "Responde cada consulta de autos y llena tus bahías de servicio"),
    subtitle: t(
      "An AI assistant for your dealership or workshop: it answers questions about vehicles and services, books test drives and service appointments, and follows up.",
      "Un asistente de IA para tu agencia o taller: responde dudas de vehículos y servicios, agenda pruebas de manejo y citas de servicio, y da seguimiento.",
    ),
    problemTitle: t("A buyer who asks about a car and waits visits the next dealership", "Un comprador que pregunta por un auto y espera visita la siguiente agencia"),
    problemText: t(
      "Car shoppers ask at all hours and compare several dealerships. The one that answers fastest gets the test drive.",
      "Quien busca auto pregunta a todas horas y compara varias agencias. La que responde más rápido se queda con la prueba de manejo.",
    ),
    people: t("customers", "clientes"),
    before: list([
      ["Inquiries about vehicles answered late", "Consultas de vehículos contestadas tarde"],
      ["Test drives and service booked only by phone", "Pruebas de manejo y servicio agendados solo por teléfono"],
      ["Service reminders forgotten", "Recordatorios de servicio olvidados"],
      ["Customers who ask for a quote and never hear back", "Clientes que piden cotización y no reciben respuesta"],
      ["Leads from ads and listings not tracked", "Prospectos de anuncios y portales sin rastrear"],
      ["Customer and vehicle records scattered", "Datos de clientes y vehículos dispersos"],
    ]),
    after: list([
      ["Instant answers about each vehicle and service", "Respuestas inmediatas de cada vehículo y servicio"],
      ["Test drives and appointments booked 24/7", "Pruebas de manejo y citas agendadas 24/7"],
      ["Service reminders sent on time", "Recordatorios de servicio a tiempo"],
      ["Automatic follow-up on every quote", "Seguimiento automático de cada cotización"],
      ["You know which ads and listings bring buyers", "Sabes qué anuncios y portales traen compradores"],
      ["Every customer and vehicle in one system", "Cada cliente y vehículo en un solo sistema"],
    ]),
    useCases: list([
      ["Vehicle inquiry replies", "Respuesta a consultas de vehículos"],
      ["Test drive scheduling", "Agenda de pruebas de manejo"],
      ["Service appointment booking", "Agenda de citas de servicio"],
      ["Service and maintenance reminders", "Recordatorios de servicio y mantenimiento"],
      ["Quote follow-up", "Seguimiento de cotizaciones"],
      ["Recall and warranty notices", "Avisos de llamados a revisión y garantías"],
      ["Review requests", "Solicitud de reseñas"],
      ["Trade-in inquiries", "Consultas de auto a cuenta"],
      ["Promotion and seasonal campaigns", "Campañas de promociones y de temporada"],
    ]),
    benefits: benefitSet({
      ask: t("questions about vehicles, financing, services and available times", "dudas de vehículos, financiamiento, servicios y horarios disponibles"),
      who: t("customer", "cliente"),
      history: t("the vehicles they asked about, test drives, services and reminders", "los vehículos por los que preguntó, pruebas de manejo, servicios y recordatorios"),
      market: t("Email and message campaigns for promotions, service reminders and seasonal offers.", "Campañas por correo y mensajes de promociones, recordatorios de servicio y ofertas de temporada."),
    }),
    faqs: [
      faqPeople("with buyers and in the workshop", "con los compradores y en el taller"),
      {
        q: t("Can it book service appointments?", "¿Puede agendar citas de servicio?"),
        a: t(
          "Yes. It offers the open times, books the appointment and sends reminders, including the next maintenance based on the date or mileage.",
          "Sí. Ofrece los horarios libres, agenda la cita y envía recordatorios, incluido el siguiente mantenimiento según la fecha o los kilómetros.",
        ),
      },
      faqTools,
      faqStart,
    ],
  },

];

export function getSolution(slug: string): Solution | undefined {
  return SOLUTIONS.find((s) => s.slug === slug);
}
