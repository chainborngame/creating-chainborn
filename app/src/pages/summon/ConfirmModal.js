import { useState } from 'react'
import { Box, Button, Text, TextInput, Modal, SummonIcon } from 'components'

export default function ConfirmModal({ isOpen, cost, onSummon, onCancel }) {
  const [ name, setName ] = useState('')
  return (
    <Modal isOpen={isOpen} onClose={onCancel}>
      <Text margin={{ bottom: 'medium' }}>
        Give your Hero a <Text color='brand'>unique</Text> name:
      </Text>
      <TextInput
        autoFocus
        value={name}
        onKeyDown={event => event.keyCode === 13 && onSummon(name)}
        onChange={event => setName(event.target.value)}
      />
      <Box direction='row' gap='small' margin={{ top: 'medium' }} >
        <Button 
          primary
          label={`Summon for ${cost}ꜩ`}
          icon={<SummonIcon />}
          disabled={name === ''}
          onClick={() => onSummon(name)} 
        />
        <Button 
          label='Nay'
          onClick={onCancel}
        />
      </Box>
    </Modal>
  )
}