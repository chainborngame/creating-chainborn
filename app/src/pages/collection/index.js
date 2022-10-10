import { Link } from 'wouter'
import { 
  Page, 
  Box, 
  Spinner, 
  InfoBox, 
  BuyIcon, 
  HeroIcon,
  LinkIcon, 
  PageHeading, 
  ActionButton, 
  HeroCard,
} from 'components'
import { useGetCollection, useGetHeroes } from 'shared/apollo'
import backgroundHeroes from 'images/background-heroes.webp'
import styled from 'styled-components'

const BuyButton = styled(ActionButton)`
  margin-left: 10px;
`

export default function Collection({ params: { address } }) {

  const { collection, loading: loadingCollection, error: errorCollection } = useGetCollection({ address })
  const { 
    heroes, 
    loading: loadingHeroes, 
    error: errorHeroes 
  } = useGetHeroes({ 
    token_address: address, 
    sort_by: 'experience_total', 
    sort_direction: 'desc',
    limit: 5
  })
  const loading = loadingCollection || loadingHeroes
  const error = errorCollection || errorHeroes

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
        <Box direction='row' align='center' justify='between' width='100%'>
          <PageHeading level='3'>
            { collection?.name }
          </PageHeading>
          <Box direction='row' justify='end'>
            <Link href='/collections'>
              <ActionButton
                label='See All Collections'
                icon={<HeroIcon size='22px'/>}
              />
            </Link>
            <a href={collection?.link} target="_blank" rel="noreferrer">
              <BuyButton
                label={<>Buy {collection?.name}{'\u00A0'}<LinkIcon/></>}
                icon={<BuyIcon size='22px' color='white'/>}
              />
            </a>
          </Box>
        </Box>
        <Box fill direction='row'>
          <Crest src={collection?.crest} />
          <Box background='black' fill margin='small'>{collection?.lore}</Box>
        </Box>
        <Box fill>
          <PageHeading level='3'>
            TOP 5
          </PageHeading>
          <Box direction='row' gap='small' wrap>
            { heroes.map(hero => 
                <HeroCard hero={hero} />
            )}
          </Box>
        </Box>
      </Box>
    </Page>
  )
}

const Crest = styled.img`
  width: 400px;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
`
