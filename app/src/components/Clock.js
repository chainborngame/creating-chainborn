import { Clock as GClock } from 'grommet'
import styled from 'styled-components'

const Clock = styled(GClock)`
  div {
    color: ${props => props.theme.global.colors[props.color] || props.color || 'inherit'};
  }
`

export default Clock