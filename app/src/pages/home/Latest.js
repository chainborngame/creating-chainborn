import { Link } from 'wouter'
import styled from 'styled-components'
import { Box, HeroCard, PageHeading, AsyncBox, BattleCard, CollectionCard, Slider } from 'components'
import { useGetCollections, useGetHeroes, useGetBattles } from 'shared/apollo'
import Section from './Section'
import image from 'images/background-home-latest.webp'

const heroWidth = 155
const batteWidth = 400
const collectionWidth = 400
const heroMargin = 8
const battleMargin = 16
const collectionMargin = 16

export default function Latest() {
  const { heroes, loading: loadingHeroes, error: errorHeroes } = useGetHeroes({ limit: 10 })
  const { battles, loading: loadingBattles, error: errorBattles } = useGetBattles({ sort_by: 'start_time', sort_direction: 'desc', limit: 5 })
  const { collections, loading: loadingCollections, error: errorCollections } = useGetCollections()

  return (
    <Section image={image} background='#000' justify='center' align='center'>
      <List>
        <Box direction='row' align='center' justify='between'>
          <Link href='/heroes?sort_by=summoned_at&sort_direction=desc'>
            <ListTitle>Newly summoned Heroes</ListTitle>
          </Link>
        </Box>
        <ListBox>
          <AsyncBox loading={loadingHeroes} error={errorHeroes}>
            <Slider contentWidth={heroes?.length * (heroWidth+heroMargin)}>
              {heroes.map(hero => (
                <HeroCard 
                  margin={`0px ${heroMargin}px 0px 0`}
                  hero={hero} 
                  width={heroWidth} 
                  key={hero.token_address+hero.token_id}
                />
              ))}
            </Slider>
          </AsyncBox>
        </ListBox>
      </List>
      <List>
        <Box direction='row' align='center' justify='between'>
          <Link href='/battles?status=ongoing'>
            <ListTitle>Latest Battles</ListTitle>
          </Link>
        </Box>
        <ListBox>
          <AsyncBox loading={loadingBattles} error={errorBattles}>
            <Slider contentWidth={battles?.length * (batteWidth+battleMargin)}>
              {battles?.map(battle => 
                <BattleCard 
                  battle={battle}
                  margin={`0px ${battleMargin}px 0px 0`}
                  size={batteWidth}
                  key={battle.bid} 
                />
              )}
            </Slider>
          </AsyncBox>
        </ListBox>
      </List>
      <List>
        <Box direction='row' align='center' justify='between'>
          <Link href='/collections'>
            <ListTitle>Collections</ListTitle>
          </Link>
        </Box>
        <ListBox padding='40px 0 40px 0'> 
          <AsyncBox loading={loadingCollections} error={errorCollections}>
            <Slider contentWidth={collections?.length * (collectionWidth+collectionMargin)}>
              {collections?.map(collection => 
                <CollectionCard 
                  collection={collection}
                  margin={`0px ${collectionMargin}px 0px 0`}
                  size={collectionWidth}
                  key={collection.address}
                />
              )}
            </Slider>
          </AsyncBox>
        </ListBox>
      </List>
    </Section>
  )
}

const List = styled(Box)`
  width: 100%;
  max-width: 1455px;
  padding: 8px 64px;
  @media (max-width: 768px) {
    padding: 8px 32px;
  }
  @media (max-width: 480px) {
    padding: 8px 16px;
  }
`

const ListBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  overflow: hidden;
  height: ${props => props.height};
  padding: ${props => props.padding || '5px 0 0 0'};
  margin: 0px 15px;
`

const ListTitle = styled(PageHeading).attrs({
  level: 2
})`
  cursor: pointer;
  border: 1px solid var(--color-brand-dark);
`

