import {ThreeCanvas} from '@remotion/three';
import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {SceneCaption} from './Captions';
import {Overlay} from './components/Layout';
import {loadFonts} from './fonts';
import {T} from './locale';
import {C, clamp} from './theme';
import {HEIGHT, SCENES, WIDTH} from './timing';
import {World} from './three/World';

loadFonts();

// Three layers: the 3D world (one camera travelling between set pieces), a soft overlay that
// keeps the text readable, and the captions. Each scene starts on a pause of the voice-over.
export const Video = () => {
  const frame = useCurrentFrame();
  // Scenes 7 and 8 are centred, so the dark left side fades away before them
  const side = interpolate(frame, [SCENES[6].from - 10, SCENES[6].from + 10], [1, 0], clamp);

  return (
    <AbsoluteFill style={{backgroundColor: C.paper}}>
      <ThreeCanvas
        width={WIDTH}
        height={HEIGHT}
        shadows
        camera={{fov: 35, near: 0.1, far: 160, position: [0, 3, 10]}}
      >
        <World />
      </ThreeCanvas>
      <Overlay side={side} />
      {SCENES.map((scene, i) => (
        <Sequence key={i} name={`Scene ${i + 1}`} from={scene.from} durationInFrames={scene.duration}>
          <SceneCaption index={i} duration={scene.duration} />
        </Sequence>
      ))}
      <Audio src={staticFile(T.audio)} />
    </AbsoluteFill>
  );
};
