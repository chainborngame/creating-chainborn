import styled from 'styled-components'
import { ActionButton, Box, Spinner } from 'components'

const BattleButtonWrap = styled(ActionButton)`
  width: ${props => props.width || `300px`};
  height: ${props => (props.height/3)-4}px;
  font-size: ${props => props.height*0.16}px;
  font-style: italic;
  font-weight: bold;
  border-top: 3px solid ${props => props.theme.global.colors.brand};
  border-bottom: 3px solid ${props => props.theme.global.colors.brand};
  border-left: 6px solid ${props => props.theme.global.colors.brand};
  border-right: 6px solid ${props => props.theme.global.colors.brand};
`

const BattleButtonSpinnerWrap = styled(Box)`
  width: 300px;
  height: ${props => (props.height/3)-4}px;
`

export default function BattleButton({ isLoading, ...props }) {
  return (
    isLoading 
      ? <BattleButtonSpinnerWrap height={props.height}>
          <Spinner size='8px' />
        </BattleButtonSpinnerWrap>
      : <BattleButtonWrap {...props} />
  )
}
