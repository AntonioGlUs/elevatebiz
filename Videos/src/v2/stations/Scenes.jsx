import React from 'react';
import {random, spring} from 'remotion';
import {C} from '../../theme';
import {easeInOut, mix3, mixColor, pop, range} from '../../three/helpers';
import {Beam, Billboard, Label, Slab, Tag} from '../../three/Primitives';
import {LogoTile} from '../../three/stations/LogoTile';
import {Front, Glow} from '../fx';
import {S} from '../script';
import {FPS, INNER_CUTS, f} from '../timing';
import {Bubble, CORAL, Handset} from './Phone';

// Floating label that is always drawn in front of every object
const FrontTag = (props) => (
  <Front>
    <Tag {...props} />
  </Front>
);

const INK = '#0b1b2d';
const TEAL = '#00a3ab';
const GREY = '#aab3bd';

// ---------------------------------------------------------------------------------------------------------
// Scene 3 · Data entry by hand: a table filled one cell at a time while the paperwork piles up
// ---------------------------------------------------------------------------------------------------------
const ROWS = 5;
const COLS = 4;

export const DataEntry = ({t}) => {
  const filled = Math.floor(t / 7); // one cell every 7 frames: slow on purpose
  const sheets = Math.min(30, 8 + Math.floor(t / 4));
  const hours = 1 + Math.floor(t / 11);

  return (
    <group>
      <pointLight color={CORAL} intensity={34} distance={14} decay={2} position={[-3, 4.5, 4]} />

      {/* The table */}
      <group position={[0, 2.7, 0]} rotation={[-0.55, 0.22, 0]}>
        <Slab w={5.6} h={3.6} r={0.2} d={0.12} color="#102640" roughness={0.45} metalness={0.2}>
          <Slab w={5.2} h={0.42} r={0.08} d={0.03} color={TEAL} position={[0, 1.36, 0]} />
          {Array.from({length: ROWS * COLS}, (_, i) => {
            const row = Math.floor(i / COLS);
            const col = i % COLS;
            const done = i < filled;
            const current = i === filled;
            return (
              <group key={i} position={[-1.95 + col * 1.3, 0.8 - row * 0.5, 0]}>
                {current && <Slab w={1.26} h={0.46} r={0.07} d={0.02} color={CORAL} emissive={CORAL} emissiveIntensity={0.5} position={[0, 0, -0.005]} />}
                <Slab w={1.18} h={0.38} r={0.06} d={0.03} color={done ? '#2b4a6f' : '#1a3352'} roughness={0.7}>
                  {done && <Slab w={0.5 + random(`cell${i}`) * 0.45} h={0.07} r={0.03} d={0.01} color="#cfd9e4" position={[-0.1, 0, 0]} />}
                </Slab>
              </group>
            );
          })}
        </Slab>
      </group>

      {/* The pile of paperwork that keeps growing */}
      <group position={[4.3, 0, 1.4]}>
        {Array.from({length: sheets}, (_, i) => (
          <mesh key={i} position={[(random(`sx${i}`) - 0.5) * 0.14, 0.03 + i * 0.062, (random(`sz${i}`) - 0.5) * 0.14]} rotation={[0, (random(`sr${i}`) - 0.5) * 0.5, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.5, 0.05, 2.05]} />
            <meshStandardMaterial color={i % 2 ? '#ffffff' : '#eef1f5'} roughness={0.85} />
          </mesh>
        ))}
      </group>

      {/* Above the table in both camera angles. It is drawn in front of everything, so the table never cuts it. */}
      <Billboard position={[1.6, 3.9, -0.6]} scale={Math.max(pop(t, 8) * 1.05, 0.001)}>
        <FrontTag text={`${hours} ${S.hours} · ${S.manual}`} w={3.3} color={CORAL} textColor="#ffd9d2" />
      </Billboard>
    </group>
  );
};

