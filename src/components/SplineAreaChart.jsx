import { useState, useRef, useLayoutEffect } from 'react';
import Chart from 'react-apexcharts';
import { colors } from '../theme';

// Dual-series area chart of CPU/GPU power draw over time (sparkline-style axes).
// `height` may be a number or "100%"; for "100%" we measure the container so ApexCharts
// gets a real pixel height (it doesn't render reliably from a percentage in a flex box).
export default function SplineAreaChart({ cpuWatts = [], gpuWatts = [], height = 150 }) {
  const ref = useRef(null);
  const [measured, setMeasured] = useState(0);
  const fluid = height === '100%';

  useLayoutEffect(() => {
    if (!fluid || !ref.current) return undefined;
    const el = ref.current;
    const update = () => setMeasured(el.clientHeight);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [fluid]);

  const chartHeight = fluid ? measured : height;

  const options = {
    chart: {
      type: 'area',
      background: 'transparent',
      animations: { enabled: false },
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    theme: { mode: 'light' },
    colors: [colors.cpu, colors.gpu],
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 2.5 },
    fill: {
      type: 'gradient',
      gradient: { opacityFrom: 0.32, opacityTo: 0.02, shadeIntensity: 1 },
    },
    grid: { show: false, padding: { top: 0, right: 0, bottom: 0, left: 0 } },
    tooltip: { enabled: false },
    legend: { show: false },
    xaxis: {
      type: 'numeric',
      labels: { show: false },
      axisTicks: { show: false },
      axisBorder: { show: false },
    },
    yaxis: { show: false, min: 0 },
  };

  const series = [
    { name: 'CPU', data: cpuWatts },
    { name: 'GPU', data: gpuWatts },
  ];

  return (
    <div ref={ref} style={{ width: '100%', height: '100%' }}>
      {chartHeight > 0 && (
        <Chart options={options} series={series} type="area" height={chartHeight} width="100%" />
      )}
    </div>
  );
}
