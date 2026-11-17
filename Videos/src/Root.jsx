import React from 'react';
import {Composition} from 'remotion';
import {FPS, HEIGHT, TOTAL, WIDTH} from './timing';
import {Video} from './Video';
import {Video2} from './v2/Video2';
import {TOTAL as TOTAL_V2} from './v2/timing';

// Main = the first intro video. MainV2 = the cinematic cut with the new script (src/v2).
export const Root = () => (
  <>
    <Composition id="Main" component={Video} durationInFrames={TOTAL} fps={FPS} width={WIDTH} height={HEIGHT} />
    <Composition id="MainV2" component={Video2} durationInFrames={TOTAL_V2} fps={FPS} width={WIDTH} height={HEIGHT} />
  </>
);
