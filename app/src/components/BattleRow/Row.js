import styled from 'styled-components'
import Box from '../Box'

export default function Row({ height=72, children, ...props }) {
  return (
    <Root {...props}>
      <InnerBox 
        direction='row' 
        align='center' 
        pad='medium' 
        round='small' 
        height={`${height}px`}
        background='brandLight'
      >
      { children }
      </InnerBox>  
    </Root>
  )
}

const Root = styled(Box)`
  width: 100%;
  min-height: initial; 
  margin-bottom: 80px;
  &:last-child {
    margin-bottom: 48px;
  }
`

const InnerBox = styled(Box)`
  gap: 24px;
  width: 100%;
  min-width: 240px;
  transition: box-shadow var(--transition-glow-ms);
  &:hover {
    box-shadow: -0px 0px 16px 0px rgba(0,255,224,0.75);
  }
  @media (max-width: 480px) {
    gap: 8px;
  }
`