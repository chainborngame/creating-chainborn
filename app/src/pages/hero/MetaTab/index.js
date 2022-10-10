import { Link } from 'wouter'
import { Box } from 'components'
import styled from 'styled-components'

const MetaRow = styled(Box)`
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 0.9em;
  line-height: 1.1em;
  a {
    color: var(--color-brand);
  }
  @media only screen and (max-width: 768px) {
    flex-direction: column;
    margin-bottom: 16px;
    div:first-child {
      color: var(--color-brand);
      margin-bottom: 4px;
    }
  }
`

export default function Story({ hero }) {

  const num_battles = hero.wins + hero.losses 

  return (
    <Box direction='column' overflow='hidden'>
      <MetaRow>
        <Box>Token Address</Box>
        <Box>{hero?.token_address}</Box>
      </MetaRow>
      <MetaRow>
        <Box>Token ID</Box>
        <Box>{hero?.token_id}</Box>
      </MetaRow>
      <MetaRow>
        <Box>Owner</Box>
        <Box><Link href={`/player/${hero?.owner}`}>{hero?.owner}</Link></Box>
      </MetaRow>
      <MetaRow>
        <Box>Battles</Box>
        <Box>{num_battles}</Box>
      </MetaRow>
      <MetaRow>
        <Box>Wins</Box>
        <Box>{hero.wins}</Box>
      </MetaRow>
      <MetaRow>
        <Box>Losses</Box>
        <Box>{hero.losses}</Box>
      </MetaRow>
      <MetaRow>
        <Box>Battle Ready</Box>
        <Box>{hero?.battle_ready ? 'Yes' : 'No'}</Box>
      </MetaRow>
      <MetaRow>
        <Box>Experience (unspent)</Box>
        <Box>{hero?.experience}</Box>
      </MetaRow>
      <MetaRow>
        <Box>Experience Total</Box>
        <Box>{hero?.experience_total}</Box>
      </MetaRow>
      <MetaRow>
        <Box>Citizen</Box>
        <Box>False</Box>
      </MetaRow>
      <MetaRow>
        <Box>Rank</Box>
        <Box>{ hero?.getRank() }</Box>
      </MetaRow>
      <MetaRow>
        <Box>Unchained</Box>
        <Box>{hero?.wins > 100 ? 'Yes' : 'No'}</Box>
      </MetaRow>
      <MetaRow>
        <Box>Items</Box>
        <Box>0</Box>
      </MetaRow>
    </Box>
  )
}
