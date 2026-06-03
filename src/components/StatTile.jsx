import styled from 'styled-components';
import { colors } from '../theme';

// Compact label / value / unit tile, reused for fan RPM and frequency(+boost).
export default function StatTile({ label, value, unit, sub, accent = colors.text }) {
  return (
    <Tile>
      <Label>{label}</Label>
      <Value style={{ color: accent }}>
        {value}
        {unit && <Unit>{unit}</Unit>}
      </Value>
      {sub != null && <Sub>{sub}</Sub>}
    </Tile>
  );
}

const Tile = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 76px;
`;

const Label = styled.div`
  font-size: 0.72rem;
  letter-spacing: 0.04em;
  color: ${colors.textDim};
  text-transform: uppercase;
`;

const Value = styled.div`
  display: flex;
  align-items: baseline;
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.1;
  font-variant-numeric: tabular-nums;
`;

const Unit = styled.span`
  font-size: 0.7rem;
  font-weight: 600;
  color: ${colors.textDim};
  margin-left: 3px;
`;

const Sub = styled.div`
  font-size: 0.68rem;
  color: ${colors.gpu};
  font-variant-numeric: tabular-nums;
`;
