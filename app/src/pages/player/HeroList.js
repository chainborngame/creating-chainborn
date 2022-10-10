import { Box, PageHeading, HeroCard, ActionButton, AsyncBox } from 'components'
import { useGetHeroes } from 'shared/apollo'
import { useFetchMore } from 'shared/utils'

export default function HeroList({ owner }) {
  const { heroes, fetchMore, loading, error } = useGetHeroes({ owner })
  const { onFetchMore, hasMore } = useFetchMore(heroes, 'heroes', fetchMore)
  return (
    <>
      <PageHeading level='3'>
        Heroes
      </PageHeading>
      <AsyncBox loading={loading} error={error}>
        <Box direction='row' wrap>
          {heroes?.map(hero => 
            <HeroCard 
              margin={'0px 12px 12px 0'}
              hero={hero}
              key={hero.token_address+hero.token_id} 
            />
          )}
        </Box>
        <Box align='end'>
          { hasMore &&
            <ActionButton 
              label='Load More'
              onClick={onFetchMore}
            />
          }
        </Box>
      </AsyncBox>
    </>
  )
}
