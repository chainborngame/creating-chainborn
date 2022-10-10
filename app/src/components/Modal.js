import { useMemo } from 'react'
import { Layer, Box } from 'grommet'
import styled from 'styled-components'

export default function Modal({ isOpen, color='brand', children, onClose }) {
  const border = useMemo(() => ({ size: 'small', color }), [color])
  if (!isOpen) {
    return null
  }
  return (
    <CenterLayer
      background='transparent'
      round='small'
      onEsc={onClose}
      onClickOutside={onClose}
    >
      <Box pad='medium' background='#111' round='small' border={border}>
        { children }
      </Box>
    </CenterLayer>
  )
}

const CenterLayer = styled(Layer)`
  display: flex;
  align-items: center;
  justify-content: center;
`