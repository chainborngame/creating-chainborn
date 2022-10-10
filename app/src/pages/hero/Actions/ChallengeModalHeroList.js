import { useState, useCallback } from 'react'
import { useRecoilValue } from 'recoil'
import styled from 'styled-components'
import { Box, Spinner, HeroCard, InfoBox, CheckBox, Text } from 'components'
import { useGetConfig, useGetHeroes } from 'shared/apollo'
import { walletState } from 'shared/state'
import { isEqualHero } from 'shared/utils'
import useComputeSecondsLeft from './useComputeSecondsLeft'
import CoolDownCounter from './CoolDownCounter'

export default function ChallengeModalHeroList({ challenged, selectedChallenger, onSelectChallenger }) {
  const [ recompute, setRecompute ] = useState(0)
  const wallet = useRecoilValue(walletState)
  const { config, loading: loadingConfig, error: errorConfig } = useGetConfig()
  const { heroes, loading: loadingHeroes, error: errorHeroes } = useGetHeroes({ owner: wallet?.address })
  const loading = loadingConfig || loadingHeroes
  const error = errorConfig || errorHeroes
  const secondsLeftByHero = useComputeSecondsLeft(challenged, heroes, config?.pair_battle_cooldown, recompute)
  const onZeroTick = useCallback(() => setRecompute(prev => prev+1), [])

  return (
    <Box direction='row' gap='small' overflow='scroll' fill>
      { error
        ? <InfoBox level='3' severity='error'>
            Could not load Heroes
          </InfoBox>
        : !wallet
        ? <InfoBox level='3'>
            Connect Wallet to see your Heroes
          </InfoBox>
        : loading ? <Spinner size='large' /> :
        heroes?.map(hero => {
          const heroKey = hero.token_address+hero.token_id
          const secondsLeft = secondsLeftByHero[heroKey]
          return (
            <HeroBox selected={isEqualHero(hero, selectedChallenger)} key={heroKey}>
              <Box margin={{ bottom: 'medium' }}>
                <CheckBox
                  label={hero.name}
                  disabled={!hero.battle_ready || secondsLeft > 0}
                  checked={isEqualHero(hero, selectedChallenger)}
                  onChange={() => onSelectChallenger(hero)}
                />
              </Box>
              <HeroCard 
                hero={hero} 
                key={heroKey}
              />
              <Box align='center' margin={{ top: 'xsmall' }}>
                { !hero.battle_ready &&
                  <Text color='status-error'>
                    Not suited 
                  </Text>
                }
                { secondsLeft > 0 &&
                  <CoolDownCounter 
                    secondsLeft={secondsLeft}
                    onZeroTick={onZeroTick}
                  />
                }
              </Box>
            </HeroBox>
          )
        }
      )}
    </Box>
  )
}

const HeroBox = styled(Box).attrs({
  pad: 'medium'
})`
  border: 1px solid ${props => props.selected 
    ? props.theme.global.colors.brand 
    : props.theme.global.colors['dark-1']
  };
  opacity: ${props => props.selected ? 1 : 0.7};
  min-width: 300px;
`
