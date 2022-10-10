import { AccordionPanel as GAccordionPanel } from 'grommet'
import styled from 'styled-components'

const AccordionPanel = styled(GAccordionPanel)`
  h4 {
    max-width: initial;
    transition: color var(--transition-glow-ms);
  }
  svg {
    transition: stroke var(--transition-glow-ms);
  }
  &:hover {
    h4 {
      color: var(--color-brand-middle);
    }
    svg {
      stroke: var(--color-brand-middle);
    }
  }
`

export default AccordionPanel