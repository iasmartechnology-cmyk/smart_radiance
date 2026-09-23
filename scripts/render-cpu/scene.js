/**
 * Offline scene for the homepage backdrop: a desktop processor that comes
 * apart layer by layer and reassembles as the page scrolls.
 *
 * This file never ships to visitors. render.mjs opens scene.html in headless
 * Chrome, calls `window.renderFrame(t)` for evenly spaced t in [0, 1] and
 * saves each frame; encode.sh turns those into the WebP sequence that
 * SequenceBackground scrubs.
 *
 * Script (t is the scroll position of the whole page):
 *   0.00–0.12  hero        assembled CPU, slow push-in
 *   0.12–0.36  services    heat spreader lifts off, thermal layer follows
 *   0.36–0.56  automation  the dies rise and power up; a wave of light runs
 *                          out along the substrate traces
 *   0.56–0.80  process     contacts drop away — full exploded stack
 *   0.80–1.00  contact     everything reassembles and the chip glows warm
 */
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";

const params = new URLSearchParams(location.search);
const MODE = params.get("mode") === "mobile" ? "mobile" : "desktop";
const W = window.innerWidth;
const H = window.innerHeight;

// Deterministic randomness so every render of the scene is identical.
let seed = 7;
const rand = () => {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
};

const clamp01 = (x) => Math.min(1, Math.max(0, x));
const ease = (x) => {
  const t = clamp01(x);
  return t * t * t * (t * (t * 6 - 15) + 10); // smootherstep
};
/** Eased 0→1 progress of t through [a, b]. */
const seg = (t, a, b) => ease((t - a) / (b - a));

// ---------------------------------------------------------------- renderer
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  preserveDrawingBuffer: true,
});
renderer.setPixelRatio(1);
renderer.setSize(W, H);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.9;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
scene.environmentIntensity = 0.35;

// Backdrop: brand onyx with a soft lift behind the chip and dark corners.
{
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 1024;
  const g = c.getContext("2d");
  const cx = MODE === "desktop" ? 640 : 512;
  const cy = MODE === "desktop" ? 470 : 600;
  const grad = g.createRadialGradient(cx, cy, 40, cx, cy, 760);
  grad.addColorStop(0, "#262a42");
  grad.addColorStop(0.45, "#1b1c2b");
  grad.addColorStop(1, "#111118");
  g.fillStyle = grad;
  g.fillRect(0, 0, 1024, 1024);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  scene.background = tex;
}

// ------------------------------------------------------------------ camera
const camera = new THREE.PerspectiveCamera(MODE === "desktop" ? 30 : 42, W / H, 0.1, 100);
// Frame shift, animated per frame in renderFrame: the chip starts centred
// (inside the hero's reveal window) and, on desktop, slides right of centre
// as the hero scrolls away so the copy down the left stays clear. On phones
// it simply sits a little low, under the text.
const frameShift = (t) =>
  MODE === "desktop"
    ? camera.setViewOffset(W, H, -W * 0.17 * seg(t, 0.03, 0.16), 0, W, H)
    : camera.setViewOffset(W, H, 0, -H * 0.08, W, H);

// Camera path, evenly spaced in t so a Catmull-Rom curve keeps it moving
// continuously instead of stopping at each keyframe.
const CAM_POS = new THREE.CatmullRomCurve3(
  [
    new THREE.Vector3(6.4, 5.8, 7.8), // hero: 3/4 from above
    new THREE.Vector3(6.6, 5.6, 8.0), // steady as the lid lifts
    new THREE.Vector3(8.0, 5.0, 8.6), // wider to fit the stack
    new THREE.Vector3(9.4, 2.8, 7.8), // low side view of the exploded layers
    new THREE.Vector3(8.2, 4.2, 7.9),
    new THREE.Vector3(6.0, 6.4, 7.2), // back above for the power-on
  ],
  false,
  "catmullrom",
  0.5,
);
const CAM_AIM = new THREE.CatmullRomCurve3(
  [
    new THREE.Vector3(0, 0.1, 0),
    new THREE.Vector3(0, 0.3, 0),
    new THREE.Vector3(0, 0.9, 0),
    new THREE.Vector3(0, 0.7, 0),
    new THREE.Vector3(0, 0.4, 0),
    new THREE.Vector3(0, 0.15, 0),
  ],
  false,
  "catmullrom",
  0.5,
);
const mobileScale = MODE === "mobile" ? 1.45 : 1;

