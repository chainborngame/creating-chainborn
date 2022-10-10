import { useState } from 'react'
import { SizeMe } from 'react-sizeme'
import styled from 'styled-components'
import { ArrowRightIcon, ArrowLeftIcon} from '..'

function Slider({ contentWidth, children }) {
  const [ shift, setShift ] = useState(0)
  return (
    <SizeMe>
      {({ size }) => 
        <SliderRoot>
          <SlideContainer shift={shift}>
            { children }
          </SlideContainer>
          { shift > 0 &&
            <PrevButton onClick={() => setShift(prev => prev-size.width/2)}>
              <ArrowLeftIcon color='#fff'/>
            </PrevButton>
          }
          { size.width + shift < contentWidth  &&
            <NextButton onClick={() => setShift(prev => prev+size.width/2)}>
              <ArrowRightIcon color='#fff'/>
            </NextButton>
          }
        </SliderRoot>
      }
    </SizeMe>
    
  )
}

const SliderRoot = styled.div`
  position: relative;
  display: flex;
  width: 100%;
`

const SlideContainer = styled.div`
  display: flex;
  transition: transform 300ms ease 100ms;
  ${props => props.shift !== 0 &&
    `transform: translate3d(${-props.shift}px, 0, 0)`
  };
`

const Button = styled.button`
  position: absolute;
  height: 100%;
  width: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0,0,0,.4);
  border: none;
  cursor: pointer;
`

const PrevButton = styled(Button)`
  left: 0;
`

const NextButton = styled(Button)`
  right: 0;
`

export default Slider
