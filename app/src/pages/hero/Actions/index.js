import { useState, useRef } from 'react'
import { useRecoilValue } from 'recoil'
import { useLocation } from 'wouter'
import { Box, Button, ActionButton, Modal, Text } from 'components'
import { walletState, useAlert } from 'shared/state'
import { challengeHero, unsuitHero, suitUpHero } from 'shared/contract'
import { useGetConfig } from 'shared/apollo'
import { useUnlockState } from 'shared/utils'
import ChallengeModal from './ChallengeModal'

export default function Actions({ hero }) {
  const wallet = useRecoilValue(walletState)
  const { config } = useGetConfig()
  return (
    <Box>
      { hero.owner === wallet?.address
        ? <ActionsMyHero hero={hero} config={config} wallet={wallet} />
        : <ActionsNotMyHero hero={hero} config={config} />
      }
    </Box>
  )
}

function ActionsMyHero({ hero, config, wallet }) {
  const [, setAlert ] = useAlert()
  const [ isSuiting, setIsSuiting ] = useState(false)
  const isSuited = useRef(hero.suited)

  useUnlockState(
    () => isSuiting,
    () => isSuited.current === !hero.suited,
    () => {
      isSuited.current = hero.suited
      setIsSuiting(false)
    },
    [hero.suited]
  )

  const onSuitToggle = async () => {
    try {
      setIsSuiting(true)
      if (hero.suited)
        await unsuitHero({
          dappAddress: config.CHAINBORN_CONTRACT,
          tokenAddress: hero.token_address,
          tokenId: hero.token_id
        })
      else
        await suitUpHero({
          dappAddress: config.CHAINBORN_CONTRACT,
          tokenAddress: hero.token_address,
          walletAddress: wallet.address,
          tokenId: hero.token_id
        })
    }
    catch (e) {
      setIsSuiting(false)
      setAlert(e)
    }
  }

  return (
    <>
      <ActionButton 
        label={ hero.suited ? 'UnSuit' : 'Suit up!' }
        isLoading={isSuiting}
        onClick={onSuitToggle} 
      />
    </>
  )
}

function ActionsNotMyHero({ hero, config }) {
  const [ isModalOpen, setIsModalOpen ] = useState(false)
  const [ isChallenging, setIsChallenging ] = useState(false)
  const [ isChallenged, setIsChallenged ] = useState(false)

  const [, setLocation] = useLocation()
  const [, setAlert] = useAlert()

  const onChallenge = async (mode, challenger, loot) => {
    try {
      setIsModalOpen(false)
      setIsChallenging(true)
      await challengeHero({
        network: config.NETWORK_NAME,
        dappAddress: config.CHAINBORN_CONTRACT, 
        mode,
        challenger,
        challenged: hero,
        loot
      })
      setIsChallenged(true)
    }
    catch (e) {
      setAlert(e)
    }
    finally {
      setIsChallenging(false)
    }
  }

  return (
    <>
      <ActionButton 
        label="Challenge"
        isLoading={isChallenging}
        onClick={() => setIsModalOpen(true)} 
      />
      <ChallengeModal 
        config={config}
        isOpen={isModalOpen}
        challenged={hero}
        onChallenge={onChallenge} 
        onCancel={() => setIsModalOpen(false)} 
      />
      <Modal 
        isOpen={isChallenged} 
        onClose={() => setIsChallenged(false)}
      >
        <Text margin='medium'>
          <Text color='brand'>{hero.name}</Text> has been Challenged!
        </Text>
        <Button 
          primary
          label='Go to Challenges'
          onClick={() => 
            setLocation(`/battles/?token_address=${hero?.token_address}&token_id=${hero?.token_id}&status=challenge`)
          }
        />
      </Modal>
    </>
  )
}
