import { Page, InfoBox } from 'components'
import backgroundImage from 'images/background-home-instructions.webp'

export default function NotFound() {
  return (
    <Page image={backgroundImage} align='center'>
      <InfoBox level='3' severity='warning'>
        🙅 Page Not Found 🙅
      </InfoBox>
    </Page>
  )
}