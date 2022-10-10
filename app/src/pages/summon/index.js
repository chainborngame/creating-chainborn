import { useState } from 'react'
import { useRecoilValue } from 'recoil'
import styled from 'styled-components'
import { Page, Box, PageHeading, Spinner, NFTCard, InfoBox } from 'components'
import heroesBackgroundImage from 'images/background-heroes.webp'
import { useGetConfig, useGetPossibleHeroes } from 'shared/apollo'
import { walletState, useAlert } from 'shared/state'
import { summonNFT } from 'shared/contract'
import { isEqualHero } from 'shared/utils'
import ConfirmModal from './ConfirmModal'

export default function Summon({ params }) {

  const wallet = useRecoilValue(walletState)
  const [, setAlert ] = useAlert()
  const [ nftToSummon, setNftToSummon ] = useState(null)
  const [ summoning, setSummoning ] = useState(null)
  const { config } = useGetConfig()
  const { loading, heroes, error } = useGetPossibleHeroes({ owner: wallet?.address })

  const onCardClick = nft => () => {
    setNftToSummon(nft)
  }

  const onCancel = () => {
    setNftToSummon(null)
  }

  const onSummon = async (name) => {
    try {
      const { token_address, token_id } = nftToSummon
      setSummoning(nftToSummon)
      setNftToSummon(null)
      await summonNFT({
        dappAddress: config.CHAINBORN_CONTRACT, 
        walletAddress: wallet.address, 
        tokenAddress: token_address, 
        tokenId: token_id, 
        name: name,
        cost: config.summon_cost
      })
    }
    catch (e) {
      const title = e.title
      const description = e.data?.[1]?.with?.string || e.description
      setAlert({ title, description })
    }
    finally {
      setSummoning(null)
    }
  }

  if (loading) {
    return (
      <Page image={heroesBackgroundImage} align='center'>
        <Spinner size='large' />
      </Page>
    )
  }

  if (error) {
    return (
      <Page image={heroesBackgroundImage} align='center'>
        <InfoBox level='3' severity='error'>
          Could not load NFTs
        </InfoBox> 
      </Page>
    )
  }

  return (
    <Page image={heroesBackgroundImage}>
      <Box direction='row' justify='between'>
        <PageHeading level='2'>
          Summon Hero
        </PageHeading>
      </Box>
      <List>
        { heroes.map(hero => 
            <NFTCard 
              key={hero.token_id} 
              address={hero.token_address}
              id={hero.token_id}
              name={hero.nft.name}
              description={hero.nft.description}
              img={hero.thumbnailUri}
              isSummoning={isEqualHero(hero, summoning)}
              onClick={onCardClick(hero)}
            />
        )}
        {!wallet &&
          <InfoBox level='3'>
            Connect Wallet to see your NFTs
          </InfoBox>
        }
      </List>
      <ConfirmModal 
        isOpen={!!nftToSummon}
        cost={config?.summon_cost}
        onSummon={onSummon}
        onCancel={onCancel}
      />
    </Page>
  )
}

const List = styled(Box).attrs({
  direction: 'row',
  gap: 'small',
  wrap: true, 
  fill: true,
})`
  > div {
    margin-bottom: 32px;
  }
`