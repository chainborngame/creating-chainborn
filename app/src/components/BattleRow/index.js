import { Link } from 'wouter'
import { Text, LootIcon, HeroIcon } from 'components'
import { 
  formatTime,
  getBattleStatus 
} from 'shared/utils'
import { useGetHero } from 'shared/apollo'
import { BATTLE_MODE } from 'shared/constants'
import { isEqualHero } from 'shared/utils'
import Row from './Row'
import BattleRowHero from './BattleRowHero'
import vsImage from './images/vs.webp'
import './index.css'

export default function BattleRow({ battle }) {

  const _challenger = useGetHero({ address: battle.challenger.address, id: battle.challenger.nat })
  const _challenged = useGetHero({ address: battle.challenged.address, id: battle.challenged.nat })
  const challenger = _challenger?.hero || {}
  const challenged = _challenged?.hero || {}
  return (
    <Link href={`/battles/${battle.bid}`}>
      <Row className="BattleRow">
        <BattleRowHero 
          address={battle.challenger.address} 
          name={challenger?.name}
          id={battle.challenger.nat} 
          isVictor={battle.resolved && isEqualHero(challenger, battle.victor)}
        />
        <img 
          src={vsImage} 
          width='32px'
          height='22.7px'
          alt='vs'
        />
        <BattleRowHero 
          address={battle.challenged.address} 
          name={challenged?.name}
          id={battle.challenged.nat} 
          isVictor={battle.resolved && isEqualHero(challenged, battle.victor)}
        />
        <div className="battleMetaWrapperOuter">
          <div className="battleMetaWrapper">
            <div className="battleMeta dates">
              <div className="battleMetaRow">
                <label>Challenged:</label>
                <div>{battle.challenge_time ? formatTime(battle.challenge_time) : '-'}</div>
              </div> 
              <div className="battleMetaRow">
                <label>Started:</label>
                <div>{battle.started ? formatTime(battle.start_time) : '-'}</div>
              </div> 
              <div className="battleMetaRow">
                <label>Finished:</label>
                <div>{battle.finished ? formatTime(battle.finish_time) : '-'}</div>
              </div> 
            </div>
            <div className="battleMeta"></div>
          </div>
        </div>
        <div className="loot">
          <label><LootIcon /></label>
          <div>{battle.loot} ꜩ</div>
        </div>
        { battle.mode === BATTLE_MODE.BOTH &&
        <div className="loot">
          <label><HeroIcon size='32px' /></label>
        </div>
        }
        <Text className='status' weight='bold'>
          {getBattleStatus(battle)}
        </Text>
      </Row>
    </Link>
  )
}
