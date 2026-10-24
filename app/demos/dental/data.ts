// Fictional content for the Riverdale Dental Care demo. Not a real business.

export const CLINIC_NAME = "Riverdale Dental Care";

export const CONTACT = {
  email: "hello@riverdaledental.example",
  phone: "555.010.0100",
  address: ["123 Example Street, Suite 100", "Sample City, ST 00000"],
};

export const HOURS = [
  { days: "Monday - Friday", time: "8am - 6pm" },
  { days: "Saturday", time: "9am - 4pm" },
];

// ---------- Booking flow (simulated, nothing is saved) ----------
export type ClinicId = "main" | "kids";

export const CLINICS: { id: ClinicId; name: string; tagline: string }[] = [
  { id: "main", name: "Riverdale Dental Care", tagline: "Cosmetic | General" },
  { id: "kids", name: "Riverdale Kids", tagline: "Pediatric dentistry" },
];

export const SERVICES_BY_CLINIC: Record<ClinicId, string[]> = {
  main: ["Exam & Cleaning", "Cosmetic Consultation", "Clear Aligners Consultation", "Teeth Whitening", "Tooth Pain / Emergency"],
  kids: ["First Visit", "Kids Exam & Cleaning", "Cavity Check", "Sealants"],
};

export const DOCTORS_BY_CLINIC: Record<ClinicId, string[]> = {
  main: ["First available", "Dr. Alex Morgan", "Dr. Sam Rivera", "Dr. Casey Parker"],
  kids: ["First available", "Dr. Jordan Lee"],
};

export const WEEKDAY_SLOTS = ["8:00 AM", "9:00 AM", "10:30 AM", "12:00 PM", "1:30 PM", "3:00 PM", "4:30 PM", "5:30 PM"];
export const SATURDAY_SLOTS = ["9:00 AM", "10:00 AM", "11:30 AM", "1:00 PM", "2:30 PM", "3:30 PM"];

// Services menu: hovering a row swaps the photo on the right
export const SERVICE_MENU = [
  {
    name: "Exams & Cleanings",
    text: "Keep your smile healthy with preventive care and a gentle, thorough cleaning.",
    icon: "exam",
    photo: "/images/dental/menu-cosmetic.webp",
    labeled: false, // photos without a correct label get one from the page...
    cover: true, // ...and this photo has another service's label baked in, so the page label must cover it
    alt: "A dentist pointing at a scan of a patient's teeth on a monitor",
  },
  {
    name: "Cosmetic Dentistry",
    text: "Enhance your smile with natural, beautiful results.",
    icon: "cosmetic",
    photo: "/images/dental/menu-cosmetic-smile.webp",
    labeled: false,
    cover: false,
    alt: "A close-up of a bright, healthy smile during a dental check",
  },
  {
    name: "Riverdale Kids",
    text: "Gentle, fun care for healthy smiles at every age.",
    icon: "kids",
    photo: "/images/dental/menu-kids.webp",
    labeled: true,
    cover: false,
    alt: "A smiling child in the dental chair with a dentist and a plush monkey",
  },
  {
    name: "Clear Aligners",
    text: "A straighter smile, more confidence — without the brackets.",
    icon: "aligners",
    photo: "/images/dental/menu-aligners.webp",
    labeled: true,
    cover: false,
    alt: "A dentist holding a clear aligner next to a 3D scan of teeth",
  },
];

// Sample reviews (fictional)
export const REVIEWS = [
  { quote: "I used to dread the dentist. Here they explained everything and I never felt rushed.", name: "Maria S." },
  { quote: "The booking was quick, the team was kind, and my kids actually asked to come back.", name: "Daniel R." },
  { quote: "Honest advice, no pressure and a cleaning that was genuinely gentle.", name: "Priya K." },
];

export const MENU = [
  { heading: "Services", links: ["Cosmetic Dentistry", "General Dentistry", "Pediatric Dentistry", "Clear Aligners"] },
  { heading: "About", links: ["Meet the Team", "Smile Gallery", "Comfort & Sedation", "Technology"] },
  { heading: "Patient Resources", links: ["Patient Portal", "New Patients & Forms", "Emergency", "Join Our Team"] },
];

// Team photos (public/images/dental): 1 woman in dark scrubs, 2 man in navy scrubs (pediatric office),
// 3 woman in white coat, 4 man in white coat.
export const PHOTOS = {
  scrubsWoman: "/images/dental/doctor-1.webp",
  pediatricMan: "/images/dental/doctor-2.webp",
  coatWoman: "/images/dental/doctor-3.webp",
  coatMan: "/images/dental/doctor-4.webp",
};

// Photos for the four portrait cards (landscape photos, cropped to each card around its focal point)
export const PORTRAIT_CARDS = [
  { label: "Schedule My Cleaning", photo: "/images/dental/scene-cleaning.webp", pos: "50% 40%", alt: "A hygienist cleaning a smiling patient's teeth", tone: "#cfd8dc" },
  { label: "About Riverdale", photo: "/images/dental/scene-welcome.webp", pos: "38% 40%", alt: "A dentist welcoming a patient in a bright reception area", tone: "#d7d3cd" },
  { label: "Fix Tooth Pain", photo: "/images/dental/scene-exam.webp", pos: "42% 40%", alt: "A dentist examining a patient with an x-ray on screen", tone: "#cdd5da" },
  { label: "Meet Our Team", photo: "/images/dental/scene-team.webp", pos: "50% 35%", alt: "Four dental team members looking at a tablet together", tone: "#d6d9d3" },
];

export const SLIDES = [
  { photo: "/images/dental/scene-team.webp", pos: "50% 35%", alt: "The dental team smiling around a tablet", tone: "#d7e3e6", caption: "Friendly faces from the moment you walk in." },
  { photo: "/images/dental/scene-welcome.webp", pos: "38% 40%", alt: "A dentist explaining a plan to a patient", tone: "#dfe3d8", caption: "Clear explanations, no surprises." },
  { photo: "/images/dental/scene-exam.webp", pos: "42% 40%", alt: "A dentist checking in with a patient", tone: "#e3dde0", caption: "Care that fits around your schedule." },
];

export const TEAM = [
  { name: "Dr. Alex Morgan", role: "Founder · General & Cosmetic Dentist", photo: PHOTOS.coatWoman },
  { name: "Dr. Sam Rivera", role: "General Dentist", photo: PHOTOS.coatMan },
  { name: "Dr. Jordan Lee", role: "Pediatric Dentist", photo: PHOTOS.pediatricMan },
  { name: "Dr. Casey Parker", role: "Periodontist", photo: PHOTOS.scrubsWoman },
];
