import { Tip as GTip } from 'grommet'
import styled from 'styled-components'
import { Box, Text } from 'components'

export default function Tip({ text, size='small', children }) {
  return (
    <GTip plain content={
      <Box pad='xsmall' round='xsmall' color='accent' background='dark-1'>
        <TipText textAlign='center' size={size}>{text}</TipText>
      </Box>
      }>
      { children }
    </GTip>
  )
}

const TipText = styled(Text)`
  font-family: ghostclan;
`
