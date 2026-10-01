"use client";

import { useEffect, useRef, useState } from "react";
import type { BufferGeometry, Group, Material, Mesh, WebGLRenderer } from "three";
import styles from "./Robot3D.module.css";

/*
  3D version of the ElevateBiz robot (same design as the robot PNGs), built with Three.js
  from simple shapes. The head and eyes follow the mouse anywhere on the page, the body
  turns a little, and the whole robot floats. On touch screens (no mouse) it looks around
  on its own. Falls back to the PNG if WebGL isn't available.
*/

const COLORS = {
  white: "#f4f6f8",
  teal: "#3a8f96",
  aqua: "#1fc3d4",
  eye: "#0b0d10",
};

export default function Robot3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    let disposed = false;
    let cleanup = () => {};

    (async () => {
      const THREE = await import("three");
      const { RoomEnvironment } = await import("three/examples/jsm/environments/RoomEnvironment.js");
      if (disposed) return;

      let renderer: WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      } catch {
        setFallback(true);
        return;
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;
      mount.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const pmrem = new THREE.PMREMGenerator(renderer);
      const envMap = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      scene.environment = envMap;

      const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
      camera.position.set(0, 0.38, 7.8);

      const key = new THREE.DirectionalLight("#ffffff", 1.6);
      key.position.set(3, 5, 6);
      scene.add(key, new THREE.HemisphereLight("#ffffff", "#9fb3b8", 0.6));

      // ---------- Materials ----------
      const white = new THREE.MeshPhysicalMaterial({ color: COLORS.white, roughness: 0.3, clearcoat: 0.8, clearcoatRoughness: 0.18 });
      const teal = new THREE.MeshStandardMaterial({ color: COLORS.teal, roughness: 0.4, metalness: 0.05 });
      const aqua = new THREE.MeshStandardMaterial({ color: COLORS.aqua, emissive: "#0aa6b8", emissiveIntensity: 0.45, roughness: 0.3 });
      const eyeMat = new THREE.MeshPhysicalMaterial({ color: COLORS.eye, roughness: 0.12, clearcoat: 1 });
      const glint = new THREE.MeshBasicMaterial({ color: "#ffffff" });

      const mesh = (geo: BufferGeometry, mat: Material) => new THREE.Mesh(geo, mat);

      // ---------- Robot ----------
      const robot = new THREE.Group();
      scene.add(robot);

      // Body (turns a little toward the mouse)
      const body = new THREE.Group();
      robot.add(body);

      const torso = mesh(new THREE.CapsuleGeometry(0.62, 0.38, 12, 32), white);
      torso.scale.set(1, 1, 0.85);
      torso.position.y = -0.38;
      body.add(torso);

      const ring = mesh(new THREE.TorusGeometry(0.19, 0.045, 20, 64), aqua);
      ring.position.set(0, -0.3, 0.52);
      body.add(ring);

      const neck = mesh(new THREE.CylinderGeometry(0.3, 0.36, 0.14, 40), teal);
      neck.position.y = 0.36;
      body.add(neck);

      const arms: Group[] = [];
      for (const side of [-1, 1]) {
        const shoulder = new THREE.Group();
        shoulder.position.set(side * 0.6, 0.08, 0);
        const arm = mesh(new THREE.CapsuleGeometry(0.16, 0.4, 10, 24), white);
        arm.position.y = -0.36;
        const hand = mesh(new THREE.SphereGeometry(0.15, 32, 24), teal);
        hand.position.y = -0.72;
        shoulder.add(arm, hand);
        shoulder.rotation.z = side * 0.28;
        body.add(shoulder);
        arms.push(shoulder);

        const leg = mesh(new THREE.CapsuleGeometry(0.21, 0.1, 10, 24), white);
        leg.position.set(side * 0.27, -1.18, 0.02);
        body.add(leg);
      }

      // Head (follows the mouse the most)
      const head = new THREE.Group();
      head.position.y = 1.0;
      robot.add(head);

      const skull = mesh(new THREE.SphereGeometry(1, 64, 48), white);
      skull.scale.set(1.15, 0.92, 1);
      head.add(skull);

      for (const side of [-1, 1]) {
        const ear = mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.18, 48), white);
        ear.rotation.z = Math.PI / 2;
        ear.position.x = side * 1.1;
        head.add(ear);
      }

      const antenna = mesh(new THREE.CylinderGeometry(0.035, 0.04, 0.34, 16), teal);
      antenna.position.set(0, 1.0, 0);
      const antennaTip = mesh(new THREE.SphereGeometry(0.075, 24, 16), teal);
      antennaTip.position.set(0, 1.19, 0);
      head.add(antenna, antennaTip);

      // Eyes slide a little inside the face, on top of the head turn
      const eyes = new THREE.Group();
      head.add(eyes);
      const eyeMeshes: Mesh[] = [];
      for (const side of [-1, 1]) {
        const eye = mesh(new THREE.SphereGeometry(0.13, 32, 24), eyeMat);
        eye.scale.set(1, 1.25, 0.55);
        eye.position.set(side * 0.36, 0.02, 0.9);
        const shine = mesh(new THREE.SphereGeometry(0.028, 12, 8), glint);
        shine.position.set(side * 0.36 + 0.04, 0.09, 0.97);
        eyes.add(eye, shine);
        eyeMeshes.push(eye);
      }

      // ---------- Mouse ----------
      const target = { x: 0, y: 0 };
      const look = { x: 0, y: 0 };
      let lastMove = -Infinity;

      function onPointerMove(e: PointerEvent) {
        if (e.pointerType !== "mouse") return;
        const rect = mount!.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height * 0.35;
        target.x = Math.max(-1, Math.min(1, (e.clientX - cx) / (window.innerWidth / 2)));
        target.y = Math.max(-1, Math.min(1, (e.clientY - cy) / (window.innerHeight / 2)));
        lastMove = performance.now();
      }
      window.addEventListener("pointermove", onPointerMove, { passive: true });

      // ---------- Size ----------
      function resize() {
        const w = mount!.clientWidth;
        const h = mount!.clientHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      }
      const ro = new ResizeObserver(resize);
      ro.observe(mount);
      resize();

      // ---------- Animation (only while on screen) ----------
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const clock = new THREE.Clock();
      let nextBlink = 2 + Math.random() * 3;
      let frame = 0;
      let onScreen = false;

      function render() {
        const t = clock.getElapsedTime();

        // No mouse for a few seconds (or touch screen): look around slowly on its own
        if (performance.now() - lastMove > 3000) {
          target.x = Math.sin(t * 0.6) * 0.45;
          target.y = Math.sin(t * 0.9) * 0.15;
        }
        look.x += (target.x - look.x) * 0.08;
        look.y += (target.y - look.y) * 0.08;

        head.rotation.y = look.x * 0.6;
        head.rotation.x = look.y * 0.35;
        head.rotation.z = -look.x * 0.06;
        body.rotation.y = look.x * 0.22;
        eyes.position.set(look.x * 0.06, -look.y * 0.04, 0);

        robot.position.y = reduceMotion ? 0 : Math.sin(t * 1.6) * 0.08;
        arms[0].rotation.x = Math.sin(t * 1.6) * 0.06;
        arms[1].rotation.x = -Math.sin(t * 1.6) * 0.06;

        // Blink every few seconds
        if (t > nextBlink) {
          const p = (t - nextBlink) / 0.16;
          const s = p < 1 ? 1 - Math.sin(p * Math.PI) * 0.9 : 1;
          eyeMeshes.forEach((e) => (e.scale.y = 1.25 * s));
          if (p >= 1) nextBlink = t + 2.5 + Math.random() * 3;
        }

        renderer.render(scene, camera);
        frame = onScreen && !reduceMotion ? requestAnimationFrame(render) : 0;
      }

      const io = new IntersectionObserver(([entry]) => {
        onScreen = entry.isIntersecting;
        if (onScreen && !frame) frame = requestAnimationFrame(render);
      });
      io.observe(mount);
      render();

      cleanup = () => {
        cancelAnimationFrame(frame);
        io.disconnect();
        ro.disconnect();
        window.removeEventListener("pointermove", onPointerMove);
        scene.traverse((obj) => {
          if (obj instanceof THREE.Mesh) obj.geometry.dispose();
        });
        [white, teal, aqua, eyeMat, glint].forEach((m) => m.dispose());
        envMap.dispose();
        pmrem.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return (
    <div className={styles.wrap} aria-hidden="true">
      {fallback ? <img src="/images/chatbot-avatar.png" alt="" className={styles.fallback} /> : <div ref={mountRef} className={styles.canvas} />}
      <div className={styles.shadow} />
    </div>
  );
}
