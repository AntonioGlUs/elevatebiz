import * as THREE from 'three';
import {SCENES} from '../timing';
import {add3, clamp01, easeInOut, easeOut, lerp, mix3, range} from './helpers';

// Where each set piece stands in the 3D world. The camera travels from one to the next.
export const ST = {
  network: [0, 0, 0],
  automation: [18, 0, -4],
  robot: [36, 0, 2],
  chat: [54, 0, -2],
  services: [72, 0, 3],
  outro: [90, 0, 0],
};

// Horizontal shift of the picture in pixels: negative moves the subject to the right,
// leaving the left side free for the caption
const SIDE = -330;

// One camera move per scene. p goes 0 to 1 over the scene, t is the local frame, d its duration.
const SHOTS = [
  // 1 · Orbit down around the AI network
  (p) => ({
    pos: add3(ST.network, mix3([7.5, 6.6, 12.5], [-2.2, 4.4, 11.8], easeOut(p))),
    look: add3(ST.network, [0, 1.3, 0]),
    roll: 0,
    off: SIDE,
  }),
  // 2 · Task board first, then swing across to the bar chart
  (p, t, d) => {
    const m = easeInOut(range(t, 58, 88));
    const q = easeOut(range(t, 69, d));
    return {
      pos: add3(ST.automation, mix3([-1.0, 2.7, 7.6], mix3([1.0, 3.8, 9.8], [4.8, 2.9, 9.2], q), m)),
      look: add3(ST.automation, mix3([-3.2, 2.2, 0], [3.2, 1.9, 0], m)),
      roll: 0,
      off: SIDE,
    };
  },
  // 3 · Low hero angle that circles the logo
  (p) => ({
    pos: add3(ST.robot, mix3([-4.6, 1.1, 7.8], [1.8, 2.1, 8.4], easeOut(p))),
    look: add3(ST.robot, [0, 2.2, 0]),
    roll: 0,
    off: SIDE,
  }),
  // 4 · Slow push toward the phone
  (p) => ({
    pos: add3(ST.chat, mix3([-3.8, 3.5, 11.8], [-2.2, 3.1, 10.6], easeOut(p))),
    look: add3(ST.chat, [0.2, 2.9, 0]),
    roll: 0,
    off: SIDE,
  }),
  // 5 · Closer and tilted: tension while the customer waits
  (p) => ({
    pos: add3(ST.chat, mix3([-2.2, 3.1, 10.6], [1.7, 2.6, 10.0], easeInOut(p))),
    look: add3(ST.chat, [0, 3.0, 0]),
    roll: -0.1 * easeInOut(p),
    off: SIDE,
  }),
  // 6 · Level again and a little wider for the reply
  (p) => ({
    pos: add3(ST.chat, mix3([2.8, 3.5, 11.6], [0.8, 3.0, 10.6], easeOut(p))),
    look: add3(ST.chat, [-0.2, 2.85, 0]),
    roll: 0,
    off: SIDE,
  }),
  // 7 · Travel along the three cards, then pull back
  (p) => {
    const k = easeInOut(p);
    return {
      pos: add3(ST.services, mix3([-5.0, 2.4, 8.2], [0, 3.1, 11.2], k)),
      look: add3(ST.services, mix3([-1, 2.2, 0], [0, 1.7, 0], k)),
      roll: 0,
      off: 0,
    };
  },
  // 8 · Start close under the logo and pull back
  (p) => {
    const k = easeOut(p);
    return {
      pos: add3(ST.outro, mix3([1.6, 1.4, 5.0], [0, 2.4, 9.6], k)),
      look: add3(ST.outro, mix3([0, 3.0, 0], [0, 2.1, 0], k)),
      roll: 0,
      off: 0,
    };
  },
];

// The move between scenes starts a little before the cut and lands a little after it
const PRE = 10;
const POST = 16;

const blend = (a, b, k) => ({
  pos: mix3(a.pos, b.pos, k),
  look: mix3(a.look, b.look, k),
  roll: lerp(a.roll, b.roll, k),
  off: lerp(a.off, b.off, k),
});

export const sceneAt = (frame) => {
  const i = SCENES.findIndex((s) => frame < s.from + s.duration);
  return i < 0 ? SCENES.length - 1 : i;
};

export const getPose = (frame) => {
  const i = sceneAt(frame);
  const {from, duration} = SCENES[i];
  const t = frame - from;
  const pose = SHOTS[i](clamp01(t / duration), t, duration);

  if (i > 0 && t < POST) {
    const prev = SCENES[i - 1].duration;
    return blend(SHOTS[i - 1](1, prev, prev), pose, easeInOut((t + PRE) / (PRE + POST)));
  }
  if (i < SCENES.length - 1 && t >= duration - PRE) {
    const next = SHOTS[i + 1](0, 0, SCENES[i + 1].duration);
    return blend(pose, next, easeInOut((t - (duration - PRE)) / (PRE + POST)));
  }
  return pose;
};

const probe = new THREE.PerspectiveCamera();

export const applyPose = (camera, pose) => {
  camera.position.set(...pose.pos);
  camera.up.set(0, 1, 0);
  camera.lookAt(...pose.look);
  camera.rotateZ(pose.roll);
};

// Orientation of the camera, so labels can face it
export const poseQuaternion = (pose) => {
  applyPose(probe, pose);
  return probe.quaternion.clone();
};
