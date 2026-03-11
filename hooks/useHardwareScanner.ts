// hooks/useHardwareScanner.ts

'use client';

import { useState, useEffect } from 'react';
import { DetectedHardware } from '@/types/hardware';

export function useHardwareScanner() {
  const [detected, setDetected] = useState<DetectedHardware>({
    estimatedRam: 0,
    logicalCores: 0,
    cpuCores: 0,
    cpuVendor: '',
    gpuRenderer: '',
    gpuVendor: '',
  });
  const [isScanning, setIsScanning] = useState(true);

  useEffect(() => {
    const scanHardware = () => {
      // ── RAM ──────────────────────────────────────────────────────────────
      // navigator.deviceMemory: Chrome/Edge only, returns 0.25–8 (privacy cap).
      const estimatedRam: number = (navigator as any).deviceMemory || 0;

      // ── CPU ──────────────────────────────────────────────────────────────
      // hardwareConcurrency = logical threads (includes HT/SMT).
      // e.g. i3-10100 (4c/8t) → 8,  Ryzen 5 5600 (6c/12t) → 12
      const logicalCores: number = navigator.hardwareConcurrency || 0;
      
      // Estimate physical cores: modern desktop Intel & AMD both use 2 threads/core.
      // Single-core or non-HT CPUs (some Celerons/Atoms) already equal logical = physical.
      const cpuCores = logicalCores >= 4 ? Math.round(logicalCores / 2) : logicalCores;

      // ── GPU & vendor (→ infer CPU brand for integrated GPUs) ─────────────
      let gpuRenderer = '';
      let gpuVendor = '';
      try {
        const canvas = document.createElement('canvas');
        const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as any;

        if (gl) {
          const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
          if (debugInfo) {
            gpuRenderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || '';
            gpuVendor   = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)   || '';
          }
          if (!gpuRenderer) gpuRenderer = gl.getParameter(gl.RENDERER) || '';
          if (!gpuVendor)   gpuVendor   = gl.getParameter(gl.VENDOR)   || '';
        }
      } catch (e) {
        console.error('GPU Detection error:', e);
      }

      // Sanitise renderer string
      if (gpuRenderer) {
        console.log('Raw GPU Renderer:', gpuRenderer, '| Vendor:', gpuVendor);
        let clean = gpuRenderer;

        // ANGLE (VendorName, Device Name, Direct3D...) → keep "Device Name"
        const angleMatch = clean.match(/^ANGLE \([^,]+,\s*([^,(]+)[\s(,]/);
        if (angleMatch) {
          clean = angleMatch[1].trim();
        }

        // Strip hex IDs like (0x00003E9B) and trailing technical suffixes
        clean = clean.replace(/\s*\(0x[0-9a-fA-F]+\)/g, '');
        clean = clean.replace(/Direct3D.*/i, '');
        clean = clean.replace(/\bvs_\S+.*$/i, '');
        // De-duplicate "NVIDIA NVIDIA ..."
        clean = clean.replace(/(\bNVIDIA\b)\s+\1/i, '$1');
        clean = clean.replace(/(\bAMD\b)\s+\1/i, '$1');

        gpuRenderer = clean.trim() || gpuRenderer;
        console.log('Cleaned GPU Renderer:', gpuRenderer);
      }

      // Infer CPU vendor:
      //  • Integrated Intel GPU  → Intel CPU
      //  • Integrated AMD GPU (Vega/RDNA iGPU) → AMD CPU
      //  • Discrete NVIDIA → vendor unknown from GPU alone
      const lowerVendor   = gpuVendor.toLowerCase();
      const lowerRenderer = gpuRenderer.toLowerCase();
      let cpuVendor = '';
      if (lowerVendor.includes('intel') || lowerRenderer.includes('intel')) {
        cpuVendor = 'Intel';
      } else if (
        lowerRenderer.includes('radeon') &&
        (lowerRenderer.includes('vega') || lowerRenderer.includes('graphics') || lowerRenderer.includes('rx'))
      ) {
        // "AMD Radeon RX Vega 8/11 Graphics" = Ryzen integrated
        cpuVendor = 'AMD';
      }

      setDetected({
        estimatedRam,
        logicalCores,
        cpuCores,
        cpuVendor,
        gpuRenderer: gpuRenderer || 'Unknown GPU',
        gpuVendor,
      });
      setIsScanning(false);
    };

    scanHardware();
  }, []);

  return { detected, isScanning };
}
