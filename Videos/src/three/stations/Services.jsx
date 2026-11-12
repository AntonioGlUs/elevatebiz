import React from 'react';
import {spring} from 'remotion';
import {T} from '../../locale';
import {C} from '../../theme';
import {FPS, f} from '../../timing';
import {pop} from '../helpers';
import {ICONS, IconPlane, Label, Slab} from '../Primitives';

// Scene 7 · Three cards fly in from the distance and line up in an arc
const ITEMS = [
  {label: T.services[0], icon: ICONS.chat, at: T.cue.s7Cards[0]},
  {label: T.services[1], icon: ICONS.calendar, at: T.cue.s7Cards[1]},
  {label: T.services[2], icon: ICONS.followUp, at: T.cue.s7Cards[2]},
];

export const Services = ({t}) => (
  <group>
    <pointLight color={C.teal} intensity={12} distance={14} decay={2} position={[0, 3.5, 4.5]} />
    {ITEMS.map((item, i) => {
      const cue = f(item.at);
      const fly = spring({frame: t - cue, fps: FPS, config: {damping: 15, stiffness: 80}});
      const done = pop(t, cue + 14);
      const side = i - 1;
      return (
        <group
          key={item.label}
          position={[side * 3.3, 2.5 + (1 - fly) * 3 + Math.sin((t + i * 30) / 28) * 0.05, Math.abs(side) * 0.7 - (1 - fly) * 14]}
          rotation={[(1 - fly) * -1.4, -side * 0.32, 0]}
        >
          <Slab w={2.9} h={3.4} r={0.22} d={0.14} position={[0, 0, -0.07]}>
            <Slab w={0.95} h={0.95} r={0.22} d={0.05} color="#0f3a4a" position={[-0.72, 0.9, 0]}>
              <IconPlane paths={item.icon} size={0.62} />
            </Slab>
            <Label text={item.label} font="serif" weight={400} size={0.46} anchor="left" maxWidth={2.3} lineHeight={1.05} position={[-1.2, -0.6, 0]} />
            <group position={[1.02, 1.28, 0.06]} scale={Math.max(done, 0.001)} rotation={[0, (1 - Math.min(done, 1)) * 6, 0]}>
              <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
                <cylinderGeometry args={[0.27, 0.27, 0.08, 40]} />
                <meshStandardMaterial color={C.teal} emissive={C.teal} emissiveIntensity={0.25} />
              </mesh>
              <IconPlane paths={ICONS.check} box={24} stroke={3.2} size={0.34} color={C.bg} position={[0, 0, 0.05]} />
            </group>
          </Slab>
        </group>
      );
    })}
  </group>
);
