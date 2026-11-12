import React, {useContext, useMemo} from 'react';
import {spring} from 'remotion';
import * as THREE from 'three';
import {T} from '../../locale';
import {C} from '../../theme';
import {FPS, SCENES, f} from '../../timing';
import {easeIn, easeInOut, mixColor, pop, range, screenGeometry, smooth} from '../helpers';
import {Billboard, FontsContext, Label, Slab, Tag} from '../Primitives';

// Scenes 4 to 6 · One phone, three moments:
//   4  a customer message arrives and the wait starts
//   5  the wait runs away, the message leaves: sale lost
//   6  the same message gets an instant reply
const CUSTOMER = T.customer;
const REPLY = T.reply;
const SCREEN_W = 2.14;
const SCREEN_H = 4.5;

// WhatsApp-style screen background: header, wallpaper and input bar
const useScreenTexture = () => {
  const ready = useContext(FontsContext);
  return useMemo(() => {
    const u = 300;
    const canvas = document.createElement('canvas');
    canvas.width = SCREEN_W * u;
    canvas.height = SCREEN_H * u;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;

    ctx.fillStyle = '#e5ddd5';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = 'rgba(20, 39, 32, 0.07)';
    for (let y = 0; y < H; y += 26) {
      for (let x = 0; x < W; x += 26) {
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const head = 0.62 * u;
    ctx.fillStyle = '#008069';
    ctx.fillRect(0, 0, W, head);
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0.34 * u, head / 2, 0.19 * u, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#008069';
    ctx.font = `700 ${0.15 * u}px "Inter", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(T.initials, 0.34 * u, head / 2 + 2);
    ctx.textAlign = 'left';
    ctx.fillStyle = '#ffffff';
    ctx.font = `600 ${0.15 * u}px "Inter", sans-serif`;
    ctx.fillText(T.business, 0.64 * u, head / 2 - 0.09 * u);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = `400 ${0.105 * u}px "Inter", sans-serif`;
    ctx.fillText(T.online, 0.64 * u, head / 2 + 0.1 * u);

    const bar = 0.5 * u;
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, H - bar, W, bar);
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(0.12 * u, H - bar + 0.09 * u, W - 0.62 * u, 0.32 * u, 0.16 * u);
    ctx.fill();
    ctx.fillStyle = '#8696a0';
    ctx.font = `400 ${0.11 * u}px "Inter", sans-serif`;
    ctx.fillText(T.message, 0.26 * u, H - bar / 2 + 2);
    ctx.fillStyle = '#008069';
    ctx.beginPath();
    ctx.arc(W - 0.28 * u, H - bar / 2, 0.16 * u, 0, Math.PI * 2);
    ctx.fill();

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    return texture;
    // `ready` redraws the header once the real fonts are available
  }, [ready]);
};

// Message bubble that pops out of the screen from its corner
const Bubble = ({text, w, h, mine = false, color, scale = 1, lift = 0, ...props}) => (
  <group {...props}>
    <group scale={Math.max(scale, 0.001)}>
      <Slab
        w={w}
        h={h}
        r={0.14}
        d={0.05}
        color={color ?? (mine ? '#d9fdd3' : '#ffffff')}
        roughness={0.65}
        position={[mine ? -w / 2 : w / 2, h / 2, lift]}
      >
        <Label text={text} size={0.125} weight={400} color="#111b21" maxWidth={w - 0.26} />
      </Slab>
    </group>
  </group>
);

export const Chat = ({frame}) => {
  const screenGeo = useMemo(() => screenGeometry(SCREEN_W, SCREEN_H, 0.28), []);
  const screenTexture = useScreenTexture();

  const t4 = frame - SCENES[3].from;
  const t5 = frame - SCENES[4].from;
  const t6 = frame - SCENES[5].from;
  const d5 = SCENES[4].duration;
  const in5 = t5 >= 0 && t6 < 0;
  const in6 = t6 >= 0;

  // Scene 4
  const phoneIn = smooth(t4, 0);
  const cueWait = f(T.cue.s4Wait);
  const seconds = Math.max(0, Math.floor((t4 - cueWait) / FPS)) + 1;

  // Scene 5
  const cueLeave = f(T.cue.s5Leave);
  const grey = in5 ? range(t5, 24, 56) : 0;
  const leave = in5 ? easeIn(range(t5, cueLeave, cueLeave + 24)) : 0;
  const minutes = Math.round(1 + 94 * easeIn(range(t5, 0, d5 - 16)));
  const waited = minutes < 60 ? `${minutes} min` : `${Math.floor(minutes / 60)} h ${minutes % 60} min`;
  const exit5 = 1 - range(t5, d5 - 8, d5);
  const lost = spring({frame: t5 - cueLeave - 18, fps: FPS, config: {damping: 11, stiffness: 120}});

  // Scene 6
  const cueReply = f(T.cue.s6Reply);
  const cueAlways = f(T.cue.s6Always);
  const turn = easeInOut(range(t6, 0, 26));

  const customerScale = in6 ? pop(t6, 8) : pop(t4, 6);
  const bob = Math.sin(frame / 26) * 0.06;

  return (
    <group>
      {/* Phone */}
      <group
        position={[0, 2.75 + bob - (1 - phoneIn) * 2.4, 0]}
        rotation={[-0.1, -0.3 - (1 - phoneIn) * 1.4 + turn * 0.42, 0]}
      >
        <Slab w={2.36} h={4.72} r={0.36} d={0.2} color="#0a1422" roughness={0.3} metalness={0.7} position={[0, 0, -0.1]} />
        <mesh geometry={screenGeo} position={[0, 0, 0.105]}>
          <meshBasicMaterial map={screenTexture} toneMapped={false} />
        </mesh>

        <group position={[0, 0, 0.11]}>
          {leave < 1 && (
            <Bubble
              text={CUSTOMER}
              w={1.56}
              h={0.62}
              color={mixColor('#ffffff', '#9aa3ab', grey)}
              scale={customerScale * (1 - leave * 0.6)}
              lift={0.04}
              position={[-0.95 + leave * 5, 0.86 + leave * 1.2, leave * 3]}
              rotation={[0, 0, -leave * 1.2]}
            />
          )}
          {in6 && t6 >= 34 && t6 < cueReply && (
            <group position={[0.95, 0.3, 0.04]}>
              <Slab w={0.62} h={0.34} r={0.14} d={0.05} color="#d9fdd3" roughness={0.65} position={[-0.31, 0.17, 0]}>
                {[0, 1, 2].map((i) => {
                  const hop = Math.max(0, Math.sin((t6 - i * 4) / 3.2));
                  return (
                    <mesh key={i} position={[(i - 1) * 0.14, hop * 0.05, 0.03]}>
                      <sphereGeometry args={[0.04, 16, 12]} />
                      <meshStandardMaterial color="#667781" />
                    </mesh>
                  );
                })}
              </Slab>
            </group>
          )}
          {in6 && t6 >= cueReply && (
            <Bubble text={REPLY} w={1.62} h={0.8} mine scale={pop(t6, cueReply)} lift={0.04} position={[0.95, -0.12, 0]} />
          )}
        </group>
      </group>

      {/* Scene 4 · waiting */}
      {!in5 && !in6 && (
        <Billboard position={[1.4, 5.15, 0.5]} scale={Math.max(pop(t4, cueWait), 0.001)}>
          <Tag text={`${T.waiting} · 0:${String(seconds).padStart(2, '0')}`} w={3.3} />
        </Billboard>
      )}

      {/* Scene 5 · the sale is lost */}
      {in5 && (
        <>
          <Billboard position={[1.4, 5.15, 0.5]} scale={Math.max(exit5, 0.001)}>
            <Tag text={`${T.noReply} · ${waited}`} w={3.1} color={mixColor(C.teal, C.warm, range(t5, 0, 36))} />
          </Billboard>
          <Billboard position={[0.1, 2.9 + (1 - lost) * 4, 0.7]} scale={Math.max(Math.min(1, lost * 3) * exit5 * 1.15, 0.001)}>
            <Tag text={T.saleLost} w={2.0} color={C.warm} textColor={C.warm} />
          </Billboard>
          <pointLight
            color={C.warm}
            intensity={range(t5, 10, 50) * 22 * exit5}
            distance={12}
            decay={2}
            position={[2, 4, 3]}
          />
        </>
      )}

      {/* Scene 6 · instant reply */}
      {in6 && (
        <>
          <pointLight color={C.teal} intensity={10} distance={10} decay={2} position={[-1.5, 3.2, 3]} />
          <Billboard position={[1.4, 5.15, 0.5]} scale={Math.max(pop(t6, cueReply + 10), 0.001)}>
            <Tag text={T.answered} w={3.0} />
          </Billboard>
          <Billboard position={[1.9, 0.3, 1.0]} scale={Math.max(pop(t6, cueAlways), 0.001)}>
            <Tag text={T.always} w={2.5} />
          </Billboard>
        </>
      )}
    </group>
  );
};
