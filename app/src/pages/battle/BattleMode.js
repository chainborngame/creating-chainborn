import { Box, Text, LootIcon, HeroIcon } from 'components'
import { BATTLE_MODE } from 'shared/constants'

const iconSize = '2rem'
const textSize = 'medium'

export default function BattleMode({ mode, loot }) {
  return (
    <Box align='center' pad='medium'>
      <Box align='center' pad='small' background='brand' round='medium'>
        {({ 
            [BATTLE_MODE.LOOT]: 
              <Box direction='row' align='center' gap='small'>
                <LootIcon size={iconSize} />
                <Text size={textSize}>{ loot } ꜩ</Text>
              </Box>,
            [BATTLE_MODE.BOTH]: 
              <Box direction='row' align='center' gap='small'>
                <Box direction='row' align='center'>
                  <HeroIcon size={iconSize} />
                  <LootIcon size={iconSize} />
                </Box>
                <Text size={textSize}>{ loot } ꜩ</Text>
              </Box>
        })[mode]}
      </Box>
    </Box>
  )
}