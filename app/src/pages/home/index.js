import { useGetConfig } from 'shared/apollo'
import { Page } from 'components'
import Banner from './Banner'
import Latest from './Latest'
import Lore from './Lore'
import Instructions from './Instructions'
import Team from './Team'
import Footer from './Footer'

export default function Home() {
  const { config } = useGetConfig()
  return (
    <Page pad='0px'>
      <Banner/>
      <Latest />
      <Lore />
      <Instructions />
      <Team />
      <Footer config={config} />
    </Page>
  )
}
