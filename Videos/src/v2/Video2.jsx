import {ThreeCanvas} from '@remotion/three';
import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {loadFonts} from '../fonts';
import {Bars, Finish, SceneCaptions} from './Overlays';
import {S} from './script';
import {HEIGHT, SCENES, WIDTH} from './timing';
import {PAPER, World2} from './World2';

loadFonts();

// Cinematic cut of the intro video. Three layers: the 3D world (one camera, cutting between angles),
// the finishing effects (grain, vignette, flashes), the captions and the cinema bars.
export const Video2 = () => (
  <AbsoluteFill style={{backgroundColor: PAPER}}>
    <ThreeCanvas width={WIDTH} height={HEIGHT} shadows camera={{fov: 30, near: 0.1, far: 200, position: [0, 3, 10]}}>
      <World2 />
    </ThreeCanvas>
    <Finish />
    {SCENES.map((scene, i) => (
      <Sequence key={i} name={`Scene ${i + 1}`} from={scene.from} durationInFrames={scene.duration}>
        <SceneCaptions index={i} />
      </Sequence>
    ))}
    <Bars />
    <Audio src={staticFile(S.audio)} />
  </AbsoluteFill>
);
