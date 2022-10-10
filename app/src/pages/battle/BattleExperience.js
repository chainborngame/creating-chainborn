import { Link } from 'wouter'
import styled from 'styled-components'
import { Box, Text, InfoBox, ExperienceIcon } from 'components'
import BattleButton from './BattleButton'
import { isEqualHero } from 'shared/utils'

const width = '225'

export default function BattleExperience({ battle, hero, isMyHero }) {
  return (
    <Box gap='small' width={`${width}px`}>
      <span></span>
      <InfoBox level='4' severity='info' margin='0px'>
        <Box direction='row' justify='center' align='center' gap='xsmall'>
          <ExperienceIcon />
          <ExperienceText>
            { isEqualHero(battle?.victor, hero) 
              ? `Gained ${battle?.experience_gained} XP`
              : `Gained ${Math.floor(battle?.experience_gained/2)} XP`
            }
          </ExperienceText>
        </Box>
      </InfoBox>
      { isMyHero && hero?.experience > 0 &&
        <Link href={`/heroes/${hero?.token_address}/${hero?.token_id}/experience`}>
          <Box align='center' justify='center'>
            <BattleButton 
              label={`Upgrade Hero`}
              width={`${width}px`}
            />
          </Box>
        </Link>
      }
    </Box>
  )
}

const ExperienceText = styled(Text)`
  font-family: ghostclan;
  letter-spacing: 1px;
`