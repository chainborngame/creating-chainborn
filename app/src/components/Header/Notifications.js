import { Link } from 'wouter'
import { ChallengeIcon, BattleIcon, AttackIcon, InfoBox } from 'components'
import { 
  formatTime,
  markNotificationRead, 
} from 'shared/utils'
import './Notifications.css'

export default function Notifications({ network, wallet, notifications }) {

  const handleNotificationClick = (n) => {
    if (!n.read) markNotificationRead(network, wallet?.address, n.fid)
  }

  const handleMarkAllClick = () => {
    notifications.forEach(n => {
      if (!n.read) markNotificationRead(network, wallet?.address, n.fid)
    })
  }

  const nItems = notifications.map(n => {
    return (
      <Link key={n.uid} href={n.link} onClick={() => handleNotificationClick(n)}>
        <div className={`item ${n.read ? 'read' : 'unread'}`}>
          <div className="first">
            <div className='text'>{n.text}</div>
            <div className='date'>{formatTime(n?.createdAt?.seconds*1000)}</div>
          </div>
          <div>
          { n.type === 'challenge' &&
            <ChallengeIcon />
          }
          { n.type === 'accept-challenge' &&
            <BattleIcon />
          }
          { n.type === 'attack' &&
            <AttackIcon />
          }
          </div>
        </div>
      </Link>
    )
  })
  return (
    <div className="Notifications">
      <div className="top">
        <div className="markAllRead" onClick={handleMarkAllClick}>Mark all read</div>
      </div>
      {!wallet &&
        <InfoBox level='4' severity='info'>
          Connect wallet to see notifications
        </InfoBox>
      }
      {nItems}
    </div>
  )
}
