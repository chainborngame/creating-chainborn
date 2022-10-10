import { uid } from 'uid'
import { useEffect, useState, useRef, useCallback } from 'react'
import { InfoBox, CloseIcon } from 'components'
import { addDoc } from 'firebase/firestore'
import { 
  formatTime,
  getTzktURI,
  getIpfsLink,
  truncateAddress, 
  getTezIDProfile,
  getIdentityImage,
} from 'shared/utils'
import './BattleChat.css'

export default function BattleChat({ bid, battle, wallet, isVisible, onClose, messages, messagesRef, config }) {
  return (
    <div className={`BattleChat ${isVisible ? '' : 'hidden'}`}>
      <button className='close' onClick={onClose}>
        <CloseIcon color='brand' size='28px' />
      </button>
      { wallet 
        ? <ChatRoom 
            bid={bid} 
            wallet={wallet} 
            config={config}
            messages={messages} 
            messagesRef={messagesRef} 
            isVisible={isVisible}
          /> 
        : <InfoBox level='4' severity='info'>
            Connect wallet to start chatting!
          </InfoBox> 
      }
    </div>
  )
}

function ChatRoom({ bid, wallet, messages, messagesRef, isVisible, config }) {

  const isInitialRender = useRef(true)
  const dummy = useRef()
  const tzktURI = getTzktURI(config) 

  useEffect(() => {
    if (isVisible) {
      dummy.current.scrollIntoView({ 
        behavior: isInitialRender.current ? 'auto' : 'smooth' 
      })
      isInitialRender.current = false
    }
  }, [messages, isVisible])

  const sendMessage = useCallback(async (text) => {
    const sender = wallet.address 
    await addDoc(messagesRef, {
      uid: uid(8),
      createdAt: new Date(), // TODO: Get server timestamp 
      text,
      sender,
    })
  }, [wallet, messagesRef])

  return (<>
    <main>
      {messages && messages.map(msg => 
        <ChatMessage 
          key={msg.uid} 
          message={msg} 
          wallet={wallet} 
          tzktURI={tzktURI}
        />
      )}
      <span key="dummy" ref={dummy} />
    </main>
    <ChatForm
      isVisible={isVisible}
      onSend={sendMessage} 
    />
  </>)
}

function ChatForm({ isVisible, onSend }) {
  const [formValue, setFormValue] = useState('')
  const inputRef = useRef()
  useEffect(() => {
    if (isVisible) {
      inputRef.current.focus()
    }
  }, [isVisible])
  const onSubmit = event => {
    event.preventDefault()
    onSend(formValue)
    setFormValue('')  
  }
  const onChange = event => {
    setFormValue(event.target.value)
  }
  return (
    <form onSubmit={onSubmit}>
      <input 
        value={formValue}
        placeholder="Say something..."
        ref={inputRef}
        onChange={onChange}
      />
      <button type="submit" disabled={!formValue}>💬</button>
    </form>
  )
}

function ChatMessage(props) {
  const { text, sender, createdAt } = props.message;
  const { tzktURI } = props
  const [ profile, setProfile ] = useState(null)

  useEffect(() => {
    (async () => {
      const p = await getTezIDProfile(sender)
      setProfile(p)
    })()
  }, [sender])

  // eslint-disable-next-line
  const isYou = sender == props?.wallet?.address 
  const messageClass = isYou ? 'sent' : 'received';
  const youText = isYou ? '(you)' : ''
  const timestamp = new Date(createdAt.seconds*1000)
  const idImg = profile?.avatar ? null : getIdentityImage(sender)
  const imgSrc = profile?.avatar ? getIpfsLink(profile.avatar) : idImg.src
  const senderName = profile?.avatar ? profile.name : truncateAddress(sender)
  const avatarImageStyle = {
    backgroundImage: `url(${imgSrc})`,
    backgroundSize: 'cover'
  }

  return (<>
    <div className={`message ${messageClass}`}>
      <div className="avatar">
        <div className="avatarImage" style={avatarImageStyle}></div>
        <div className="youtext">{youText}</div> 
      </div>
      <div className="payload">
        <div className="meta">
          <div className="sender">
            <a href={`${tzktURI}/${sender}`} target='_blank' rel='noreferrer'>{senderName}</a>
          </div>
          <div className="date">{formatTime(timestamp)}</div>
        </div>
        <p>{text}</p>
      </div>
    </div>
  </>)
}
