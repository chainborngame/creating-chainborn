import { 
  Box, 
  Heading, 
  SortButtonList,
  ChallengeDateIcon,
  StartDateIcon,
  FinishDateIcon, 
  LootIcon, 
} from 'components'

export default function BattleSorting({ filter, onSortChange }) {
  return (
    <>
      <Heading level='3' color='brand'>
        Sort
      </Heading>
      <Box direction='row' gap='small' wrap>
        <SortButtonList 
          filter={filter}
          properties={[
            { name: 'challenge_time', tip: 'Challenge Date', icon: ChallengeDateIcon },
            { name: 'start_time', tip: 'Start Date', icon: StartDateIcon },
            { name: 'finish_time', tip: 'Finish Date', icon: FinishDateIcon },
            { name: 'loot', tip: 'Loot', icon: LootIcon }
          ]}
          onSortChange={onSortChange}
        />
      </Box>
    </>
  )
}
