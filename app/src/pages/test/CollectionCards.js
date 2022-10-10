import { Box, CollectionCard } from 'components'
import { useGetCollections } from 'shared/apollo'

export default function CollectionCards(argument) {
  const { collections } = useGetCollections()
  return (
    <Box pad={{ top: '40px' }}gap='small'>
      {collections?.map(collection => 
        <CollectionCard collection={collection} key={collection.address} />
      )}
    </Box>
  )
}