// ------------------------------------------------------------------ lights
const key = new THREE.DirectionalLight("#ffe2bd", 1.7);
key.position.set(4, 9, 3);
key.castShadow = true;
key.shadow.mapSize.set(2048, 2048);
key.shadow.camera.left = -4;
key.shadow.camera.right = 4;
key.shadow.camera.top = 4;
key.shadow.camera.bottom = -4;
key.shadow.bias = -0.0004;
key.shadow.radius = 4;
scene.add(key);

const rim = new THREE.DirectionalLight("#5266eb", 0.45); // brand cobalt, a thin edge only
rim.position.set(-6, 2.5, -5);
scene.add(rim);

const fill = new THREE.DirectionalLight("#c9cfe8", 0.3);
fill.position.set(-3, 3, 6);
scene.add(fill);

// Warm glow from inside the chip for the final power-on.
const core = new THREE.PointLight("#ffb46b", 0, 7, 1.6);
core.position.set(0, 0.5, 0);
scene.add(core);

// ---------------------------------------------------------------- textures
const canvasTex = (w, h, draw, srgb = true) => {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  draw(c.getContext("2d"), w, h);
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
};

/** Gold routing from the die area out to the edge pads. */
const traces = [];
for (let i = 0; i < 150; i++) {
  const side = Math.floor(rand() * 4);
  const along = 0.08 + rand() * 0.84;
  const pts = [];
  let x = 0.5 + (rand() - 0.5) * 0.46;
  let y = 0.5 + (rand() - 0.5) * 0.46;
  pts.push([x, y]);
  const ex = side === 0 ? 0.03 : side === 1 ? 0.97 : along;
  const ey = side === 2 ? 0.03 : side === 3 ? 0.97 : along;
  // Orthogonal then 45° run, like real substrate routing.
  const mid = rand() * 0.5 + 0.25;
  if (side < 2) {
    x = x + (ex - x) * mid;
    pts.push([x, y]);
    const d = Math.min(Math.abs(ey - y), Math.abs(ex - x));
    x += Math.sign(ex - x) * d;
    y += Math.sign(ey - y) * d;
    pts.push([x, y]);
  } else {
    y = y + (ey - y) * mid;
    pts.push([x, y]);
    const d = Math.min(Math.abs(ey - y), Math.abs(ex - x));
    x += Math.sign(ex - x) * d;
    y += Math.sign(ey - y) * d;
    pts.push([x, y]);
  }
  pts.push([ex, ey]);
  traces.push(pts);
}
const strokeTraces = (g, w, h, color, width) => {
  g.strokeStyle = color;
  g.lineWidth = width;
  g.lineJoin = "round";
  for (const p of traces) {
    g.beginPath();
    g.moveTo(p[0][0] * w, p[0][1] * h);
    for (const q of p.slice(1)) g.lineTo(q[0] * w, q[1] * h);
    g.stroke();
  }
};

const substrateMap = canvasTex(2048, 2048, (g, w, h) => {
  g.fillStyle = "#0f2420";
  g.fillRect(0, 0, w, h);
  strokeTraces(g, w, h, "rgba(214,170,92,0.55)", 3);
  // Edge pad ring
  g.fillStyle = "#c9a15a";
  for (let i = 0; i < 64; i++) {
    const p = 60 + i * ((w - 120) / 63);
    g.fillRect(p - 6, 22, 12, 22);
    g.fillRect(p - 6, h - 44, 12, 22);
    g.fillRect(22, p - 6, 22, 12);
    g.fillRect(w - 44, p - 6, 22, 12);
  }
  // Silkscreen corner mark
  g.fillStyle = "#e9e6dc";
  g.beginPath();
  g.moveTo(70, 70);
  g.lineTo(170, 70);
  g.lineTo(70, 170);
  g.fill();
});

