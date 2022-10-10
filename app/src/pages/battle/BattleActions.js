import { useState } from 'react'
import styled from 'styled-components'
import { Box, Text, InfoBox, VictorIcon } from 'components'
import BattleButton from './BattleButton'
import { useGetConfig } from 'shared/apollo'
import { acceptChallenge, cancelChallenge, resolveBattle } from 'shared/contract'
import { useAlert } from 'shared/state'
import { signExecuteBattleTurnMessage } from 'shared/wallet'
import { useUnlockState } from 'shared/utils'
import { executeBattleTurn } from 'shared/api'

const height = '200'

export default function BattleActions({ 
  bid, 
  loot, 
  wallet,
  attacker,
  defender,
  victor,
  experienceGained,
  myHero,
  isStarted, 
  isFinished, 
  isTimeout, 
  isMyTurn, 
  isMyHeroPlaying, 
  isResolved, 
  isCancelled,
  challenger, 
  challenged, 
  isMyHeroChallenger,
  isMyHeroVictor
}) {

  const { config } = useGetConfig()
  const [, setAlert ] = useAlert()
  const [ loading, setLoading ] = useState(false)

  useUnlockState(
    () => loading,
    () => !isMyTurn, 
    () => {
      setLoading(false)
    },
    [isMyTurn, loading]
  )

  const onAccept = async () => {
    try {
      setLoading(true)
      await acceptChallenge({
        network: config.NETWORK_NAME,
        dappAddress: config.CHAINBORN_CONTRACT,
        challenger: challenger,
        challenged: challenged,
        bid,
        loot
      })
    }
    catch (e) {
      setAlert(e)
    }
    finally {
      setLoading(false)
    }
  }

  const onCancel = async () => {
    try {
      setLoading(true)
      await cancelChallenge({
        dappAddress: config.CHAINBORN_CONTRACT,
        bid,
      })
    }
    catch (e) {
      setAlert(e)
    }
    finally {
      setLoading(false)
    }
  }

  const onAttack = async () => {
    try {
      setLoading(true)
      const payload = await signExecuteBattleTurnMessage({ bid, account: wallet })
      await executeBattleTurn(payload)
    }
    catch (e) {
      setAlert(e)
      setLoading(false)
    }
  }

  const onResolve = async () => {
    try {
      setLoading(true)
      await resolveBattle({
        dappAddress: config.CHAINBORN_CONTRACT,
        bid
      })
    }
    catch (e) {
      setAlert(e)
    }
    finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Box>
        { isFinished &&
          <InfoBox level='3' severity='info'>
            <Box align='center' justify='center' gap='xsmall' pad='xsmall'>
              <VictorIcon color='secondary' size='large' />
              <Text>
                <BattleText textAlign='center'>{victor?.name} won</BattleText>
                <Text>!</Text>
              </Text>
            </Box>
          </InfoBox>
        }
        { isCancelled &&
          <InfoBox level='3' severity='error'>
            The challenge was cancelled!
          </InfoBox>
        }
        { isStarted && !isFinished && isTimeout && 
          <InfoBox level='3' severity='info'>
            Time is Out!
          </InfoBox>
        }
      </Box>
      <Box margin={{ top: 'medium' }}>
        { !isStarted && !isCancelled && isMyHeroPlaying && isMyTurn &&
          <BattleButton 
            label='Accept' 
            height={height} 
            isLoading={loading}
            onClick={onAccept}
          />
        }
        { !isStarted && !isCancelled && isMyHeroPlaying && isMyHeroChallenger &&
          <BattleButton 
            label='Cancel' 
            height={height} 
            isLoading={loading}
            onClick={onCancel}
          />
        }
        { !isFinished && !isTimeout && isMyHeroPlaying && isMyTurn && 
           <BattleButton 
            label='Attack' 
            height={height} 
            isLoading={loading} 
            onClick={onAttack} 
          />
        }
        { isMyHeroVictor &&
          !isResolved &&
           isStarted &&
          (isFinished && isMyHeroPlaying ||
           isTimeout && isMyHeroPlaying && !isMyTurn) &&
          <BattleButton 
            label='Resolve' 
            height={height} 
            isLoading={loading}
            onClick={onResolve}
          />
        }
      </Box>
    </>
  )
}

const BattleText = styled(Text)`
  font-family: ghostclan;
  font-size: 1.2rem;
  letter-spacing: 1px;
`