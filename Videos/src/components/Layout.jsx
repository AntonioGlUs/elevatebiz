import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F, clamp} from '../theme';

// Fades a scene's text in and out at its edges
export const SceneShell = ({duration, children}) => {
  const frame = useCurrentFrame();
  const a = interpolate(frame, [0, 10], [0, 1], clamp);
  const b = interpolate(frame, [duration - 8, duration], [1, 0], clamp);
  return <AbsoluteFill style={{opacity: Math.min(a, b)}}>{children}</AbsoluteFill>;
};

// Headline that rises word by word. parts: [{t: 'text', em: true}] (em = italic teal)
export const Caption = ({parts, start = 0, size = 78, stagger = 3, align = 'left', style}) => {
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
        lineHeight: 1.08,
        letterSpacing: '-0.01em',
        color: C.ink,
        textAlign: align,
        textShadow: '0 0 26px rgba(248, 246, 242, 0.95)',
        ...style,
      }}
    >
      {words.map((x, i) => {
        const p = spring({frame: frame - start - i * stagger, fps, config: {damping: 200}});
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              margin: '0 0.12em',
              opacity: p,
              transform: `translateY(${(1 - p) * 28}px)`,
              fontStyle: x.em ? 'italic' : 'normal',
              color: x.em ? C.tealInk : undefined,
            }}
          >
            {x.w}
          </span>
        );
      })}
    </div>
  );
};

// Left text column used by scenes 1 to 6
export const LeftColumn = ({children, width = 760}) => (
  <div
    style={{
      position: 'absolute',
      left: 110,
      top: 0,
      bottom: 0,
      width,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      gap: 22,
    }}
  >
    {children}
  </div>
);

// Lightens the left side so the caption reads well over the 3D scene
export const Overlay = ({side}) => (
    <AbsoluteFill
      style={{
        opacity: side,
        background:
          'linear-gradient(90deg, rgba(248, 246, 242, 0.96) 0%, rgba(248, 246, 242, 0.8) 30%, rgba(248, 246, 242, 0) 58%)',
      }}
    />
);
