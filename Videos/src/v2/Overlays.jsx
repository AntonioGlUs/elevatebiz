import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {F, clamp} from '../theme';
import {S} from './script';
import {ALL_CUTS, HEIGHT, SCENES, f, sceneAt} from './timing';

const CORAL = '#ff5841';
const TEAL = '#00a3ab';
const INK = '#0b1b2d';
const BAR = Math.round((HEIGHT - 1920 / 2.39) / 2); // bars of a 2.39:1 cinema frame

// Finishing layers over the 3D picture: a faint colour wash, a soft vignette, a little film grain,
// and a gentle dip to white on every cut. Kept quiet on purpose.
export const Finish = () => {
  const frame = useCurrentFrame();
  // Distance in frames to the nearest cut: the picture breathes through white for a few frames around it
  const near = ALL_CUTS.reduce((best, c) => Math.min(best, Math.abs(frame - c)), 999);
  const dip = interpolate(near, [0, 7], [0.85, 0], clamp);
  const alert = S.scenes[sceneAt(frame)].tone === 'alert';
  const tint = alert ? '255, 88, 65' : '0, 163, 171';

  return (
    <>
      {/* Faint colour wash from the top corner: coral while the video shows the problem, teal for the solution */}
      <AbsoluteFill style={{background: `radial-gradient(110% 90% at 88% 0%, rgba(${tint}, 0.07) 0%, rgba(${tint}, 0) 60%)`}} />
      {/* Vignette */}
      <AbsoluteFill style={{background: 'radial-gradient(120% 120% at 50% 50%, rgba(11,27,45,0) 58%, rgba(11,27,45,0.14) 100%)'}} />
      {/* Film grain */}
      <AbsoluteFill style={{opacity: 0.05, mixBlendMode: 'multiply'}}>
        <svg width="100%" height="100%">
          <filter id="grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={frame % 12} />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#grain)" />
        </svg>
      </AbsoluteFill>
      {/* Dip to white on every cut */}
      <AbsoluteFill style={{background: `rgba(246, 247, 249, ${dip})`}} />
    </>
  );
};

// Cinema bars. They go on top of everything else, captions included.
export const Bars = () => (
  <>
    <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: BAR, background: INK}} />
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: BAR, background: INK}} />
  </>
);

// One caption line that rises word by word. Highlighted words take the colour of the scene's tone.
const Line = ({parts, start, tone, size}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const words = [];
  parts.forEach((part) =>
    part.t
      .split(' ')
      .filter(Boolean)
      .forEach((w) => words.push({w, em: part.em})),
  );
  return (
    <div
      style={{
        fontFamily: F.serif,
        fontSize: size,
        lineHeight: 1.1,
        letterSpacing: '-0.01em',
        color: INK,
        textAlign: 'center',
        textShadow: '0 0 24px rgba(246,247,249,1), 0 0 10px rgba(246,247,249,1), 0 0 4px rgba(246,247,249,0.9)',
      }}
    >
      {words.map((x, i) => {
        const p = spring({frame: frame - start - i * 3, fps, config: {damping: 200}});
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              margin: '0 0.12em',
              opacity: p,
              transform: `translateY(${(1 - p) * 26}px)`,
              filter: `blur(${(1 - p) * 6}px)`,
              fontStyle: x.em ? 'italic' : 'normal',
              color: x.em ? (tone === 'alert' ? CORAL : TEAL) : undefined,
            }}
          >
            {x.w}
          </span>
        );
      })}
    </div>
  );
};

// Closing card of the last scene: the call to action as a button, and the web address
const CallToAction = ({start}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - start, fps, config: {damping: 14, stiffness: 120}});
  const q = spring({frame: frame - start - 14, fps, config: {damping: 200}});
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, marginTop: 14}}>
      <div
        style={{
          padding: '20px 54px',
          borderRadius: 999,
          background: CORAL,
          color: '#ffffff',
          fontFamily: F.sans,
          fontWeight: 600,
          fontSize: 44,
          boxShadow: '0 16px 40px rgba(255, 88, 65, 0.38)',
          opacity: Math.min(1, p * 2),
          transform: `scale(${0.6 + p * 0.4})`,
        }}
      >
        {S.cta}
      </div>
      <div style={{fontFamily: F.sans, fontWeight: 500, fontSize: 30, letterSpacing: '0.04em', color: INK, opacity: q, textShadow: '0 0 16px rgba(246,247,249,1)'}}>{S.url}</div>
    </div>
  );
};

// Captions of one scene, centred in the lower third above the cinema bar
export const SceneCaptions = ({index}) => {
  const frame = useCurrentFrame();
  const scene = S.scenes[index];
  const duration = SCENES[index].duration;
  const last = index === S.scenes.length - 1;
  const out = last ? 1 : interpolate(frame, [duration - 8, duration], [1, 0], clamp);
  const lines = last ? scene.lines.slice(0, 1) : scene.lines;
  return (
    <AbsoluteFill
      style={{
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingBottom: BAR + (last ? 40 : 54),
        opacity: out,
        // Soft white band behind the captions so they read over any picture
        background: `linear-gradient(to top, rgba(246,247,249,0.94) ${BAR}px, rgba(246,247,249,0.86) ${BAR + (last ? 250 : 150)}px, rgba(246,247,249,0) ${BAR + (last ? 420 : 300)}px)`,
      }}
    >
      <div style={{maxWidth: 1500, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6}}>
        {lines.map((line, i) => (
          <Line key={i} parts={line.parts} start={f(line.at)} tone={scene.tone} size={last ? 84 : lines.length > 1 ? 64 : 70} />
        ))}
        {last && <CallToAction start={f(scene.lines[1].at)} />}
      </div>
    </AbsoluteFill>
  );
};
