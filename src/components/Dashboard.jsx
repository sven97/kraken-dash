import styled from 'styled-components';
import { SCREEN, colors, tempColor } from '../theme';
import RadialGauge from './RadialGauge';
import BarGauge from './BarGauge';
import SplineAreaChart from './SplineAreaChart';
import Sparkline from './Sparkline';
import StatTile from './StatTile';

// Two-domain circular dashboard: COOLING (top) over PERFORMANCE (bottom).
// Everything critical is kept inside the inscribed circle of the 640x640 panel.
export default function Dashboard({ data }) {
  const { cpu, gpu, ram, liquid } = data;

  return (
    <Stage $round={data.shape === 'circle'}>
      <Safe>
        {/* ---------- COOLING ---------- */}
        <SectionLabel>COOLING</SectionLabel>

        <LiquidHero>
          <LiquidLabel>LIQUID</LiquidLabel>
          <LiquidTemp style={{ color: tempColor(liquid.temperature) }}>
            {liquid.temperature}°C
          </LiquidTemp>
          <Sparkline history={liquid.history} min={liquid.min} max={liquid.max} />
        </LiquidHero>

        <TempRow>
          <TempCol>
            <RadialGauge label="CPU" value={cpu.temperature} max={100} size={150} />
            <StatTile label="CPU FAN" value={cpu.fan || '—'} unit={cpu.fan ? 'rpm' : ''} />
          </TempCol>
          <TempCol>
            <RadialGauge label="GPU" value={gpu.temperature} max={100} size={150} />
            <StatTile label="GPU FAN" value={gpu.fan || '—'} unit={gpu.fan ? 'rpm' : ''} />
          </TempCol>
        </TempRow>

        <Divider />

        {/* ---------- PERFORMANCE ---------- */}
        <SectionLabel>PERFORMANCE</SectionLabel>

        <PerfMid>
          <ChartBox>
            <ChartTitle>POWER (W)</ChartTitle>
            <SplineAreaChart cpuWatts={data.cpuWatts} gpuWatts={data.gpuWatts} height={120} />
            <Legend>
              <span style={{ color: colors.cpu }}>● CPU {cpu.power}W</span>
              <span style={{ color: colors.gpu }}>● GPU {gpu.power}W</span>
            </Legend>
          </ChartBox>
          <Bars>
            <BarGauge label="CPU Load" value={cpu.load} accent={colors.cpu} />
            <BarGauge label="GPU Load" value={gpu.load} accent={colors.gpu} />
            <BarGauge label="RAM Load" value={ram.percent} accent={colors.ram} />
          </Bars>
        </PerfMid>

        <Footer>
          <StatTile
            label="CPU"
            value={cpu.frequency}
            unit="MHz"
            sub={cpu.boostPct != null ? `+${cpu.boostPct}% boost` : null}
          />
          <StatTile
            label="RAM"
            value={`${ram.inUseGb.toFixed(1)}/${ram.totalGb.toFixed(0)}`}
            unit="GB"
            sub={ram.kind ? `${ram.kind} ${ram.frequency}MHz` : null}
            accent={colors.ram}
          />
          <StatTile label="GPU" value={gpu.frequency} unit="MHz" />
        </Footer>
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

/* Inscribed-circle safe area: keep content away from clipped corners. */
const Safe = styled.div`
  position: absolute;
  inset: 0;
  padding: 64px 96px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SectionLabel = styled.div`
  font-size: 0.7rem;
  letter-spacing: 0.32em;
  color: ${colors.textDim};
  text-transform: uppercase;
`;

const LiquidHero = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2px;
`;

const LiquidLabel = styled.div`
  font-size: 0.8rem;
  letter-spacing: 0.1em;
  color: ${colors.textDim};
`;

const LiquidTemp = styled.div`
  font-size: 2.2rem;
  font-weight: 700;
  line-height: 1.05;
`;

const TempRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-top: -6px;
`;

const TempCol = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
`;

const Divider = styled.div`
  width: 78%;
  height: 1px;
  margin: 8px 0;
  background: linear-gradient(90deg, transparent, ${colors.divider} 20%, ${colors.divider} 80%, transparent);
`;

const PerfMid = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  margin-top: 2px;
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
  gap: 12px;
  min-width: 0;
`;

const Footer = styled.div`
  display: flex;
  justify-content: center;
  gap: 28px;
  margin-top: auto;
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
