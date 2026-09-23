/**
 * True only when WebGL is backed by a real GPU.
 *
 * Without hardware acceleration (GPU blocklisted, acceleration turned off,
 * VMs, headless/lab browsers such as PageSpeed Insights) Chrome falls back to
 * a software rasteriser — SwiftShader, llvmpipe… — that runs every WebGL frame
 * on the CPU main thread. For a full-screen scene with post-processing that
 * means tens of seconds of blocking time, so those environments get the CSS
 * backdrop instead.
 *
 * The probe context is released immediately so it doesn't count against the
 * browser's limit of live WebGL contexts.
 */
export function hasHardwareWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    // Fails outright when the only available implementation is a slow one.
    const gl = (canvas.getContext("webgl2", {
      failIfMajorPerformanceCaveat: true,
    }) ??
      canvas.getContext("webgl", {
        failIfMajorPerformanceCaveat: true,
      })) as WebGLRenderingContext | null;
    if (!gl) return false;

    let renderer = "";
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    if (info) {
      renderer = String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL));
    }
    gl.getExtension("WEBGL_lose_context")?.loseContext();

    // Some builds still hand out a software context despite the flag.
    return !/swiftshader|llvmpipe|softpipe|software|basic render|mesa offscreen/i.test(
      renderer,
    );
  } catch {
    return false;
  }
}
