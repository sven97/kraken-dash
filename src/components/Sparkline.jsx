import styled from 'styled-components';
import { colors } from '../theme';

// Lightweight inline-SVG sparkline for the liquid-temperature trend,
// with min/max readout. Replaces the (non-existent) pump-RPM tile.
export default function Sparkline({ history = [], min, max, width = 150, height = 30, color = colors.liquid }) {
  const data = history.length ? history : [0];
  const lo = Math.min(...data);
  const hi = Math.max(...data);
  const span = hi - lo || 1;

  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1 || 1)) * width;
      const y = height - ((v - lo) / span) * (height - 4) - 2;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  return (
    <Wrap>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
      <MinMax>
        <span>min {min ?? '--'}°</span>
        <span>max {max ?? '--'}°</span>
      </MinMax>
    </Wrap>
  );
}

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
`;

const MinMax = styled.div`
  display: flex;
  gap: 14px;
  font-size: 0.7rem;
  color: ${colors.textDim};
  font-variant-numeric: tabular-nums;
`;
