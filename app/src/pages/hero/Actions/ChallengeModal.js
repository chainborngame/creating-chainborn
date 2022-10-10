import { useState } from 'react'
import { Box, Modal, Button, Text, TextInput, RadioButton, LootIcon, HeroIcon, ChallengeIcon } from 'components'
import ChallengeModalHeroList from './ChallengeModalHeroList'
import { BATTLE_MODE as MODE } from 'shared/constants'

export default function ChallengeModal({ isOpen, onChallenge, challenged, onCancel, config }) {
  const [ mode, setMode ] = useState(null)
  const [ challenger, setChallenger ] = useState(null)
  const [ loot, setLoot ] = useState(null)

  const onModeToggle = modeOption => event => {
    setMode(modeOption)
  }

  const onChallengeClick = () => {
    onChallenge(mode, challenger, loot)
  }

  const modeDisabled = !challenger
  const lootDisabled = modeDisabled || (mode !== MODE.LOOT && mode !== MODE.BOTH)

  return (
    <Modal isOpen={isOpen} onClose={onCancel}>
      <Box margin={{ bottom: 'medium' }}>
        <Text margin={{ bottom: 'small' }}>
          Who's the Challenger?
        </Text>
        <ChallengeModalHeroList
          challenged={challenged}
          selectedChallenger={challenger}
          onSelectChallenger={setChallenger}
        />
      </Box>
      <Box margin={{ bottom: 'medium' }} disabled={modeDisabled}>
        <Text margin={{ bottom: 'small' }}>
          What do you bet?
        </Text>
        <Box direction='row' gap='medium'>
          <RadioButton
            name='battle_mode'
            label={<>
              <LootIcon />
              <Text margin='xsmall'>
                A Loot
              </Text>
            </>}
            checked={mode === MODE.LOOT}
            disabled={modeDisabled}
            onChange={onModeToggle(MODE.LOOT)}
          />
          <RadioButton
            name='battle_mode'
            label={<>
              <HeroIcon />
              <LootIcon />
              <Text margin='xsmall'>
                Hero & Loot
              </Text>
            </>}
            checked={mode === MODE.BOTH}
            disabled={modeDisabled}
            onChange={onModeToggle(MODE.BOTH)}
          />
        </Box>
        <Box margin={{ top: 'small' }} disabled={lootDisabled}>
          <TextInput
            type='number' 
            value={loot || ''}
            autoFocus 
            placeholder={`Set the loot (minimum ${config?.minimum_loot} ꜩ)...`}
            disabled={lootDisabled}
            onChange={event => setLoot(parseInt(event.target.value))}
          />
        </Box>
      </Box>
      <Box direction='row' gap='small'>
        <Button 
          primary
          label='Challenge!'
          icon={<ChallengeIcon />}
          disabled={!(
            mode && 
            challenger &&
            ((mode === MODE.LOOT || mode === MODE.BOTH) && loot >= config?.minimum_loot)
          )}
          onClick={onChallengeClick} 
        />
        <Button 
          label='Nay'
          onClick={onCancel}
        />
      </Box>
    </Modal>
  )
}
