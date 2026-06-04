import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrochip, faDisplay, faBolt } from '@fortawesome/free-solid-svg-icons';
import { SCREEN, colors } from '../theme';
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
      <Safe>
        {/* ---------- TOP: CPU / GPU temperature gauges ---------- */}
        <TempRow>
          <RadialGauge
            label="CPU"
            icon={faMicrochip}
            iconColor={colors.cpu}
            value={cpu.temperature}
            max={100}
            size={264}
          />
          <RadialGauge
            label="GPU"
            icon={faDisplay}
            iconColor={colors.gpu}
            value={gpu.temperature}
            max={100}
            size={264}
          />
        </TempRow>

        {/* ---------- MIDDLE: load bars across the wide center ---------- */}
        <Bars>
          <BarGauge label="CPU" value={cpu.load} accent={colors.cpu} detail={cpuDetail} />
          <BarGauge label="GPU" value={gpu.load} accent={colors.gpu} detail={gpuDetail} />
          <BarGauge label="RAM" value={ram.percent} accent={colors.ram} detail={ramDetail} />
        </Bars>

        {/* ---------- BOTTOM: power chart, centered + narrow for the arc ---------- */}
        <ChartBox>
          <ChartTitle>
            <FontAwesomeIcon icon={faBolt} /> POWER (W)
            <Legend>
              <span style={{ color: colors.cpu }}>● {cpu.power}W</span>
              <span style={{ color: colors.gpu }}>● {gpu.power}W</span>
            </Legend>
          </ChartTitle>
          <SplineAreaChart cpuWatts={data.cpuWatts} gpuWatts={data.gpuWatts} height={120} />
        </ChartBox>
      </Safe>

      {data.source === 'sim' && <SimBadge>SIM</SimBadge>}
    </Stage>
  );
}

const Stage = styled.div`
  position: relative;
  width: ${SCREEN}px;
  height: ${SCREEN}px;
  background: ${colors.bg};
  color: ${colors.text};
  border-radius: ${({ $round }) => ($round ? '50%' : '0')};
  overflow: hidden;
`;

/* Circle-aware safe area: the middle band may run nearly full width (the circle is
   widest at center); the top/bottom rows are kept narrow where the circle pinches in.
   Small side padding lets the mid-band fill; per-section max-widths protect the ends. */
/* Three bands distributed top -> middle -> bottom to fill the round screen:
   gauges (top), load bars (wide middle), power chart (narrow centered bottom). */
const Safe = styled.div`
  position: absolute;
  inset: 0;
  padding: 14px 48px 42px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

/* Two large gauges with normal spacing; arcs reach toward the top of the circle. */
const TempRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  width: 100%;
`;

/* Load bars run across the wide center band. */
const Bars = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  padding: 0 6px;
`;

/* Power chart sits at the bottom, full width. It's a rolling chart, so it's fine for
   its corners to extend past the arc — only scrolling fill gets clipped there. */
const ChartBox = styled.div`
  width: 100%;
  padding: 0 6px;
`;

const ChartTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.74rem;
  letter-spacing: 0.08em;
  color: ${colors.textDim};
`;

const Legend = styled.div`
  display: flex;
  gap: 12px;
  margin-left: auto;
  font-size: 0.74rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
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
