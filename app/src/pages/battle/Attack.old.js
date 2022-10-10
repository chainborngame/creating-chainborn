import { useState } from 'react'
import { Box } from 'components'
import BattleButton from './BattleButton'
import { useGetConfig } from 'shared/apollo'
import { executeBattle } from 'shared/contract'
import turnImage from 'images/turn.webp'

const height = 200

export default function Attack({ bid }) {
  const [ attacking, setAttacking ] = useState(false)

  const { config } = useGetConfig()

  const onAttack = async () => {
    try {
      setAttacking(true)
      await executeBattle({
        dappAddress: config.CHAINBORN_CONTRACT,
        bid
      })
    }
    finally {
      setAttacking(false)
    }
  }

  return (
    <Box direction='row' justify='center' align='center' margin={{ left: `-${height/2}px` }} fill>
      <img 
        src={turnImage} 
        height={`${height}px`}
        alt='turn' 
      />
      <Box height={`${height}px`} direction='column' justify='between' margin={{ left:'8px' }}>
        <BattleButton label='Attack' height={height} isLoading={attacking} onClick={onAttack} />
        <BattleButton label='Magic'  height={height} disabled />
        <BattleButton label='Random' height={height} disabled />
      </Box>
    </Box>
  )
}