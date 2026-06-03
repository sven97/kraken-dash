# kraken-dash

A custom **NZXT CAM Web Integration** for the **Kraken Elite** round **640×640** LCD,
reorganized into two clear domains — **Cooling** (top) and **Performance** (bottom).

Built with React + Vite + ApexCharts + styled-components. Inspired by
[ReinhardtBotha/NZXT-aviation](https://github.com/ReinhardtBotha/NZXT-aviation), but with the
information re-grouped and using real telemetry the aviation layout doesn't surface.

## Layout

```
            COOLING
   LIQUID 28°C  (+ trend sparkline, min/max)
   CPU 50°   |   GPU 49°      (temperature radials)
   fan 980rpm   fan 1100rpm   (real fan speeds)
  ---------------------------------
            PERFORMANCE
   POWER(W) chart | CPU / GPU / RAM load bars
   CPU 5450MHz(+boost%)  RAM 16/32GB  GPU 503MHz
```

## What's shown (and what the API actually provides)

Data comes from `window.nzxt.v1.onMonitoringDataUpdate` (`@nzxt/web-integrations-types`):

- **Cooling:** liquid temperature (+ rolling trend & min/max), CPU & GPU temperature, CPU & GPU **fan RPM**.
- **Performance:** CPU/GPU/RAM load, CPU/GPU power (rolling chart), CPU & GPU frequency with **boost %**
  (vs stock), RAM used/total + module kind/speed (e.g. DDR5 6000MHz).
- **No pump RPM:** the `kraken` object only exposes `liquidTemperature` — there is no pump-speed field.
  The slot a typical layout uses for "PUMP" instead shows the **liquid-temperature trend**.

When `window.nzxt` is absent (desktop browser / GitHub Pages), the dashboard runs on **simulated data**
so you can design without CAM. A small "SIM" marker indicates simulation mode.

## Develop

```bash
npm install
npm run dev      # http://localhost:5173/kraken-dash/  (simulated data)
npm run build    # outputs to dist/
npm run preview  # serve the production build
```

## Deploy & use on the Kraken

1. Push to GitHub (repo name **kraken-dash** — must match `base` in `vite.config.js`).
2. Settings → Pages → Source: **GitHub Actions**. The included workflow builds and publishes `dist/`.
3. Copy the published URL: `https://<your-user>.github.io/kraken-dash/`.
4. In **NZXT CAM** → Kraken → **Web Integration**, paste that URL. CAM appends `?kraken=1` and starts
   pushing live data once per second.

> If you publish under a different repo name, update `base` in `vite.config.js` to `'/<repo>/'`.
