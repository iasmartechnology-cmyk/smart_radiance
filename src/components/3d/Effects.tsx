"use client";

import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";

/**
 * Cinematic grade. The bloom threshold is set high enough that only the sun
 * disc and lit snow crests blow out — so the glare reads as real sunlight at
 * the summit instead of washing the whole scene. The vignette keeps the frame
 * edges dark, protecting contrast for the text layered above the canvas.
 */
export default function Effects() {
  return (
    <EffectComposer>
      <Bloom
        intensity={1.15}
        luminanceThreshold={0.62}
        luminanceSmoothing={0.35}
        mipmapBlur
        radius={0.8}
      />
      <Vignette offset={0.22} darkness={0.62} eskil={false} />
    </EffectComposer>
  );
}
