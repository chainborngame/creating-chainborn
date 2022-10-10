import { useState } from 'react'
import { useRecoilValue } from 'recoil'
import { firestore } from 'shared/firebase' 
import { collection, query, orderBy, limitToLast } from 'firebase/firestore'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { Page, PageContent, PageSidebar, Box, Spinner, InfoBox } from 'components'
import { walletState } from 'shared/state'
import { useGetBattle, useGetConfig } from 'shared/apollo'
import { isEqualHero } from 'shared/utils'
import Player from './Player'
import Round from './Round'
import RoundList from './RoundList'
import BattleChatBubble from './BattleChatBubble'
import BattleActions from './BattleActions'
import BattleChat from './BattleChat'
import BattleMode from './BattleMode'
import BattleExperience from './BattleExperience'
import backgroundBattle from 'images/background-battle.webp'

const rowGap = 64

export default function Battle({ params: { bid } }) {
  const [ isSidebarOpen, setIsSidebarOpen ] = useState(false)

  const wallet = useRecoilValue(walletState)
  const { loading, battle, error } = useGetBattle({ bid })
  const { config } = useGetConfig()
  const messagesRef = collection(firestore, `/${config?.NETWORK_NAME}/battlechat/${bid}`);
  const q = query(messagesRef, orderBy('createdAt','asc'), limitToLast(100)) 

  const [messages] = useCollectionData(q)
  const myHero = 
    !loading && battle?.challenger?.owner === wallet?.address ? battle?.challenger : 
    !loading && battle?.challenged?.owner === wallet?.address ? battle?.challenged : 
    null
  const challenger = battle?.challenger
  const challenged = battle?.challenged
  const victor = 
    battle?.resolved ?
      battle.victor
    : (
      challenger && challenger.damage > challenger.health ? challenged : 
      challenged && challenged.damage > challenged.health ? challenger :
      null 
    )
  const isMyHeroPlaying = !!myHero
  const isMyTurn = isEqualHero(battle?.turn, myHero)
  const isChallengerTurn = isEqualHero(battle?.turn, battle?.challenger)
  const isChallengedTurn = isEqualHero(battle?.turn, battle?.challenged)
  const isStarted = battle?.started
  const isFinished = battle?.finished
  const isTimeout = battle?.isTimeout(config?.battle_turn_timeout)
  const isResolved = battle?.resolved
  const isMyHeroChallenger = !!myHero && battle?.challenger?.owner === wallet?.address
  const isMyHeroVictor = !!myHero && victor?.owner === wallet?.address
  const isCancelled = battle?.cancelled
  const attacker = isChallengerTurn ? battle?.challenger : battle?.challenged
  const defender = isChallengerTurn ? battle?.challenged : battle?.challenger

  if (loading) {
    return (
      <Page image={backgroundBattle} align='center'>
        <Spinner size='large' />
      </Page>
    )
  }

  if (error) {
    return (
      <Page image={backgroundBattle} align='center'>
        <InfoBox level='3' severity='error'>
          Could not load the Battle
        </InfoBox> 
      </Page>
    )
  }

  return (
    <Page image={backgroundBattle} landscapeOnly>
      <PageContent isSidebarOpen={isSidebarOpen} sidebarWidth={400}>
        <Box direction='row' align='center' gap={`${rowGap}px`}>
          <Box align='end' fill>
            <Player 
              hero={battle.challenger}
              number={1}
              isPlayerTurn={isChallengerTurn}
              showProgressbar={!isResolved}
            />
          </Box>
          <Box gap='small' fill>
            <Round
              round={battle?.turns?.turns.length + 1}
              isMyTurn={isMyTurn}
              challenger={battle?.challenger}
              challenged={battle?.challenged}
              isChallengerTurn={isChallengerTurn}
              isChallengedTurn={isChallengedTurn}
              isRoundVisible={!isFinished && !isTimeout}
            />
            <BattleMode 
              mode={battle?.mode} 
              loot={battle?.loot} 
            />
          </Box>
          <Box align='start' fill>
            <Player 
              hero={battle.challenged}
              number={2}
              isPlayerTurn={isChallengedTurn}
              showProgressbar={!isResolved}
            />
          </Box>
        </Box>
        <Box direction='row' gap={`${rowGap}px`}>
          <Box align='end' fill>
            { isResolved &&
              <BattleExperience 
                battle={battle} 
                hero={battle?.challenger}
                isMyHero={wallet?.address === battle?.challenger?.owner} 
              />
            }
          </Box>
          <Box justify='center' align='center' fill>
            <BattleActions 
              bid={bid}
              loot={battle?.loot}
              wallet={wallet}
              attacker={attacker}
              defender={defender}
              victor={victor}
              experienceGained={battle?.experience_gained}
              myHero={myHero}
              isStarted={isStarted}
              isFinished={isFinished}
              isTimeout={isTimeout}
              isMyTurn={isMyTurn}
              isMyHeroPlaying={isMyHeroPlaying}
              isResolved={isResolved}
              isCancelled={isCancelled}
              isMyHeroChallenger={isMyHeroChallenger}
              isMyHeroVictor={isMyHeroVictor}
              challenger={battle?.challenger}
              challenged={battle?.challenged}
            />
          </Box>
          <Box align='start' fill>
            { isResolved &&
              <BattleExperience 
                battle={battle} 
                hero={battle?.challenged}
                isMyHero={wallet?.address === battle?.challenged?.owner} 
              />
            }
          </Box>
        </Box>
        <RoundList 
          turns={battle?.turns?.turns}
          challenger={battle?.challenger}
          challenged={battle?.challenged}
          showHealth={!isResolved}
        />
        <BattleChatBubble 
          messages={messages} 
          onClick={() => setIsSidebarOpen(true)} 
        />
      </PageContent>
      <PageSidebar isOpen={isSidebarOpen} isCloseVisible={false} sidebarWidth={400}>
        <BattleChat 
          bid={bid}
          config={config}
          battle={battle}
          wallet={wallet}
          isVisible={isSidebarOpen}
          messages={messages}
          messagesRef={messagesRef}
          onClose={() => setIsSidebarOpen(false)}
        />
      </PageSidebar>
    </Page>
  )
}
