import { useEffect, useState } from 'react'
import { Box, ChatIcon } from 'components'
import styled from 'styled-components'

export default function BattleChatBubble({ onClick, messages }) {
  const [ chatActivity, setChatActivity ] = useState(false)  

  useEffect(() => {
    setChatActivity(true)
    setTimeout(() => setChatActivity(false), 3000)
  },[messages, setChatActivity])

  return (
    <Bubble onClick={onClick}>
      <BubbleContent>
        { chatActivity &&
          <ActivityChatIcon color='brand' size='32px' />
        }
        { !chatActivity &&
          <ChatIcon color='brandMiddle' size='32px' />
        }
      </BubbleContent>
    </Bubble>
  )
}

const ActivityChatIcon = styled(ChatIcon)`
  animation: wiggle 2s linear infinite;
`

const Bubble = styled(Box)`
  position: fixed;
  right: 16px;
  bottom: 16px;
  align-items: center;
  justify-content: center;
  height: 72px;
  width: 72px;
  border-radius: 50%;
  background: ${props => props.theme.global.colors.brandDark};
  box-shadow: 0px 0px 9px -3px rgba(0,0,0,0.54);
  cursor: pointer;
  &:active {
    height: 70px;
    width: 70px;
  }
`

const BubbleContent = styled(Box)`
  justify-content: center;
  align-items: center;
  margin-right: 2px;
  margin-top: 4px;
`
