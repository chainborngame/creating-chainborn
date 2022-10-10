import { useLocation } from 'wouter'
import { Box, ActionButton, Heading, HeroIcon, LinkIcon, BuyIcon } from 'components'
import styled from 'styled-components'

export default function Collection({ address, banner, crest, name, lore, link, reverse=false }) {
  
  const [, setLocation ] = useLocation()

  const right = (
    <RootRight>
      <Title>
        { name }
      </Title>
      <Description>
        { lore }
      </Description>
      <Box direction='row' gap='small' height='60px'>
        <CollectionButton
          label={<>Buy {name}{'\u00A0'}<LinkIcon/></>}
          icon={<BuyIcon color='accent' size='18px' />}
          onClick={() => window.open(link)}
        />
        <CollectionButton
          label={<>Top 10 {'\u00A0'}<LinkIcon/></>}
          icon={<HeroIcon size='22px'/>}
          onClick={() => setLocation(`/heroes?sort_by=experience_total&sort_direction=desc&token_address=${address}`)}
        />
      </Box>
    </RootRight>
  )

  const left = (
    <RootLeft>
      <Crest src={banner} />
    </RootLeft>
  )

  return (
    <Root>
    {reverse
      ? <>{right}{left}</> 
      : <>{left}{right}</> 
    }
    </Root>
  )
}

const borderRadius = 6

const Root = styled.div`
  display: flex;
  transition: transform var(--transition-move-ms);
  gap: 16px;
  height: 400px;
  &:hover {
    // transform: translateX(16px);
    // transform: scale(1.02);
  }
`

const RootLeft = styled.div`
  height: 100%;
  border-radius: ${borderRadius}px;
`

const RootRight = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%; 
  width: 100%;
  padding: 32px;
  border-radius: ${borderRadius}px;
  background-color: var(--color-secondary);
`

const Crest = styled.img`
  width: 400px;
  height: 100%;
  object-fit: cover;
  border-radius: ${borderRadius}px;
`

const Title = styled(Heading).attrs({ level: 2 })`
  background: ${props => props.theme.global.colors.brand};
  color: var(--color-secondary);
  padding: 4px 8px;
  border-radius: ${borderRadius}px;
  width: fit-content;
  margin-top: 0;
`

const Description = styled.p`
  height: 100%;
  margin: 0;
  line-height: 2;
  border-radius: ${borderRadius}px;
  overflow: scroll;
  color: ${props => props.theme.global.colors.brand};
`

const CollectionButton = styled(ActionButton)`
  width: fit-content;
  box-shadow: 0px 0px 0px 2px ${props => props.theme.global.colors.brandMiddle};
`
