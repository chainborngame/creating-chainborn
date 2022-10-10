import { Img, CircleLoader, CircleError } from 'components'
import styled from 'styled-components'
import { useGetHero } from 'shared/apollo'

const size = 128

const CircleImg = styled.img`
  height: ${size}px;
  border-radius: 50%;
  border: 2px solid var(--color-secondary); 
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
  bottom: -10px;
  background-color: var(--color-secondary);
  padding: 2px 5px;
  font-size: 0.8em;
  border-radius: 5px;
  color: var(--color-accent);
`

export default function BattleRowHero({ address, name, id }) {

  const { loading, hero, error } = useGetHero({ address, id })

  return (
    <Wrapper>
      <Img 
        src={hero?.thumbnailUri} 
        size={size}
        isLoading={loading} 
        isError={error} 
        Component={CircleImg}
        ComponentLoader={CircleLoader}
        ComponentError={CircleError}
      />
      <NameBox>{name}</NameBox>
    </Wrapper>
  )
}
