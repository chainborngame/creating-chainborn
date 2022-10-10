import styled from 'styled-components'
import { Button as GButton } from 'grommet'

const Button = styled(GButton)`
  user-select: none;
  color: ${props => 
    props.primary 
      ? 'var(--color-secondary)' 
      : 'var(--color-accent)'
  };
`

export default Button