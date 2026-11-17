import React, {useLayoutEffect, useMemo, useRef} from 'react';
import * as THREE from 'three';

// Light effects for a bright (white) set: soft coloured discs and rings instead of additive glows,
// which would not show against white.

// Soft round patch of colour that fades to nothing at its edge. Put it inside a <Billboard> to face the camera.
export const Glow = ({size = 2, color = '#01c3cc', opacity = 0.6, ...props}) => {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.3, 'rgba(255,255,255,0.5)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 256);
    return new THREE.CanvasTexture(canvas);
  }, []);
  return (
    <mesh {...props}>
      <planeGeometry args={[size, size]} />
      <meshBasicMaterial map={texture} color={color} transparent opacity={opacity} depthWrite={false} toneMapped={false} fog={false} />
    </mesh>
  );
};

// Ring that spreads over the floor and fades, like a ripple of light. k goes 0 to 1.
export const Ripple = ({k, radius = 5, color = '#01c3cc', ...props}) => {
  if (k <= 0 || k >= 1) return null;
  const r = 0.4 + k * radius;
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} {...props}>
      <ringGeometry args={[r, r + 0.09 + (1 - k) * 0.12, 96]} />
      <meshBasicMaterial color={color} transparent opacity={(1 - k) * 0.85} depthWrite={false} toneMapped={false} side={THREE.DoubleSide} />
    </mesh>
  );
};

// Draws its children on top of everything else in the 3D scene, whatever stands between them and the camera
// (the 3D equivalent of a very high z-index). Used for the floating labels, so no object can cut through them.
export const Front = ({children}) => {
  const ref = useRef(null);
  useLayoutEffect(() => {
    let order = 1000;
    ref.current.traverse((object) => {
      if (!object.isMesh) return;
      object.renderOrder = order++; // later pieces of the label (its text) go above earlier ones (its body)
      object.material.depthTest = false;
      object.material.depthWrite = false;
    });
  });
  return <group ref={ref}>{children}</group>;
};
