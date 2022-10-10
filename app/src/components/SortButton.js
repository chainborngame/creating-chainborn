import { 
  Box, 
  Tip, 
  AscendIcon, 
  DescendIcon, 
}
from 'components'

export default function SortButton({ name, enabled, direction, tip, Icon, onToggle }) {
  const color = enabled ? 'brand' : 'dark-3'
  return (
    <Tip text={tip} size='medium'>
      <Box 
        direction='row' 
        pad='xxsmall' 
        width='fit-content' 
        border={{color, size: 'small'}} 
        cursor='pointer'
        margin='small'
        onClick={() => onToggle(name)}
        >
          <Icon color={color} />
          { direction === 'asc'
            ? <AscendIcon color={color} />
            : <DescendIcon color={color} />
          }
      </Box>
    </Tip>
  )
}
