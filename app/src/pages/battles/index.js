import { useRecoilValue } from 'recoil'
import { Page, PageContent, PageSidebar, Box, PageHeading, Spinner, InfoBox, ActionButton, BattleRow } from 'components'
import { walletState } from 'shared/state'
import { useGetBattles } from 'shared/apollo'
import { useUrlState, useFetchMore, useLocalStorage } from 'shared/utils'
import backgroundBattle from 'images/background-battle.webp'
import BattleFilters from './BattleFilters'
import BattleSorting from './BattleSorting'
import Toolbar from './Toolbar'

export default function Battles() {
  const [ filter, setFilter ] = useUrlState()
  const [ isSidebarOpen, setSidebarOpen ] = useLocalStorage(
    'battles_sidebar_open', 
    document.body.getBoundingClientRect().width < 768
  )
  const wallet = useRecoilValue(walletState)
  const {
    battles: myBattles,
    fetchMore: fetchMoreMyBattles,
    loading: loadingMyBattles,
    error: errorMyBattles,
  } = useGetBattles({ owner: wallet?.address, ...filter, limit: 2 })
  const {
    battles: otherBattles,
    fetchMore: fetchMoreOtherBattles,
    loading: loadingAllBattles,
    error: errorAllBattles,
  } = useGetBattles({ not_owner: wallet?.address, ...filter })

  const { 
    onFetchMore: onFetchMoreMyBattles, 
    hasMore: hasMoreMyBattles 
  } = useFetchMore(myBattles, 'battles', fetchMoreMyBattles)
  const { 
    onFetchMore: onFetchMoreOtherBattles, 
    hasMore: hasMoreOtherBattles 
  } = useFetchMore(otherBattles, 'battles', fetchMoreOtherBattles)

  const onSidebarOpen = () => setSidebarOpen(true)
  const onSidebarClose = () => setSidebarOpen(false)

  const loading = loadingMyBattles || loadingAllBattles
  const error = errorMyBattles || errorAllBattles

  if (loading) {
    return (
      <Page image={backgroundBattle} align='center'>
        <Spinner size='large' />
      </Page>
    )
  }

  if (error) {
    return (
      <Page image={backgroundBattle} align='center'>
        <InfoBox level='3' severity='error'>
          Could not load Battles
        </InfoBox> 
      </Page>
    )
  }

  return (
    <Page image={backgroundBattle}>
      <PageContent isSidebarOpen={isSidebarOpen}>
        { wallet &&
          <Box>
            <Box direction='row' align='center' gap='small' fill>
              <PageHeading level='3'>
                My Battles
              </PageHeading>
              <Toolbar 
                isSidebarOpen={isSidebarOpen}
                onSidebarOpen={onSidebarOpen} 
              />
            </Box>
            <Box margin={{top:'large'}}>
              {myBattles?.map(battle => 
                <BattleRow 
                  key={battle.bid} 
                  battle={battle}
                />
              )}
            </Box>
            <Box align='end'>
              { hasMoreMyBattles &&
                <ActionButton 
                  label='Load More'
                  onClick={onFetchMoreMyBattles}
                />
              }
            </Box>
          </Box>
        }
        <Box>
          <Box direction='row' align='center' gap='small' fill>
            <PageHeading level='3'>
              Explore Battles
            </PageHeading>
            {!wallet &&
              <Toolbar 
                isSidebarOpen={isSidebarOpen}
                onSidebarOpen={onSidebarOpen} 
              />
            }
          </Box>
          <Box margin={{ vertical: 'medium' }}>
            {otherBattles?.map(battle => 
              <BattleRow 
                key={battle.bid} 
                battle={battle}
              />
            )}
          </Box>
          <Box align='end'>
            { hasMoreOtherBattles &&
              <ActionButton 
                label='Load More'
                onClick={onFetchMoreOtherBattles}
              />
            }
          </Box>
        </Box>
      </PageContent>
      <PageSidebar isOpen={isSidebarOpen} onClose={onSidebarClose}>
        <Box pad='medium'>
          <BattleFilters 
            filter={filter}
            onFilterChange={setFilter} 
          />
          <BattleSorting 
            filter={filter}
            onSortChange={setFilter}
          />
        </Box>
      </PageSidebar>
    </Page>
  )
}
