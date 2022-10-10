import { 
  Box, 
  Heading, 
  SortButtonList,
  DateIcon, 
  HealthIcon, 
  StrengthIcon,
  ExperienceIcon,
  VictorIcon,
  LoserIcon,
} from 'components'

const properties = [
  { name: 'summoned_at', tip: 'Summoned Date', icon: DateIcon },
  { name: 'experience_total', tip: 'Experience', icon: ExperienceIcon },
  { name: 'health', tip: 'Health', icon: HealthIcon },
  { name: 'strength', tip: 'Strength', icon: StrengthIcon },
  { name: 'wins', tip: 'Wins', icon: VictorIcon },
  { name: 'losses', tip: 'Losses', icon: LoserIcon },
]

export default function HeroSorting({ filter, onSortChange }) {
  return (
    <>
      <Heading level='3' color='brand'>
        Sort
      </Heading>
      <Box direction='row' gap='small' wrap>
        <SortButtonList 
          filter={filter}
          properties={properties}
          onSortChange={onSortChange}
        />
      </Box>
    </>
  )
}
