import { useState } from 'react'
import { Box, Heading, Text, TextInput, TextArea, CheckBox, Button, Spinner, EditIcon } from 'components'
import { updateHeroCharacter } from 'shared/contract'
import { useAlert } from 'shared/state'
import { useUnlockState } from 'shared/utils'

export default function Story({ config, address, id, name, story, battleReady, isEditable }) {
  
  const [, setAlert ] = useAlert()
  const [ editing, setEditing ] = useState(false)
  const [ values, setValues ] = useState({ name, story, battleReady })
  const [ saving, setSaving ] = useState(false)

  useUnlockState(
    () => saving,
    () =>
      name === values.name &&
      story === values.story &&
      battleReady === values.battleReady,
    () => {
      setSaving(false)
      setEditing(false)
    },
    [name, story, battleReady]
  )

  const onEdit = () => {
    setEditing(true)
  }

  const onChange = attribute => event => {
    const propValue = event.target.type === 'checkbox' ? 'checked' : 'value'
    setValues(prev => ({ ...prev, [attribute]: event.target[propValue] }))
  }

  const onSave = async () => {
    try {
      setSaving(true)
      await updateHeroCharacter({
        dappAddress: config.CHAINBORN_CONTRACT,
        tokenAddress: address,
        tokenId: id,
        name: values.name,
        story: values.story,
        battleReady: values.battleReady,
      })
    }
    catch (e) {
      setAlert({ title: e.message })
      setSaving(false)
      setEditing(false)
    }
  }

  const onCancel = () => {
    setValues({ name, story, battleReady })
    setEditing(false)
  }

  return (
    <Box direction='row' justify='between' overflow='hidden'>
      { saving ?
        <Spinner size='8px' /> 
        : editing ?
        <Box width='100%' gap='small' pad='1px'>
          <TextInput 
            value={values.name}
            onChange={onChange('name')}
          />
          <TextArea
            value={values.story}
            style={{ height: '256px' }}
            onChange={onChange('story')}
          />
          <CheckBox 
            label='Battle Ready'
            checked={values.battleReady}
            onChange={onChange('battleReady')}
          />
          <Box direction='row' gap='small' margin={{ vertical: 'small' }}>
            <Button primary label='Save' onClick={onSave} />
            <Button label='Cancel' onClick={onCancel} />
          </Box>
        </Box>
        :
        <Box>
          <Heading level='2' margin={{ top: '0px' }}>
            {name}
          </Heading>
          <Text>{ story }</Text>
        </Box>
      }
      <Box>
        { isEditable && !editing && !saving &&
          <EditIcon onClick={onEdit} cursor='pointer' />
        }
      </Box>     
    </Box>
  )
}
