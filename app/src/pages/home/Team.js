import styled from 'styled-components'
import { Box } from 'components'
import Section from './Section'
import TeamMember from './TeamMember'
import titleImage from 'images/team-title.webp'
import { getIpfsLink } from '../../shared/utils'

export default function Team() {
  return (
    <Section background='accent'>
      <TitleWrapper>
        <TitleImg src={titleImage} alt='team' />
      </TitleWrapper>
      <Members direction='row' justify='center' gap='medium' wrap>
        <TeamMember 
          img={getIpfsLink('ipfs://QmUMat94rqkeRW93QMRdZTjEhnjn32ziuYaww4uoaXEugc')}
          name='Asbjørn Enge'
          role='Founder & Systems Architect'
          twitter='asbjornenge'
          github='asbjornenge'
          description='Asbjørn is an entrepreneur, developer and systems architect. He is the creator of TezID and the founder of ChainBorn. In his free time he surfs icy waves and fights polar bears in Norway.'
        />
        <TeamMember 
          img={getIpfsLink('ipfs://QmcUpob3awxsScX4KFcPMJNTAE2LyWdvNppYkkBzyeVHAz')}
          name='Eduard Castellano'
          role='UI Engineer & UX Designer'
          twitter='educastellano'
          github='educastellano'
          description="Eduard is a is a fullstack engineer, but spends most of his time on the front-end. He has been nomading since 2014 mostly in Asia and Europe, and is planning to mint his travel photos as NFTs on the Tezos Blockchain."
        />
        <TeamMember 
          img={getIpfsLink('ipfs://QmWDhQnXN8wJp1imq3RXmMNRACCEngYBVBDm6ArV1zvYhr')}
          name='Sarin Eskandarian'
          role='Community Manager'
          twitter='houseoftez'
          description='Front-end web developer and artist from California. Have been creating NFT projects on Tezos for about a year and have many successful projects. He manages many artists, developers and projects.' 
        />
      </Members>
    </Section>
  )
}


const TitleWrapper = styled.div.attrs({ id: 'team' })`
  width: 100%;
  overflow-x: hidden;
  display: flex;
  justify-content: center;
  margin-top: -280px;
  margin-bottom: 90px;
`

const TitleImg = styled.img`
  bottom: 128px; 
  height: 3.7rem; 
`

const Members = styled(Box)`
  // margin-top: -120px;
`
