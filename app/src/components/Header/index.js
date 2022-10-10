import { Link } from 'wouter'
import { Box } from 'grommet'
import styled from 'styled-components'
import { useResponsive } from 'shared/utils'
import logoImage from 'images/logo.webp'
import logoSmallImage from 'images/logo-small.webp'
import chainImage from 'images/chain.webp'
import betaImage from 'images/beta.webp'
import Logo from './Logo'
import HeaderMenuScreen from './HeaderMenuScreen'
import HeaderMenuMobile from './HeaderMenuMobile'
import { LAYOUT_HEADER_HEIGHT, LAYOUT_MAX_WIDTH } from 'shared/constants'

const WIDTH_SMALL = 320
const WIDTH_MEDIUM = 768
export const ROUTE_HEROES = '/heroes'
export const ROUTE_BATTLES = '/battles?sort_by=challenge_time&sort_direction=desc'

export default function Header({ onNotificationsClick, withBoxShadow, ...props }) {
  const { width } = useResponsive()
  return (
    <HeaderRoot
      tag='header'
      pad='small'
      elevation='medium'
      background='brand'
      withBoxShadow={withBoxShadow}
      {...props}
    >
      <Link href="/">
        {width > WIDTH_SMALL
          ? <Logo src={logoImage} alt='logo' />
          : <Logo src={logoSmallImage} alt='logo' />
        }
      </Link>
      <BetaTag>
        <img src={betaImage} alt='beta' />
      </BetaTag>
      {width > WIDTH_MEDIUM
        ? <HeaderMenuScreen onNotificationsClick={onNotificationsClick} />
        : <HeaderMenuMobile onNotificationsClick={onNotificationsClick} />
      }
    </HeaderRoot>
  )
}

const HeaderRoot = styled(Box)`
  position: fixed;
  width: 100%;
  height: ${LAYOUT_HEADER_HEIGHT}px;
  max-width: ${LAYOUT_MAX_WIDTH}px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-image: url(${chainImage});
  background-repeat: repeat-x;
  background-position: center;
  background-size: 860px;
  z-index: 1;
  box-shadow: ${props => props.withBoxShadow ? null : 'none'};
`

const BetaTag = styled(Box)`
  position: absolute;
  left: 190px;
  width: 72px;
  height: 58px;
  img {
    height: 100%;
    width: 100%;
  }
  @media (max-width: ${WIDTH_SMALL}px) {
    left: 40px;
  }
`
