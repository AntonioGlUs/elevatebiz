import {S} from './script';

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

// Seconds to frames
export const f = (seconds) => Math.round(seconds * FPS);

export const TOTAL = f(S.cuts[S.cuts.length - 1]);

// Every scene starts on a pause of the voice-over
export const SCENES = S.cuts.slice(0, -1).map((start, i) => ({
  from: f(start),
  duration: f(S.cuts[i + 1]) - f(start),
}));

export const sceneAt = (frame) => {
  const i = SCENES.findIndex((s) => frame < s.from + s.duration);
  return i < 0 ? SCENES.length - 1 : i;
};

// Camera changes inside a scene (frames from the start of that scene). The picture cuts to a new angle there.
// In scene 4 the angle changes on "the day you rest", which falls at a different moment in each language.
export const INNER_CUTS = [[64], [72], [58], [f(S.scenes[3].lines[1].at) - 1], [], [66], [66], [], []];

// Every frame where the picture cuts: scene starts plus the changes of angle inside them
export const ALL_CUTS = SCENES.flatMap((s, i) => [s.from, ...INNER_CUTS[i].map((c) => s.from + c)]).filter((c) => c > 0);
