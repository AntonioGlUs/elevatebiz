import React from 'react';
import {T} from '../../locale';
import {C} from '../../theme';
import {mix3, pop, range, smooth} from '../helpers';
import {Beam, Billboard, Label} from '../Primitives';

// Scene 1 · A glowing AI core connects to the businesses standing around it
const CORE = [0, 2.3, 0];
const BUILDINGS = Array.from({length: 8}, (_, i) => {
  const angle = (i / 8) * Math.PI * 2 + 0.3;
  const radius = i % 2 ? 2.6 : 3.6;
  return {x: Math.cos(angle) * radius, z: Math.sin(angle) * radius, h: 0.9 + ((i * 37) % 5) * 0.24};
});

export const Network = ({t}) => {
  const core = pop(t, 4);

  return (
    <group>
      <group position={CORE} scale={Math.max(core, 0.001)}>
        <mesh castShadow>
          <sphereGeometry args={[0.6, 48, 32]} />
          <meshStandardMaterial color={C.tealInk} emissive={C.tealInk} emissiveIntensity={0.12} roughness={0.3} />
        </mesh>
        <mesh rotation={[t * 0.03, t * 0.02, 0]}>
          <torusGeometry args={[1.0, 0.022, 12, 96]} />
          <meshStandardMaterial color={C.teal} emissive={C.teal} emissiveIntensity={0.6} />
        </mesh>
        <mesh rotation={[1.2 - t * 0.025, 0, t * 0.03]}>
          <torusGeometry args={[1.28, 0.016, 12, 96]} />
          <meshStandardMaterial color={C.teal} emissive={C.teal} emissiveIntensity={0.45} />
        </mesh>
        <pointLight color={C.teal} intensity={6} distance={12} decay={2} />
      </group>
      <Billboard position={CORE} scale={Math.max(core, 0.001)}>
        <Label text={T.ai} size={0.5} weight={700} color="#ffffff" position={[0, 0, 0.64]} />
      </Billboard>

      {BUILDINGS.map((b, i) => {
        const rise = smooth(t, 2 + i * 3);
        const grow = range(t, 18 + i * 6, 44 + i * 6);
        const lit = range(t, 44 + i * 6, 54 + i * 6);
        const top = [b.x, b.h + 0.07, b.z];
        const travel = (((t - i * 7) % 44) + 44) % 44 / 44;
        const floors = Math.floor((b.h - 0.3) / 0.36);
        return (
          <group key={i}>
            <group position={[b.x, 0, b.z]} scale={[1, Math.max(rise, 0.001), 1]}>
              <mesh position={[0, b.h / 2, 0]} castShadow receiveShadow>
                <boxGeometry args={[0.8, b.h, 0.8]} />
                <meshStandardMaterial color="#15304f" roughness={0.5} metalness={0.2} />
              </mesh>
              {Array.from({length: floors}, (_, k) => (
                <mesh key={k} position={[0, 0.3 + k * 0.36, 0]}>
                  <boxGeometry args={[0.82, 0.07, 0.82]} />
                  <meshStandardMaterial color="#0c2238" emissive={C.teal} emissiveIntensity={lit * 0.7} />
                </mesh>
              ))}
              <mesh position={[0, b.h + 0.03, 0]}>
                <boxGeometry args={[0.6, 0.06, 0.6]} />
                <meshStandardMaterial color={C.teal} emissive={C.teal} emissiveIntensity={lit * 0.6} />
              </mesh>
            </group>
            <Beam from={CORE} to={top} progress={grow} />
            {lit > 0 && (
              <mesh position={mix3(CORE, top, travel)}>
                <sphereGeometry args={[0.07, 16, 12]} />
                <meshStandardMaterial color={C.teal} emissive={C.teal} emissiveIntensity={0.9} />
              </mesh>
            )}
          </group>
        );
      })}
    </group>
  );
};
