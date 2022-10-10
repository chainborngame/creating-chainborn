import styled from 'styled-components'
import { Box, Heading, HeroCard } from 'components'
import { useResponsive } from 'shared/utils'

export default function Player({ hero, number, isPlayerTurn, showProgress }) {
  const { width } = useResponsive()
  const cardSize = 
    width < 900 && width >= 768 
      ? 285 :
    width < 768 ? 240 : 350

  return (
    <Box align='center'>
      <PlayerHeading level={2} color='accent'>
        Player { number }
      </PlayerHeading>
      { hero &&
        <HeroCard 
          hero={hero} 
          height={cardSize}
          showProgress={showProgress} 
          isTurn={isPlayerTurn}
        />
      }
    </Box>
  )
}

const PlayerHeading = styled(Heading)`
  background-color: var(--color-secondary);
  font-family: 'ghostclan';
  border-radius: 4px;
  padding: 10px 16px;
  /* fixes small screens */
  text-align: center;
  line-height: 1.18;
  white-space: nowrap;
`