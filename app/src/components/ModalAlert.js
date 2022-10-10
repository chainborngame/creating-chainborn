import { useCallback } from 'react'
import styled from 'styled-components'
import { useAlert } from 'shared/state'
import Modal from './Modal'
import Heading from './Heading'
import Box from './Box'
import Button from './Button'

export default function ModalAlert() {
  const [ alert, setAlert ] = useAlert()
  const onClose = useCallback(() => setAlert(null), [setAlert])
  const color = `status-${alert?.severity}`
  return (
    <Modal isOpen={!!alert} color={color} onClose={onClose}>
      <ModalTitle severity={alert?.severity} color={color}>
        {alert?.title}
      </ModalTitle>
      { alert?.description }
      <Box align='center'>
        <OkButton 
          label='ok'
          color={color}
          onClick={onClose}
        />
      </Box>
    </Modal>
  )
}

const ModalTitle = styled(Heading).attrs({
  level: 4
})`
  margin-top: 0;
`

const OkButton = styled(Button)`
  margin-top: ${props => props.theme.global.spacing};
  width: 128px;
`
