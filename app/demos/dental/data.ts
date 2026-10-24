// Fictional content for the Dental Clinic demo. Not a real business.

export const CLINIC_NAME = "Dental Clinic";

export const CONTACT = {
  email: "hello@dentalclinic.example",
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
  { id: "main", name: "Dental Clinic", tagline: "Cosmetic | General" },
  { id: "kids", name: "Dental Clinic Kids", tagline: "Pediatric dentistry" },
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

export const SERVICES = [
  "Exams & Cleanings",
  "Cosmetic Dentistry",
  "Dental Clinic Kids",
  "Clear Aligners",
];

export const MENU = [
  { heading: "Services", links: ["Cosmetic Dentistry", "General Dentistry", "Pediatric Dentistry", "Clear Aligners"] },
  { heading: "About", links: ["Meet the Team", "Smile Gallery", "Comfort & Sedation", "Technology"] },
  { heading: "Patient Resources", links: ["Patient Portal", "New Patients & Forms", "Emergency", "Join Our Team"] },
];

export const PORTRAIT_CARDS = [
  { label: "Schedule My Cleaning", skin: "#e8b99a", hair: "#2b1d16", tone: "#cfd8dc" },
  { label: "About Dental Clinic", skin: "#8d5a3c", hair: "#1c1410", tone: "#d7d3cd" },
  { label: "Fix Tooth Pain", skin: "#f0c8a8", hair: "#17120f", tone: "#cdd5da" },
  { label: "Meet Our Team", skin: "#f3d2b8", hair: "#6b3f24", tone: "#d6d9d3" },
];

export const SLIDES = [
  { skin: "#8d5a3c", hair: "#3a2214", tone: "#d7e3e6", caption: "Friendly faces from the moment you walk in." },
  { skin: "#e8b99a", hair: "#2b1d16", tone: "#dfe3d8", caption: "Clear explanations, no surprises." },
  { skin: "#f3d2b8", hair: "#6b3f24", tone: "#e3dde0", caption: "Care that fits around your schedule." },
];

export const TEAM = [
  { name: "Dr. Alex Morgan", role: "Founder · General & Cosmetic Dentist", skin: "#e8b99a", hair: "#2b1d16" },
  { name: "Dr. Sam Rivera", role: "General Dentist", skin: "#8d5a3c", hair: "#1c1410" },
  { name: "Dr. Jordan Lee", role: "Pediatric Dentist", skin: "#f0c8a8", hair: "#17120f" },
  { name: "Dr. Casey Parker", role: "Periodontist", skin: "#f3d2b8", hair: "#6b3f24" },
];
