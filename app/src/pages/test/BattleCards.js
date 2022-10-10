import { Box, BattleCard } from 'components'
import { useGetBattles } from 'shared/apollo'

const sizeStep = 200

export default function BattleCards(argument) {
  const { battles } = useGetBattles({ limit: 5 })
  return (
    <Box gap='small'>
      { battles?.map((battle, index) => 
          <BattleCard 
            battle={battle}
            key={battle.bid}
            size={sizeStep * (index+1)}
          />
      )}
    </Box>
  )
}