// ---------------------------------------------------------------------------------------------------------
// Scenes 4 and 8 · The business as a hub with six areas around it.
//   owner mode: everything hangs from "YOU"; when you rest, the areas stop one by one
//   ai mode:    the same areas, now run by the AI: nothing stops
// ---------------------------------------------------------------------------------------------------------
const CENTER = [0, 2.5, 0];
// Placed to the sides and above the centre, so no label ever covers it
const SPOTS = [[-3.7, 3.5, -0.6], [-3.0, 1.3, 1.1], [-1.6, 4.7, -1.4], [1.6, 4.8, -1.3], [3.0, 1.2, 1.1], [3.8, 3.4, -0.5]];
const AREAS = S.areas.map((label, i) => ({label, pos: SPOTS[i]}));

export const Hub = ({t, mode}) => {
  const owner = mode === 'owner';
  const stopAt = owner ? INNER_CUTS[3][0] : Infinity; // "the day you rest…"
  const rest = owner ? easeInOut(range(t, stopAt, stopAt + 18)) : 0;
  const core = pop(t, 2);

  return (
    <group>
      <pointLight color={owner ? mixColor(TEAL, CORAL, rest) : C.teal} intensity={owner ? 22 : 40} distance={16} decay={2} position={[0, 5, 4]} />

      {/* Centre */}
      <group position={CENTER} scale={Math.max(core, 0.001)}>
        <mesh castShadow>
          <sphereGeometry args={[0.78, 48, 32]} />
          <meshStandardMaterial color={owner ? mixColor(INK, '#6f7a86', rest) : TEAL} emissive={owner ? '#000000' : TEAL} emissiveIntensity={owner ? 0 : 0.25} roughness={0.3} metalness={0.2} />
        </mesh>
        {!owner && (
          <>
            <mesh rotation={[t * 0.03, t * 0.02, 0]}>
              <torusGeometry args={[1.15, 0.025, 12, 96]} />
              <meshStandardMaterial color={C.teal} emissive={C.teal} emissiveIntensity={0.6} />
            </mesh>
            <mesh rotation={[1.2 - t * 0.025, 0, t * 0.03]}>
              <torusGeometry args={[1.45, 0.018, 12, 96]} />
              <meshStandardMaterial color={C.teal} emissive={C.teal} emissiveIntensity={0.5} />
            </mesh>
          </>
        )}
      </group>
      <Billboard position={CENTER} scale={Math.max(core, 0.001)}>
        <Label text={owner ? S.you : S.ai} size={0.42} weight={700} color="#ffffff" position={[0, 0, 0.82]} />
      </Billboard>

      {/* Areas of the business */}
      {AREAS.map((a, i) => {
        const appear = pop(t, 6 + i * 4);
        // In owner mode each area stops a little after the previous one
        const dead = owner ? range(t, stopAt + 6 + i * 7, stopAt + 18 + i * 7) : 0;
        const color = mixColor(TEAL, GREY, dead);
        const cycle = 40;
        const travel = dead > 0 ? 0.55 : ((((t - i * 6) % cycle) + cycle) % cycle) / cycle;
        return (
          <group key={a.label}>
            <Beam from={CENTER} to={a.pos} progress={range(t, 4 + i * 4, 22 + i * 4)} color={color} radius={0.024} />
            {appear > 0.5 && dead < 1 && (
              <mesh position={mix3(CENTER, a.pos, travel)}>
                <sphereGeometry args={[0.1, 16, 12]} />
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.9 * (1 - dead)} />
              </mesh>
            )}
            <Billboard position={a.pos} scale={Math.max(appear, 0.001)}>
              <FrontTag text={a.label} w={1.9} color={color} textColor={mixColor('#f6f1e8', '#8a94a0', dead)} size={0.19} />
            </Billboard>
          </group>
        );
      })}

      {owner && (
        <Billboard position={[0, 4.35 + (1 - pop(t, stopAt + 44)) * 2, 0.5]} scale={Math.max(Math.min(1, pop(t, stopAt + 44) * 3) * 1.05, 0.001)}>
          <FrontTag text={S.stopped} w={2.7} color={CORAL} textColor="#ffd9d2" />
        </Billboard>
      )}
    </group>
  );
};

