"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./onboarding.module.css";

type Lang = "en" | "es";

const COPY = {
  en: {
    start: "Dictate",
    stop: "Done",
    clear: "Clear all",
    clearSure: "Clear? Press again",
    asking: "Asking for the microphone...",
    listening: "Listening... speak now",
    denied: "The microphone is blocked. Click the icon at the left of the address bar, allow the microphone and try again.",
    insecure: "Dictation only works on a secure page (https) or on localhost.",
    noMic: "No microphone was found. Check that one is connected and that your browser is allowed to use it in your system settings.",
    service: "Your browser's dictation service is off. On a Mac, turn on Dictation in System Settings > Keyboard, then try again.",
    network: "Your browser couldn't reach its speech service. Check your connection, or try Chrome.",
    deaf: "I can hear you, but your browser is not turning it into text. Try Chrome, or type your answer.",
    failed: "Dictation stopped ({code}). Press the button to try again.",
  },
  es: {
    start: "Dictar",
    stop: "Terminar",
    clear: "Borrar todo",
    clearSure: "¿Borrar? Presiona otra vez",
    asking: "Pidiendo el micrófono...",
    listening: "Escuchando... habla ahora",
    denied: "El micrófono está bloqueado. Haz clic en el ícono a la izquierda de la barra de direcciones, permite el micrófono e intenta de nuevo.",
    insecure: "El dictado solo funciona en una página segura (https) o en localhost.",
    noMic: "No se encontró un micrófono. Revisa que haya uno conectado y que tu navegador tenga permiso de usarlo en los ajustes del sistema.",
    service: "El servicio de dictado de tu navegador está apagado. En Mac, activa Dictado en Ajustes del Sistema > Teclado e intenta de nuevo.",
    network: "Tu navegador no pudo conectar con su servicio de voz. Revisa tu conexión, o prueba con Chrome.",
    deaf: "Te escucho, pero tu navegador no lo está convirtiendo en texto. Prueba con Chrome, o escribe tu respuesta.",
    failed: "El dictado se detuvo ({code}). Presiona el botón para intentar de nuevo.",
  },
};

// Language the browser listens for
const LOCALE: Record<Lang, string> = { en: "en-US", es: "es-MX" };
const BARS = 5; // bars of the voice meter
const DEAF_AFTER = 7000; // ms of clear voice without any text before warning that nothing is being transcribed

// The browser's speech recognition has no TypeScript types; these are the parts used here
type RecognitionResult = { isFinal: boolean; 0: { transcript: string } };
type RecognitionEvent = { resultIndex: number; results: ArrayLike<RecognitionResult> };
type Recognition = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: RecognitionEvent) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};
type RecognitionClass = new () => Recognition;

function recognitionClass(): RecognitionClass | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { SpeechRecognition?: RecognitionClass; webkitSpeechRecognition?: RecognitionClass };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

type Phase = "idle" | "asking" | "listening";

const join = (before: string, spoken: string) => (before.trim() ? `${before.trimEnd()} ${spoken}` : spoken);

// Connects a text field to the dictation: the words appear in the field while they are being spoken.
// text / setText are the field's value; call onTyped when the visitor edits the field by hand.
export function useLiveText(text: string, setText: (text: string) => void) {
  const base = useRef<string | null>(null); // the field's text before the phrase being spoken
  const current = useRef(text);
  current.current = text;
  const write = useRef(setText);
  write.current = setText;
  const onLive = useCallback((spoken: string, final: boolean) => {
    const before = base.current ?? current.current;
    base.current = final ? null : before; // a finished phrase becomes part of the text
    write.current(spoken ? join(before, spoken) : before);
  }, []);
  const onTyped = useCallback(() => {
    base.current = null;
  }, []);
  return { onLive, onTyped };
}

// Microphone button: the visitor speaks and the words are handed to onLive as they are heard (final = the phrase is finished).
// Uses the browser's own speech recognition (Chrome, Edge, Safari). Where it does not exist, nothing is shown.
// While it listens it shows a live voice meter, so the visitor can see the microphone is picking them up.
type Props = {
  lang: Lang;
  onLive: (spoken: string, final: boolean) => void;
  onClear?: () => void; // shows "Clear all" when the field has something to clear
};

