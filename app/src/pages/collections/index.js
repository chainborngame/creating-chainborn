import { Page, Box, Spinner, InfoBox, PageHeading } from 'components'
import { useGetCollections } from 'shared/apollo'
import backgroundHeroes from 'images/background-heroes.webp'
import Collection from './Collection'

export default function Collections() {

  const { collections, loading, error } = useGetCollections()

  if (loading) {
    return (
      <Page image={backgroundHeroes} align='center'>
        <Spinner size='large' />
      </Page>
    )
  }

  if (error) {
    return (
      <Page image={backgroundHeroes} align='center'>
        <InfoBox level='3' severity='error'>
          Could not load Collections
        </InfoBox> 
      </Page>
    )
  }

  return (
    <Page image={backgroundHeroes}>
      <Box direction='row' gap='small' wrap fill>
        <Box direction='row' align='center' justify='between'>
          <PageHeading level='3'>
            Collections
          </PageHeading>
        </Box>
        <Box gap='large' fill>
          {collections.map((collection, index) => 
            <Collection key={collection.address} { ...collection } index={index} reverse={index % 2 !== 0} />
          )}
        </Box>
      </Box>
    </Page>
  )
}
