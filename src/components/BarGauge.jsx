import styled from 'styled-components';
import { colors, loadColor } from '../theme';

// Horizontal load bar with label and big percent readout.
export default function BarGauge({ label, value = 0, accent }) {
  const fill = accent ?? loadColor(value);
  return (
    <Row>
      <Left>
        <Track>
          <Fill style={{ width: `${Math.min(100, value)}%`, background: fill }} />
        </Track>
        <Label>{label}</Label>
      </Left>
      <Value>
        {Math.round(value)}
        <Unit>%</Unit>
      </Value>
    </Row>
  );
}

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
`;

const Left = styled.div`
  flex: 1;
  min-width: 0;
`;

const Track = styled.div`
  height: 18px;
  border-radius: 4px;
  background: ${colors.track};
  overflow: hidden;
`;

const Fill = styled.div`
  height: 100%;
  border-radius: 4px;
  transition: width 0.4s ease, background 0.4s ease;
`;

const Label = styled.div`
  margin-top: 4px;
  font-size: 0.92rem;
  font-weight: 700;
  color: ${colors.text};
`;

const Value = styled.div`
  display: flex;
  align-items: baseline;
  font-size: 2rem;
  font-weight: 700;
  color: ${colors.text};
  width: 64px;
  justify-content: flex-end;
`;

const Unit = styled.span`
  font-size: 0.8rem;
  color: ${colors.textDim};
  margin-left: 2px;
`;
