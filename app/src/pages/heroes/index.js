import { useRecoilValue } from 'recoil'
import { Page, PageContent, PageSidebar, Box, HeroCard, InfoBox, PageHeading, ActionButton } from 'components'
import { useGetHeroes } from 'shared/apollo'
import { walletState } from 'shared/state'
import { useUrlState, useLocalStorage, useFetchMore, useResponsive } from 'shared/utils'
import backgroundHeroes from 'images/background-heroes.webp'
import HeroFilters from './HeroFilters'
import HeroSorting from './HeroSorting'
import Toolbar from './Toolbar'

export default function Heroes() {
  const [ filter, setFilter ] = useUrlState({})
  const [ isSidebarOpen, setSidebarOpen ] = useLocalStorage(
    'heroes_sidebar_open', 
    document.body.getBoundingClientRect().width < 768
  )
  const wallet = useRecoilValue(walletState)
  const { width } = useResponsive()
  const cardSize = width < 768 ? 220 : 300

  const { 
    heroes: othersHeroes,
    fetchMore: fetchMoreOthersHeroes,
    loading: loadingAllHeroes, 
    error: errorAllHeroes 
  } = useGetHeroes({
    not_owner: wallet?.address,
    token_address: filter.token_address,
    name: filter.name,
    sort_by: filter.sort_by,
    sort_direction: filter.sort_direction,
    // limit: 3
  })
  const { 
    heroes: myHeroes,
    fetchMore: fetchMoreMyHeroes,
    loading: loadingMyHeroes,
    error: errorMyHeroes
  } = useGetHeroes({ 
    owner: wallet?.address,
    token_address: filter.token_address,
    name: filter.name,
    sort_by: filter.sort_by,
    sort_direction: filter.sort_direction,
    // limit: 2
  })

  const { 
    onFetchMore: onFetchMoreMyHeroes, 
    hasMore: hasMoreMyHeroes 
  } = useFetchMore(myHeroes, 'heroes', fetchMoreMyHeroes)
  const { 
    onFetchMore: onFetchMoreOthersHeroes, 
    hasMore: hasMoreOthersHeroes 
  } = useFetchMore(othersHeroes, 'heroes', fetchMoreOthersHeroes)

  const onSidebarOpen = () => setSidebarOpen(true)
  const onSidebarClose = () => setSidebarOpen(false)

  // eslint-disable-next-line no-unused-vars
  const loading =  loadingAllHeroes || loadingMyHeroes
  const error = errorAllHeroes || errorMyHeroes

  if (error) {
    return (
      <Page image={backgroundHeroes} align='center'>
        <InfoBox level='3' severity='error'>
          Could not load Heroes
        </InfoBox> 
      </Page>
    )
  }

  return (
    <Page image={backgroundHeroes}>
      <PageContent isSidebarOpen={isSidebarOpen}>
        { wallet &&
          <>
            <Box direction='row' align='center' gap='small' fill>
              <PageHeading level='3'>
                My Heroes
              </PageHeading>
              <Toolbar 
                isSidebarOpen={isSidebarOpen}
                onSidebarOpen={onSidebarOpen} 
              />
            </Box>
            <Box direction='row' wrap>
              {myHeroes?.map(hero => 
                <HeroCard 
                  margin={'0px 12px 12px 0'}
                  hero={hero}
                  height={cardSize}
                  key={hero.token_address+hero.token_id} 
                />
              )}
            </Box>
          </>
        }
        <Box align='end'>
          { hasMoreMyHeroes &&
            <ActionButton 
              label='Load More'
              onClick={onFetchMoreMyHeroes}
            />
          }
        </Box>
        <Box direction='row' align='center' gap='small' fill>
          <PageHeading level='3'>
            Explore Heroes
          </PageHeading>
          { !wallet &&
            <Toolbar 
              isSidebarOpen={isSidebarOpen}
              onSidebarOpen={onSidebarOpen} 
            />
          }
        </Box>
        <Box direction='row' wrap>
          {othersHeroes?.map(hero => 
            <HeroCard 
              margin={'0px 12px 12px 0'}
              hero={hero}
              height={cardSize}
              key={hero.token_address+hero.token_id}
            />
          )}
        </Box>
        <Box align='end'>
          { hasMoreOthersHeroes &&
            <ActionButton 
              label='Load More'
              onClick={onFetchMoreOthersHeroes}
            />
          }
        </Box>
      </PageContent>
      <PageSidebar isOpen={isSidebarOpen} onClose={onSidebarClose}>
        <Box pad='medium'>
          <HeroFilters 
            filter={filter}
            onFilterChange={setFilter} 
          />
          <HeroSorting 
            filter={filter}
            onSortChange={setFilter}
          />
        </Box>
      </PageSidebar>
    </Page>
  )
}
