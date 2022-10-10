import { Link } from 'wouter'
import { Box, ActionButton, AddIcon, FilterIcon } from 'components'
import { useResponsive } from 'shared/utils'

export default function Toolbar({ isSidebarOpen, onSidebarOpen }) {
  const { width } = useResponsive()
  return (
    <Box direction='row' align='center' gap='small' margin={{left: 'auto'}}>
      <Link href='/heroes/summon'>
        <ActionButton 
          primary 
          label={width > 768 ? 'Summon Hero' : ''}
          icon={<AddIcon color='brand' />} 
        />
      </Link>
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
