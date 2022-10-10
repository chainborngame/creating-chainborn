import { useEffect } from 'react'
import styled from 'styled-components'
import { LAYOUT_HEADER_HEIGHT } from 'shared/constants'
import { useResponsive } from 'shared/utils'

export default function Page(props) {
  const { width } = useResponsive()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [])

  if (props.landscapeOnly) {
    if (width < 480) {
      return <LandscapePageMessage />
    }
  }

  return <PageDiv {...props} />
}

const PageDiv = styled.div`
  display: ${props => props.align || props.direction ? 'flex' : 'inherit'};
  align-items: ${props => props.align ? props.align : 'inherit'};
  flex-direction: ${props => props.direction ? props.direction : 'inherit'};
  background-image: url(${props => props.image || 'inherit' });
  background-size: cover;
  width: 100%;
  height: 100%;
  min-height: ${props => props.minHeight || '100vh'};
  padding: ${props => props.pad || 'var(--spacing)'};
  padding-top: ${LAYOUT_HEADER_HEIGHT}px;
  position: relative;
  @media only screen and (max-width: 350px) {
    padding: ${props => props.pad || 'calc(var(--spacing) / 2)'};
    padding-top: ${LAYOUT_HEADER_HEIGHT}px;
  }
`

const LandscapePageMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
  animation: wiggle 2s linear infinite;
  &:before {
    content: 'Rotate deviceeeee';
  }
`
