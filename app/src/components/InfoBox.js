import styled from 'styled-components'
import { Heading as GHeading } from 'grommet'

const InfoBox = styled(GHeading)`
  width: ${props => props.width || 'initial'};
  margin: ${props => props.margin || 'auto'};
  padding: 8px 16px;
  border-radius: 3px;
  color: #222;
  background-color: ${props => 
    props.severity === 'error' 
    ? props.theme.global.colors['status-error']
    : props.severity === 'warning'
    ? props.theme.global.colors['status-warning']
    : props.theme.global.colors.brand
  };
`

export default InfoBox