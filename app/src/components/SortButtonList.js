import SortButton from './SortButton'

export default function SortButtonList({ filter, properties, defaultDirection='desc', onSortChange }) {

  const oppositeDirection = defaultDirection === 'desc' ? 'asc' : 'desc'
  
  const onToggle = (name) => {
    let sortBy, sortDirection
    if (filter.sort_by === name) {
      if (filter.sort_direction === defaultDirection) {
        sortBy = name
        sortDirection = oppositeDirection
      }
      else if (filter.sort_direction === oppositeDirection) {
        sortBy = ''
        sortDirection = ''
      }
      else {
        sortBy = name
        sortDirection = defaultDirection
      }
    }
    else {
      sortBy = name
      sortDirection = defaultDirection
    }

    if (sortBy && sortDirection) {
      onSortChange({ 
        ...filter, 
        sort_by: sortBy, 
        sort_direction: sortDirection 
      })
    }
    else {
      const { sort_by, sort_direction, ...rest } = filter
      onSortChange(rest)
    }
  }

  return (
    properties.map(property => 
      <SortButton
        key={property.name}
        tip={property.tip}
        name={property.name}
        enabled={property.name === filter.sort_by}
        direction={property.name === filter.sort_by ? filter.sort_direction : defaultDirection}
        Icon={property.icon}
        onToggle={onToggle}
      />
    )
  )
}
