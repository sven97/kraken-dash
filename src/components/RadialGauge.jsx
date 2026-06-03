import Chart from 'react-apexcharts';
import styled from 'styled-components';
import { tempColor, colors } from '../theme';

// Temperature radial gauge: a top half-arc (like the aviation reference) with the
// label + big value overlaid in the lower-center. We render the text ourselves
// rather than via ApexCharts dataLabels for reliable positioning on a half-arc.
export default function RadialGauge({ label, value = 0, max = 100, size = 150 }) {
  const fill = tempColor(value);

  const options = {
    chart: { type: 'radialBar', sparkline: { enabled: true }, animations: { enabled: true, speed: 400 } },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        hollow: { size: '60%' },
        track: { background: colors.track, strokeWidth: '100%' },
        dataLabels: { show: false },
      },
    },
    fill: { colors: [fill] },
    stroke: { lineCap: 'round' },
    labels: [label],
  };

  const series = [Math.min(100, (value / max) * 100)];

  return (
    <Wrap style={{ width: size, height: size * 0.66 }}>
      <Chart options={options} series={series} type="radialBar" height={size} width={size} />
      <Overlay>
        <Label>{label}</Label>
        <Value>{Math.round(value)}°</Value>
      </Overlay>
    </Wrap>
  );
}

const Wrap = styled.div`
  position: relative;
  overflow: hidden;
`;

// Anchored in the lower-center, sitting just under the half-arc.
const Overlay = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  pointer-events: none;
`;

const Label = styled.div`
  font-size: 1rem;
  font-weight: 700;
  color: ${colors.text};
  line-height: 1;
`;

const Value = styled.div`
  font-size: 2.1rem;
  font-weight: 700;
  color: ${colors.text};
  line-height: 1.05;
`;
