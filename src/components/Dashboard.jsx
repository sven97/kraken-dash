import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDroplet, faMicrochip, faDisplay, faBolt } from '@fortawesome/free-solid-svg-icons';
import { SCREEN, colors, tempColor } from '../theme';
import RadialGauge from './RadialGauge';
import BarGauge from './BarGauge';
import SplineAreaChart from './SplineAreaChart';
import Sparkline from './Sparkline';

// Circular dashboard: cooling temps (top) over performance (bottom), no section
// chrome. Everything critical is kept inside the inscribed circle of the 640px panel.
export default function Dashboard({ data }) {
  const { cpu, gpu, ram, liquid } = data;

  const ghz = (mhz) => (mhz ? (mhz / 1000).toFixed(2) : '0.00');
  const cpuDetail = `${ghz(cpu.frequency)} GHz`;
  const gpuDetail = `${ghz(gpu.frequency)} GHz`;
  const ramDetail = `${ram.inUseGb.toFixed(1)}/${ram.totalGb.toFixed(0)} GB`;

  return (
    <Stage $round={data.shape === 'circle'}>
      <Safe>
        {/* ---------- COOLING (temperatures) ---------- */}
        <LiquidHero>
          <LiquidLabel>
            <FontAwesomeIcon icon={faDroplet} style={{ color: colors.liquid }} /> LIQUID
          </LiquidLabel>
          <LiquidTemp style={{ color: tempColor(liquid.temperature) }}>
            {liquid.temperature}°C
          </LiquidTemp>
          <Sparkline history={liquid.history} min={liquid.min} max={liquid.max} />
        </LiquidHero>

        <TempRow>
          <RadialGauge
            label="CPU"
            icon={faMicrochip}
            iconColor={colors.cpu}
            value={cpu.temperature}
            max={100}
            size={186}
          />
          <RadialGauge
            label="GPU"
            icon={faDisplay}
            iconColor={colors.gpu}
            value={gpu.temperature}
            max={100}
            size={186}
          />
        </TempRow>

        <Divider />

        {/* ---------- PERFORMANCE ---------- */}
        <PerfMid>
          <ChartBox>
            <ChartTitle>
              <FontAwesomeIcon icon={faBolt} /> POWER (W)
            </ChartTitle>
            <SplineAreaChart cpuWatts={data.cpuWatts} gpuWatts={data.gpuWatts} height={138} />
            <Legend>
              <span style={{ color: colors.cpu }}>● CPU {cpu.power}W</span>
              <span style={{ color: colors.gpu }}>● GPU {gpu.power}W</span>
            </Legend>
          </ChartBox>
          <Bars>
            <BarGauge label="CPU" value={cpu.load} accent={colors.cpu} detail={cpuDetail} />
            <BarGauge label="GPU" value={gpu.load} accent={colors.gpu} detail={gpuDetail} />
            <BarGauge label="RAM" value={ram.percent} accent={colors.ram} detail={ramDetail} />
          </Bars>
        </PerfMid>
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
const Safe = styled.div`
  position: absolute;
  inset: 0;
  padding: 26px 52px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
`;

const LiquidHero = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2px;
`;

const LiquidLabel = styled.div`
  font-size: 0.9rem;
  letter-spacing: 0.1em;
  color: ${colors.textDim};
`;

const LiquidTemp = styled.div`
  font-size: 2.4rem;
  font-weight: 700;
  line-height: 1.05;
`;

/* Spread the two gauges out toward the wide part of the circle. */
const TempRow = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: flex-start;
  width: 100%;
  margin-top: -8px;
`;

const Divider = styled.div`
  width: 92%;
  height: 1px;
  margin: 6px 0;
  background: linear-gradient(90deg, transparent, ${colors.divider} 12%, ${colors.divider} 88%, transparent);
`;

/* Performance band sits below the circle's center line, where the arc narrows again,
   so the right side is inset to keep the lowest bar (RAM) clear of the bottom-right arc. */
const PerfMid = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  width: 100%;
  margin-top: 2px;
  padding-right: 46px;
`;

const ChartBox = styled.div`
  flex: 1;
  min-width: 0;
`;

const ChartTitle = styled.div`
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  color: ${colors.textDim};
`;

const Legend = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  font-size: 0.72rem;
  font-weight: 600;
  margin-top: -6px;
  font-variant-numeric: tabular-nums;
`;

const Bars = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-width: 0;
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
