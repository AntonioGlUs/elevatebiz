import {useThree} from '@react-three/fiber';
import React, {useEffect, useLayoutEffect, useMemo, useState} from 'react';
import {continueRender, delayRender, random, staticFile, useCurrentFrame} from 'remotion';
import * as THREE from 'three';
import {RoomEnvironment} from 'three/examples/jsm/environments/RoomEnvironment.js';
import {useFontsReady} from '../fonts';
import {C} from '../theme';
import {HEIGHT, SCENES, WIDTH} from '../timing';
import {ST, applyPose, getPose, poseQuaternion} from './camera';
import {add3} from './helpers';
import {CameraContext, FontsContext} from './Primitives';
import {Automation} from './stations/Automation';
import {Chat} from './stations/Chat';
import {Network} from './stations/Network';
import {Outro} from './stations/Outro';
import {BrandIntro} from './stations/BrandIntro';
import {Services} from './stations/Services';

// Soft studio reflections on the glossy materials
const Environment = () => {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  useLayoutEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const texture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = texture;
    scene.environmentIntensity = 0.5;
    return () => {
      scene.environment = null;
      texture.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);
  return null;
};

// Moves the camera to its place for the current frame, before the frame is drawn
const CameraRig = ({pose}) => {
  const camera = useThree((s) => s.camera);
  useLayoutEffect(() => {
    applyPose(camera, pose);
    camera.setViewOffset(WIDTH, HEIGHT, pose.off, 0, WIDTH, HEIGHT);
    camera.updateMatrixWorld();
  });
  return null;
};

// Draws the scene again when something that loaded late (fonts, logo) becomes available
const Redraw = ({when}) => {
  const advance = useThree((s) => s.advance);
  useEffect(() => {
    advance(performance.now());
  }, [advance, when]);
  return null;
};

const useLogoTexture = () => {
  const [texture, setTexture] = useState(null);
  useEffect(() => {
    const handle = delayRender('Loading the logo texture');
    new THREE.TextureLoader().load(
      staticFile('logo-large.png'),
      (loaded) => {
        loaded.colorSpace = THREE.SRGBColorSpace;
        loaded.anisotropy = 8;
        setTexture(loaded);
        setTimeout(() => continueRender(handle), 120);
      },
      undefined,
      () => continueRender(handle),
    );
  }, []);
  return texture;
};

const Particles = () => {
  const positions = useMemo(() => {
    const count = 700;
    const data = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      data[i * 3] = -12 + random(`px${i}`) * 116;
      data[i * 3 + 1] = 0.3 + random(`py${i}`) * 7.5;
      data[i * 3 + 2] = -14 + random(`pz${i}`) * 24;
    }
    return data;
  }, []);
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.06} color={C.tealInk} transparent opacity={0.45} sizeAttenuation depthWrite={false} />
    </points>
  );
};

// A set piece is only built while the camera is near its scenes
const near = (frame, first, last = first) =>
  frame >= SCENES[first].from - 30 && frame < SCENES[last].from + SCENES[last].duration + 30;

export const World = () => {
  const frame = useCurrentFrame();
  const fontsReady = useFontsReady();
  const logo = useLogoTexture();
  const pose = getPose(frame);
  const quaternion = useMemo(() => poseQuaternion(pose), [pose]);
  const lightTarget = useMemo(() => new THREE.Object3D(), []);
  const local = (i) => frame - SCENES[i].from;

  return (
    <FontsContext.Provider value={fontsReady}>
      <CameraContext.Provider value={quaternion}>
        <color attach="background" args={[C.paper]} />
        <fog attach="fog" args={[C.paper, 14, 44]} />
        <Environment />
        <CameraRig pose={pose} />
        <Redraw when={`${fontsReady}-${Boolean(logo)}`} />

        <hemisphereLight args={['#ffffff', '#e9e3d8', 0.75]} />
        <primitive object={lightTarget} position={pose.look} />
        <directionalLight
          target={lightTarget}
          position={add3(pose.look, [4, 9, 6])}
          intensity={2.1}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.0004}
          shadow-camera-left={-9}
          shadow-camera-right={9}
          shadow-camera-top={9}
          shadow-camera-bottom={-9}
          shadow-camera-near={0.5}
          shadow-camera-far={40}
        />

        {/* Floor with a grid that fades into the distance */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[45, 0, 0]} receiveShadow>
          <planeGeometry args={[320, 140]} />
          <meshStandardMaterial color="#ece7dd" roughness={0.95} metalness={0} />
        </mesh>
        <gridHelper args={[320, 160, '#d6d0c4', '#e3ded4']} position={[45, 0.01, 0]} />
        <group position={[0, Math.sin(frame / 60) * 0.2, 0]}>
          <Particles />
        </group>

        {near(frame, 0) && (
          <group position={ST.network}>
            <Network t={local(0)} />
          </group>
        )}
        {near(frame, 1) && (
          <group position={ST.automation}>
            <Automation t={local(1)} />
          </group>
        )}
        {near(frame, 2) && (
          <group position={ST.robot}>
            <BrandIntro t={local(2)} logo={logo} />
          </group>
        )}
        {near(frame, 3, 5) && (
          <group position={ST.chat}>
            <Chat frame={frame} />
          </group>
        )}
        {near(frame, 6) && (
          <group position={ST.services}>
            <Services t={local(6)} />
          </group>
        )}
        {near(frame, 7) && (
          <group position={ST.outro}>
            <Outro t={local(7)} logo={logo} />
          </group>
        )}
      </CameraContext.Provider>
    </FontsContext.Provider>
  );
};
