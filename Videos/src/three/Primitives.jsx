import React, {createContext, useContext, useMemo} from 'react';
import * as THREE from 'three';
import {C} from '../theme';
import {slabGeometry} from './helpers';

// Shared by everything inside the 3D canvas
export const FontsContext = createContext(false);
export const CameraContext = createContext(new THREE.Quaternion());

// Rounded 3D slab. Children are placed on its front face.
export const Slab = ({
  w,
  h,
  r = 0.12,
  d = 0.08,
  color = C.card,
  roughness = 0.45,
  metalness = 0.1,
  emissive = '#000000',
  emissiveIntensity = 0,
  children,
  ...props
}) => {
  const geo = useMemo(() => slabGeometry(w, h, Math.min(r, w / 2, h / 2), d), [w, h, r, d]);
  return (
    <group {...props}>
      <mesh geometry={geo} castShadow receiveShadow>
        <meshStandardMaterial
          color={color}
          roughness={roughness}
          metalness={metalness}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>
      {children ? <group position={[0, 0, d + 0.004]}>{children}</group> : null}
    </group>
  );
};

const RES = 300; // texture pixels per world unit
const FAMILY = {sans: 'Inter', serif: 'Instrument Serif', brand: 'Fraunces'};

const toTexture = (canvas) => {
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
};

// Text drawn on a flat plane. size = letter height in world units.
export const Label = ({
  text,
  size = 0.2,
  font = 'sans',
  weight = 500,
  italic = false,
  color = C.cream,
  maxWidth = Infinity,
  anchor = 'center',
  lineHeight = 1.22,
  opacity = 1,
  ...props
}) => {
  const ready = useContext(FontsContext);
  const {texture, w, h, pad} = useMemo(() => {
    const px = size * RES;
    const fontString = `${italic ? 'italic ' : ''}${weight} ${px}px "${FAMILY[font]}", sans-serif`;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.font = fontString;

    const lines = [];
    let line = '';
    String(text)
      .split(' ')
      .forEach((word) => {
        const test = line ? `${line} ${word}` : word;
        if (line && ctx.measureText(test).width > maxWidth * RES) {
          lines.push(line);
          line = word;
        } else {
          line = test;
        }
      });
    lines.push(line);

    const margin = Math.ceil(px * 0.2);
    const lh = px * lineHeight;
    canvas.width = Math.ceil(Math.max(...lines.map((l) => ctx.measureText(l).width))) + margin * 2;
    canvas.height = Math.ceil(lines.length * lh) + margin * 2;

    ctx.font = fontString;
    ctx.fillStyle = color;
    ctx.textBaseline = 'middle';
    ctx.textAlign = anchor === 'left' ? 'left' : 'center';
    lines.forEach((l, i) => ctx.fillText(l, anchor === 'left' ? margin : canvas.width / 2, margin + lh * (i + 0.5)));

    return {texture: toTexture(canvas), w: canvas.width / RES, h: canvas.height / RES, pad: margin / RES};
    // `ready` redraws the text once the real fonts are available
  }, [ready, text, size, font, weight, italic, color, maxWidth, anchor, lineHeight]);

  return (
    <group {...props}>
      <mesh position={[anchor === 'left' ? w / 2 - pad : 0, 0, 0]}>
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial map={texture} transparent opacity={opacity} toneMapped={false} depthWrite={false} />
      </mesh>
    </group>
  );
};

// Line icon drawn from SVG path strings
export const IconPlane = ({paths, size = 0.5, color = C.teal, stroke = 2.6, box = 48, ...props}) => {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    ctx.scale(256 / box, 256 / box);
    ctx.strokeStyle = color;
    ctx.lineWidth = stroke;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    paths.forEach((d) => ctx.stroke(new Path2D(d)));
    return toTexture(canvas);
  }, [paths, color, stroke, box]);

  return (
    <mesh {...props}>
      <planeGeometry args={[size, size]} />
      <meshBasicMaterial map={texture} transparent toneMapped={false} depthWrite={false} />
    </mesh>
  );
};

export const ICONS = {
  check: ['M5 12.5l4.5 4.5L19 7.5'],
  chat: [
    'M6 9a4 4 0 0 1 4-4h28a4 4 0 0 1 4 4v20a4 4 0 0 1-4 4H22l-10 8v-8h-2a4 4 0 0 1-4-4z',
    'M19.5 15.5a4.5 4.5 0 1 1 6.6 4c-1.4.8-2.1 1.6-2.1 3',
    'M24 27v.4',
  ],
  calendar: [
    'M10 9h28a4 4 0 0 1 4 4v25a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4V13a4 4 0 0 1 4-4z',
    'M6 19h36M16 5v8M32 5v8M17 30l5 5 9-10',
  ],
  followUp: ['M40 24a16 16 0 1 1-5-11.6', 'M36 4v9h-9', 'M24 16v8l5 4'],
  // 24-unit box, like `check`
  phone: [
    'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z',
  ],
};

// Always turned toward the camera. Use it only under groups that are not rotated.
export const Billboard = ({children, ...props}) => {
  const quaternion = useContext(CameraContext);
  return (
    <group quaternion={quaternion} {...props}>
      {children}
    </group>
  );
};

// Floating pill-shaped tag with a glowing outline
export const Tag = ({text, w, color = C.teal, textColor = C.cream, size = 0.17, ...props}) => (
  <group {...props}>
    <Slab
      w={w + 0.07}
      h={0.53}
      r={0.265}
      d={0.05}
      color={color}
      emissive={color}
      emissiveIntensity={0.35}
      position={[0, 0, -0.03]}
    />
    <Slab w={w} h={0.46} r={0.23} d={0.06} color={C.navy} roughness={0.9} metalness={0}>
      <Label text={text} size={size} weight={600} color={textColor} />
    </Slab>
  </group>
);

// Thin glowing rod from one point to another. progress grows it from the start point.
export const Beam = ({from, to, progress = 1, radius = 0.018, color = C.teal}) => {
  const {position, quaternion, length} = useMemo(() => {
    const a = new THREE.Vector3(...from);
    const b = new THREE.Vector3(...to).sub(a).multiplyScalar(progress);
    const len = b.length();
    return {
      position: a.clone().addScaledVector(b, 0.5),
      quaternion: new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        len > 0 ? b.clone().normalize() : new THREE.Vector3(0, 1, 0),
      ),
      length: len,
    };
  }, [from, to, progress]);

  if (length < 0.001) return null;
  return (
    <mesh position={position} quaternion={quaternion} scale={[1, length, 1]}>
      <cylinderGeometry args={[radius, radius, 1, 8]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} />
    </mesh>
  );
};
