import React, {useContext, useMemo} from 'react';
import * as THREE from 'three';
import {C} from '../../theme';
import {easeIn, easeInOut, mix3, mixColor, pop, range, screenGeometry} from '../../three/helpers';
import {Billboard, FontsContext, Label, Slab, Tag} from '../../three/Primitives';
import {Front, Glow} from '../fx';
import {ST} from '../camera';
import {S} from '../script';
import {FPS, INNER_CUTS, f} from '../timing';

// Floating label that is always drawn in front of every object
const FrontTag = (props) => (
  <Front>
    <Tag {...props} />
  </Front>
);

const SCREEN_W = 2.14;
const SCREEN_H = 4.5;
export const CORAL = '#ff5841'; // the "book a call" colour of the website, used here as the alarm colour

// Chat screen in dark mode: header, wallpaper and input bar. A dark phone stands out against the white set.
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

    ctx.fillStyle = '#0b141a';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.045)';
    for (let y = 0; y < H; y += 26) {
      for (let x = 0; x < W; x += 26) {
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const head = 0.62 * u;
    ctx.fillStyle = '#1f2c34';
    ctx.fillRect(0, 0, W, head);
    ctx.fillStyle = '#00a884';
    ctx.beginPath();
    ctx.arc(0.34 * u, head / 2, 0.19 * u, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = `700 ${0.15 * u}px "Inter", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(S.initials, 0.34 * u, head / 2 + 2);
    ctx.textAlign = 'left';
    ctx.fillStyle = '#ffffff';
    ctx.font = `600 ${0.15 * u}px "Inter", sans-serif`;
    ctx.fillText(S.business, 0.64 * u, head / 2 - 0.09 * u);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = `400 ${0.105 * u}px "Inter", sans-serif`;
    ctx.fillText(S.online, 0.64 * u, head / 2 + 0.1 * u);

    const bar = 0.5 * u;
    ctx.fillStyle = '#1f2c34';
    ctx.fillRect(0, H - bar, W, bar);
    ctx.fillStyle = '#2a3942';
    ctx.beginPath();
    ctx.roundRect(0.12 * u, H - bar + 0.09 * u, W - 0.62 * u, 0.32 * u, 0.16 * u);
    ctx.fill();
    ctx.fillStyle = '#8696a0';
    ctx.font = `400 ${0.11 * u}px "Inter", sans-serif`;
    ctx.fillText(S.message, 0.26 * u, H - bar / 2 + 2);
    ctx.fillStyle = '#00a884';
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

// The phone itself. wake = 0 (screen off) to 1 (on). Children sit just above the screen.
export const Handset = ({wake = 1, children, ...props}) => {
  const screenGeo = useMemo(() => screenGeometry(SCREEN_W, SCREEN_H, 0.28), []);
  const screenTexture = useScreenTexture();
  return (
    <group {...props}>
      <Slab w={2.36} h={4.72} r={0.36} d={0.2} color="#0a1422" roughness={0.25} metalness={0.8} position={[0, 0, -0.1]} />
      <mesh geometry={screenGeo} position={[0, 0, 0.105]}>
        <meshBasicMaterial map={screenTexture} toneMapped={false} color={mixColor('#000000', '#ffffff', wake)} />
      </mesh>
      <group position={[0, 0, 0.11]}>{children}</group>
    </group>
  );
};

// Message bubble that pops out from its corner. mine = sent by the business (right side).
export const Bubble = ({text, w, h, mine = false, color, scale = 1, ...props}) => (
  <group {...props} scale={Math.max(scale, 0.001)}>
    <Slab w={w} h={h} r={0.14} d={0.05} color={color} emissive={color} emissiveIntensity={0.45} roughness={0.5} position={[mine ? -w / 2 : w / 2, h / 2, 0.04]}>
      <Label text={text} size={0.125} weight={500} color="#eef3f5" maxWidth={w - 0.26} />
    </Slab>
  </group>
);

// The competitor's shop, a little way off: where the unanswered customer ends up
const Competitor = ({lit}) => (
  <group position={ST.competitor} scale={1.35}>
    <mesh position={[0, 2.2, 0]} castShadow receiveShadow>
      <boxGeometry args={[5.2, 4.4, 3.2]} />
      <meshStandardMaterial color="#1a2230" roughness={0.6} metalness={0.3} />
    </mesh>
    {[-1.6, 0, 1.6].map((x) => (
      <mesh key={x} position={[x, 1.6, 1.62]}>
        <planeGeometry args={[1.2, 2.2]} />
        <meshBasicMaterial color={mixColor('#3a2a28', '#ffb08a', lit)} toneMapped={false} />
      </mesh>
    ))}
    <mesh position={[0, 3.75, 1.63]}>
      <planeGeometry args={[4.6, 0.7]} />
      <meshBasicMaterial color={mixColor('#4a2a26', CORAL, lit)} toneMapped={false} />
    </mesh>
    <Label text={S.competitor} size={0.34} weight={700} color="#ffffff" opacity={0.35 + lit * 0.65} position={[0, 3.75, 1.66]} />
    <pointLight color={CORAL} intensity={lit * 70} distance={22} decay={2} position={[0, 3, 4]} />
  </group>
);

// Scenes 1 and 2 · One phone, alone.
//   1  a customer message lands; nobody answers and the wait starts
//   2  the wait runs away, the light turns red and the sale leaves for the competitor
export const Phone = ({t1, t2}) => {
  const in2 = t2 >= 0;
  const cut1 = INNER_CUTS[0][0];
  const cut2 = INNER_CUTS[1][0];

  // Scene 1: the screen wakes up and the message pops in with a pulse of light
  const wake = range(t1, 2, 16);
  const arrive = f(0.75);
  const bubble = pop(t1, arrive);
  const pulse = Math.max(0, 1 - Math.abs(t1 - arrive - 4) / 12);
  const seconds = Math.max(0, Math.floor((t1 - cut1) / FPS)) + 1;

  // Scene 2: the wait runs away and everything turns red, then the message leaves
  const alarm = in2 ? easeInOut(range(t2, 0, 60)) : 0;
  const minutes = Math.round(1 + 94 * easeIn(range(t2, 0, cut2 + 20)));
  const waited = minutes < 60 ? `${minutes} min` : `${Math.floor(minutes / 60)} h ${minutes % 60} min`;
  const leaveAt = cut2 + 6;
  const leave = in2 ? easeInOut(range(t2, leaveAt, leaveAt + 44)) : 0;
  const lost = pop(t2, leaveAt + 30);
  const bob = Math.sin((t1 + 200) / 26) * 0.05;

  // Path of the message as it flies from the phone to the competitor (arcing upward)
  const from = [-0.3, 3.7, 0.4];
  const to = [ST.competitor[0], 3.6, ST.competitor[2] + 2.4];
  const fly = (k) => {
    const p = mix3(from, to, k);
    return [p[0], p[1] + Math.sin(k * Math.PI) * 2.4, p[2]];
  };

  return (
    <group>
      {/* Red light that grows over the floor and the phone as the wait gets longer */}
      <pointLight color={CORAL} intensity={alarm * 120} distance={18} decay={2} position={[2.6, 4.6, 3.6]} />
      <pointLight color={CORAL} intensity={alarm * 60} distance={14} decay={2} position={[-3, 1.2, 2]} />

      <Handset wake={wake} position={[0, 2.75 + bob, 0]} rotation={[-0.1, -0.3, 0]}>
        {leave < 0.02 && <Bubble text={S.customer} w={1.56} h={0.62} color={mixColor('#22313a', '#7a2a20', alarm)} scale={bubble} position={[-0.95, 0.86, 0]} />}
        <Glow size={3.6} color="#19c9b0" opacity={pulse * 0.6} position={[-0.2, 1.1, 0.25]} />
      </Handset>
      {/* Ripple on the floor when the message lands */}
      <Billboard position={[0, 2.75, -0.6]}>
        <Glow size={9} color="#19c9b0" opacity={pulse * 0.28} />
      </Billboard>

      {/* Scene 1 · nobody answers */}
      {!in2 && t1 >= cut1 && (
        <Billboard position={[3.5, 4.3, 0.6]} scale={Math.max(pop(t1, cut1 + 6) * 1.3, 0.001)}>
          <FrontTag text={`${S.waiting} · 0:${String(seconds).padStart(2, '0')}`} w={3.3} />
        </Billboard>
      )}

      {/* Scene 2 · the wait runs away */}
      {in2 && t2 < cut2 && (
        <Billboard position={[2.3, 4.5, 0.6]} scale={0.8}>
          <FrontTag text={`${S.noReply} · ${waited}`} w={3.1} color={mixColor(C.teal, CORAL, alarm)} />
        </Billboard>
      )}

      {/* Scene 2 · the message leaves as a streak of light and lands on the competitor */}
      {in2 && t2 >= cut2 && (
        <>
          <Competitor lit={easeInOut(range(t2, leaveAt + 24, leaveAt + 50))} />
          {leave > 0 && leave < 1 && (
            <>
              {Array.from({length: 9}, (_, i) => {
                const k = leave - i * 0.022;
                if (k <= 0) return null;
                return (
                  <Billboard key={i} position={fly(k)}>
                    <Glow size={(1.7 - i * 0.14) * (1 - leave * 0.4)} color={CORAL} opacity={0.95 - i * 0.09} />
                  </Billboard>
                );
              })}
              <pointLight color={CORAL} intensity={40} distance={9} decay={2} position={fly(leave)} />
            </>
          )}
          <Billboard position={[ST.competitor[0], 7.9 + (1 - lost) * 4, ST.competitor[2] + 2.4]} scale={Math.max(Math.min(1, lost * 3) * 2.9, 0.001)}>
            <FrontTag text={S.saleLost} w={2.1} color={CORAL} textColor="#ffd9d2" />
          </Billboard>
        </>
      )}
    </group>
  );
};
