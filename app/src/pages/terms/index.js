import styled from 'styled-components'
import { Page, Box, PageHeading } from 'components'
import heroesBackgroundImage from 'images/background-heroes.webp'

export default function Terms() {
  return (
    <Page direction='column' align='start' minHeight='220vh' image={heroesBackgroundImage}>
      <PageHeading>Terms</PageHeading>
      <TextBox>
        <em>
          ChainBorn is currently in public beta.<br/>
          This implies the software may have bugs and/or unintended functionality.<br/>
          A user of the public beta is solely responsible for the loss of any tokens, cryptocurrency or any other technical or personal information or property while using the beta.<br/>
          <br/>
          Surf Labs AS is in no way resposible for any damages, financial or otherwise, that users may suffer while playing ChainBorn.
        </em>
      </TextBox>
      <PageHeading>Code of conduct</PageHeading>
      <TextBox>
        <em>
          <i>
            One shall not bother others,<br/>
            one shall be nice and kind,<br/>
            otherwise one may do as one pleases.
          </i>
        </em>
      </TextBox>
    </Page>
  )
}

const TextBox = styled(Box).attrs({
  pad: 'medium',
  round:'small',
  background: 'secondary',
  color: 'brand',
})`
  box-shadow: -0px 0px 16px 0px rgba(64,64,64,0.75);
  width: 100%;
  em {
    font-style: initial;
    font-weight: bold;
    color: var(--color-brand);
  }
`
