import {T} from './locale';

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

// Seconds to frames
export const f = (seconds) => Math.round(seconds * FPS);

// Scene cuts in seconds, measured from the pauses in the voice-over of the current language (see locale.js)
const CUTS = T.cuts;

export const TOTAL = f(CUTS[CUTS.length - 1]);

export const SCENES = CUTS.slice(0, -1).map((start, i) => ({
  from: f(start),
  duration: f(CUTS[i + 1]) - f(start),
}));
