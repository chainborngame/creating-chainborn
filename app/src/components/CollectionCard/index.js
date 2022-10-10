import { Link } from 'wouter'
import styled from 'styled-components'
import Box from '../Box'
import frameImage from './frame.webp'

export default function CollectionCard({ collection, width=400, margin }) {
  return (
    <Link href={`/collections/#${collection.address}`}>
      <Card width={`${width}px`} margin={margin}>
        <Title src={collection.crest} />
        <Image src={frameImage} crest={collection.banner} />
      </Card>
    </Link>
  )
}

const Card = styled(Box)`
  position: relative;
  width: ${props => props.width};
  margin: ${props => props.margin || 0};
  cursor: pointer;
  transition: all var(--transition-move-ms) ease-in-out;
  &:hover {
    transform: translateY(-6px);
  }
`

const Image = styled.img`
  background-image: url(${props => props.crest});
  background-size: cover;
  clip-path: polygon(0 0,95.3% 0,100% 8%,100% 100%,4.2% 100%,0 93.9%);
  height: 100%;
  width: 100%;
`

const titleSize = 75
const borderSize = 8

const Title = styled.img`
  position: absolute;
  left: calc(50% - ${titleSize/2}px);
  top: -${titleSize/2 - borderSize/2}px;
  width: ${titleSize}px;
  height: ${titleSize}px;
  border: ${borderSize}px solid var(--color-brand);
  border-radius: 50%;
  z-index: 1;
`
