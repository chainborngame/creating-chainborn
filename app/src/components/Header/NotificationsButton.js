import { DropButton, Stack, Text } from 'grommet'
import { Box, NotificationIcon } from 'components'
import { useRecoilState } from 'recoil'
import { useGetConfig } from 'shared/apollo'
import { walletState } from 'shared/state'
import { firestore } from 'shared/firebase'
import { collection, query, orderBy, limitToLast } from 'firebase/firestore'
import { useCollection } from 'react-firebase-hooks/firestore'
import Notifications from './Notifications'

const dropAlign = { top: 'bottom', right: 'right' }
const badgePad = { horizontal: 'xsmall' }

export default function NotificationsButton({ dropTarget, onClick }) {
  const [ wallet ] = useRecoilState(walletState)
  const { config } = useGetConfig()
  const notificationsRef = collection(firestore, `/${config?.NETWORK_NAME}/notifications/${wallet?.address}`);
  const q = query(notificationsRef, orderBy('createdAt','asc'), limitToLast(25)) 
  const [value] = useCollection(q)
  const notifications = (value?.docs || []).map(v => {
    return Object.assign({}, v.data(), { fid: v.id })
  }).reverse()
  const unread = notifications.filter(n => !n.read)
  const iconColor = unread.length > 0 ? 'brand' : 'brandMiddle'
  return (
    <Box round='large' background='secondary'>
      <Stack anchor='top-right'>
        <DropButton
          icon={<NotificationIcon color={iconColor} />}
          dropContent={<Notifications network={config?.NETWORK_NAME} wallet={wallet} notifications={notifications} />}
          dropAlign={dropAlign}
          dropTarget={dropTarget}
          onClick={onClick}
        />
        { unread.length &&
          <Box background='tomato' pad={badgePad} round>
            <Text color='white' size='small' weight='bold'>
              {unread.length}
            </Text>
          </Box>
        }
      </Stack>
    </Box>
  )
}
