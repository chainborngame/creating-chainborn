import styled from 'styled-components'
import { Img, CircleLoader, CircleError } from 'components'
import { useGetHero } from 'shared/apollo'
import { useResponsive } from 'shared/utils'

const size = 128
const sizeSmall = 104

export default function BattleRowHero({ address, name, id, isVictor }) {

  const { loading, hero, error } = useGetHero({ address, id })
  const { width } = useResponsive()
  const imgSize = width > 480 ? size : sizeSmall

  return (
    <Wrapper>
      <Img 
        src={hero?.thumbnailUri} 
        size={imgSize}
        isLoading={loading} 
        isError={error} 
        Component={CircleImg}
        ComponentLoader={CircleLoader}
        ComponentError={CircleError}
      />
      <NameBox isVictor={isVictor}>
        {name}
      </NameBox>
    </Wrapper>
  )
}

const CircleImg = styled.img`
  height: ${size}px;
  border-radius: 50%;
  border: 2px solid var(--color-secondary); 
  @media only screen and (max-width: 480px) {
    height: ${sizeSmall}px;
  }
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
`

const NameBox = styled.div`
  position: absolute;
  z-index: 100;
  bottom: -4px;
  background-color: var(--color-secondary);
  padding: 2px 5px;
  font-family: 'ghostclan';
  font-size: 0.9em;
  border-radius: 5px;
  color: ${props => props.isVictor ? `var(--color-brand)` : `var(--color-accent)` };
  ${props => props.isVictor ? 'box-shadow: -0px 0px 16px 0px rgba(0,255,224,0.75);' : ''};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: calc(100%); 
`
