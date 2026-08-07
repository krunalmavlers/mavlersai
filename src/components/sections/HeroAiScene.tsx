'use client';

/**
 * Hero visual for /services/ai-development — a WebGL pipeline scene, ported
 * from the `ai-development-hero.html` / `ai-hero-scene.js` Claude Design
 * project (Mavlers deck design system: yellow #FFDB2D, orange #FFA300).
 *
 * Left to right: your knowledge (documents, database, API node) flows as
 * particles into a vector index, through the LLM core, and out into the three
 * things we ship — cited answers, agents that act, live dashboards. Labels are
 * plain DOM projected onto the canvas each frame, as in the design.
 *
 * three is imported dynamically so it never lands in the shared bundle, and
 * the scene only ever mounts on the large-screen (lg) layout. Reduced-motion
 * visitors get a single static frame; anything without WebGL falls back to the
 * CSS pipeline in HeroAiPipeline.
 */

import { useEffect, useRef, useState } from 'react';
import { HeroAiPipeline } from './HeroAiPipeline';

const YELLOW = 0xffdb2d;
const ORANGE = 0xffa300;

/**
 * World-space fit box the camera frames. The design's stage is ~700px wide;
 * ours is ~520px inside the hero grid, so the box is a little wider than the
 * design's 17.6 × 11.6 to keep the output panels and their labels off the edge.
 */
const FIT_W = 19.4;
const FIT_H = 12.2;

const SRC_X = -6.1;
const INDEX_X = -2.2;
const CORE_X = 1.7;
const OUT_X = 5.9;
const srcY = [2.15, 0, -2.15];
const outY = [2.2, 0, -2.2];

type Three = typeof import('three');

/**
 * Builds the scene into `canvas`, sized to `wrap`, and starts the loop.
 * Returns a teardown function.
 */
