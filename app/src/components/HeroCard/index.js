import { Link } from 'wouter'
import styled, { css } from 'styled-components'
import Box from '../Box'
import { Img, BattleIcon, ExperienceIcon, NotBattleReadyIcon } from 'components'
import { Hero } from 'shared/models'
import { CircleLoader, CircleError } from '../Loaders/Circle'
import Badges from './Badges'
import ExperienceProgressBar from './ExperienceProgressBar'
import BattleProgressBar from './BattleProgressBar'
import UnknownSkin from './images/SkinUnknown.webp'
import NoviceSkin from './images/SkinNovice.webp'
import TraineeSkin from './images/SkinTrainee.webp'
import ExperiencedSkin from './images/SkinExperienced.webp'
import MasterSkin from './images/SkinMaster.webp'
import { float } from './keyframes'

const skinImage = {
  [Hero.RANK.UNKNOWN]: UnknownSkin,
  [Hero.RANK.NOVICE]: NoviceSkin,
  [Hero.RANK.TRAINEE]: TraineeSkin,
  [Hero.RANK.EXPERIENCED]: ExperiencedSkin,
  [Hero.RANK.MASTER]: MasterSkin,
}
const defaultSize = 300
const sizeRatio = 0.64403337271

export default function HeroCard({ hero, showProgress, isTurn, margin, height, width }) {
  const size = calcSize(height, width)
  const imgSize = size * 0.4
  const iconSize = size / 8

  const experienceProgressbarHeight = size * 0.031
  const battleProgressbarHeight = size * 0.1
  const damagePercentage = hero.damage ? Math.round((hero.damage / hero.health) * 100) : 0 
  const healthPercentage = Math.max(0, 100 - damagePercentage)

  return (
    <Link href={`/heroes/${hero.token_address}/${hero.token_id}`}>
      <CardShadowWrap isTurn={isTurn}>
        <Card size={size} margin={margin} isTurn={isTurn}>
          <FrameImage src={skinImage[hero.getRank()]} />
          <Badges badges={hero.badges} />
          <HeroImageBox size={imgSize}>
            <Img
              src={hero.thumbnailUri} 
              size={imgSize} 
              Component={HeroImage} 
              ComponentProps={{ isBW: !hero.suited }}
              ComponentLoader={CircleLoader} 
              ComponentError={CircleError} 
            />
          </HeroImageBox>
          <HeroName numLetters={hero.name?.length}>
            {hero.name}
          </HeroName>
          <Strength>{hero.strength}</Strength>
          <Health>{hero.health}</Health>
          <Stats>
            { !hero.battle_ready &&
              <NotBattleReadyIcon size={iconSize} color='white' />
            }
            { hero.battling &&
              <BattleIcon size={iconSize} color='white' />
            }
            { !hero.battling && hero.experience > 0 &&
              <ExperienceIcon size={iconSize} color='white' />
            }
          </Stats>
          <ExperienceProgressBar 
            height={experienceProgressbarHeight} 
            percentage={hero.experience_total}
          />
        </Card>
      </CardShadowWrap>
      { showProgress &&
        <BattleProgressBar 
          height={battleProgressbarHeight} 
          percentage={healthPercentage}
        />
      }
    </Link>
  )
}

// Trick to use "box-shadow" and "clip-path" together
//   https://css-tricks.com/using-box-shadows-and-clip-path-together/
const CardShadowWrap = styled.span`
  ${props => props.isTurn &&
    'filter: drop-shadow(0px 0px 32px rgba(0, 255, 224, 0.75))'
  };
`

const Card = styled(Box)`
  --fs-name: ${props => props.size*0.07}px;
  --fs-stats: ${props => props.size*0.045}px;
  position: relative;
  height: ${props => props.size}px;
  width: ${props => props.size * sizeRatio}px;
  cursor: pointer;
  font-family: ghostclan;
  clip-path: polygon(92.7% 0, 100% 3.9%, 100% 100%, 0 100%, 0 0);
  transition: all var(--transition-move-ms) ease-in-out;
  animation: ${props => props.isTurn
    ? css`${float} 5s ease-in-out infinite;`
    : 'inherit'
  };
  &:hover {
    transform: translateY(-6px);
  }
`

const FrameImage = styled.img`
  z-index: 0;
  height: 100%;
  width: 100%;
`

const HeroImageBox = styled.div`
  position: absolute;
  top: calc(31.2% - ${props => props.size/2}px);
  left: calc(50% - ${props => props.size/2}px);
  z-index: -1;
`

const HeroImage = styled.img`
  ${props => props.isBW &&
    'filter: grayscale(1)'
  };
`

const HeroName = styled.span`
  position: absolute;
  top: 54.8%;
  left: 19%;
  width: 60%;
  height: 7.5%;
  display: flex;
  justify-content: ${props => props.numLetters > 8 ? 'flex-start' : 'center'}; 
  text-align: center;
  align-items: center;
  font-size: var(--fs-name);
  white-space: nowrap;
  overflow: hidden;
  color: white;
`

const Attribute = styled.span`
  position: absolute;
  bottom: 3%;
  height: 4.5%;
  width: 13%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #000;
  font-size: var(--fs-stats);
`

const Strength = styled(Attribute)`
  left: 1.9%;
`

const Health = styled(Attribute)`
  right: 1.9%;
`

const Stats = styled.span`
  position: absolute;
  top: 63.7%;
  left: 19%;
  width: 61.5%;
  height: 23.5%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
  padding: 2%;
`

function calcSize(height, width) {
  if (height === undefined && width === undefined) {
    height = defaultSize
    width = height * sizeRatio
  }
  else if (height === undefined) {
    height = width / sizeRatio
  }
  // else if (width === undefined) {
  //   width = height * sizeRatio
  // }
  // else {
  //   // all defined 
  // }
  return height
}