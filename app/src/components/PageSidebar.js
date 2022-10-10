import styled from 'styled-components'
import { CloseIcon } from 'components'
import Box from './Box'
import { LAYOUT_HEADER_HEIGHT, LAYOUT_SIDEBAR_WIDTH_DEFAULT } from 'shared/constants'

export default function PageSidebar({ children, minWidth='0px', isCloseVisible=true, onClose, ...props }) {
  const width = props.isOpen 
    ? `${props.sidebarWidth || LAYOUT_SIDEBAR_WIDTH_DEFAULT}px` 
    : minWidth
  return (
    <PageSidebarWrap width={width} {...props}>
      <PageSidebarContent width={width}>
        { children }
      </PageSidebarContent>
      { props.isOpen && isCloseVisible &&
        <CloseButton onClick={onClose}>
          <CloseIcon color='brand' size='28px' />
        </CloseButton>
      }
    </PageSidebarWrap>
  )
}

const PageSidebarWrap = styled(Box)`
  position: absolute;
  right: 0px;
  bottom: 0px;
  width: ${props => props.width};
  height: 100%;
  background: ${props => props.background || props.theme.global.colors.brandDark};
  transition: width 250ms;
`

const PageSidebarContent = styled(Box)`
  position: fixed;
  bottom: 0px;
  height: 100%;
  padding-top: ${LAYOUT_HEADER_HEIGHT}px;
  width: ${props => props.width};
  ${props => props.width === '0px' &&
    'display: none;'
  }
`

const CloseButton = styled.span`
  position: fixed;
  right: 0;
  top: calc(${LAYOUT_HEADER_HEIGHT}px + var(--spacing) / 2);

  display: flex;
  align-items: center;
  justify-content: center;
  height: 56px;
  width: 56px;
  border-radius: 50%;
  padding: 8px;
  cursor: pointer;

`