// Emissive map for the substrate, redrawn every frame: a ring of light that
// travels out from the dies, masked to the traces.
const traceMask = document.createElement("canvas");
traceMask.width = traceMask.height = 1024;
{
  const g = traceMask.getContext("2d");
  g.fillStyle = "#000";
  g.fillRect(0, 0, 1024, 1024);
  strokeTraces(g, 1024, 1024, "#fff", 3);
}
const waveCanvas = document.createElement("canvas");
waveCanvas.width = waveCanvas.height = 1024;
const waveTex = new THREE.CanvasTexture(waveCanvas);
waveTex.colorSpace = THREE.SRGBColorSpace;
const drawWave = (radius, base) => {
  const g = waveCanvas.getContext("2d");
  g.globalCompositeOperation = "source-over";
  g.fillStyle = "#000";
  g.fillRect(0, 0, 1024, 1024);
  if (radius > 0 || base > 0) {
    const r = Math.max(1, radius * 820);
    const grad = g.createRadialGradient(512, 512, Math.max(0, r - 170), 512, 512, r + 10);
    grad.addColorStop(0, `rgba(255,255,255,${base})`);
    grad.addColorStop(0.8, "rgba(255,255,255,1)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, 1024, 1024);
    g.globalCompositeOperation = "multiply";
    g.drawImage(traceMask, 0, 0);
  }
  waveTex.needsUpdate = true;
};

/** Procedural die shot: core blocks, cache arrays and routing channels. */
const dieShot = (cols, rows, hue) =>
  canvasTex(1024, 1024, (g, w, h) => {
    g.fillStyle = `hsl(${hue}, 32%, 13%)`;
    g.fillRect(0, 0, w, h);
    const pad = 40;
    const cw = (w - pad * 2) / cols;
    const ch = (h - pad * 2) / rows;
    for (let cx = 0; cx < cols; cx++) {
      for (let cy = 0; cy < rows; cy++) {
        const x = pad + cx * cw + 8;
        const y = pad + cy * ch + 8;
        const bw = cw - 16;
        const bh = ch - 16;
        g.fillStyle = `hsl(${hue + rand() * 30 - 15}, ${28 + rand() * 18}%, ${18 + rand() * 10}%)`;
        g.fillRect(x, y, bw, bh);
        // Cache: dense stripes on part of each block
        g.fillStyle = `hsla(${hue + 20}, 30%, 36%, 0.55)`;
        const stripes = 10 + Math.floor(rand() * 14);
        for (let s = 0; s < stripes; s++) g.fillRect(x + 6, y + 6 + s * (bh * 0.45 / stripes), bw * 0.55, 2);
        // Logic: scattered small cells
        for (let k = 0; k < 40; k++) {
          g.fillStyle = `hsla(${hue - 30 + rand() * 60}, 40%, ${25 + rand() * 25}%, 0.8)`;
          g.fillRect(x + bw * 0.6 + rand() * bw * 0.35, y + rand() * bh, 6 + rand() * 14, 4 + rand() * 10);
        }
      }
    }
    g.strokeStyle = `hsla(${hue}, 25%, 45%, 0.35)`;
    g.lineWidth = 2;
    g.strokeRect(pad / 2, pad / 2, w - pad, h - pad);
  });

const dieGlowMap = (cols, rows) =>
  canvasTex(1024, 1024, (g, w, h) => {
    g.fillStyle = "#000";
    g.fillRect(0, 0, w, h);
    g.strokeStyle = "#fff";
    g.lineWidth = 3;
    const pad = 40;
    const cw = (w - pad * 2) / cols;
    const ch = (h - pad * 2) / rows;
    for (let cx = 0; cx <= cols; cx++) {
      g.beginPath();
      g.moveTo(pad + cx * cw, pad);
      g.lineTo(pad + cx * cw, h - pad);
      g.stroke();
    }
    for (let cy = 0; cy <= rows; cy++) {
      g.beginPath();
      g.moveTo(pad, pad + cy * ch);
      g.lineTo(w - pad, pad + cy * ch);
      g.stroke();
    }
  });

/** Brushed-nickel roughness with the engraving picked out. */
const engrave = (g, w, h) => {
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.font = "600 92px Arial, Helvetica, sans-serif";
  g.fillText("SMART RADIANCE", w / 2, h * 0.44);
  g.font = "500 40px Arial, Helvetica, sans-serif";
  g.fillText("SR-01  ·  RADIANT CORE", w / 2, h * 0.56);
  g.fillText("DISEÑO · SEO · AUTOMATIZACIÓN", w / 2, h * 0.63);
  g.beginPath();
  g.arc(w * 0.12, h * 0.12, 22, 0, Math.PI * 2);
  g.fill();
};
const ihsRough = canvasTex(
  2048,
  2048,
  (g, w, h) => {
    g.fillStyle = "rgb(80,80,80)";
    g.fillRect(0, 0, w, h);
    for (let i = 0; i < 2600; i++) {
      const v = 60 + rand() * 50;
      g.fillStyle = `rgba(${v},${v},${v},0.35)`;
      g.fillRect(0, rand() * h, w, 1 + rand() * 2);
    }
    g.fillStyle = "rgb(200,200,200)";
    engrave(g, w, h);
  },
  false,
);
const ihsBump = canvasTex(
  2048,
  2048,
  (g, w, h) => {
    g.fillStyle = "rgb(200,200,200)";
    g.fillRect(0, 0, w, h);
    g.fillStyle = "rgb(120,120,120)";
    engrave(g, w, h);
  },
  false,
);

// --------------------------------------------------------------- materials
const gold = new THREE.MeshPhysicalMaterial({ color: "#d9a653", metalness: 1, roughness: 0.3 });
const substrateMat = new THREE.MeshPhysicalMaterial({
  map: substrateMap,
  roughness: 0.5,
  metalness: 0.1,
  clearcoat: 0.7,
  clearcoatRoughness: 0.25,
  emissive: new THREE.Color("#ffb05c"),
  emissiveMap: waveTex,
  emissiveIntensity: 0,
});
const substrateEdge = new THREE.MeshPhysicalMaterial({ color: "#0c1b18", roughness: 0.6 });
const ihsMat = new THREE.MeshPhysicalMaterial({
  color: "#c7cad2",
  metalness: 1,
  roughness: 1,
  roughnessMap: ihsRough,
  bumpMap: ihsBump,
  bumpScale: 1.4,
  clearcoat: 0.15,
});
const ihsSide = new THREE.MeshPhysicalMaterial({ color: "#b9bcc4", metalness: 1, roughness: 0.32 });
const timMat = new THREE.MeshPhysicalMaterial({ color: "#9ea3ad", metalness: 0.85, roughness: 0.45 });
const capMat = new THREE.MeshPhysicalMaterial({ color: "#3a3431", roughness: 0.5 });

const makeDieMat = (cols, rows, hue) =>
  new THREE.MeshPhysicalMaterial({
    map: dieShot(cols, rows, hue),
    metalness: 0.45,
    roughness: 0.34,
    iridescence: 0.8,
    iridescenceIOR: 1.5,
    iridescenceThicknessRange: [180, 620],
    clearcoat: 0.5,
    clearcoatRoughness: 0.2,
    emissive: new THREE.Color("#8a9bff"),
    emissiveMap: dieGlowMap(cols, rows),
    emissiveIntensity: 0,
  });
const dieSide = new THREE.MeshPhysicalMaterial({ color: "#20222c", metalness: 0.6, roughness: 0.3 });

// Box with a textured top face only (RoundedBoxGeometry groups: +x -x +y -y +z -z).
const topped = (geo, top, side) => new THREE.Mesh(geo, [side, side, top, side, side, side]);

// ------------------------------------------------------------------ model
const cpu = new THREE.Group();
scene.add(cpu);

// 1. Contacts (LGA pads) on their own carrier so they can drop away.
const contacts = new THREE.Group();
{
  const n = 38;
  const pad = new THREE.CylinderGeometry(0.032, 0.032, 0.02, 12);
  const inst = new THREE.InstancedMesh(pad, gold, n * n);
  const m = new THREE.Matrix4();
  let k = 0;
  const step = 3.3 / (n - 1);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const x = -1.65 + i * step;
      const z = -1.65 + j * step;
      // Real LGA packages leave the centre free.
      if (Math.abs(x) < 0.55 && Math.abs(z) < 0.55) continue;
      m.makeTranslation(x, 0, z);
      inst.setMatrixAt(k++, m);
    }
  }
  inst.count = k;
  inst.castShadow = true;
  contacts.add(inst);
  const carrier = new THREE.Mesh(
    new RoundedBoxGeometry(3.6, 0.03, 3.6, 2, 0.015),
    new THREE.MeshPhysicalMaterial({ color: "#0e0f14", roughness: 0.95 }),
  );
  carrier.position.y = 0.022;
  carrier.receiveShadow = true;
  contacts.add(carrier);
}
cpu.add(contacts);

