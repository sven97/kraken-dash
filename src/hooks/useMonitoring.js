import { useEffect, useRef, useState } from 'react';

// Number of samples kept for the rolling charts/sparklines.
const HISTORY = 60;

// 0..1 load -> rounded 0..100 percent.
const pct = (v) => Number(((v ?? 0) * 100).toFixed(0));

// Push a value into a fixed-length rolling window (returns a new array).
const roll = (arr, value, len = HISTORY) => {
  const next = arr.length >= len ? arr.slice(arr.length - len + 1) : arr.slice();
  next.push(value);
  return next;
};

const emptyHistory = () => Array.from({ length: HISTORY }, () => 0);

const initialState = {
  source: 'init', // 'cam' | 'sim' | 'init'
  shape: 'square',
  cpu: { name: '', load: 0, temperature: 0, frequency: 0, boostPct: null, fan: 0, power: 0, cores: null, threads: null },
  gpu: { name: '', load: 0, temperature: 0, frequency: 0, fan: 0, power: 0 },
  ram: { inUseGb: 0, totalGb: 0, percent: 0, kind: '', frequency: 0 },
  liquid: { temperature: 0, min: null, max: null, history: emptyHistory() },
  cpuWatts: emptyHistory(),
  gpuWatts: emptyHistory(),
};

// Pick the discrete GPU when an integrated one is also present.
function pickGpu(gpus = []) {
  if (!gpus.length) return undefined;
  const discrete = gpus.find((g) => !/(graphics|integrated|igpu)/i.test(g?.name ?? ''));
  return discrete ?? gpus[gpus.length - 1];
}

// Boost over stock frequency, as a percentage (null if not derivable).
function boost(freq, stock) {
  if (!freq || !stock) return null;
  return Number((((freq - stock) / stock) * 100).toFixed(0));
}

export default function useMonitoring() {
  const [state, setState] = useState(initialState);
  const ref = useRef(initialState); // latest value, to roll histories without stale closures

  useEffect(() => {
    let simId = null;

    const apply = (next) => {
      ref.current = next;
      setState(next);
    };

    const handle = (data, source) => {
      // Real CAM data wins: once it arrives, stop the simulation for good.
      if (source === 'cam' && simId) {
        clearInterval(simId);
        simId = null;
      }
      const prev = ref.current;
      const cpu = (data?.cpus ?? []).at(-1) ?? {};
      const gpu = pickGpu(data?.gpus) ?? {};
      const ram = data?.ram ?? {};
      const liquidTemp = data?.kraken?.liquidTemperature ?? 0;
      const ramModule = (ram?.modules ?? [])[0] ?? {};

      const totalGb = ram?.totalSize ? ram.totalSize / 1024 : 0;
      const inUseGb = ram?.inUse ? ram.inUse / 1024 : 0;

      const min = prev.liquid.min == null ? liquidTemp : Math.min(prev.liquid.min, liquidTemp);
      const max = prev.liquid.max == null ? liquidTemp : Math.max(prev.liquid.max, liquidTemp);

      apply({
        source,
        shape: window.nzxt?.v1?.shape ?? 'circle',
        cpu: {
          name: cpu.name ?? '',
          load: pct(cpu.load),
          temperature: Math.round(cpu.temperature ?? 0),
          frequency: Math.round(cpu.frequency ?? 0),
          boostPct: boost(cpu.frequency, cpu.stockFrequency),
          fan: Math.round(cpu.fanSpeed ?? 0),
          power: Math.round(cpu.power ?? 0),
          cores: cpu.numCores ?? null,
          threads: cpu.numThreads ?? null,
        },
        gpu: {
          name: gpu.name ?? '',
          load: pct(gpu.load),
          temperature: Math.round(gpu.temperature ?? 0),
          frequency: Math.round(gpu.frequency ?? 0),
          fan: Math.round(gpu.fanSpeed ?? 0),
          power: Math.round(gpu.power ?? 0),
        },
        ram: {
          inUseGb,
          totalGb,
          percent: totalGb ? Math.round((inUseGb / totalGb) * 100) : 0,
          kind: ramModule.kind ?? '',
          frequency: Math.round(ramModule.frequency ?? 0),
        },
        liquid: {
          temperature: Math.round(liquidTemp),
          min: Math.round(min),
          max: Math.round(max),
          history: roll(prev.liquid.history, liquidTemp),
        },
        cpuWatts: roll(prev.cpuWatts, Math.round(cpu.power ?? 0)),
        gpuWatts: roll(prev.gpuWatts, Math.round(gpu.power ?? 0)),
      });
    };

    // ALWAYS register the CAM callback. CAM may inject window.nzxt.v1 before or after
    // this runs, so we (re)build the structure ourselves, preserving any values CAM set,
    // and hand it our callback. CAM's data pump then finds onMonitoringDataUpdate.
    const camDefaults = window.nzxt?.v1;
    window.nzxt = {
      ...window.nzxt,
      v1: {
        width: camDefaults?.width ?? 640,
        height: camDefaults?.height ?? 640,
        shape: camDefaults?.shape ?? 'circle',
        targetFps: camDefaults?.targetFps ?? 1,
        onMonitoringDataUpdate: (data) => handle(data, 'cam'),
      },
    };

    // Run simulation ONLY when we're not embedded on the Kraken.
    // CAM appends ?kraken=1 to the integration URL — that's the reliable "on device" signal.
    const onKraken = new URLSearchParams(window.location.search).has('kraken');
    if (!onKraken) {
      const sim = makeSimulator();
      handle(buildSimData(sim), 'sim'); // immediate first frame
      simId = setInterval(() => handle(buildSimData(sim), 'sim'), 1000);
    }

    return () => {
      if (simId) clearInterval(simId);
      if (window.nzxt?.v1) window.nzxt.v1.onMonitoringDataUpdate = undefined;
    };
  }, []);

  return state;
}

