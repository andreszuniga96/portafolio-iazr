/**
 * useGPUTier — detects WebGL capabilities and returns a performance tier.
 * Tier 0 = no WebGL (SSR / blocked)
 * Tier 1 = low-end mobile GPU → disable heavy effects
 * Tier 2 = mid-range → enable DataSpace, disable ArchitectLab on mobile
 * Tier 3 = high-end → full experience
 */
import { useEffect, useState } from "react";

export type GPUTier = 0 | 1 | 2 | 3;

const cache: { tier: GPUTier | null } = { tier: null };

function detectGPUTier(): GPUTier {
  if (typeof window === "undefined") return 0;
  if (cache.tier !== null) return cache.tier;

  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ||
      (canvas.getContext("webgl") as WebGLRenderingContext | null) ||
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);

    if (!gl) { cache.tier = 0; return 0; }

    const dbgInfo = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = dbgInfo
      ? gl.getParameter(dbgInfo.UNMASKED_RENDERER_WEBGL) as string
      : "";

    const lowEnd = /mali-4|mali-3|adreno 3|adreno 4|powervr|sgx|videocore|d3d9|swiftshader|llvmpipe|software/i;
    const highEnd = /rtx|rx 6|rx 7|radeon pro|3090|4090|apple m[123]|apple m[12] max|m[23] ultra/i;

    if (lowEnd.test(renderer)) { cache.tier = 1; return 1; }
    if (highEnd.test(renderer)) { cache.tier = 3; return 3; }

    // Heuristic: mobile UA = tier 2 unless high-end, desktop = tier 3
    const isMobile = /android|iphone|ipad/i.test(navigator.userAgent);
    cache.tier = isMobile ? 2 : 3;
    return cache.tier;
  } catch {
    cache.tier = 1;
    return 1;
  }
}

export function useGPUTier(): GPUTier {
  const [tier, setTier] = useState<GPUTier>(3); // optimistic default → avoids flash

  useEffect(() => {
    // Run off the main thread to avoid blocking first paint
    const id = requestIdleCallback
      ? requestIdleCallback(() => setTier(detectGPUTier()))
      : setTimeout(() => setTier(detectGPUTier()), 200);
    return () => {
      if (typeof id === "number") clearTimeout(id);
    };
  }, []);

  return tier;
}
