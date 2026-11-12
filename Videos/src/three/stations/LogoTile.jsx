import React from 'react';
import {Slab} from '../Primitives';

// Glossy 3D tile with the ElevateBiz logo on its front
export const LogoTile = ({logo, size = 2, ...props}) => (
  <group {...props}>
    <Slab
      w={size}
      h={size}
      r={size * 0.23}
      d={size * 0.13}
      color="#0d2036"
      roughness={0.25}
      metalness={0.5}
      position={[0, 0, -size * 0.065]}
    >
      {logo && (
        <mesh>
          <planeGeometry args={[size * 0.75, size * 0.75]} />
          <meshBasicMaterial map={logo} transparent toneMapped={false} />
        </mesh>
      )}
    </Slab>
  </group>
);
