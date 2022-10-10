import styled from 'styled-components'
import { Button as GButton } from 'grommet'
import Box from './Box'
import Spinner from './Spinner'

const ActionButtonWrap = styled(GButton)`
  font-family: ghostclan;
  font-size: 22px;
  width: ${props => props.width || 'inherit'};
  padding: ${props => props.padding || '8px 16px'};
  border: none;
  border-radius: 0;
  text-transform: uppercase;
  color: var(--color-accent);
  background: ${props => 
    props.negative 
      ? '#E44747'
      : 'var(--color-secondary)'
  };
  cursor: pointer;
  user-select: none;
  transition: transform 0.15s cubic-bezier(0, 0.2, 0.5, 3) 0s;
  &:active {
    background: #90f1f5;
    color: var(--color-secondary);
    svg {
      stroke: var(--color-secondary);
    }
  }
`;

const ActionButtonSpinnerWrap = styled(Box)`
  width: ${props => props.width || 'inherit'};
`

export default function ActionButton({ isLoading, ...props }) {
  return (
    isLoading 
      ? <ActionButtonSpinnerWrap width={props.width} margin={props.margin}>
          <Spinner size='8px' />
        </ActionButtonSpinnerWrap>
      : <ActionButtonWrap {...props} />
  )
}