// ---------------------------------------------------------------------------------------------------------
// Scenes 5 and 9 · The logo, alone. It settles into place slowly and one soft band of light crosses it. Nothing else.
// ---------------------------------------------------------------------------------------------------------
export const Brand = ({t, logo, height = 2.3}) => {
  const settle = spring({frame: t - 4, fps: FPS, config: {damping: 200, stiffness: 40}});
  const s = t / FPS;
  const glint = range(t, 46, 78); // a single, slow pass of light
  return (
    <group position={[0, height + (1 - settle) * 0.5 + Math.sin(s * 1.1) * 0.04, 0]} rotation={[0, -0.14 - (1 - settle) * 0.5 + Math.sin(s * 0.6) * 0.06, 0]} scale={0.9 + settle * 0.1}>
      <LogoTile logo={logo} size={2.4} />
      {glint > 0 && glint < 1 && (
        <Glow size={1} color="#ffffff" opacity={Math.sin(glint * Math.PI) * 0.4} position={[-1.2 + glint * 2.4, 0, 0.19]} rotation={[0, 0, -0.4]} scale={[0.9, 2.6, 1]} />
      )}
    </group>
  );
};

// ---------------------------------------------------------------------------------------------------------
// Scene 6 · The same message, answered in seconds. Then more phones: every customer gets an answer
// ---------------------------------------------------------------------------------------------------------
const Answered = ({t, delay = 0, main = false}) => {
  const typing = t >= delay + 10 && t < delay + 32;
  const replyAt = delay + 32;
  return (
    <>
      <Bubble text={S.customer} w={1.56} h={0.62} color="#22313a" scale={pop(t, delay + 2)} position={[-0.95, 0.86, 0]} />
      {typing && (
        <group position={[0.95, 0.3, 0.04]}>
          <Slab w={0.62} h={0.34} r={0.14} d={0.05} color="#005c4b" roughness={0.6} position={[-0.31, 0.17, 0]}>
            {[0, 1, 2].map((i) => (
              <mesh key={i} position={[(i - 1) * 0.14, Math.max(0, Math.sin((t - i * 4) / 3.2)) * 0.05, 0.03]}>
                <sphereGeometry args={[0.04, 16, 12]} />
                <meshStandardMaterial color="#cfe9e2" />
              </mesh>
            ))}
          </Slab>
        </group>
      )}
      {t >= replyAt && <Bubble text={S.reply} w={1.62} h={0.8} mine color="#005c4b" scale={pop(t, replyAt)} position={[0.95, -0.12, 0]} />}
      {main && <Glow size={4} color="#19c9b0" opacity={Math.max(0, 1 - Math.abs(t - replyAt - 4) / 12) * 0.6} position={[0.2, 0.3, 0.3]} />}
    </>
  );
};

export const Reply = ({t}) => {
  const cut = INNER_CUTS[5][0];
  const wide = t >= cut;
  const bob = Math.sin(t / 26) * 0.05;
    return (
    <group>
      <pointLight color={C.teal} intensity={46} distance={16} decay={2} position={[-2.5, 4, 4]} />
      <Handset position={[0, 2.75 + bob, 0]} rotation={[-0.1, -0.22, 0]}>
        <Answered t={t} main />
      </Handset>

      {wide && (
        <>
          <Handset position={[-4.4, 2.6 - bob, -1.6]} rotation={[-0.1, 0.25, 0]} scale={0.86}>
            <Answered t={t - cut} delay={-6} />
          </Handset>
          <Handset position={[4.4, 2.6 - bob, -1.6]} rotation={[-0.1, -0.5, 0]} scale={0.86}>
            <Answered t={t - cut} delay={6} />
          </Handset>
          <Billboard position={[0, 5.75, 0.4]} scale={Math.max(pop(t, cut + 14) * 1.4, 0.001)}>
            <FrontTag text={S.always} w={2.9} />
          </Billboard>
        </>
      )}
    </group>
  );
};

// ---------------------------------------------------------------------------------------------------------
// Scene 7 · Processes that run on their own (a pipeline), then software built to measure (a window that
// assembles itself). The window stands 16 units to the right of the pipeline; the camera cuts over to it.
// ---------------------------------------------------------------------------------------------------------
export const WINDOW_X = 16;

