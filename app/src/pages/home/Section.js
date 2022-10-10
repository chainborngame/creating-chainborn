import { Box } from 'components'
import styled from 'styled-components'

const Section = styled(Box)`
  background-image: ${props => props.image ? `url(${props.image})` : 'inherit'};
  background-position: center;
  background-size: cover;
  background-color: ${props => props.background || 'inherit'};
`

export default Section