import {useThree} from '@react-three/fiber';
import React, {useEffect, useLayoutEffect, useMemo, useState} from 'react';
import {continueRender, delayRender, random, staticFile, useCurrentFrame} from 'remotion';
import * as THREE from 'three';
import {RoomEnvironment} from 'three/examples/jsm/environments/RoomEnvironment.js';
import {useFontsReady} from '../fonts';
import {add3} from '../three/helpers';
import {CameraContext, FontsContext} from '../three/Primitives';
import {ST, applyPose, getPose, poseQuaternion} from './camera';
import {Phone} from './stations/Phone';
import {Brand, DataEntry, Hub, Process, Reply} from './stations/Scenes';
import {SCENES, sceneAt} from './timing';

export const PAPER = '#f6f7f9'; // the white of the set

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

// Specks floating in the air around whatever the camera is looking at
const Dust = ({frame, around}) => {
  const positions = useMemo(() => {
    const count = 500;
    const data = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      data[i * 3] = (random(`dx${i}`) - 0.5) * 46;
      data[i * 3 + 1] = 0.3 + random(`dy${i}`) * 9;
      data[i * 3 + 2] = -20 + random(`dz${i}`) * 34;
    }
    return data;
  }, []);
  return (
    <points position={[around[0] + Math.sin(frame / 90) * 0.4, Math.sin(frame / 70) * 0.25, 0]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.045} color="#00a3ab" transparent opacity={0.18} sizeAttenuation depthWrite={false} />
    </points>
  );
};

export const World2 = () => {
  const frame = useCurrentFrame();
  const fontsReady = useFontsReady();
  const logo = useLogoTexture();
  const pose = getPose(frame);
  const quaternion = useMemo(() => poseQuaternion(pose), [pose]);
  const lightTarget = useMemo(() => new THREE.Object3D(), []);
  const scene = sceneAt(frame);
  const local = (i) => frame - SCENES[i].from;

  return (
    <FontsContext.Provider value={fontsReady}>
      <CameraContext.Provider value={quaternion}>
        <color attach="background" args={[PAPER]} />
        <fog attach="fog" args={[PAPER, 26, 78]} />
        <Environment />
        <CameraRig pose={pose} />
        <Redraw when={`${fontsReady}-${Boolean(logo)}`} />

        {/* Bright studio light that follows the camera's subject, with soft shadows */}
        <hemisphereLight args={['#ffffff', '#d5dde6', 0.8]} />
        <primitive object={lightTarget} position={pose.look} />
        <directionalLight
          target={lightTarget}
          position={add3(pose.look, [5, 11, 7])}
          intensity={2.2}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.0004}
          shadow-camera-left={-14}
          shadow-camera-right={14}
          shadow-camera-top={14}
          shadow-camera-bottom={-14}
          shadow-camera-near={0.5}
          shadow-camera-far={50}
        />

        {/* White floor with a faint grid that fades into the distance */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[145, 0, 0]} receiveShadow>
          <planeGeometry args={[700, 240]} />
          <meshStandardMaterial color="#f1f3f6" roughness={0.6} metalness={0.05} />
        </mesh>
        <gridHelper args={[700, 350, '#d5dbe3', '#e4e8ee']} position={[145, 0.01, 0]} />
        <Dust frame={frame} around={pose.look} />

        {/* Only the set piece of the current scene is built */}
        {scene <= 1 && (
          <group position={ST.phone}>
            <Phone t1={local(0)} t2={local(1)} />
          </group>
        )}
        {scene === 2 && (
          <group position={ST.data}>
            <DataEntry t={local(2)} />
          </group>
        )}
        {scene === 3 && (
          <group position={ST.owner}>
            <Hub t={local(3)} mode="owner" />
          </group>
        )}
        {scene === 4 && (
          <group position={ST.brand}>
            <Brand t={local(4)} logo={logo} height={2.9} />
          </group>
        )}
        {scene === 5 && (
          <group position={ST.reply}>
            <Reply t={local(5)} />
          </group>
        )}
        {scene === 6 && (
          <group position={ST.process}>
            <Process t={local(6)} />
          </group>
        )}
        {scene === 7 && (
          <group position={ST.running}>
            <Hub t={local(7)} mode="ai" />
          </group>
        )}
        {scene === 8 && (
          <group position={ST.outro}>
            <Brand t={local(8)} logo={logo} height={4.4} />
          </group>
        )}
      </CameraContext.Provider>
    </FontsContext.Provider>
  );
};
