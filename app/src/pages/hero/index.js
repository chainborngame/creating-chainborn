import { useRecoilValue } from 'recoil'
import { Link } from 'wouter'
import styled from 'styled-components'
import { Page, Box, PageHeading, Spinner, HeroCard, InfoBox, TabsRoute, Tab, LinkIcon, StoryIcon, MetaIcon, ExperienceIcon, BattleRow } from 'components'
import { walletState } from 'shared/state'
import { useGetConfig, useGetHero, useGetHeroBattles } from 'shared/apollo'
import { useResponsive } from 'shared/utils'
import StoryTab from './StoryTab'
import MetaTab from './MetaTab'
import ExperienceTab from './ExperienceTab'
import Actions from './Actions'
import backgroundHeroes from 'images/background-heroes.webp'
import './index.css'

const LatestBattlesContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 30px;
`
const LatestBattlesContainerInner = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 50px;
  margin-right: 20px;
`

export default function Hero({ params: { address, id, bid } }) {
  
  const wallet = useRecoilValue(walletState)
  const { loading: loadingConfig, error: errorConfig, config } = useGetConfig()
  const { loading: loadingHero, error: errorHero, hero } = useGetHero({ address, id })
  const { loading: loadingBattles, error: errorBattles, battles } = useGetHeroBattles({ address, id })
  const { width } = useResponsive()

  const cardSize = 
    width < 480 ? 450 :
    width < 768 ? 300 : 
    400

  // TODO: List these as BattleRows below Hero stats! Add limit param passable from here to useGetHeroBattles...
  const loading = loadingConfig || loadingHero || loadingBattles
  const error = errorConfig || errorHero || errorBattles
  const isMyHero = !loading && hero?.owner === wallet?.address
  
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
          Could not load the Hero
        </InfoBox> 
      </Page>
    )
  }

  return (
    <Page className="Hero" image={backgroundHeroes}>
      <TitleBox direction='row' justify='start'>
        <PageHeading level='2'>Hero</PageHeading>
        <BattleLinkBox direction='row' justify='end' align='center' width='100%'>
          <Box className="BattleLink" pad='small' direction='row' align='center' overflow='hidden'>
            <Link href={`/battles/?token_address=${hero?.token_address}&token_id=${hero?.token_id}&status=ongoing`}>
              Battles
              <LinkIcon size='22px' />
            </Link>
          </Box>
          <Box className="BattleLink" pad='small' direction='row' align='center' overflow='hidden'>
            <Link href={`/battles/?token_address=${hero?.token_address}&token_id=${hero?.token_id}&status=challenge`}>
              Challenges 
              <LinkIcon size='22px' />
            </Link>
          </Box>
          <Box className="BattleLink" pad='small' direction='row' align='center' overflow='hidden'>
            <Link href={`/collections/#${hero?.token_address}`}>
              Collection 
              <LinkIcon size='22px' />
            </Link>
          </Box>
        </BattleLinkBox>
      </TitleBox>
      <ContentBox direction='row' justify='between' gap='medium'>
        <Box direction='column'>
          <HeroCard 
            hero={hero} 
            height={cardSize} 
          />
          <Box style={{ marginTop: 20 }}>
            <Actions hero={hero} />
          </Box>
        </Box>
        <TabsBox>
          <TabsRoute className="HeroTabs" height='100%' alignControls='start'>
            <Tab title='Story' icon={<StoryIcon />} route={`/heroes/${address}/${id}`}>
              <StoryTab
                config={config}
                address={address}
                id={id}
                name={hero.name}
                story={hero.story}
                battleReady={hero.battle_ready}
                isEditable={isMyHero}
              />
            </Tab>
            <Tab title='Meta' icon={<MetaIcon />} route={`/heroes/${address}/${id}/meta`}>
              <MetaTab
                hero={hero}
              />
            </Tab>
            {isMyHero &&
              <Tab title='Experience' icon={<ExperienceIcon />} route={`/heroes/${address}/${id}/experience`}>
                <ExperienceTab 
                  address={address}
                  id={id}
                  health={hero.health}
                  strength={hero.strength}
                  experience={hero.experience}
                />
              </Tab>
            }
          </TabsRoute>
        </TabsBox>
      </ContentBox>
      <LatestBattlesContainer>
        <PageHeading level='3'>Latest battles</PageHeading>
        <LatestBattlesContainerInner>
          {battles?.map(battle => 
            <BattleRow 
              key={battle.bid} 
              battle={battle}
            />
          )}
        </LatestBattlesContainerInner>
      </LatestBattlesContainer>
    </Page>
  )
}

const TitleBox = styled(Box)`
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: center;
  }
`

const BattleLinkBox = styled(Box)`
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }
`

const ContentBox = styled(Box)`
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: center;
    margin: 32px 0;
  }
`

const TabsBox = styled(Box)`
  flex: 1 1 0;
  @media (max-width: 480px) {
    flex: 1 1 auto;
    width: 100%;
    margin-top: 32px;
  }
`
