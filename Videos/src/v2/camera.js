import * as THREE from 'three';
import {add3, easeInOut, easeOut, lerp, mix3, range} from '../three/helpers';
import {INNER_CUTS, SCENES, sceneAt} from './timing';

// Where each set piece stands in the 3D world. The picture cuts from one to the next, so they are simply far apart.
export const ST = {
  phone: [0, 0, 0],
  competitor: [9.5, 0, -10.5], // a little behind the phone: where the lost sale goes
  data: [40, 0, 0],
  owner: [80, 0, 0],
  brand: [120, 0, 0],
  reply: [160, 0, 0],
  process: [200, 0, 0],
  running: [250, 0, 0],
  outro: [290, 0, 0],
};
const WINDOW_X = 16; // the software window of scene 7 stands this far to the right of the pipeline

const orbit = (st, angle, radius, height) => add3(st, [Math.sin(angle) * radius, height, Math.cos(angle) * radius]);

// One function per scene. p goes 0 to 1 over the scene, t is the frame inside the scene, d its length in frames.
// Each returns the camera position, the point it looks at, its roll (radians) and the lens (field of view).
const SHOTS = [
  // 1 · Close on the phone as the message lands, then a high wide shot: one phone, alone
  (p, t, d) => {
    const cut = INNER_CUTS[0][0];
    if (t < cut) {
      const k = easeOut(t / cut);
      return {pos: add3(ST.phone, mix3([-4.0, 2.7, 6.6], [-2.7, 3.2, 5.6], k)), look: add3(ST.phone, [0.15, 3.45, 0]), roll: 0.035, fov: 30};
    }
    const k = easeOut(range(t, cut, d));
    return {pos: add3(ST.phone, mix3([4.6, 8.2, 13.0], [2.8, 6.0, 10.4], k)), look: add3(ST.phone, [0.6, 3.1, 0]), roll: 0, fov: 32};
  },
  // 2 · Slow tilted orbit while the wait runs away, then a low angle as the sale leaves for the competitor
  (p, t, d) => {
    const cut = INNER_CUTS[1][0];
    if (t < cut) {
      const k = easeInOut(t / cut);
      return {pos: orbit(ST.phone, lerp(-0.62, 0.5, k), 6.4, lerp(2.8, 3.4, k)), look: add3(ST.phone, [0, 3.15, 0]), roll: lerp(-0.02, -0.13, k), fov: 30, shake: 0.5 + k};
    }
    const k = easeOut(range(t, cut, d));
    return {pos: add3(ST.phone, mix3([-2.4, 1.3, 7.2], [-3.3, 1.9, 8.8], k)), look: add3(ST.competitor, [0, 3.3, 0]), roll: 0.045, fov: 40, shake: 0.6};
  },
  // 3 · High angle sliding over the table, then a low angle where the pile of paperwork towers in front
  (p, t, d) => {
    const cut = INNER_CUTS[2][0];
    if (t < cut) {
      const k = easeOut(t / cut);
      return {pos: add3(ST.data, mix3([-4.4, 6.6, 8.2], [-1.6, 6.0, 7.2], k)), look: add3(ST.data, [0.4, 2.7, 0]), roll: -0.03, fov: 32};
    }
    const k = easeOut(range(t, cut, d));
    return {pos: add3(ST.data, mix3([8.0, 0.8, 5.6], [7.2, 1.7, 6.4], k)), look: add3(ST.data, [2.6, 2.3, 0.4]), roll: 0.04, fov: 36, shake: 0.4};
  },
  // 4 · Orbit around the owner and the areas, then straight down from above as everything stops
  (p, t, d) => {
    const cut = INNER_CUTS[3][0];
    if (t < cut) {
      const k = easeInOut(t / cut);
      return {pos: orbit(ST.owner, lerp(-0.6, 0.25, k), 10.5, 3.3), look: add3(ST.owner, [0, 2.6, 0]), roll: 0, fov: 34};
    }
    const k = easeOut(range(t, cut, d));
    return {pos: add3(ST.owner, mix3([1.2, 12.5, 8.6], [0.6, 10.2, 7.0], k)), look: add3(ST.owner, [0, 2.4, 0]), roll: lerp(0.07, 0, k), fov: 34, shake: 0.3};
  },
  // 5 · One slow, straight push toward the logo
  (p) => {
    const k = easeInOut(p);
    return {pos: add3(ST.brand, mix3([-0.9, 2.9, 11.2], [0.3, 3.0, 9.0], k)), look: add3(ST.brand, [0, 2.75, 0]), roll: 0, fov: 30};
  },
  // 6 · Close on the reply, then wide: three phones, the sun and the moon
  (p, t, d) => {
    const cut = INNER_CUTS[5][0];
    if (t < cut) {
      const k = easeOut(t / cut);
      return {pos: add3(ST.reply, mix3([3.6, 2.9, 6.4], [2.2, 3.2, 5.6], k)), look: add3(ST.reply, [0.4, 3.2, 0]), roll: -0.03, fov: 30};
    }
    const k = easeOut(range(t, cut, d));
    return {pos: add3(ST.reply, mix3([-1.6, 3.0, 13.5], [0.4, 3.6, 12.0], k)), look: add3(ST.reply, [0, 3.3, 0]), roll: 0, fov: 36};
  },
  // 7 · Travel along the pipeline, then push in on the software window as it assembles
  (p, t, d) => {
    const cut = INNER_CUTS[6][0];
    if (t < cut) {
      const k = easeInOut(t / cut);
      return {pos: add3(ST.process, mix3([-6.5, 2.7, 8.6], [3.4, 3.1, 8.0], k)), look: add3(ST.process, mix3([-2.4, 2.3, 0], [2.6, 2.3, 0], k)), roll: 0, fov: 34};
    }
    const k = easeOut(range(t, cut, d));
    return {pos: add3(ST.process, mix3([WINDOW_X - 4.2, 3.9, 10.6], [WINDOW_X + 1.0, 3.3, 8.4], k)), look: add3(ST.process, [WINDOW_X, 3.1, 0]), roll: lerp(-0.04, 0, k), fov: 32};
  },
  // 8 · Wide, calm orbit: the business runs by itself
  (p) => {
    const k = easeInOut(p);
    return {pos: orbit(ST.running, lerp(0.55, -0.3, k), lerp(12.5, 11, k), lerp(4.6, 3.6, k)), look: add3(ST.running, [0.6, 2.9, 0]), roll: 0, fov: 34};
  },
  // 9 · One slow pull back from the logo
  (p) => {
    const k = easeInOut(p);
    return {pos: add3(ST.outro, mix3([0.5, 3.9, 8.4], [0, 3.5, 10.8], k)), look: add3(ST.outro, [0, 3.7, 0]), roll: 0, fov: 30};
  },
];

