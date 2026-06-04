import styled from 'styled-components';
import { colors, loadColor } from '../theme';

// Load bar with a combined title line: name + load% + a gray "actual" value
// (e.g. "CPU  16%            4.82GHz"). The bar fill visualizes the load%.
export default function BarGauge({ label, value = 0, accent, detail }) {
  const fill = accent ?? loadColor(value);
  return (
    <Wrap>
      <TitleRow>
        <Name>{label}</Name>
        <Pct>{Math.round(value)}%</Pct>
        {detail && <Detail>{detail}</Detail>}
      </TitleRow>
      <Track>
        <Fill style={{ width: `${Math.min(100, value)}%`, background: fill }} />
      </Track>
    </Wrap>
  );
}

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 10px;
`;

const Name = styled.span`
  font-size: 1.05rem;
  font-weight: 700;
  color: ${colors.text};
`;

const Pct = styled.span`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${colors.text};
  font-variant-numeric: tabular-nums;
`;

// Gray actual value, pushed to the right so the values line up into a column.
const Detail = styled.span`
  margin-left: auto;
  font-size: 0.95rem;
  font-weight: 600;
  color: ${colors.textDim};
  font-variant-numeric: tabular-nums;
`;

const Track = styled.div`
  height: 24px;
  border-radius: 6px;
  background: ${colors.track};
  overflow: hidden;
`;

const Fill = styled.div`
  height: 100%;
  border-radius: 6px;
  transition: width 0.4s ease, background 0.4s ease;
`;
