import Chart from 'react-apexcharts';
import { colors } from '../theme';

// Dual-series area chart of CPU/GPU power draw over time (sparkline-style axes).
export default function SplineAreaChart({ cpuWatts = [], gpuWatts = [], height = 150 }) {
  const options = {
    chart: {
      type: 'area',
      background: 'transparent',
      animations: { enabled: false },
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    theme: { mode: 'dark' },
    colors: [colors.cpu, colors.gpu],
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 2 },
    fill: {
      type: 'gradient',
      gradient: { opacityFrom: 0.45, opacityTo: 0.02, shadeIntensity: 1 },
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

  return <Chart options={options} series={series} type="area" height={height} width="100%" />;
}
