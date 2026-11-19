// Cookie preferences of the visitor, saved in the browser. "Strictly necessary" cookies (language, cookie choices and the
// chat assistant) are always on and are not stored here; the only choice is the performance (analytics) category.
export type CookiePrefs = { performance: boolean };

const KEY = "eb-cookie-prefs";
const LEGACY_KEY = "eb-consent"; // the previous notice saved "accepted" or "declined"

export const PREFS_EVENT = "eb-cookie-prefs-change"; // fired after the preferences are saved
export const OPEN_EVENT = "eb-cookie-open"; // fired by the footer link to open the settings

// What the settings panel shows before the visitor has chosen: on. Nothing is loaded just because of this:
// analytics starts only after the visitor accepts or confirms.
export const DEFAULT_PREFS: CookiePrefs = { performance: true };

// The saved preferences, or null if the visitor has not chosen yet
export function readPrefs(): CookiePrefs | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const data = JSON.parse(raw);
      return { performance: data.performance === true };
    }
    const legacy = localStorage.getItem(LEGACY_KEY);
    if (legacy === "accepted") return { performance: true };
    if (legacy === "declined") return { performance: false };
  } catch {
    // Storage blocked: treated as "not chosen yet"
  }
  return null;
}

export function currentPrefs(): CookiePrefs {
  return readPrefs() ?? DEFAULT_PREFS;
}

export function savePrefs(prefs: CookiePrefs) {
  try {
    localStorage.setItem(KEY, JSON.stringify(prefs));
  } catch {
    // Storage blocked: the choice just lasts until the page is closed
  }
  window.dispatchEvent(new Event(PREFS_EVENT));
}

export function openCookieSettings() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}
