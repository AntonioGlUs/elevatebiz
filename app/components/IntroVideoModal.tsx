"use client";

import { useCallback, useEffect, useRef, useState, type SyntheticEvent } from "react";
import styles from "./IntroVideoModal.module.css";

// One video per language: each has its own voice-over and on-screen text
const VIDEO_SRC = {
  es: "/videos/elevatebiz-intro.mp4",
  en: "/videos/elevatebiz-intro-en.mp4",
};
const PREVIEW_TIME = 3; // second of the video shown as the still picture before it is played
const CLOSE_TIME = 320; // ms, matches the exit animation in the CSS

const LABELS = {
  es: {
    title: "Video de presentación de ElevateBiz",
    close: "Cerrar",
    play: "Reproducir video",
    replay: "Ver de nuevo",
  },
  en: {
    title: "ElevateBiz introduction video",
    close: "Close",
    play: "Play video",
    replay: "Watch again",
  },
};

type Stage = "hidden" | "open" | "closing";

type Props = {
  lang: "es" | "en";
  open: boolean; // set by the "Play video" button in the hero
  onClose: () => void;
};

// Intro video that drops in over a dimmed page when the visitor presses "Play video" in the hero.
export default function IntroVideoModal({ lang, open, onClose }: Props) {
  const [stage, setStage] = useState<Stage>("hidden");
  const [started, setStarted] = useState(false);
  const [ended, setEnded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const playRef = useRef<HTMLButtonElement>(null);
  const l = LABELS[lang] ?? LABELS.en;

  // Opened from the hero button: the video starts right away, with sound (allowed because it follows a click)
  useEffect(() => {
    if (!open) return;
    setEnded(false);
    setStarted(true);
    setStage("open");
  }, [open]);

  const close = useCallback(() => {
    videoRef.current?.pause();
    setStage("closing");
    setTimeout(() => {
      setStage("hidden");
      onClose();
    }, CLOSE_TIME);
  }, [onClose]);

  // Language switched while the video is up: the other video loads and waits on its play button
  useEffect(() => {
    setStarted(false);
    setEnded(false);
  }, [lang]);

  // While it is up: the page behind does not scroll, and Escape closes it
  useEffect(() => {
    if (stage === "hidden") return;
    const html = document.documentElement;
    const previous = html.style.overflow;
    html.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      html.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [stage, close]);

  // Play from the beginning, with sound (allowed because it comes from a click)
  function play() {
    const video = videoRef.current;
    if (!video) return;
    video.muted = false;
    video.currentTime = 0;
    setStarted(true);
    video.play().catch(() => {});
  }

  // Some phones do not send the "ended" event reliably, so the end is also detected from the playback position
  function atEnd(e: SyntheticEvent<HTMLVideoElement>) {
    const video = e.currentTarget;
    setEnded(video.ended || (video.duration > 0 && video.currentTime >= video.duration - 0.15));
  }

  if (stage === "hidden") return null;

  return (
    <div
      className={`${styles.overlay} ${stage === "closing" ? styles.closing : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label={l.title}
      data-lenis-prevent
      onClick={close}
    >
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <div className={styles.frame}>
          <video
            key={lang}
            ref={videoRef}
            className={styles.video}
            src={VIDEO_SRC[lang] ?? VIDEO_SRC.en}
            playsInline
            autoPlay={started}
            controls={started && !ended}
            preload="auto"
            onEnded={() => setEnded(true)}
            onTimeUpdate={atEnd}
            onSeeked={atEnd}
            onPause={atEnd}
            onLoadedMetadata={(e) => {
              if (!started) e.currentTarget.currentTime = PREVIEW_TIME;
            }}
          >
          </video>
          {/* Play button before the video starts; "Watch again" button once it has finished */}
          {(!started || ended) && (
            <button
              type="button"
              ref={playRef}
              className={styles.play}
              onClick={play}
              aria-label={ended ? l.replay : l.play}
            >
              <span className={styles.playIcon}>
                {ended ? (
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M3 12a9 9 0 1 0 3-6.7" />
                    <path d="M3 4v5h5" />
                  </svg>
                ) : (
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l11-6.86a1 1 0 0 0 0-1.72l-11-6.86A1 1 0 0 0 8 5.14z" />
                  </svg>
                )}
              </span>
              {ended && <span className={styles.playLabel}>{l.replay}</span>}
            </button>
          )}
        </div>
        <div className={styles.actions}>
          <button type="button" className={styles.primary} onClick={close}>
            {l.close}
          </button>
        </div>
      </div>
    </div>
  );
}
