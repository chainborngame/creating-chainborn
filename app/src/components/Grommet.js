import styled from 'styled-components'
import { Grommet as GGrommet } from 'grommet'
import { LAYOUT_MAX_WIDTH } from 'shared/constants'

const Grommet = styled(GGrommet)`
  max-width: ${LAYOUT_MAX_WIDTH}px;
  margin: 0 auto;
`

export default Grommet