import styled from 'styled-components'
import Box from './Box'
import { LAYOUT_SIDEBAR_WIDTH_DEFAULT } from 'shared/constants'

const PageContent = styled(Box)`
  margin-right: ${props => props.isSidebarOpen 
    ? `${props.sidebarWidth || LAYOUT_SIDEBAR_WIDTH_DEFAULT}px` 
    : '0px'
  }
`

export default PageContent