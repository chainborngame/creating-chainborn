import { Link, useLocation } from 'wouter'
import { Heading as GHeading } from 'grommet'
import styled from 'styled-components'

const Heading = styled(GHeading)`
  padding: 8px 16px;
  background: var(--color-secondary);
  cursor: pointer;
  font-family: 'ghostclan';
  font-size: 22px;
  user-select: none;
`;

export default function HeaderButton({ href, children }) {

  const location = useLocation()

  const hrefParts = href.split('?')[0].split('/')
  const locationParts = location?.[0].split('?')[0].split('/')

  const color = 
    hrefParts.length > 1 && 
    locationParts.length > 1 && 
    hrefParts[1] === locationParts[1] 
      ? 'brand' 
      : 'brandMiddle'

  return (
    <Link href={href}>
      <Heading level='2' size='small' margin='none' color={color}>
        { children }
      </Heading>
    </Link>
  )
}
