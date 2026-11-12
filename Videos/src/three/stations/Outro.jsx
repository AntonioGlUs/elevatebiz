import React from 'react';
import {spring} from 'remotion';
import {C} from '../../theme';
import {FPS} from '../../timing';
import {LogoTile} from './LogoTile';

// Scene 8 · The logo spins in on a glossy tile
export const Outro = ({t, logo}) => {
  const enter = spring({frame: t - 4, fps: FPS, config: {damping: 16, stiffness: 60}});
  const s = t / FPS;

  return (
    <group position={[0, 3.3 + Math.sin(s * 1.4) * 0.06, 0]}>
      <group scale={Math.max(enter, 0.001)} rotation={[0, (1 - enter) * -7 + Math.sin(s * 0.8) * 0.22, 0]}>
        <LogoTile logo={logo} size={2} />
      </group>
      <pointLight color={C.teal} intensity={14} distance={12} decay={2} position={[0, 0.5, 3]} />
    </group>
  );
};
