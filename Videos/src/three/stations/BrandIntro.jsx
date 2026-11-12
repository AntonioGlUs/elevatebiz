import React from 'react';
import {spring} from 'remotion';
import {T} from '../../locale';
import {C} from '../../theme';
import {FPS, f} from '../../timing';
import {pop} from '../helpers';
import {Billboard, ICONS, IconPlane, Label, Slab} from '../Primitives';
import {LogoTile} from './LogoTile';

// Scene 3 · The ElevateBiz logo lands on its platform. On "para atender a tus clientes",
// customer messages and phone calls gather around it.
// Where each floating piece sits around the logo (kept on the side the camera sees)
const ITEMS = [
  {at: [2.25, 2.4, 0.9], call: true},
  {at: [-1.7, 3.35, 0.5]},
  {at: [1.9, 3.8, -0.4]},
  {at: [-1.55, 1.05, 1.2]},
];
const CALL_GREEN = '#12a150';
const CUE_SERVE = f(T.cue.s3Serve); // just before the voice mentions serving customers

// Round green call button with rings pulsing out of it
const CallCoin = ({t, radius = 0.42, rings = true}) => (
  <group>
    <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
      <cylinderGeometry args={[radius, radius, 0.1, 48]} />
      <meshStandardMaterial color={CALL_GREEN} emissive={CALL_GREEN} emissiveIntensity={0.05} roughness={0.4} />
    </mesh>
    <IconPlane paths={ICONS.phone} box={24} stroke={2.2} size={radius * 1.1} color="#ffffff" position={[0, 0, 0.06]} />
    {rings &&
      [0, 1].map((k) => {
        const wave = (((t + k * 18) % 36) + 36) % 36 / 36;
        return (
          <mesh key={k} scale={1 + wave * 0.6}>
            <torusGeometry args={[radius + 0.06, 0.012, 8, 64]} />
            <meshBasicMaterial color={CALL_GREEN} transparent opacity={(1 - wave) * 0.8} depthWrite={false} />
          </mesh>
        );
      })}
  </group>
);

export const BrandIntro = ({t, logo}) => {
  const land = spring({frame: t - 8, fps: FPS, config: {damping: 14, stiffness: 90}});
  const s = t / FPS;

  return (
    <group>
      <mesh position={[0, 0.09, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.6, 1.7, 0.18, 64]} />
        <meshStandardMaterial color="#0e2238" roughness={0.4} metalness={0.3} />
      </mesh>
      <mesh position={[0, 0.19, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.62, 0.03, 12, 96]} />
        <meshStandardMaterial color={C.teal} emissive={C.teal} emissiveIntensity={0.6} />
      </mesh>
      <pointLight color={C.teal} intensity={10} distance={9} decay={2} position={[0, 0.8, 2.2]} />

      <LogoTile
        logo={logo}
        size={2.2}
        position={[0, 2.1 + Math.sin(s * 1.4) * 0.07 + (1 - land) * 4, 0]}
        rotation={[0, (1 - land) * -5 - 0.25 + Math.sin(s * 0.8) * 0.2, 0]}
      />

      {ITEMS.map((item, i) => {
        const p = pop(t, CUE_SERVE + i * 5);
        const [x, y, z] = item.at;
        return (
          <Billboard key={i} position={[x, y + Math.sin((t + i * 20) / 22) * 0.07, z]} scale={Math.max(p, 0.001)}>
            {item.call ? (
              <CallCoin t={t} />
            ) : (
              <Slab w={1.3} h={0.62} r={0.16} d={0.06} color={C.card} roughness={0.6}>
                <Slab w={0.9} h={0.07} r={0.035} d={0.01} color="#b8c4d2" position={[-0.05, 0.11, 0]} />
                <Slab w={0.58} h={0.07} r={0.035} d={0.01} color="#7f8ea0" position={[-0.21, -0.1, 0]} />
              </Slab>
            )}
          </Billboard>
        );
      })}

      {/* Incoming call card, in front of the logo */}
      <Billboard position={[1.35, 0.85 + Math.sin(t / 20) * 0.05, 1.8]} scale={Math.max(pop(t, CUE_SERVE + 6), 0.001)}>
        <Slab w={2.7} h={0.9} r={0.3} d={0.08} color="#0b1b2d" roughness={0.5}>
          <group position={[-0.95, 0, 0.05]}>
            <CallCoin t={t} radius={0.28} rings={false} />
          </group>
          <Label text={T.incomingCall} size={0.17} weight={600} anchor="left" position={[-0.52, 0.16, 0]} />
          {Array.from({length: 11}, (_, k) => {
            const level = 0.25 + 0.75 * Math.abs(Math.sin(t / 4 + k * 0.9));
            return (
              <mesh key={k} position={[-0.47 + k * 0.1, -0.17, 0.02]} scale={[1, level, 1]}>
                <boxGeometry args={[0.05, 0.3, 0.03]} />
                <meshStandardMaterial color={C.teal} emissive={C.teal} emissiveIntensity={0.5} />
              </mesh>
            );
          })}
        </Slab>
      </Billboard>
    </group>
  );
};
