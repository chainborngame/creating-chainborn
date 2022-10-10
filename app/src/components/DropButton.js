import styled from 'styled-components'
import { DropButton as GDropButton } from 'grommet'

const DropButton = styled(GDropButton)`
  padding: 8px 16px;
  border: none;
  border-radius: 0;
  text-transform: uppercase;
  color: var(--color-accent);
  background: var(--color-secondary);
  cursor: pointer;
  user-select: none;
`;

export default DropButton