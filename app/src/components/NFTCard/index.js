import { Img, RectangleLoader, RectangleError } from '../index'
import { 
  Card, 
  CardImage, 
  CardImg, 
  CardText, 
  CardName, 
  CardDescription 
} from './components'

export default function NFTCard({ address, id, name, description, img, isSummoning, onClick }) {
  return (
    <Card animation={isSummoning ? 'pulse' : ''} onClick={onClick}>
      <CardImage>
        <Img 
          src={img} 
          width={208}
          height={208}
          Component={CardImg} 
          ComponentLoader={RectangleLoader} 
          ComponentError={RectangleError} 
        />
      </CardImage>
      <CardText>
        <CardName>{ name }</CardName>
        <CardDescription>{ description }</CardDescription>
      </CardText>
    </Card>
  )
}
