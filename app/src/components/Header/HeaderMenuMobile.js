import { useRef } from 'react'
import { Menu as MenuIcon } from 'grommet-icons'
import Box from '../Box'
import DropButton from '../DropButton'
import Wallet from '../Wallet'
import NotificationsButton from './NotificationsButton'
import { NotificationsDropTarget } from './DropTarget'
import { ROUTE_HEROES, ROUTE_BATTLES } from './index'
import HeaderButton from './HeaderButton'

const dropAlign = { top: 'bottom', right: 'right' }

export default function HeaderMenuMobile({ onNotificationsClick }) {
  const notificationTarget = useRef()
  return (
    <>
      <Box direction='row' align='center' justify='between' gap='small'>
        <NotificationsButton 
          dropTarget={notificationTarget.current} 
          onClick={onNotificationsClick} 
        />
        <DropButton
          icon={<MenuIcon color='brand' />} 
          dropContent={
            <Box background='secondary'>
              <HeaderButton href={ROUTE_HEROES}>Heroes</HeaderButton>
              <HeaderButton href={ROUTE_BATTLES}>Battles</HeaderButton>
              <Wallet />
            </Box>
          }
          dropAlign={dropAlign}
        />
      </Box>
      <NotificationsDropTarget ref={notificationTarget} />
    </>
  )
}
