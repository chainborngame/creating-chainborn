import { Box, Text, TextInput, Button } from 'components'

export default function NumberInput({ label, value, max, min, onChange }) {
  const onInputChange = event => {
    onChange(parseInt(event.target.value))
  }
  const onPlusClick = () => {
    const newValue = parseInt(value) + 1
    if (newValue >= min && newValue <= max) {
      onChange(newValue)
    }
  }
  const onMinusClick = () => {
    const newValue = parseInt(value) - 1
    if (newValue >= min && newValue <= max) {
      onChange(newValue)
    }
  }
  return (
    <Box direction='row' align='center' justify='end' gap='small'>
      <Text style={{ minWidth: '80px' }}>
        { label }
      </Text>
      <TextInput 
        type='number' 
        value={value} 
        min={min} 
        max={max} 
        onChange={onInputChange} 
      />
      <Button label='+' disabled={value === max} onClick={onPlusClick} />
      <Button label='-' disabled={value === min} onClick={onMinusClick} />
    </Box>
  )
}
