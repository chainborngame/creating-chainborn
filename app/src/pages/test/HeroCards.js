import styled from 'styled-components'
import { Box, HeroCard } from 'components'
import { useGetHeroes } from 'shared/apollo'
import { Hero } from 'shared/models'

const sizeStep = 100

export default function HeroCards(argument) {
  const { heroes } = useGetHeroes({ limit: 5 })
  return (
    <Box direction='row' pad={{ top: '40px' }} overflow='scroll'>
      <Column gap='small'>
        <b>Suited & BattleReady</b>
        {heroes?.map((hero, index) => 
          <HeroCard 
            hero={Hero.merge(hero, { suited: true, battle_ready: true, battling: false, experience: 0 })} 
            height={sizeStep * (index+1)}
            key={hero.token_address+hero.token_id} 
          />
        )}
      </Column>
      <Column gap='small'>
        <b>!Suited</b>
        {heroes?.map((hero, index) => 
          <HeroCard 
            hero={Hero.merge(hero, { suited: false, battle_ready: false, battling: false, experience: 0 })} 
            height={sizeStep * (index+1)}
            key={hero.token_address+hero.token_id} 
          />
        )}
      </Column>
      <Column gap='small'>
        <b>!BattleReady</b>
        {heroes?.map((hero, index) => 
          <HeroCard 
            hero={Hero.merge(hero, { suited: true, battle_ready: false, battling: false, experience: 0 })} 
            height={sizeStep * (index+1)}
            key={hero.token_address+hero.token_id} 
          />
        )}
      </Column>
      <Column gap='small'>
        <b>Battling</b>
        {heroes?.map((hero, index) => 
          <HeroCard 
            hero={Hero.merge(hero, { suited: true, battle_ready: true, battling: true, experience: 0 })} 
            height={sizeStep * (index+1)}
            key={hero.token_address+hero.token_id} 
          />
        )}
      </Column>
      <Column gap='small'>
        <b>Experience</b>
        {heroes?.map((hero, index) => 
          <HeroCard 
            hero={Hero.merge(hero, { suited: true, battle_ready: true, battling: false, experience: 1 })} 
            height={sizeStep * (index+1)}
            key={hero.token_address+hero.token_id} 
          />
        )}
      </Column>
    </Box>
  )
}

const Column = styled(Box)`
  flex: 0 0 auto;
  // width: auto;
  // max-width: 100%;
  margin-right: 8px;
`