// 2. Substrate with capacitors.
const substrate = new THREE.Group();
{
  const board = topped(new RoundedBoxGeometry(3.75, 0.1, 3.75, 3, 0.03), substrateMat, substrateEdge);
  board.castShadow = board.receiveShadow = true;
  substrate.add(board);
  const capGeo = new THREE.BoxGeometry(0.14, 0.06, 0.07);
  const caps = new THREE.InstancedMesh(capGeo, capMat, 40);
  const m = new THREE.Matrix4();
  for (let i = 0; i < 40; i++) {
    const side = i % 4;
    const a = -1.4 + (Math.floor(i / 4) / 9) * 2.8;
    const x = side === 0 ? -1.62 : side === 1 ? 1.62 : a;
    const z = side === 2 ? -1.62 : side === 3 ? 1.62 : a;
    m.makeRotationY(side < 2 ? Math.PI / 2 : 0).setPosition(x, 0.08, z);
    caps.setMatrixAt(i, m);
  }
  caps.castShadow = true;
  substrate.add(caps);
}
cpu.add(substrate);

// 3. Dies: one I/O die and two compute chiplets.
const dies = [];
{
  const specs = [
    { w: 1.35, d: 0.85, x: 0, z: 0.5, cols: 3, rows: 2, hue: 232 },
    { w: 0.72, d: 0.55, x: -0.52, z: -0.52, cols: 4, rows: 2, hue: 250 },
    { w: 0.72, d: 0.55, x: 0.52, z: -0.52, cols: 4, rows: 2, hue: 250 },
  ];
  for (const s of specs) {
    const mat = makeDieMat(s.cols, s.rows, s.hue);
    const mesh = topped(new RoundedBoxGeometry(s.w, 0.05, s.d, 2, 0.008), mat, dieSide);
    mesh.castShadow = mesh.receiveShadow = true;
    mesh.userData = { x: s.x, z: s.z, mat };
    mesh.position.set(s.x, 0, s.z);
    dies.push(mesh);
    cpu.add(mesh);
  }
}

