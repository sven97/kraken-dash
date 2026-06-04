import styled, { keyframes } from 'styled-components';
import { SCREEN, colors, noise, type } from '../theme';
import RadialGauge from './RadialGauge';
import BarGauge from './BarGauge';
import SplineAreaChart from './SplineAreaChart';

// Circular dashboard: large CPU/GPU temperature gauges (top) over performance
// (bottom). Everything critical is kept inside the inscribed circle of the 640px panel.
export default function Dashboard({ data }) {
  const { cpu, gpu, ram } = data;

  const ghz = (mhz) => (mhz ? (mhz / 1000).toFixed(2) : '0.00');
  const cpuDetail = `${ghz(cpu.frequency)} GHz`;
  const gpuDetail = `${ghz(gpu.frequency)} GHz`;
  const ramDetail = `${ram.inUseGb.toFixed(1)}/${ram.totalGb.toFixed(0)} GB`;

  return (
    <Stage $round={data.shape === 'circle'}>
      <Grid aria-hidden="true" />
      <Safe>
        {/* ---------- TOP: CPU / GPU temperature gauges ---------- */}
        <TempRow>
          <RadialGauge label="CPU" value={cpu.temperature} max={100} size={252} />
          <RadialGauge label="GPU" value={gpu.temperature} max={100} size={252} />
        </TempRow>

        {/* ---------- MIDDLE: load bars (vertical, wide center band) ---------- */}
        <BarGauge label="CPU" value={cpu.load} detail={cpuDetail} />
        <BarGauge label="GPU" value={gpu.load} detail={gpuDetail} />
        <BarGauge label="RAM" value={ram.percent} detail={ramDetail} />

        {/* ---------- BOTTOM: power title + chart, fills the remaining height ---------- */}
        <ChartBox>
          <ChartTitle>
            <PowerName>POWER</PowerName>
            <PowerUnit>(W)</PowerUnit>
            <Legend>
              <LegendItem style={{ color: colors.cpu }}>● CPU {cpu.power}W</LegendItem>
              <LegendItem style={{ color: colors.gpu }}>● GPU {gpu.power}W</LegendItem>
            </Legend>
          </ChartTitle>
          <ChartArea>
            <SplineAreaChart cpuWatts={data.cpuWatts} gpuWatts={data.gpuWatts} height="100%" />
          </ChartArea>
        </ChartBox>
      </Safe>

      {data.source === 'sim' && <SimBadge>SIM</SimBadge>}
    </Stage>
  );
}

/* Brushed-silver surface with depth: layered gradients (top-light sheen, base silver) +
   grain texture, inset shadows for a machined bezel. The grid lives in <Grid> (animated). */
const Stage = styled.div`
  position: relative;
  width: ${SCREEN}px;
  height: ${SCREEN}px;
  color: ${colors.text};
  border-radius: ${({ $round }) => ($round ? '50%' : '0')};
  overflow: hidden;

  background-image:
    ${noise},
    radial-gradient(115% 80% at 26% 8%, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0) 52%),
    radial-gradient(130% 120% at 50% 4%, #ffffff 0%, #eceef3 50%, #d6dbe4 100%);
  background-size: 180px 180px, cover, cover;
  box-shadow:
    inset 0 2px 2px rgba(255, 255, 255, 0.85),
    inset 0 0 0 1px rgba(255, 255, 255, 0.55),
    inset 0 -26px 64px rgba(86, 96, 118, 0.12),
    inset 0 0 46px rgba(140, 150, 168, 0.10);
`;

/* Subtle line grid that slowly drifts diagonally. It pans exactly one cell (26px) and
   loops, so the motion is seamless. Oversized + inset so edges never reveal a gap. */
const drift = keyframes`
  from { transform: translate3d(0, 0, 0); }
  to   { transform: translate3d(-26px, -26px, 0); }
`;

const Grid = styled.div`
  position: absolute;
  inset: -40px;
  pointer-events: none;
  background-image:
    linear-gradient(rgba(86, 96, 118, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(86, 96, 118, 0.05) 1px, transparent 1px);
  background-size: 26px 26px;
  animation: ${drift} 6s linear infinite;
`;

/* Three bands distributed top -> middle -> bottom to fill the round screen:
   gauges (top), load bars (wide middle), power chart (bottom). */
const Safe = styled.div`
  position: absolute;
  inset: 0;
  padding: 30px 50px 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 16px;
`;

/* Two large gauges with normal spacing; arcs reach toward the top of the circle. */
const TempRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  width: 100%;
`;

/* Power title + chart at the bottom. Grows to fill the remaining height; the chart is
   a rolling area chart, so its corners extending past the arc is fine. */
const ChartBox = styled.div`
  flex: 1;
  min-height: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const ChartArea = styled.div`
  flex: 1;
  min-height: 0;
  width: 100%;
`;

/* Power label row: shared label + unit styles, with the wattage legend on the right. */
const ChartTitle = styled.div`
  display: flex;
  align-items: baseline;
  gap: 10px;
`;

const PowerName = styled.span`
  font-size: ${type.label.size};
  font-weight: ${type.label.weight};
  color: ${colors.text};
`;

const PowerUnit = styled.span`
  font-size: ${type.unit.size};
  font-weight: ${type.unit.weight};
  color: ${colors.textDim};
`;

const Legend = styled.div`
  display: flex;
  gap: 16px;
  margin-left: auto;
  font-size: ${type.detail.size};
  font-weight: 700;
  font-variant-numeric: tabular-nums;
`;

const LegendItem = styled.span`
  white-space: nowrap;
`;

const SimBadge = styled.div`
  position: absolute;
  top: 50%;
  left: 14px;
  transform: translateY(-50%) rotate(-90deg);
  transform-origin: left center;
  font-size: 0.6rem;
  letter-spacing: 0.2em;
  color: ${colors.textDim};
  opacity: 0.5;
`;
