"use client";

import { useFrame } from "@react-three/fiber";
import {
  CatmullRomCurve3,
  Color,
  Vector3,
  type PerspectiveCamera,
} from "three";
import Sky from "./Sky";
import Terrain from "./Terrain";
import Sun from "./Sun";
import Stars from "./Stars";
import Snow from "./Snow";
import { scrollState } from "@/lib/scroll-store";
import { maxHeightAround } from "@/lib/terrain";
import { damp } from "@/lib/utils";

type Props = {
  reduced: boolean;
  mobile: boolean;
};

/**
 * The ascent, as a pair of camera splines.
 *
 * Position and aim are separate Catmull-Rom curves rather than a list of
 * discrete stops, so the motion is continuous in both value and tangent —
 * no direction changes at keyframes, which is what made the old path feel
 * like it snapped between poses.
 *
 * The route spirals up the eastern flank and crests behind the summit, where
 * the camera turns to face the sunrise over the range.
 */
const PATH = new CatmullRomCurve3(
  [
    new Vector3(0, 7, 122), // Valley floor — looking up at the peak
    new Vector3(58, 16, 92), // Approach across the moraine
    new Vector3(84, 30, 20), // Traverse of the east flank
    new Vector3(48, 48, -50), // High on the shoulder
    new Vector3(8, 66, -62), // Cresting the ridge
    new Vector3(0, 76, -34), // Summit
  ],
  false,
  "catmullrom",
  0.5,
);

const AIM = new CatmullRomCurve3(
  [
    new Vector3(0, 44, 0), // Up at the summit from below
    new Vector3(0, 46, 0),
    new Vector3(0, 50, 0),
    new Vector3(0, 52, -4),
    new Vector3(6, 56, -120), // Sun comes into view
    new Vector3(12, 62, -160), // The full sunrise panorama
  ],
  false,
  "catmullrom",
  0.5,
);

/** Minimum metres between the camera and the rock beneath it. */
const CLEARANCE = 10;
/** Radius sampled around the camera — a single point lets crests slip through. */
const PROBE = 8;

const FOG_NIGHT = new Color("#171721");
const FOG_DAWN = new Color("#d3b18a");

/**
 * Scratch state, module-scoped so the frame loop allocates nothing and the rig
 * owns mutable values outside React's render model. Safe because exactly one
 * CameraRig is mounted at a time.
 */
const desiredPos = new Vector3();
const desiredAim = new Vector3();
const currentAim = new Vector3(0, 44, 0);
const tanA = new Vector3();
const tanB = new Vector3();
const scroll = { smooth: 0, started: false, roll: 0 };

function CameraRig({ reduced }: { reduced: boolean }) {
  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const raw = reduced ? 1 : scrollState.progress;

    // Ease the scroll value itself, so flicks and trackpad jitter arrive at
    // the camera as one continuous glide instead of a step function.
    if (!scroll.started) {
      scroll.smooth = raw;
      scroll.started = true;
    }
    scroll.smooth = reduced ? raw : damp(scroll.smooth, raw, 4.5, dt);
    const t = Math.min(1, Math.max(0, scroll.smooth));

    PATH.getPointAt(t, desiredPos);
    AIM.getPointAt(t, desiredAim);

    // Pointer parallax is applied before the ground check so it can never
    // nudge the camera into the mountain.
    if (scrollState.pointerEnabled && !reduced) {
      desiredPos.x += scrollState.pointerX * 4;
      desiredPos.y -= scrollState.pointerY * 2.5;
    }

    // Keep the intended path above the rock.
    const groundAtTarget = maxHeightAround(desiredPos.x, desiredPos.z, PROBE);
    desiredPos.y = Math.max(desiredPos.y, groundAtTarget + CLEARANCE);

    const cam = state.camera as PerspectiveCamera;
    if (reduced) {
      cam.position.copy(desiredPos);
      currentAim.copy(desiredAim);
    } else {
      cam.position.x = damp(cam.position.x, desiredPos.x, 3, dt);
      cam.position.y = damp(cam.position.y, desiredPos.y, 3, dt);
      cam.position.z = damp(cam.position.z, desiredPos.z, 3, dt);
      currentAim.x = damp(currentAim.x, desiredAim.x, 2.4, dt);
      currentAim.y = damp(currentAim.y, desiredAim.y, 2.4, dt);
      currentAim.z = damp(currentAim.z, desiredAim.z, 2.4, dt);
    }

    // Hard guarantee: damping lags behind the target, so re-check the ground
    // at the camera's *actual* position. This is what makes clipping through
    // the mountain impossible rather than merely unlikely.
    const groundHere = maxHeightAround(cam.position.x, cam.position.z, PROBE);
    const floor = groundHere + CLEARANCE;
    if (cam.position.y < floor) cam.position.y = floor;

    cam.lookAt(currentAim);

    // Bank into the turns. Comparing the path tangent just ahead against the
    // current one gives the rate of heading change; rolling into it is what
    // makes the traverse read as flight rather than a sliding camera.
    if (!reduced) {
      PATH.getTangentAt(t, tanA);
      PATH.getTangentAt(Math.min(1, t + 0.02), tanB);
      const turn = tanA.x * tanB.z - tanA.z * tanB.x;
      const targetRoll = Math.max(-0.22, Math.min(0.22, turn * 9));
      scroll.roll = damp(scroll.roll, targetRoll, 2, dt);
      cam.rotateZ(scroll.roll);
    }

    // Widen slightly at the top so the summit reveal opens up.
    const fov = 45 + t * t * 11;
    if (Math.abs(cam.fov - fov) > 0.01) {
      cam.fov = fov;
      cam.updateProjectionMatrix();
    }

    // Haze warms with the dawn so distant ridges melt into the horizon.
    const fog = state.scene.fog;
    if (fog && "color" in fog) {
      const f = Math.min(1, Math.max(0, (t - 0.4) / 0.6));
      fog.color.copy(FOG_NIGHT).lerp(FOG_DAWN, f * f * (3 - 2 * f));
    }
  });

  return null;
}

export default function Scene({ reduced, mobile }: Props) {
  return (
    <>
      <fogExp2 attach="fog" args={["#171721", 0.0052]} />

      <Sky reduced={reduced} />
      <CameraRig reduced={reduced} />

      {/* Ambient stays low so the sun does the sculpting */}
      <ambientLight intensity={0.5} color="#5f6ea8" />
      {/* Cool bounce off the snow during the blue-hour ascent */}
      <hemisphereLight args={["#8ea0ff", "#12121a", 0.55]} />

      <Sun reduced={reduced} />
      <Terrain mobile={mobile} />
      <Stars count={mobile ? 200 : 450} reduced={reduced} />
      {/* Snow rewrites its buffer every frame, so the count is kept modest. */}
      {!reduced && <Snow count={mobile ? 90 : 200} />}

      {/* Post-processing is mounted by SceneCanvas, which code-splits it so
          the effect library never reaches phones that would not run it. */}
    </>
  );
}
