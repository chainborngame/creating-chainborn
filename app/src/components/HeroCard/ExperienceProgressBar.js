import styled from 'styled-components'
import { Box as GBox } from 'grommet'
import { Tip } from 'components'

export default function ExperienceProgressBar({ percentage, height }) {
  return (
    <Tip text={`${percentage}% XP`}>
      <ProgressBarOuter height={`${height}px`}>
        <ProgressBarInner height={`${height}px`} percentage={percentage} />
      </ProgressBarOuter>
    </Tip>
  )
}

const ProgressBarOuter = styled(GBox)`
  position: absolute;
  bottom: 5%;
  left: 22.8%;
  width: 53.8%;
`

const ProgressBarInner = styled(GBox)`
  width: ${props => `${props.percentage}%`};
  background-color: white;
  ${props => props.percentage < 8 
    ? `border-top-left-radius: 8px;
       border-bottom-left-radius: 8px;`
    : `border-radius: 8px;`
  };
  transition: width 1000ms;
`
