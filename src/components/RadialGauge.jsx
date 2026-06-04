import Chart from 'react-apexcharts';
import styled from 'styled-components';
import { colors, type } from '../theme';

// Temperature radial gauge: a top half-arc (like the aviation reference) with the
// label + big value overlaid in the lower-center. We render the text ourselves
// rather than via ApexCharts dataLabels for reliable positioning on a half-arc.
// The active arc uses the ROG holographic gradient to match the white STRIX board.
export default function RadialGauge({ label, value = 0, max = 100, size = 150 }) {
  const options = {
    chart: { type: 'radialBar', sparkline: { enabled: true }, animations: { enabled: true, speed: 400 } },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        hollow: { size: '70%' },
        track: { background: colors.track, strokeWidth: '100%' },
        dataLabels: { show: false },
      },
    },
    colors: [colors.accent],
    fill: { colors: [colors.accent] },
    stroke: { lineCap: 'round' },
    labels: [label],
  };

  const series = [Math.min(100, (value / max) * 100)];

  return (
    <Wrap style={{ width: size, height: size * 0.66 }}>
      <Chart options={options} series={series} type="radialBar" height={size} width={size} />
      <Overlay>
        <Label>{label}</Label>
        <Value>
          {Math.round(value)}
          <Unit>°</Unit>
        </Value>
      </Overlay>
    </Wrap>
  );
}

const Wrap = styled.div`
  position: relative;
  overflow: hidden;
  /* Soft shadow under the arc for a little lift off the silver surface. */
  filter: drop-shadow(0 1px 2px rgba(70, 80, 100, 0.18));
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
  font-size: ${type.label.size};
  font-weight: ${type.label.weight};
  color: ${colors.text};
  line-height: 1;
`;

const Value = styled.div`
  display: flex;
  align-items: baseline;
  font-size: ${type.value.size};
  font-weight: ${type.value.weight};
  color: ${colors.text};
  line-height: 1.05;
  font-variant-numeric: tabular-nums;
`;

const Unit = styled.span`
  font-size: ${type.unit.size};
  font-weight: ${type.unit.weight};
  color: ${colors.textDim};
  margin-left: 1px;
`;
