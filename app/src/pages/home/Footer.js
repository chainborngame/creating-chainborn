import styled from 'styled-components'
import { Link } from 'wouter'
import { Box, DiscordIcon, TwitterIcon } from 'components'
import logoImage from 'images/logo.webp'
import Section from './Section'

export default function Footer(props) {
  const tzkt_prefix = props?.config?.NETWORK_NAME !== 'mainnet' ? `${props?.config?.NETWORK_NAME}.` : ''
  return (
    <FooterSection background='secondary'>
      <FooterLeft>
        <img src={logoImage} loading='lazy' alt='logo' />
      </FooterLeft>
      <FooterMiddle>
        <Link href='/faq'>
          FAQ
        </Link>
        <a href='/terms'>
          Terms & Conditions
        </a>
        <a href={`https://${tzkt_prefix}tzkt.io/${props?.config?.CHAINBORN_CONTRACT}`} target='_blank' rel='noreferrer'>
          Game logic<br/>
          <small>{props?.config?.CHAINBORN_CONTRACT}</small>
        </a>
        <a href={`https://${tzkt_prefix}tzkt.io/${props?.config?.CHAINBORN_DATASTORE}`} target='_blank' rel='noreferrer'>
          Game data<br/>
          <small>{props?.config?.CHAINBORN_DATASTORE}</small>
        </a>
      </FooterMiddle>
      <FooterRight>
        <a href='https://discord.gg/RzJ3aBj3eF' target='_blank' rel='noreferrer'>
          <DiscordIcon color='accent' size='32px' />
        </a>
        <a href='https://twitter.com/chainborngame' target='_blank' rel="noreferrer">
          <TwitterIcon color='accent' size='32px' /> 
        </a>
      </FooterRight>
    </FooterSection>
  )
}

const FooterSection = styled(Section)`
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  height: 400px;
  padding: 128px;
  @media (max-width: 768px) {
    height: 300px;
    padding: 64px;
  }
  @media (max-width: 634px) {
    flex-direction: column;
    align-items: center;
    height: 500px;
    padding: 64px 32px;
  }
`

const FooterLeft = styled(Box)`
  img {
    width: 156px;
  }
`

const FooterMiddle = styled(Box)`
  a {
    color: ${props => props.theme.global.colors.brand};
    margin-bottom: 16px;
  }
  a:hover {
    text-decoration: underline;
  }
  small {
    font-size: 10px;
  }
`

const FooterRight = styled(Box).attrs({ 
  direction: 'row',
  gap: '16px',
})`

`
