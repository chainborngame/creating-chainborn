import styled from 'styled-components'
import { Page, Accordion, AccordionPanel as AccordionPanelDefault, Box, PageHeading, Text } from 'components'
import { useGetConfig } from 'shared/apollo'
import heroesBackgroundImage from 'images/background-heroes.webp'

export default function Faq() {
  
  const { config } = useGetConfig()

  return (
    <Page direction='column' align='center' minHeight='220vh' image={heroesBackgroundImage}>
      <PageHeading>FAQ</PageHeading>
      <FaqBox>
        <Accordion>
          <AccordionPanel label='What happens when I summon my NFT into a Chainborn Hero?'>
            When summoning a Hero, a user can select any of the NFTs they own from any of the supported collections. Summoning a Hero turns your NFT into a character in ChainBorn. You can name your Hero, give it a story, battle, gain experience and much more.
          </AccordionPanel>
          <AccordionPanel label='Does summoning a Hero have a cost?'>
            Currently the cost for summoning a new Hero is {config?.summon_cost} XTZ.
          </AccordionPanel>
          <AccordionPanel label='Hero states'>
            <span>
              A ChainBorn Hero can be in a few different states; Battle Ready, Suited and Battling.
            </span>
            <p>
              <em>Battle Ready</em> means a Hero is ready for battle and can be challenged. If you are not interested in challenge requests for a time, put your Hero as not Battle Ready and no-one will be able to challenge you.
            </p>
            <p>
              <em>Suited</em> means your Hero is staked in the ChainBorn game contract. In order to be able to use your NFT in Chainborn and battles, you need to “suit up” / stake your NFT into the ChainBorn smart contract. When a user “unsuits”, the NFT gets unstaked and returned to the owners wallet. You need to “suit up” before you can battle again.
            </p>
            <p>
              <em>Battling</em> means a Hero is currently engaged in a battle!
            </p>
          </AccordionPanel>
          <AccordionPanel label='How can I battle?'>
            Your Hero can challenge any of the other Heroes in ChainBorn - as long as they are “Suited” and “Battle Ready”. When you challenge another Hero you need to put up some loot. Currently the minimum loot required is {config?.minimum_loot} XTZ. You can also choose to put up both loot and your Hero for a battle! If the other Hero accepts your challenge, they have to match your bid, and the battle begins!
          </AccordionPanel>
          <AccordionPanel label='How does battles work?'>
            A battle happens in turns. Who gets the first turn is decided by coin-flip. Each turn requires the current Hero to perform an action. For the initial gameplay, the only action a hero can perform is “attack”. An attack action generates a random number within the parameters of the attacking Hero’s strength (between zero and Hero’s strength). This number is then deducted from the other party's health. Heros take turns until one of the Hero's health reaches zero or less. Once this happens, the battle is finished. Once a battle is finished, it needs to be resolved. Either party can resolve the battle.
          </AccordionPanel>
          <AccordionPanel label='What happens if I win a battle?'>
            If you win a battle you are rewarded with the loot put up by both Heroes (minus the platform fee)! If both loot and Hero was put on the line, the winner is also rewarded with the loser's Hero! The winner of a battle also gains experience points. The winner can gain anywhere between {config?.battle_experience_min} and {config?.battle_experience_max} points. Experience is calculated from the battle-loot. The more loot, the more experience a Hero can gain (within min/max parameters).
          </AccordionPanel>
          <AccordionPanel label='What happens if I lose a battle?'>
            If you lose a battle, you lose any loot you put up. The winner get’s the spoils! If you also put up your Hero, you also lose it to the winner. The loser also gains experience points! The loser gains ½ of the experience points awarded to the winner. However we cannot award half points, so if the winner is awarded 1 point, the loser get’s no points.
          </AccordionPanel>
          <AccordionPanel label='How does experience work?'>
            After a battle, both Heros will have gained experience. The Heroes can then decide whether to spend these experience points on “Strength” or “Health” in preparation for their next battle. Increased Health will make them able to withstand more attacks. Increased Strength will allow for a larger range of damage for attacks.
          </AccordionPanel>
          <AccordionPanel label='What if my opponent does not take their turn?'>
            If a battling Hero neglects to take their turn within {config && config.battle_turn_timeout/60/60/24} days time period. The battle is forfeited to their opponent. In this case, the Hero who’s turn it was not can resolve the battle and claim any rewards put up.
          </AccordionPanel>
          <AccordionPanel label='What is the cooldown period?'>
            The cooldown is a period of time, currently {config && config.pair_battle_cooldown/60/60} hours, where two Heroes cannot fight each other again after battle. The cooldown period exists to prevent people fighting themselves to gain experience points without putting anything on the line.
          </AccordionPanel>
          <AccordionPanel label='Where can I get more Heroes?'>
            You can win them in battles! Or you can summon new ones by purchasing an NFT from any of our supported collections.
          </AccordionPanel>
          <AccordionPanel label='What happens if I sell or transfer a Hero NFT?'>
            If a ChainBorn Hero NFT changes owner outside the game, the ChainBorn Hero also changes owner. The Hero follows the NFT!! This means you can increase the value of your NFT by having a strong ChainBorn Hero character attached to it!
          </AccordionPanel>
          <AccordionPanel label='What is the platform loot fee?'>
            The platform loot fee is the fee we take from each battle loot in order to sustain & grow the ChainBorn game. Currently the platform loot fee is {config?.platform_loot_percentage}%.
          </AccordionPanel>
        </Accordion>
      </FaqBox>
    </Page>
  )
}

const FaqBox = styled(Box).attrs({
  pad: 'medium',
  round:'small',
  background: 'secondary',
  color: 'brand',
})`
  box-shadow: -0px 0px 16px 0px rgba(64,64,64,0.75);
  width: 100%;
  max-width: 800px;
  em {
    font-style: initial;
    font-weight: bold;
    color: var(--color-brand);
  }
`

function AccordionPanel({ children, ...props}) {
  return (
    <AccordionPanelDefault {...props}>
      <Box pad="medium">
        <Text color='accent'>{ children }</Text>
      </Box>
    </AccordionPanelDefault>
  )
}
