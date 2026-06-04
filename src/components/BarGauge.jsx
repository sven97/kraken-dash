import styled from 'styled-components';
import { colors, loadColor } from '../theme';

// Load bar. Title line shows name + the gray "actual" value (e.g. "CPU   4.82 GHz");
// the bar fill visualizes the load, with the big load% to the right of the bar.
export default function BarGauge({ label, value = 0, accent, detail }) {
  const fill = accent ?? loadColor(value);
  return (
    <Row>
      <Left>
        <TitleRow>
          <Name>{label}</Name>
          {detail && <Detail>{detail}</Detail>}
        </TitleRow>
        <Track>
          <Fill style={{ width: `${Math.min(100, value)}%`, background: fill }} />
        </Track>
      </Left>
      <Pct>
        {Math.round(value)}
        <PctUnit>%</PctUnit>
      </Pct>
    </Row>
  );
}

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
`;

const Left = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 7px;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 10px;
`;

const Name = styled.span`
  font-size: 1.45rem;
  font-weight: 700;
  color: ${colors.text};
`;

// Gray actual value, right-aligned in the title row.
const Detail = styled.span`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${colors.textDim};
  font-variant-numeric: tabular-nums;
`;

const Track = styled.div`
  height: 11px;
  border-radius: 999px;
  background: ${colors.track};
  overflow: hidden;
`;

const Fill = styled.div`
  height: 100%;
  border-radius: 999px;
  transition: width 0.4s ease, background 0.4s ease;
`;

// Big load% to the right of the bar.
const Pct = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: flex-end;
  width: 84px;
  font-size: 2.65rem;
  font-weight: 800;
  color: ${colors.text};
  font-variant-numeric: tabular-nums;
`;

const PctUnit = styled.span`
  font-size: 1.1rem;
  font-weight: 700;
  color: ${colors.textDim};
  margin-left: 2px;
`;
