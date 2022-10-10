import { useState } from 'react'
import { Box, Heading, ActionButton, HeroCard, Spinner, InfoBox } from 'components'
import { useGetConfig, useGetBattle } from 'shared/apollo'
import { acceptChallenge, rejectChallenge } from 'shared/contract'
import { useAlert } from 'shared/state'

export default function Challenge({ bid, showButtons }) {
  const { config } = useGetConfig()
  const { loading, error, battle } = useGetBattle({ bid })
  const [, setAlert ] = useAlert()
  const [ accepting, setAccepting ] = useState(false)
  const [ rejecting, setRejecting ] = useState(false)
  const challenger = battle?.challenger
  const challenged = battle?.challenged

  const onAcceptChallenge = async () => {
    try {
      setAccepting(true)
      await acceptChallenge({
        dappAddress: config.CHAINBORN_CONTRACT, 
        bid,
        loot: battle.loot
      })
    }
    catch (e) {
      setAlert(e)
    }
    finally {
      setAccepting(false)
    }
  }

  const onRejectChallenge = async () => {
    try {
      setRejecting(true)
      await rejectChallenge({
        dappAddress: config.CHAINBORN_CONTRACT, 
        bid
      })
    }
    catch (e) {
      setAlert(e)
    }
    finally {
      setRejecting(false)
    }
  }

  return (
    <>
    { loading 
      ? <Spinner size='medium' /> :
      error 
      ? <InfoBox level='3' severity='error'>
          Could not load Challenge  
        </InfoBox> :
      battle?.started 
      ? <InfoBox level='3' severity='info'>
          The Battle has already started
        </InfoBox> :
      <Box gap='medium'>
        <Heading level='3' margin={{vertical: 'small'}}>
          {challenger?.name} has challenged {challenged?.name}!
        </Heading>
        <Box direction='row' gap='medium'>
          { challenger &&
            <HeroCard hero={challenger} />
          }
          <Box>
            <Box>loot: { battle?.loot } ꜩ</Box>
            <Box>mode: { battle?.mode }</Box>  
          </Box>
        </Box>
        { showButtons &&
          <Box direction='row' gap='small'>
            <ActionButton 
              label='Accept Challenge!' 
              width='240px' 
              isLoading={accepting} 
              onClick={onAcceptChallenge} 
            />
            <ActionButton 
              negative 
              label='Reject' 
              width='140px' 
              isLoading={rejecting} 
              onClick={onRejectChallenge} 
            />
          </Box>
        }
      </Box>
    }
    </>
  )
}