export const Process = ({t}) => {
  const cut = INNER_CUTS[6][0];
  const xs = [-4.8, -1.6, 1.6, 4.8];
  const run = range(t, 6, 58); // the token travels the whole line once
  const tokenX = -4.8 + run * 9.6;
  const w = t - cut; // frames since the cut to the window

  return (
    <group>
      <pointLight color={C.teal} intensity={40} distance={18} decay={2} position={[0, 5, 5]} />

      {/* Pipeline */}
      {xs.slice(0, -1).map((x, i) => (
        <Beam key={x} from={[x + 1.0, 2.3, 0]} to={[xs[i + 1] - 1.0, 2.3, 0]} progress={range(t, 4 + i * 6, 16 + i * 6)} color={TEAL} radius={0.03} />
      ))}
      {xs.map((x, i) => {
        const done = tokenX >= x - 0.2;
        const hit = pop(t, 6 + Math.round((i / 3) * 52));
        return (
          <group key={x} position={[x, 2.3 + (done ? Math.max(0, 1 - hit) * 0.3 : 0), 0]} scale={Math.max(pop(t, 2 + i * 4), 0.001)}>
            <Slab w={1.9} h={1.3} r={0.2} d={0.14} color="#ffffff" roughness={0.5} position={[0, 0, -0.07]}>
              <Label text={S.stages[i]} size={0.21} weight={600} color={INK} position={[0, 0.2, 0]} />
              <mesh position={[0, -0.26, 0.02]}>
                <circleGeometry args={[0.17, 32]} />
                <meshBasicMaterial color={done ? TEAL : '#d9dfe6'} toneMapped={false} />
              </mesh>
            </Slab>
          </group>
        );
      })}
      {run < 1 && (
        <mesh position={[tokenX, 2.3, 0.35]}>
          <sphereGeometry args={[0.16, 24, 16]} />
          <meshStandardMaterial color={C.teal} emissive={C.teal} emissiveIntensity={1} />
        </mesh>
      )}

      {/* Software window that builds itself piece by piece */}
      {w > -10 && (
        <group position={[WINDOW_X, 3.0, 0]} rotation={[-0.06, -0.18, 0]}>
          <pointLight color={C.teal} intensity={40} distance={14} decay={2} position={[-2, 1, 4]} />
          <group scale={Math.max(pop(w, 0), 0.001)}>
            <Slab w={6.6} h={4.1} r={0.24} d={0.16} color="#0f2238" roughness={0.4} metalness={0.25} position={[0, 0, -0.08]} />
          </group>
          <group position={[0, 0, 0.09]}>
            {/* top bar */}
            <group scale={[Math.max(pop(w, 5), 0.001), 1, 1]}>
              <Slab w={6.2} h={0.42} r={0.1} d={0.04} color="#1d3a5c" position={[0, 1.66, 0]} />
            </group>
            {/* sidebar */}
            <group scale={[1, Math.max(pop(w, 9), 0.001), 1]}>
              <Slab w={1.3} h={3.0} r={0.12} d={0.05} color="#1a3352" position={[-2.45, -0.15, 0]} />
            </group>
            {/* three figures */}
            {[0, 1, 2].map((i) => (
              <group key={i} position={[-0.95 + i * 1.5, 0.82, 0]} scale={Math.max(pop(w, 14 + i * 4), 0.001)}>
                <Slab w={1.34} h={0.8} r={0.12} d={0.06} color="#ffffff" roughness={0.6}>
                  <Slab w={0.7} h={0.14} r={0.05} d={0.01} color={TEAL} position={[-0.18, 0.12, 0]} />
                  <Slab w={0.95} h={0.07} r={0.03} d={0.01} color="#9aa7b5" position={[-0.05, -0.14, 0]} />
                </Slab>
              </group>
            ))}
            {/* chart */}
            {[0.5, 0.8, 0.62, 1.05, 1.3, 1.55].map((h, i) => {
              const grow = pop(w, 24 + i * 3);
              return (
                <mesh key={i} position={[-1.15 + i * 0.62, -1.5 + (h * grow) / 2, 0.08]} scale={[1, Math.max(grow, 0.001), 1]}>
                  <boxGeometry args={[0.4, h, 0.14]} />
                  <meshStandardMaterial color={i > 3 ? C.teal : TEAL} emissive={C.teal} emissiveIntensity={i > 3 ? 0.4 : 0.1} roughness={0.4} />
                </mesh>
              );
            })}
          </group>
        </group>
      )}
    </group>
  );
};
