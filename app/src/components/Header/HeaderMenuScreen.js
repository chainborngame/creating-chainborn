import { useRef } from 'react'
import Box from '../Box'
import Wallet from '../Wallet'
import HeaderButton from './HeaderButton'
import NotificationsButton from './NotificationsButton'
import { NotificationsDropTarget } from './DropTarget'
import { ROUTE_HEROES, ROUTE_BATTLES } from './index'

export default function HeaderMenuScreen({ onNotificationsClick }) {
  const notificationTarget = useRef()
  return (
    <>
      <Box
        direction='row'
        align='center'
        justify='between'
        gap='medium'
      >
        <HeaderButton href={ROUTE_HEROES}>Heroes</HeaderButton>
        <HeaderButton href={ROUTE_BATTLES}>Battles</HeaderButton>
        <Wallet />
        <NotificationsButton 
          dropTarget={notificationTarget.current} 
          onClick={onNotificationsClick} 
        />
      </Box>
      <NotificationsDropTarget ref={notificationTarget} />
    </>
  )
}