export default function Dictate({ lang, onLive, onClear }: Props) {
  const t = COPY[lang];
  const [supported, setSupported] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [confirmClear, setConfirmClear] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);
  const [level, setLevel] = useState(0); // 0..1, how loud the voice is right now

  const recognition = useRef<Recognition | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const audio = useRef<AudioContext | null>(null);
  const frame = useRef(0);
  const wanted = useRef(false); // the visitor wants it listening (false once they press Stop)
  const gotText = useRef(false);
  const voiceMs = useRef(0);
  const pending = useRef(""); // words of the phrase still being spoken, already shown in the field
  const onLiveRef = useRef(onLive);
  onLiveRef.current = onLive;

  // Whatever was heard of an unfinished phrase stays in the field as normal text
  const commitPending = () => {
    if (!pending.current) return;
    onLiveRef.current(pending.current, true);
    pending.current = "";
  };

  const shutDown = () => {
    wanted.current = false;
    commitPending();
    cancelAnimationFrame(frame.current);
    recognition.current?.abort();
    recognition.current = null;
    stream.current?.getTracks().forEach((track) => track.stop());
    stream.current = null;
    audio.current?.close().catch(() => {});
    audio.current = null;
    setLevel(0);
    setPhase("idle");
  };

  // Checked after mount so the server-rendered page and the browser agree
  useEffect(() => {
    setSupported(recognitionClass() !== null);
    return shutDown;
    // shutDown only touches refs and setters
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fail = (message: string) => {
    shutDown();
    setProblem(message);
  };

  // Live voice level from the microphone, drawn as bars next to the button
  const startMeter = (source: MediaStream) => {
    const Context = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Context) return;
    const context = new Context();
    audio.current = context;
    context.resume().catch(() => {}); // some browsers create it paused
    const analyser = context.createAnalyser();
    analyser.fftSize = 512;
    context.createMediaStreamSource(source).connect(analyser);
    const samples = new Uint8Array(analyser.fftSize);
    let last = performance.now();
    const tick = () => {
      analyser.getByteTimeDomainData(samples);
      let sum = 0;
      for (const sample of samples) sum += ((sample - 128) / 128) ** 2;
      const loudness = Math.min(1, Math.sqrt(sum / samples.length) * 6);
      setLevel(loudness);
      // Clear voice for a while but no text at all: the browser's speech service is not answering
      const now = performance.now();
      if (loudness > 0.15) voiceMs.current += now - last;
      last = now;
      if (!gotText.current && voiceMs.current > DEAF_AFTER) return fail(t.deaf);
      frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
  };

  const startRecognition = () => {
    const Class = recognitionClass();
    if (!Class) return;
    const instance = new Class();
    instance.lang = LOCALE[lang];
    instance.continuous = true; // keeps listening through pauses until the visitor presses Stop
    instance.interimResults = true; // words appear while speaking; only finished phrases are added to the field
    instance.onresult = (event) => {
      gotText.current = true;
      let unfinished = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          pending.current = "";
          onLiveRef.current(result[0].transcript.trim(), true);
        } else unfinished += result[0].transcript;
      }
      // Straight into the field while speaking, so there is no wait for the end of the phrase
      pending.current = unfinished.trim();
      if (pending.current) onLiveRef.current(pending.current, false);
    };
    // Every way it can fail gets its own plain explanation, so the button never looks like it did nothing
    instance.onerror = (event) => {
      const code = event.error;
      if (code === "aborted" || code === "no-speech") return; // silence is not an error: it keeps listening
      if (code === "not-allowed") fail(t.denied);
      else if (code === "service-not-allowed") fail(t.service);
      else if (code === "audio-capture") fail(t.noMic);
      else if (code === "network") fail(t.network);
      else fail(t.failed.replace("{code}", code));
    };
    // Browsers end the session after a silence; while the visitor has not pressed Stop, it starts again
    instance.onend = () => {
      commitPending();
      if (!wanted.current) return;
      try {
        instance.start();
      } catch {
        fail(t.failed.replace("{code}", "restart"));
      }
    };
    recognition.current = instance;
    try {
      instance.start();
    } catch {
      fail(t.failed.replace("{code}", "start"));
    }
  };

  const start = async () => {
    setProblem(null);
    // Browsers refuse the microphone outside https / localhost, without asking
    if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) return setProblem(t.insecure);
    gotText.current = false;
    voiceMs.current = 0;
    wanted.current = true;
    setPhase("asking");
    try {
      // Asking for the microphone directly shows the browser's permission prompt and gives a clear answer
      const source = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (!wanted.current) return source.getTracks().forEach((track) => track.stop()); // stopped while the prompt was up
      stream.current = source;
    } catch (error) {
      const name = (error as { name?: string }).name;
      return fail(name === "NotFoundError" || name === "NotReadableError" ? t.noMic : t.denied);
    }
    setPhase("listening");
    startMeter(stream.current);
    startRecognition();
  };

  if (!supported && !onClear) return null;

  const busy = phase !== "idle";
  // "Clear all" asks for a second press, so a long answer is not lost by accident
  const clear = () => {
    if (!confirmClear) {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 3000);
      return;
    }
    setConfirmClear(false);
    pending.current = "";
    onClear?.();
  };
  return (
    <div className={styles.dictate}>
      {supported && (
        <button type="button" className={busy ? `${styles.mic} ${styles.micOn}` : styles.mic} onClick={busy ? shutDown : start} aria-pressed={busy}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="9" y="3" width="6" height="11" rx="3" />
            <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
          </svg>
          {busy ? t.stop : t.start}
        </button>
      )}
      {phase === "listening" && (
        // The bars always move while it listens (so it is clear the microphone is on) and grow with the voice
        <span className={styles.meter} style={{ transform: `scaleY(${0.7 + Math.min(1, level) * 0.6})` }} aria-hidden="true">
          {Array.from({ length: BARS }, (_, i) => (
            <i key={i} />
          ))}
        </span>
      )}
      <span className={problem ? `${styles.micState} ${styles.micProblem}` : styles.micState} role="status">
        {problem ?? (phase === "asking" ? t.asking : "")}
      </span>
      {onClear && (
        <button type="button" className={`${styles.link} ${styles.clearAll}`} onClick={clear}>
          {confirmClear ? t.clearSure : t.clear}
        </button>
      )}
    </div>
  );
}
