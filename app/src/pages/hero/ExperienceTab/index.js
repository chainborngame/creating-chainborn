import { useState } from 'react'
import { Box, Heading, ActionButton, UpgradeIcon } from 'components'
import { useGetConfig } from 'shared/apollo'
import { updateHeroAttributes } from 'shared/contract'
import { useAlert } from 'shared/state'
import { useUnlockState } from 'shared/utils'
import NumberInput from './NumberInput'

export default function ExperienceTab({ address, id, health, strength, experience }) {
  
  const [ newHealth, setNewHealth ] = useState(health)
  const [ newStrength, setNewStrength ] = useState(strength)
  const [ upgrading, setUpgrading ] = useState(false)
  const { config } = useGetConfig()
  const [, setAlert ] = useAlert()

  useUnlockState(
    () => upgrading,
    () => 
      health === newHealth &&
      strength === newStrength,
    () => setUpgrading(false),
    [health, strength]
  )

  const onUpdateHero = async () => {
    try {
      setUpgrading(true)
      await updateHeroAttributes({
        dappAddress: config.CHAINBORN_CONTRACT, 
        tokenAddress: address,
        tokenId: id,
        values: { 
          health: newHealth-health, 
          strength: newStrength-strength 
        }
      })
    }
    catch (e) {
      setUpgrading(false)
      setAlert(e)
    }
  }

  const onHealthChange = value => {
    setNewHealth(value)
  }

  const onStrengthChange = value => {
    setNewStrength(value)
  }

  return (
    <Box justify='center' align='center'>
      <Heading>
        { experience - (newHealth - health) - (newStrength - strength) }
      </Heading>
      <Box gap='small'>
        <NumberInput
          label='Health'
          value={newHealth} 
          max={health + experience - (newStrength - strength)} 
          min={health}
          onChange={onHealthChange} 
        />
        <NumberInput
          label='Strength'
          value={newStrength}
          max={strength + experience - (newHealth - health)}
          min={strength}
          onChange={onStrengthChange}
        />
        <ActionButton 
          primary 
          margin={{ vertical: 'medium' }}
          icon={<UpgradeIcon/>} 
          label='Upgrade Hero' 
          disabled={newHealth - health === 0 && newStrength - strength === 0}
          isLoading={upgrading}
          onClick={onUpdateHero} 
        />
      </Box>
    </Box>
  )
}