function build(THREE: Three, canvas: HTMLCanvasElement, wrap: HTMLElement, still: boolean) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 200);

  scene.add(new THREE.AmbientLight(0xffffff, 0.55));
  const key = new THREE.DirectionalLight(0xffffff, 1.5);
  key.position.set(4, 8, 7);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xffd980, 0.7);
  rim.position.set(-7, 2, -5);
  scene.add(rim);
  const coreLight = new THREE.PointLight(YELLOW, 8, 9, 2);
  coreLight.position.set(1.6, 0, 0);
  scene.add(coreLight);

  /* ---------- materials ---------- */
  const mGraphite = new THREE.MeshStandardMaterial({ color: 0x3a3d44, roughness: 0.5, metalness: 0.45 });
  const mSteel = new THREE.MeshStandardMaterial({ color: 0x4a4a50, roughness: 0.35, metalness: 0.8 });
  const mPaper = new THREE.MeshStandardMaterial({ color: 0xe9e9ea, roughness: 0.75, metalness: 0.02 });
  const mBrand = new THREE.MeshStandardMaterial({ color: YELLOW, roughness: 0.3, metalness: 0.15, emissive: YELLOW, emissiveIntensity: 0.35 });
  const mCore = new THREE.MeshStandardMaterial({ color: 0xffd24a, roughness: 0.25, metalness: 0.1, emissive: ORANGE, emissiveIntensity: 0.45 });
  const mWire = new THREE.MeshBasicMaterial({ color: 0x5a5a60, wireframe: true, transparent: true, opacity: 0.5 });

  const root = new THREE.Group();
  root.name = 'aiPipeline';
  scene.add(root);

  const box = (w: number, h: number, d: number) => new THREE.BoxGeometry(w, h, d);

  /* ---------- glow sprite texture ---------- */
  const glowTexture = () => {
    const s = 256;
    const cv = document.createElement('canvas');
    cv.width = cv.height = s;
    const ctx = cv.getContext('2d')!;
    const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    g.addColorStop(0, 'rgba(255,219,45,0.9)');
    g.addColorStop(0.35, 'rgba(255,163,0,0.28)');
    g.addColorStop(1, 'rgba(255,163,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s, s);
    return new THREE.CanvasTexture(cv);
  };

  /* ---------- knowledge sources (left) ---------- */
  const sources = new THREE.Group();
  root.add(sources);

  const docs = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const p = new THREE.Mesh(box(1.18, 1.52, 0.05), mPaper);
    p.position.set(-i * 0.16, i * 0.1, -i * 0.16);
    p.rotation.set(0.05, 0.38 - i * 0.05, -0.04 + i * 0.02);
    docs.add(p);
    if (i === 2) {
      [0.42, 0.22, 0.02, -0.18].forEach((y, j) => {
        const l = new THREE.Mesh(box(j === 0 ? 0.5 : 0.78 - j * 0.06, 0.055, 0.012), j === 0 ? mBrand : mSteel);
        l.position.set(-0.12, y, 0.032);
        p.add(l);
      });
    }
  }
  docs.position.set(SRC_X, srcY[0], 0);
  sources.add(docs);

  const db = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const d = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.72, 0.26, 48), mGraphite);
    d.position.y = i * 0.34;
    db.add(d);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.723, 0.018, 12, 64), mBrand);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = i * 0.34 + 0.13;
    db.add(ring);
  }
  db.position.set(SRC_X, srcY[1] - 0.35, 0);
  sources.add(db);

  const api = new THREE.Group();
  api.add(new THREE.Mesh(new THREE.OctahedronGeometry(0.52, 0), mSteel));
  const apiCage = new THREE.Mesh(new THREE.OctahedronGeometry(0.86, 0), mWire);
  api.add(apiCage);
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2;
    const n = new THREE.Mesh(new THREE.SphereGeometry(0.1, 20, 16), mBrand);
    n.position.set(Math.cos(a) * 0.86, 0, Math.sin(a) * 0.86);
    api.add(n);
  }
  api.position.set(SRC_X, srcY[2], 0);
  sources.add(api);

  /* ---------- vector index ---------- */
  const index = new THREE.Group();
  index.position.set(INDEX_X, 0, 0);
  root.add(index);
  const shell = new THREE.Mesh(new THREE.IcosahedronGeometry(1.65, 1), mWire);
  index.add(shell);

  const cellsN = 5;
  const cellMat = new THREE.MeshStandardMaterial({ roughness: 0.4, metalness: 0.6 });
  const cells = new THREE.InstancedMesh(box(0.13, 0.13, 0.13), cellMat, cellsN ** 3);
  const dummy = new THREE.Object3D();
  const cellBase: InstanceType<Three['Vector3']>[] = [];
  const cellHot: boolean[] = [];
  const colGrey = new THREE.Color(0x6d7076);
  const colHot = new THREE.Color(YELLOW);
  let ci = 0;
  for (let x = 0; x < cellsN; x++)
    for (let y = 0; y < cellsN; y++)
      for (let z = 0; z < cellsN; z++) {
        const p = new THREE.Vector3((x - 2) * 0.52, (y - 2) * 0.52, (z - 2) * 0.52);
        cellBase.push(p);
        const hot = Math.random() < 0.16;
        cellHot.push(hot);
        cells.setColorAt(ci, hot ? colHot : colGrey);
        dummy.position.copy(p);
        dummy.updateMatrix();
        cells.setMatrixAt(ci++, dummy.matrix);
      }
  cells.instanceColor!.needsUpdate = true;
  index.add(cells);

  /* ---------- LLM core ---------- */
  const core = new THREE.Group();
  core.position.set(CORE_X, 0, 0);
  root.add(core);
  const brain = new THREE.Mesh(new THREE.IcosahedronGeometry(1.05, 2), mCore);
  core.add(brain);
  const facet = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.42, 1),
    new THREE.MeshBasicMaterial({ color: YELLOW, wireframe: true, transparent: true, opacity: 0.35 }),
  );
  core.add(facet);
  const rings: InstanceType<Three['Mesh']>[] = [];
  for (let i = 0; i < 3; i++) {
    const r = new THREE.Mesh(new THREE.TorusGeometry(1.85 + i * 0.28, 0.022, 12, 128), mBrand);
    r.rotation.set(Math.PI / 2 + i * 0.5, i * 0.7, i * 0.3);
    core.add(r);
    rings.push(r);
  }
  const glow = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: glowTexture(), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }),
  );
  glow.scale.set(6.2, 6.2, 1);
  core.add(glow);

  /* ---------- production outputs (right) ---------- */
  const outputs = new THREE.Group();
  root.add(outputs);
  const panelMat = new THREE.MeshStandardMaterial({ color: 0x23262b, roughness: 0.45, metalness: 0.4 });

  const panel = (y: number) => {
    const g = new THREE.Group();
    const back = new THREE.Mesh(box(2.26, 1.53, 0.06), mSteel);
    back.position.z = -0.03;
    g.add(back);
    g.add(new THREE.Mesh(box(2.15, 1.42, 0.1), panelMat));
    const edge = new THREE.Mesh(box(2.15, 0.07, 0.101), mBrand);
    edge.position.set(0, 0.675, 0.001);
    g.add(edge);
    g.position.set(OUT_X, y, 0);
    g.rotation.y = -0.34;
    outputs.add(g);
    return g;
  };

  // cited answers
  const pAns = panel(outY[0]);
  [0.28, 0.08, -0.12].forEach((y, i) => {
    const l = new THREE.Mesh(box(1.5 - i * 0.32, 0.075, 0.03), mPaper);
    l.position.set(-0.24 + i * 0.16, y, 0.06);
    pAns.add(l);
  });
  [0, 1, 2].forEach((i) => {
    const c = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.085, 0.03, 24), mBrand);
    c.rotation.x = Math.PI / 2;
    c.position.set(-0.78 + i * 0.24, -0.42, 0.06);
    pAns.add(c);
  });

  // agents that act
  const pAgent = panel(outY[1]);
  const agentHub = new THREE.Mesh(new THREE.IcosahedronGeometry(0.26, 1), mBrand);
  agentHub.position.set(-0.6, -0.1, 0.14);
  pAgent.add(agentHub);
  for (let i = 0; i < 3; i++) {
    const t = new THREE.Mesh(box(0.34, 0.34, 0.06), mSteel);
    t.position.set(0.25 + (i % 2) * 0.5, 0.24 - i * 0.36, 0.1);
    pAgent.add(t);
    const link = new THREE.Mesh(box(t.position.x + 0.6, 0.018, 0.018), mBrand);
    link.position.set((-0.6 + t.position.x) / 2, (-0.1 + t.position.y) / 2, 0.12);
    link.rotation.z = Math.atan2(t.position.y + 0.1, t.position.x + 0.6);
    pAgent.add(link);
  }

  // live dashboards
  const pDash = panel(outY[2]);
  const bars: InstanceType<Three['Mesh']>[] = [];
  for (let i = 0; i < 6; i++) {
    const b = new THREE.Mesh(box(0.16, 1, 0.06), i === 4 ? mBrand : mSteel);
    b.position.set(-0.78 + i * 0.28, -0.3, 0.08);
    pDash.add(b);
    bars.push(b);
  }
  const axis = new THREE.Mesh(box(1.78, 0.02, 0.03), mWire);
  axis.position.set(-0.05, -0.55, 0.08);
  pDash.add(axis);

  /* ---------- flow particles along source → index → core → output ---------- */
  const srcPts = srcY.map((y) => new THREE.Vector3(SRC_X + 0.9, y, 0));
  const outPts = outY.map((y) => new THREE.Vector3(OUT_X - 1.15, y, 0));
  const curves: InstanceType<Three['CatmullRomCurve3']>[] = [];
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++) {
      curves.push(
        new THREE.CatmullRomCurve3(
          [
            srcPts[i],
            new THREE.Vector3(-4.2, srcY[i] * 0.72, 0.5),
            new THREE.Vector3(INDEX_X, srcY[i] * 0.22, 0),
            new THREE.Vector3(-0.3, 0, -0.4),
            new THREE.Vector3(CORE_X, 0, 0),
            new THREE.Vector3(3.5, outY[j] * 0.3, 0.4),
            outPts[j],
          ],
          false,
          'catmullrom',
          0.4,
        ),
      );
    }

  const PER = 16;
  const N = curves.length * PER;
  const pPos = new Float32Array(N * 3);
  const pCol = new Float32Array(N * 3);
  const pT = new Float32Array(N);
  const pSpd = new Float32Array(N);
  const pCurve = new Int32Array(N);
  for (let i = 0; i < N; i++) {
    pCurve[i] = Math.floor(i / PER);
    pT[i] = (i % PER) / PER + Math.random() * 0.02;
    pSpd[i] = 0.055 + Math.random() * 0.03;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  pGeo.setAttribute('color', new THREE.BufferAttribute(pCol, 3));
  const pts = new THREE.Points(
    pGeo,
    new THREE.PointsMaterial({
      size: 0.13,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    }),
  );
  root.add(pts);

  const guideMat = new THREE.LineBasicMaterial({ color: YELLOW, transparent: true, opacity: 0.07 });
  curves.forEach((c) => {
    root.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(c.getPoints(90)), guideMat));
  });

  const cIn = new THREE.Color(0x9aa0a8);
  const cMid = new THREE.Color(ORANGE);
  const cOut = new THREE.Color(YELLOW);
  const tmp = new THREE.Vector3();
  const tc = new THREE.Color();

  /* ---------- DOM labels projected onto the canvas ---------- */
  // Anchors are spread further apart vertically than the design's: the stage is
  // narrower here, so the stage labels would otherwise collide horizontally.
  const anchors: Record<string, InstanceType<Three['Vector3']>> = {
    in: new THREE.Vector3(SRC_X, 4.6, 0),
    index: new THREE.Vector3(INDEX_X, -3.9, 0),
    core: new THREE.Vector3(CORE_X, 3.6, 0),
    out: new THREE.Vector3(OUT_X, 5.5, 0),
    s0: new THREE.Vector3(SRC_X, srcY[0] - 0.95, 0),
    s1: new THREE.Vector3(SRC_X, srcY[1] - 1.15, 0),
    s2: new THREE.Vector3(SRC_X, srcY[2] - 1.15, 0),
    o0: new THREE.Vector3(OUT_X, outY[0] - 1.15, 0),
    o1: new THREE.Vector3(OUT_X, outY[1] - 1.15, 0),
    o2: new THREE.Vector3(OUT_X, outY[2] - 1.15, 0),
  };
  const labelEls = [...wrap.querySelectorAll<HTMLElement>('[data-a]')]
    .map((el) => ({ el, a: anchors[el.dataset.a!] }))
    .filter((l) => l.a);

  const placeLabels = () => {
    const w = wrap.clientWidth;
    const h = wrap.clientHeight;
    for (const { el, a } of labelEls) {
      tmp.copy(a).applyMatrix4(root.matrixWorld).project(camera);
      el.style.left = `${(tmp.x * 0.5 + 0.5) * w}px`;
      el.style.top = `${(-tmp.y * 0.5 + 0.5) * h}px`;
      el.style.opacity = '1';
    }
  };

  /* ---------- fit the camera to the box, whatever the aspect ---------- */
  const resize = () => {
    const w = wrap.clientWidth;
    const h = wrap.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    const vFov = THREE.MathUtils.degToRad(camera.fov);
    const distH = FIT_H / 2 / Math.tan(vFov / 2);
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * camera.aspect);
    const distW = FIT_W / 2 / Math.tan(hFov / 2);
    camera.position.set(0.6, 1.45, Math.max(distH, distW) * 1.04);
    camera.lookAt(0, 0.3, 0);
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(wrap);
  resize();

  /* ---------- pointer parallax ---------- */
  let mx = 0;
  let my = 0;
  let tmx = 0;
  let tmy = 0;
  const onPointer = (e: PointerEvent) => {
    const r = wrap.getBoundingClientRect();
    tmx = ((e.clientX - r.left) / r.width - 0.5) * 2;
    tmy = ((e.clientY - r.top) / r.height - 0.5) * 2;
  };
  if (!still) window.addEventListener('pointermove', onPointer);

  /* ---------- loop ---------- */
  const clock = new THREE.Clock();
  let raf = 0;
  let visible = true;

  const step = (dt: number, t: number) => {
    mx += (tmx - mx) * 0.05;
    my += (tmy - my) * 0.05;
    root.rotation.y = mx * 0.14 + Math.sin(t * 0.18) * 0.035;
    root.rotation.x = -my * 0.07;

    // sources
    docs.position.y = srcY[0] + Math.sin(t * 0.9) * 0.07;
    db.rotation.y = t * 0.25;
    api.rotation.y = -t * 0.4;
    apiCage.rotation.x = t * 0.3;

    // index
    index.rotation.y = t * 0.22;
    shell.rotation.x = -t * 0.15;
    for (let i = 0; i < cellBase.length; i++) {
      const b = cellBase[i];
      const pulse = 0.55 + 0.45 * Math.sin(t * 2.2 + b.x * 2 + b.y * 1.4 + b.z);
      dummy.position.copy(b).multiplyScalar(1 + Math.sin(t * 0.6 + b.y) * 0.03);
      dummy.scale.setScalar(cellHot[i] ? 0.7 + pulse * 0.8 : 0.45 + pulse * 0.35);
      dummy.rotation.set(t * 0.3, t * 0.4, 0);
      dummy.updateMatrix();
      cells.setMatrixAt(i, dummy.matrix);
    }
    cells.instanceMatrix.needsUpdate = true;

    // core
    brain.rotation.y = t * 0.35;
    brain.rotation.x = t * 0.14;
    facet.rotation.y = -t * 0.22;
    facet.rotation.z = t * 0.1;
    rings[0].rotation.z = t * 0.5;
    rings[1].rotation.x = Math.PI / 2 + t * 0.4;
    rings[2].rotation.y = t * 0.6;
    const pulse = 0.9 + Math.sin(t * 2.6) * 0.18;
    mCore.emissiveIntensity = 0.35 + pulse * 0.2;
    glow.scale.setScalar(6.2 + Math.sin(t * 2.6) * 0.4);
    coreLight.intensity = 7 + Math.sin(t * 2.6) * 2.5;

    // outputs
    bars.forEach((b, i) => {
      const h = 0.35 + (0.4 + 0.4 * Math.sin(t * 1.2 + i * 0.8)) * 1.0;
      b.scale.y = h;
      b.position.y = -0.55 + h * 0.5;
    });
    agentHub.rotation.y = t * 0.8;
    agentHub.rotation.x = t * 0.5;
    outputs.children.forEach((g, i) => {
      g.position.y = outY[i] + Math.sin(t * 0.7 + i * 1.5) * 0.06;
    });

    // particles
    for (let i = 0; i < N; i++) {
      pT[i] += pSpd[i] * dt;
      if (pT[i] > 1) pT[i] -= 1;
      const u = pT[i];
      curves[pCurve[i]].getPointAt(u, tmp);
      pPos[i * 3] = tmp.x;
      pPos[i * 3 + 1] = tmp.y;
      pPos[i * 3 + 2] = tmp.z;
      if (u < 0.42) tc.copy(cIn).lerp(cMid, u / 0.42);
      else tc.copy(cMid).lerp(cOut, Math.min(1, (u - 0.42) / 0.3));
      pCol[i * 3] = tc.r;
      pCol[i * 3 + 1] = tc.g;
      pCol[i * 3 + 2] = tc.b;
    }
    pGeo.attributes.position.needsUpdate = true;
    pGeo.attributes.color.needsUpdate = true;
  };

  const frame = () => {
    const dt = Math.min(clock.getDelta(), 0.05);
    step(dt, clock.elapsedTime);
    renderer.render(scene, camera);
    placeLabels();
    raf = requestAnimationFrame(frame);
  };

  // Reduced motion: one settled frame, no loop.
  if (still) {
    step(0, 2.4);
    renderer.render(scene, camera);
    placeLabels();
  } else {
    raf = requestAnimationFrame(frame);
  }

  // Don't burn frames while the hero is scrolled out of view.
  const io = new IntersectionObserver(
    ([entry]) => {
      if (still) return;
      if (entry.isIntersecting && !visible) {
        visible = true;
        clock.getDelta();
        raf = requestAnimationFrame(frame);
      } else if (!entry.isIntersecting && visible) {
        visible = false;
        cancelAnimationFrame(raf);
      }
    },
    { threshold: 0 },
  );
  io.observe(wrap);

  return () => {
    cancelAnimationFrame(raf);
    ro.disconnect();
    io.disconnect();
    window.removeEventListener('pointermove', onPointer);
    scene.traverse((o) => {
      const m = o as InstanceType<Three['Mesh']>;
      m.geometry?.dispose?.();
      const mat = m.material as { dispose?: () => void } | { dispose?: () => void }[] | undefined;
      if (Array.isArray(mat)) mat.forEach((x) => x.dispose?.());
      else mat?.dispose?.();
    });
    renderer.dispose();
  };
}