// 4. Thermal interface layer.
const tim = new THREE.Mesh(new RoundedBoxGeometry(2.2, 0.02, 2.0, 2, 0.008), timMat);
tim.castShadow = tim.receiveShadow = true;
cpu.add(tim);

// 5. Integrated heat spreader: top plate plus a flange.
const ihs = new THREE.Group();
{
  const top = topped(new RoundedBoxGeometry(2.95, 0.14, 2.95, 4, 0.06), ihsMat, ihsSide);
  top.position.y = 0.06;
  top.castShadow = top.receiveShadow = true;
  const flange = new THREE.Mesh(new RoundedBoxGeometry(3.35, 0.05, 3.35, 3, 0.02), ihsSide);
  flange.position.y = -0.03;
  flange.castShadow = true;
  ihs.add(top, flange);
}
cpu.add(ihs);

// ------------------------------------------------------------- composing
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(new THREE.Vector2(W, H), 0.18, 0.5, 0.92);
composer.addPass(bloom);
composer.addPass(new OutputPass());

// ------------------------------------------------------------------ frame
const aim = new THREE.Vector3();
const renderAt = (t) => {
  // Layer heights, assembled → exploded → reassembled.
  const lift = (a, b) => seg(t, a, b);
  const down = seg(t, 0.8, 0.96);

  const lidUp = lift(0.12, 0.34) * (1 - down);
  ihs.position.y = 0.25 + 2.05 * lidUp;
  ihs.rotation.x = -0.32 * lidUp;
  ihs.rotation.z = 0.2 * lidUp;

  const timUp = lift(0.18, 0.37) * (1 - seg(t, 0.8, 0.94));
  tim.position.y = 0.155 + 1.45 * timUp;
  tim.rotation.x = -0.12 * timUp;

  dies.forEach((d, i) => {
    const up = lift(0.36 + i * 0.03, 0.5 + i * 0.03) * (1 - seg(t, 0.82, 0.95));
    d.position.set(d.userData.x * (1 + 0.35 * up), 0.075 + 0.85 * up, d.userData.z * (1 + 0.35 * up));
    const on = lift(0.4, 0.52) * (1 - 0.6 * down);
    d.userData.mat.emissiveIntensity = 0.3 * on + 0.4 * seg(t, 0.9, 1);
  });

  contacts.position.y = -0.075 - 0.95 * lift(0.56, 0.72) * (1 - seg(t, 0.83, 0.97));

  // Power wave out along the traces, then a steady warm glow at the end.
  const wave = seg(t, 0.42, 0.66);
  const settle = seg(t, 0.88, 1);
  drawWave(wave > 0 && wave < 1 ? wave : settle > 0 ? 1.2 : 0, 0.15 * settle);
  substrateMat.emissiveIntensity = (wave > 0 && wave < 1 ? 0.9 : 0) + 0.6 * settle;
  core.intensity = 2.2 * settle;
  bloom.strength = 0.18 + 0.22 * settle;

  // Slow turntable so the chip is always in motion.
  cpu.rotation.y = -0.45 + 0.8 * t;

  frameShift(t);
  CAM_POS.getPoint(t, camera.position);
  camera.position.multiplyScalar(mobileScale);
  CAM_AIM.getPoint(t, aim);
  camera.lookAt(aim);

  composer.render();
};

// Motion blur by temporal supersampling: each published frame is the average
// of several instants spread across its own slice of the timeline, like a
// film camera's open shutter. Scrubbing then blends between frames that
// already carry their motion, so it reads as continuous movement instead of
// sharp edges cross-dissolving into a double outline.
const acc = document.createElement("canvas");
acc.width = W;
acc.height = H;
acc.style.cssText = "position:fixed;inset:0;width:100%;height:100%";
document.body.appendChild(acc);
const accCtx = acc.getContext("2d");

window.renderFrame = (t, span = 0, samples = 1) => {
  for (let k = 0; k < samples; k++) {
    const tt = clamp01(t + span * ((k + 0.5) / samples - 0.5));
    renderAt(tt);
    // Running average: sample k is weighted 1/(k+1).
    accCtx.globalAlpha = 1 / (k + 1);
    accCtx.drawImage(renderer.domElement, 0, 0);
  }
  accCtx.globalAlpha = 1;
};

window.renderFrame(0);
window.__ready = true;
