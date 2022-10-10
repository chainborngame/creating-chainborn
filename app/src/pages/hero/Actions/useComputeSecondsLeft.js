import { useMemo } from 'react'
import differenceInSeconds from 'date-fns/differenceInSeconds'
import addSeconds from 'date-fns/addSeconds'
import { isEqualHero } from 'shared/utils'

export default function useComputeSecondsLeft(challenged, challengers, pairBattleCooldown, recompute) {

  const timeBattleByHero = useMemo(() => 
    challengers.reduce((acc, challenger) => {
      const key = challenger.token_address+challenger.token_id
      const heroBattle = challenged.battles.find(heroBattle => isEqualHero(heroBattle?.key, challenger))
      if (heroBattle) {
        const latest = heroBattle?.value?.latest
        const timeBattleAllowed = addSeconds(new Date(latest), pairBattleCooldown)
        const diff = differenceInSeconds(new Date(), timeBattleAllowed)
        acc[key] = diff > 0 ? 0 : Math.abs(diff)
      }
      else {
        acc[key] = 0
      }
      return acc
    }, {})
  // eslint-disable-next-line react-hooks/exhaustive-deps
  , [challenged, challengers, pairBattleCooldown, recompute])

  return timeBattleByHero
}
