import {spring} from 'remotion';
import * as THREE from 'three';
import {FPS} from '../timing';

export const clamp01 = (v) => Math.min(1, Math.max(0, v));
export const lerp = (a, b, t) => a + (b - a) * t;
export const mix3 = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
export const add3 = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
export const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const easeOut = (t) => 1 - Math.pow(1 - t, 3);
export const easeIn = (t) => t * t * t;

// 0 before `a`, 1 after `b`
export const range = (frame, a, b) => clamp01((frame - a) / (b - a));

// Springs that start at frame `at`: pop overshoots a little, smooth does not
export const pop = (frame, at) => spring({frame: frame - at, fps: FPS, config: {damping: 13, stiffness: 160}});
export const smooth = (frame, at) => spring({frame: frame - at, fps: FPS, config: {damping: 200}});

export const mixColor = (a, b, t) => `#${new THREE.Color(a).lerp(new THREE.Color(b), clamp01(t)).getHexString()}`;

export const roundedRect = (w, h, r) => {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
};

// Rounded slab with soft edges. Its back sits at z = 0 and its front at z = d.
export const slabGeometry = (w, h, r, d) => {
  const bevel = Math.min(0.02, d / 3, r / 2);
  const geo = new THREE.ExtrudeGeometry(roundedRect(w - bevel * 2, h - bevel * 2, Math.max(0.001, r - bevel)), {
    depth: d - bevel * 2,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 3,
    curveSegments: 14,
  });
  geo.translate(0, 0, bevel);
  return geo;
};

// Flat rounded rectangle whose texture covers it edge to edge (used for the phone screen)
export const screenGeometry = (w, h, r) => {
  const geo = new THREE.ShapeGeometry(roundedRect(w, h, r), 14);
  const pos = geo.attributes.position;
  const uv = geo.attributes.uv;
  for (let i = 0; i < pos.count; i++) {
    uv.setXY(i, (pos.getX(i) + w / 2) / w, (pos.getY(i) + h / 2) / h);
  }
  return geo;
};
