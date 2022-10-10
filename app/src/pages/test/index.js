import styled from 'styled-components'
import { Tabs, Tab } from 'components'
import { LAYOUT_HEADER_HEIGHT } from 'shared/constants'
import HeroCards from './HeroCards'
import BattleCards from './BattleCards'
import CollectionCards from './CollectionCards'

export default function Test() {
  return (
    <TestPage>
      <Tabs height='100%' alignControls='start'>
        <Tab title='Hero Cards'>
          <HeroCards />
        </Tab>
        <Tab title='Battle Cards'>
          <BattleCards />
        </Tab>
        <Tab title='Collection Cards'>
          <CollectionCards />          
        </Tab>
      </Tabs>
    </TestPage>
  )
}



const TestPage = styled.div`
  padding: ${LAYOUT_HEADER_HEIGHT}px 0px;
`