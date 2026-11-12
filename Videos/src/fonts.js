import {useEffect, useState} from 'react';
import {continueRender, delayRender} from 'remotion';

// Same Google Fonts as the website. Rendering waits until they are ready.
const FONTS_URL =
  'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600&family=Inter:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap';

const FACES = [
  '400 40px "Instrument Serif"',
  'italic 400 40px "Instrument Serif"',
  '400 40px "Inter"',
  '500 40px "Inter"',
  '600 40px "Inter"',
  '700 40px "Inter"',
  '600 40px "Fraunces"',
];

let promise = null;

export const loadFonts = () => {
  if (promise) return promise;
  if (typeof document === 'undefined') {
    promise = Promise.resolve();
    return promise;
  }

  const handle = delayRender('Loading fonts');
  promise = new Promise((resolve) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = FONTS_URL;
    link.onload = () => {
      Promise.all(FACES.map((face) => document.fonts.load(face))).then(resolve, resolve);
    };
    link.onerror = resolve;
    document.head.appendChild(link);
  }).then(() => continueRender(handle));
  return promise;
};

// True once the fonts can be drawn into the 3D text textures
export const useFontsReady = () => {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let alive = true;
    const handle = delayRender('Fonts for 3D labels');
    loadFonts().then(() => {
      if (alive) setReady(true);
      // Give the 3D scene a moment to redraw its text before the frame is captured
      setTimeout(() => continueRender(handle), 120);
    });
    return () => {
      alive = false;
    };
  }, []);
  return ready;
};
