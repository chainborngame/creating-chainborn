import { useMemo, useState } from 'react'
import { Heading, Select, AsyncBox } from 'components'
import { useGetCollections, useGetHeroes } from 'shared/apollo'

const HERO_ID_SEPARATOR = '_'

export default function BattleFilter({ filter, onFilterChange }) {
  
  const [ heroSearchText, setHeroSearchText ] = useState('')
  const { collections, loading: loadingCollections, error: errorCollections } = useGetCollections()
  const { heroes, error: errorHeroes } = useGetHeroes({ 
    name: heroSearchText, 
    token_address: filter?.token_address,
    limit: 25
  })

  const collectionOptions = useMemo(() => 
    collections?.map(collection => ({ 
      value: collection.address, 
      label: collection.name 
    }))
  , [collections])

  const heroOptions = useMemo(() => 
    heroes?.map(hero => ({
      value: hero.token_address + HERO_ID_SEPARATOR + hero.token_id,
      label: hero.name
    }))
  , [heroes])

  const onChange = (value, filterName) => {
    if (filterName === 'token_address+token_id') {
      if (value !== null) {
        const [token_address, token_id] = value.split(HERO_ID_SEPARATOR)
        onFilterChange({ ...filter, token_address, token_id })
      }
      else {
        const { token_id, ...rest } = filter
        onFilterChange(rest)
      }
    }
    else if (filterName === 'token_address') {
      if (value !== null) {
        onFilterChange({ ...filter, [filterName]: value })
      }
      else {
        const { token_address, token_id, ...rest } = filter
        onFilterChange(rest)
      }
    }
    else {
      onFilterChange({ ...filter, [filterName]: value })  
    }
  }

  return (
    <>
      <Heading level='3' color='brand' margin={{top: '0px'}}>
        Filter
      </Heading>
      <Select
        options={[
          { value: null, label: '-' }, 
          { value: 'challenge', label: 'Challenge' },
          { value: 'ongoing', label: 'Ongoing' }, 
          { value: 'finished', label: 'Finished' }, 
          { value: 'resolved', label: 'Resolved' }, 
        ]}
        value={filter?.status || ''}
        placeholder='Status'
        margin={{ vertical: 'small' }}
        onChange={({ value }) => onChange(value, 'status')}
      />
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
      <AsyncBox error={errorHeroes}>
        <Select
          options={[
            { value: null, label: '-' },
            ...heroOptions
          ]}
          value={(filter?.token_address + HERO_ID_SEPARATOR + filter?.token_id) || ''}
          placeholder='Hero'
          margin={{ vertical: 'small' }}
          searchPlaceholder='Search...'
          onSearch={setHeroSearchText}
          onChange={({ value }) => {
            setHeroSearchText('')
            onChange(value, 'token_address+token_id')
          }}
        />
      </AsyncBox>
      <Select
        options={[
          { value: null, label: '-' },
          { value: '0-25', label: '0-25' },
          { value: '25-100', label: '25-100' },
          { value: '100-500', label: '100-500' },
          { value: '500-1000', label: '500-1000' },
          { value: '1000-', label: '1000+' },
        ]}
        value={filter?.loot || ''}
        placeholder='Loot'
        margin={{ vertical: 'small' }}
        onChange={({ value }) => onChange(value, 'loot')}
      />
    </>
  )
}
