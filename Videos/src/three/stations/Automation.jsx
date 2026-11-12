import React from 'react';
import {T} from '../../locale';
import {C} from '../../theme';
import {f} from '../../timing';
import {lerp, pop, range, smooth} from '../helpers';
import {Billboard, ICONS, IconPlane, Label, Slab, Tag} from '../Primitives';

// Scene 2 · A task board ticks itself off, then a 3D bar chart reveals one opportunity
const TASKS = T.tasks;
const BARS = [0.35, 0.5, 0.42, 0.62, 0.96, 0.55, 0.7];
const BEST = 4;
const BAR_X = (i) => (i - 3) * 0.66;
const BAR_H = (i) => BARS[i] * 2.9;

export const Automation = ({t}) => {
  const swap = f(T.cue.s2Swap); // the voice moves on to the opportunities
  const highlight = f(T.cue.s2Highlight); // the word "opportunities"
  const boardIn = smooth(t, 0);
  const hl = range(t, highlight, highlight + 10);
  const scan = range(t, swap + 12, highlight);
  const tag = pop(t, highlight + 4);

  return (
    <group>
      {/* Task board */}
      <group position={[-3.2, (1 - boardIn) * -1.5, 0.2]} rotation={[-0.06, 0.28, 0]}>
        <Slab w={3.6} h={3.9} r={0.2} d={0.14} position={[0, 2.25, 0]}>
          <Label text={T.tasksTitle} size={0.13} weight={600} color={C.teal} anchor="left" position={[-1.45, 1.5, 0]} />
          {TASKS.map((task, i) => {
            const done = smooth(t, 12 + i * 11);
            return (
              <group key={task} position={[0, 0.85 - i * 0.72, 0]}>
                <Slab w={0.42} h={0.42} r={0.1} d={0.04} color="#0d2740" position={[-1.24, 0, 0]} />
                <group position={[-1.24, 0, 0.02]} scale={Math.max(done, 0.001)}>
                  <Slab w={0.42} h={0.42} r={0.1} d={0.06} color={C.teal} emissive={C.teal} emissiveIntensity={0.2}>
                    <IconPlane paths={ICONS.check} box={24} stroke={3.2} size={0.34} color={C.bg} />
                  </Slab>
                </group>
                <Label text={task} size={0.24} anchor="left" opacity={1 - done * 0.45} position={[-0.9, 0, 0]} />
              </group>
            );
          })}
        </Slab>
      </group>

      {/* Bar chart */}
      <group position={[3.2, 0, 0]}>
        <mesh position={[0, 0.08, 0]} castShadow receiveShadow>
          <boxGeometry args={[5.1, 0.16, 1.9]} />
          <meshStandardMaterial color={C.card} roughness={0.5} metalness={0.2} />
        </mesh>
        {BARS.map((_, i) => {
          const grow = Math.max(smooth(t, swap + 5 + i * 3), 0.001);
          const best = i === BEST;
          const h = BAR_H(i);
          return (
            <mesh key={i} position={[BAR_X(i), 0.16 + (h * grow) / 2, 0]} scale={[1, grow, 1]} castShadow>
              <boxGeometry args={[0.46, h, 0.46]} />
              <meshStandardMaterial
                color={best ? C.tealInk : C.muted}
                emissive={best ? C.tealInk : '#000000'}
                emissiveIntensity={best ? hl * 0.18 : 0}
                roughness={0.4}
                metalness={0.2}
              />
            </mesh>
          );
        })}
        <pointLight
          color={C.teal}
          intensity={hl * 4}
          distance={6}
          decay={2}
          position={[BAR_X(BEST), BAR_H(BEST) + 0.6, 0.9]}
        />
        {/* Scan: the data is read in seconds */}
        {scan > 0 && scan < 1 && (
          <mesh position={[lerp(-2.4, 2.4, scan), 1.76, 0]}>
            <boxGeometry args={[0.04, 3.2, 1.9]} />
            <meshStandardMaterial color={C.teal} emissive={C.teal} emissiveIntensity={0.8} transparent opacity={0.45} />
          </mesh>
        )}
        <Billboard position={[BAR_X(BEST), 0.16 + BAR_H(BEST) + 0.6, 0]} scale={Math.max(tag, 0.001)}>
          <Tag text={T.opportunity} w={1.8} color={C.warm} textColor={C.warm} />
        </Billboard>
      </group>
    </group>
  );
};
