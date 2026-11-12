import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Caption, LeftColumn, SceneShell} from './components/Layout';
import {T} from './locale';
import {C, F, clamp} from './theme';
import {f} from './timing';

// On-screen text for each scene. The 3D picture behind it lives in src/three.

const Scene1 = () => (
  <LeftColumn>
    <Caption
      size={84}
      start={f(T.cue.s1)}
      parts={T.s1}
    />
  </LeftColumn>
);

const Scene2 = () => {
  const frame = useCurrentFrame();
  const swap = f(T.cue.s2Swap);
  return (
    <LeftColumn>
      <div style={{opacity: interpolate(frame, [swap - 4, swap + 8], [1, 0.4], clamp)}}>
        <Caption size={84} start={f(T.cue.s2)} parts={T.s2a} />
      </div>
      <Caption
        size={66}
        start={swap}
        parts={T.s2b}
      />
    </LeftColumn>
  );
};

const Scene3 = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const brand = spring({frame: frame - f(T.cue.s3Brand), fps, config: {damping: 200}});
  return (
    <LeftColumn>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          marginBottom: 14,
          opacity: brand,
          transform: `translateY(${(1 - brand) * 24}px)`,
        }}
      >
        <div style={{fontFamily: F.brand, fontWeight: 600, fontSize: 68, color: C.ink, letterSpacing: '-0.02em'}}>
          ElevateBiz
        </div>
      </div>
      <Caption
        size={78}
        start={f(T.cue.s3)}
        parts={T.s3}
      />
    </LeftColumn>
  );
};

const Scene4 = () => (
  <LeftColumn>
    <Caption size={86} start={f(T.cue.s4)} parts={T.s4a} />
    <Caption size={86} start={f(T.cue.s4Wait)} parts={T.s4b} />
  </LeftColumn>
);

const Scene5 = () => (
  <LeftColumn>
    <Caption
      size={80}
      start={f(T.cue.s5)}
      parts={T.s5}
    />
  </LeftColumn>
);

const Scene6 = () => (
  <LeftColumn>
    <Caption
      size={70}
      start={f(T.cue.s6)}
      stagger={8}
      parts={T.s6a}
    />
    <Caption size={70} start={f(T.cue.s6Always)} parts={T.s6b} />
  </LeftColumn>
);

const Scene7 = () => (
  <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 120}}>
    <Caption
      size={76}
      align="center"
      start={f(T.cue.s7)}
      parts={T.s7}
    />
  </AbsoluteFill>
);

const Scene8 = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const name = spring({frame: frame - f(T.cue.s8Brand), fps, config: {damping: 200}});
  const line = interpolate(frame, [f(T.cue.s8Line), f(T.cue.s8Line + 0.8)], [0, 1], clamp);
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 110}}>
      <div
        style={{
          marginBottom: 26,
          fontFamily: F.brand,
          fontWeight: 600,
          fontSize: 128,
          letterSpacing: '-0.02em',
          color: C.ink,
          textShadow: '0 0 30px rgba(248, 246, 242, 0.95)',
          opacity: name,
          transform: `translateY(${(1 - name) * 30}px)`,
        }}
      >
        ElevateBiz
      </div>
      <div style={{display: 'flex', gap: 36, marginBottom: 18}}>
        <Caption size={62} start={f(T.cue.s8A)} parts={[{t: T.s8a}]} />
        <Caption size={62} start={f(T.cue.s8B)} parts={[{t: T.s8b}]} />
      </div>
      <Caption size={88} align="center" start={f(T.cue.s8C)} parts={[{t: T.s8c, em: true}]} />
      <div
        style={{
          width: 420,
          height: 4,
          marginTop: 28,
          borderRadius: 2,
          background: C.tealInk,
          transform: `scaleX(${line})`,
        }}
      />
    </AbsoluteFill>
  );
};

const SCENE_TEXT = [Scene1, Scene2, Scene3, Scene4, Scene5, Scene6, Scene7, Scene8];

export const SceneCaption = ({index, duration}) => {
  const Text = SCENE_TEXT[index];
  return (
    <SceneShell duration={duration}>
      <Text />
    </SceneShell>
  );
};
