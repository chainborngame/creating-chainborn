import styled from 'styled-components'
import { Box } from 'components'
import SectionDefault from './Section'
import image from 'images/background-home-instructions.webp'

export default function Instructions() {
  return (
    <Section image={image}>
      <Box margin='medium' align='center' background='black'>
      </Box>
    </Section>
  )
}

const height = 1090

const Section = styled(SectionDefault).attrs({
  align: 'center',
  justify: 'center'
})`
  height: ${height}px;
  margin-bottom: ${height / 5}px;
  padding-top: 256px;
  em {
    font-family: Courier New;
  }
`

//const Step = styled(PageHeading).attrs({ level: 2, color: 'accent' })`
//
//`