// --- Simulation -----------------------------------------------------------

function makeSimulator() {
  return { t: 0, cpuLoad: 0.3, gpuLoad: 0.2, liquid: 28 };
}

function drift(value, target, rate) {
  return value + (target - value) * rate + (Math.random() - 0.5) * 0.04;
}

// Advance the simulator one tick and return a CAM-shaped MonitoringData object.
function buildSimData(s) {
  s.t += 1;
  // Occasionally retarget loads to mimic bursts of activity.
  if (s.t % 6 === 0) s.cpuLoad = Math.random() * 0.8 + 0.1;
  if (s.t % 9 === 0) s.gpuLoad = Math.random() * 0.7 + 0.05;
  s.cpuLoad = clamp01(drift(s.cpuLoad, s.cpuLoad, 0.3));
  s.gpuLoad = clamp01(drift(s.gpuLoad, s.gpuLoad, 0.3));

  const cpuTemp = 42 + s.cpuLoad * 38;
  const gpuTemp = 40 + s.gpuLoad * 40;
  s.liquid = drift(s.liquid, 26 + (cpuTemp + gpuTemp) / 20, 0.1);

  return {
    cpus: [
      {
        name: 'AMD Ryzen 7 9800X3D',
        load: s.cpuLoad,
        temperature: cpuTemp,
        frequency: 4700 + s.cpuLoad * 700,
        stockFrequency: 4700,
        fanSpeed: 600 + s.cpuLoad * 900,
        power: 30 + s.cpuLoad * 90,
        numCores: 8,
        numThreads: 16,
      },
    ],
    gpus: [
      {
        name: 'NVIDIA GeForce RTX',
        load: s.gpuLoad,
        temperature: gpuTemp,
        frequency: 300 + s.gpuLoad * 2200,
        stockFrequency: 2200,
        fanSpeed: s.gpuLoad > 0.3 ? 900 + s.gpuLoad * 800 : 0,
        power: 20 + s.gpuLoad * 280,
      },
    ],
    ram: {
      totalSize: 32 * 1024,
      inUse: (12 + s.cpuLoad * 8) * 1024,
      modules: [{ kind: 'DDR5', frequency: 6000 }],
    },
    kraken: { liquidTemperature: s.liquid },
  };
}

const clamp01 = (v) => Math.max(0, Math.min(1, v));
