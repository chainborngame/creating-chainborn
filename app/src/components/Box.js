import styled from 'styled-components'
import { Box as GBox } from 'grommet'

const Box = styled(GBox)`
  opacity: ${props => props.disabled ? 0.2 : 'inherit'};
  pointer-events: ${props => props.disabled ? 'none' : 'inherit'};
  color: ${props => props.theme.global.colors[props.color] || props.color || 'inherit'};
  cursor: ${props => props.cursor || 'inherit'};
`

Box.defaultProps = {
  animation: {
    type: 'fadeIn',
    duration: 200 
  },
  focusIndicator: false,
}

export default Box