// Scenes that are not built yet hold a neutral wide shot
const FALLBACK = () => ({pos: add3(ST.phone, [0, 4, 14]), look: add3(ST.phone, [0, 2.6, 0]), roll: 0, fov: 34});

export const getPose = (frame) => {
  const i = sceneAt(frame);
  const {from, duration} = SCENES[i];
  const t = frame - from;
  const pose = (SHOTS[i] ?? FALLBACK)(t / duration, t, duration);
  // Hand-held tremor for the tense shots: small, slow and never the same on two axes
  const s = (pose.shake ?? 0) * 0.008;
  if (s) {
    pose.pos = add3(pose.pos, [Math.sin(frame * 0.47) * s, Math.sin(frame * 0.61 + 1.3) * s, Math.sin(frame * 0.39 + 2.1) * s]);
  }
  return pose;
};

export const applyPose = (camera, pose) => {
  camera.position.set(...pose.pos);
  camera.up.set(0, 1, 0);
  camera.lookAt(...pose.look);
  camera.rotateZ(pose.roll * 0.5); // tilts kept gentle
  if (camera.fov !== pose.fov) {
    camera.fov = pose.fov;
    camera.updateProjectionMatrix();
  }
};

const probe = new THREE.PerspectiveCamera();

// Orientation of the camera, so labels can face it
export const poseQuaternion = (pose) => {
  applyPose(probe, pose);
  return probe.quaternion.clone();
};
