import { useMemo } from 'react'
import { Box, Heading, Select, TextInput, AsyncBox } from 'components'
import { useGetCollections } from 'shared/apollo'

export default function HeroFilters({ filter, onFilterChange }) {

  const { collections, loading: loadingCollections, error: errorCollections } = useGetCollections()
  
  const collectionOptions = useMemo(() => 
    collections?.map(collection => ({ 
      value: collection.address, 
      label: collection.name 
    })) || []
  , [collections])

  const onChange = (value, filterName) => {
    onFilterChange({ ...filter, [filterName]: value })
  }

  return (
    <>
      <Heading level='3' color='brand' margin={{top:'0px'}}>
        Filter
      </Heading>
      <Box color='brand'>
        <TextInput
          placeholder='Search...'
          value={filter?.name || ''}
          onChange={(event) => onChange(event.target.value, 'name')}
        />
      </Box>
      <AsyncBox loading={loadingCollections} error={errorCollections}>
        <Select
          options={[
            { value: null, label: '-' },
            ...collectionOptions
          ]}
          value={filter?.token_address || ''}
          placeholder='Collection'
          margin={{ vertical: 'small' }}
          onChange={({ value }) => onChange(value, 'token_address')}
        />
      </AsyncBox>
    </>
  )
}
