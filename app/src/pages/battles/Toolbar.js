import { Box, ActionButton, FilterIcon } from 'components'

export default function Toolbar({ isSidebarOpen, onSidebarOpen }) {
  return (
    <Box direction='row' align='center' gap='small' margin={{left: 'auto'}}>
      { !isSidebarOpen &&
        <ActionButton 
          primary 
          margin={{ vertical: 'small' }}
          icon={<FilterIcon color={'brand'} />} 
          style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            backgroundColor: 'var(--color-secondary)',
          }}
          onClick={onSidebarOpen}
        />
      }
    </Box>
  )
}
