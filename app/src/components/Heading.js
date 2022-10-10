import styled from 'styled-components'
import { Heading as GHeading } from 'grommet'

const Heading = styled(GHeading)`
  font-family: 'ghostclan';
  letter-spacing: 1px;
  color: ${props => props.color || props.theme.global.colors.brand};
  background-color: ${props => props.background || 'inherit'};
`

export default Heading