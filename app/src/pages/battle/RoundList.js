import { Box } from 'components'
import styled from 'styled-components'
import { AttackIcon } from 'components'
import { isEqualHero, formatTime } from 'shared/utils'
import './RoundList.css'

const Round = styled(Box)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: var(--round-height);
  width: 100%; 
  background: var(--color-brand-middle);
  color: var(--color-brand-light);
  border-bottom: 1px solid var(--color-dark-grey);
  font-weight: bold;
  font-size: 0.7em;
  @media (min-width: 768px) {
    width: 60%;
  }
`

const BBox = styled(Box)`
  width: 25%; 
  display: flex;
`
export default function RoundList({ turns, challenger, challenged, showHealth }) {
  let challengerDamageTotal = 0
  let challengedDamageTotal = 0
  const turnList = turns.slice().reverse().map(turn => {
    const hero = [challenger, challenged].find(hero => isEqualHero(hero, turn.hero))
    if (hero === challenger) challengedDamageTotal += parseInt(turn.damage)
    if (hero === challenged) challengerDamageTotal += parseInt(turn.damage)
    return (
      <Round className="Round" key={turn.timestamp}>
        <BBox className={`FirstBox ${challenged === hero ? 'hit' : ''}`}>
          { challenged === hero &&
            <>
              <AttackIcon />
              <Box className="damage">{ turn.damage }</Box>
              {showHealth &&
                <Box className="damageTotal">{`(${challenger.health - challengerDamageTotal})`}</Box>
              }
              <div className="arrow"></div>
            </>
          }
          { challenger === hero &&
              <Box className="heroname">{`${hero?.name}`}</Box>
          }
        </BBox>
        <BBox className="CenterBox">
          <Box className="timestamp">
            { formatTime(turn.timestamp) }
          </Box>
        </BBox>
        <BBox className={`LastBox ${challenger === hero ? 'hit' : ''}`}>
          { challenged === hero &&
              <Box className="heroname">{`${hero?.name}`}</Box>
          }
          { challenger === hero &&
            <>
              <div className="arrow"></div>
              {showHealth &&
                <Box className="damageTotal">{`(${challenged.health - challengedDamageTotal})`}</Box>
              }
              <Box className="damage">{ turn.damage }</Box>
              <AttackIcon />
            </>
          }
        </BBox>
      </Round>
    )
  })
  turnList.reverse()
  return (
    <Box className="RoundList">
      {turnList}
    </Box>
  )
}