/* ------------------------------ label markup ------------------------------ */

function Lbl({ a, k, t, s }: { a: string; k: string; t?: string; s?: string }) {
  return (
    <div
      data-a={a}
      className="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-center opacity-0 transition-opacity duration-500"
    >
      <div className="text-[9px] font-bold uppercase tracking-[0.14em] text-brand">{k}</div>
      {t && <div className="mt-1 text-[11.5px] font-semibold text-[#E8E8E8]">{t}</div>}
      {s && <div className="mt-[3px] text-[10px] tracking-[0.02em] text-[#7D7D7D]">{s}</div>}
    </div>
  );
}

function Chip({ a, label, out }: { a: string; label: string; out?: boolean }) {
  return (
    <div
      data-a={a}
      className={`absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full px-2 py-[3px] text-[10px] opacity-0 backdrop-blur-[6px] transition-opacity duration-500 ${
        out
          ? 'border border-brand bg-brand font-semibold text-black'
          : 'border border-white/[0.12] bg-white/[0.06] font-medium text-[#C9C9C9]'
      }`}
    >
      {label}
    </div>
  );
}

/* -------------------------------- component ------------------------------- */

export function HeroAiScene() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    let cancelled = false;
    let teardown: (() => void) | undefined;

    (async () => {
      try {
        const THREE = await import('three');
        if (cancelled) return;
        const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        teardown = build(THREE, canvas, wrap, still);
      } catch {
        // No WebGL / no bundle — fall back to the CSS pipeline.
        if (!cancelled) setFailed(true);
      }
    })();

    return () => {
      cancelled = true;
      teardown?.();
    };
  }, []);

  if (failed) return <HeroAiPipeline />;

  return (
    <div
      ref={wrapRef}
      className="relative aspect-[1/0.70] min-h-[400px] w-full overflow-hidden rounded-[24px] border border-[#1C1C1C] shadow-[0_28px_66px_rgba(0,0,0,0.32)] [background:radial-gradient(120%_95%_at_62%_8%,#151515,#050505_62%)]"
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
      <div className="pointer-events-none absolute inset-0">
        <Lbl a="in" k="Your knowledge in" t="PDFs · Databases · APIs" />
        <Lbl a="index" k="Retrieval" t="Indexed over your data" s="hybrid search · re-ranking" />
        <Lbl a="core" k="LLM reasoning" t="Grounded, streaming" s="3 sources cited" />
        <Lbl a="out" k="Production AI out" />
        <Chip a="s0" label="handbook.pdf · p12" />
        <Chip a="s1" label="crm/accounts" />
        <Chip a="s2" label="api/orders" />
        <Chip a="o0" label="Cited answers" out />
        <Chip a="o1" label="Agents that act" out />
        <Chip a="o2" label="Live dashboards" out />
      </div>
    </div>
  );
}
