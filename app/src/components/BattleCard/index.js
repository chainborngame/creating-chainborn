import { Link } from 'wouter'
import styled from 'styled-components'
import { useGetHero } from 'shared/apollo'
import { isEqualHero } from 'shared/utils'
import { BATTLE_MODE } from 'shared/constants'
import Box from '../Box'
import { LootIcon, HeroIcon } from '..'
import frameImage from './frame.webp'

const sizeRatio = 0.5144965876

export default function BattleCard({ battle, size=400, margin }) {
  const { hero: challenger } = useGetHero({ 
    address: battle?.challenger?.address, 
    id: battle?.challenger?.nat 
  })
  const { hero: challenged } = useGetHero({ 
    address: battle?.challenged?.address, 
    id: battle?.challenged?.nat 
  })

  const isChallengerVictor = battle.resolved && isEqualHero(challenger, battle.victor)
  const isChallengedVictor = battle.resolved && isEqualHero(challenged, battle.victor)

  return (
    <Link href={`/battles/${battle.bid}`}>
      <Card width={`${size}px`} height={`${size*sizeRatio}px`} margin={margin}>
        <FrameImage src={frameImage} />
        <ChallengerImage src={challenger?.thumbnailUri} />
        <ChallengedImage src={challenged?.thumbnailUri} />
        <ChallengerName isVictor={isChallengerVictor}>
          {challenger?.name}
        </ChallengerName>
        <ChallengedName isVictor={isChallengedVictor}>
          {challenged?.name}
        </ChallengedName>
        <Loot>
          { String(battle?.loot).length > 3 
            ? <small>🤯</small> 
            : battle?.loot
          }
        </Loot>
        { battle?.mode === BATTLE_MODE.BOTH &&
          <BothMode>
            <LootIcon color='brand' size='100%' />
            <HeroIcon color='brand' size='100%' />
          </BothMode>
        }
        { battle?.mode === BATTLE_MODE.LOOT &&
          <LootMode>
            <LootIcon color='brand' size='100%' />
          </LootMode>
        }
      </Card>
    </Link>
  )
}

const Card = styled(Box)`
  --fs: ${props => props.width*0.0485}px;
  position: relative;
  height: ${props => props.height};
  width: ${props => props.width};
  margin: ${props => props.margin || 0};
  clip-path: polygon(97.9% 0.05%, 99.9% 4.6%, 99.9% 99.1%, 1.9% 99%, 0% 95.9%, 0% 0.05%);
  cursor: pointer;
  user-select: none;
  transition: all var(--transition-move-ms) ease-in-out;
  &:hover {
    transform: translateY(-6px);
  }
`

const FrameImage = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 1;
`

const ChallengerImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 50%;
  height: 100%;
`

const ChallengedImage = styled.img`
  position: absolute;
  top: 0;
  right: 0;
  width: 50%;
  height: 100%;
`

const CardText = styled.span`
  position: absolute;
  display: flex;
  align-items: center;
  z-index: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: ghostclan;
  // font-size: var(--fs);
  color: var(--color-brand);
  // border: 1px solid tomato;
  white-space: nowrap;
`

const ChallengerName = styled(CardText)`
  bottom: 3%;
  left: 2%;  
  height: 9%;
  width: 25%;
  max-width: 25%;
  ${props => props.isVictor ? `box-shadow: -0px 0px 16px 0px rgba(0,255,224,0.75);` : ''}
`

const ChallengedName = styled(CardText)`
  top: 1.8%;
  right: 1.9%;
  height: 9%;
  width: 25%;
  max-width: 25%;
  ${props => props.isVictor ? `box-shadow: -0px 0px 16px 0px rgba(0,255,224,0.75);` : ''}
`

const Loot = styled(CardText)`
  justify-content: center;
  bottom: 2.5%;
  right: 0.8%;
  height: 11%;
  width: 10%;
  max-width: 10%;
  small {
    margin-top: 10%;
  }
`

const BattleMode = styled.div`
  position: absolute;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`

const LootMode = styled(BattleMode)`
  right: 10%;
  bottom: 3.5%;
  width: 9%;
  height: 9%;
`

const BothMode = styled(BattleMode)`
  right: 10.7%;
  bottom: 4%;
  width: 7.5%;
  height: 7.5%;
  svg:first-child {
    margin-right: -2px;
  }
`
