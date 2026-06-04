import styled from 'styled-components';
import { colors, type } from '../theme';

// Load bar (vertical-stacked). Title shows name + the gray actual value (e.g. "CPU  4.9 GHz");
// a flat crimson fill visualizes the load, with the big load% to the right.
export default function BarGauge({ label, value = 0, detail }) {
  const v = Math.min(100, Math.max(0, value));
  return (
    <Row>
      <Left>
        <TitleRow>
          <Name>{label}</Name>
          {detail && <Detail>{detail}</Detail>}
        </TitleRow>
        <Track>
          <Fill style={{ width: `${v}%` }} />
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
  gap: 8px;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 10px;
`;

const Name = styled.span`
  font-size: ${type.label.size};
  font-weight: ${type.label.weight};
  color: ${colors.text};
`;

const Detail = styled.span`
  font-size: ${type.detail.size};
  font-weight: ${type.detail.weight};
  color: ${colors.textDim};
  font-variant-numeric: tabular-nums;
`;

// Recessed silver groove.
const Track = styled.div`
  height: 12px;
  border-radius: 999px;
  background: ${colors.track};
  box-shadow: inset 0 1px 2px rgba(70, 80, 100, 0.28);
  overflow: hidden;
`;

// Flat crimson fill, rounded ends.
const Fill = styled.div`
  height: 100%;
  border-radius: 999px;
  background: ${colors.accent};
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.28);
  transition: width 0.4s ease;
`;

// Big load% to the right of the bar.
const Pct = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: flex-end;
  width: 102px;
  font-size: ${type.value.size};
  font-weight: ${type.value.weight};
  color: ${colors.text};
  font-variant-numeric: tabular-nums;
`;

const PctUnit = styled.span`
  font-size: ${type.unit.size};
  font-weight: ${type.unit.weight};
  color: ${colors.textDim};
  margin-left: 2px;
`;
