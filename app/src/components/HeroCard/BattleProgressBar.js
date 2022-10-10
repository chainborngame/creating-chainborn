import styled from 'styled-components'
import { Box as GBox } from 'grommet'
import progressBarInnerImage from './images/progressbar-inner.webp'
import progressBarOuterImage from './images/progressbar-outer.webp'

export default function BattleProgressBar({ percentage, height }) {
  return (
    <ProgressBarOuter height={`${height}px`}>
      <ProgressBarInner height={`${height}px`} percentage={percentage} />
    </ProgressBarOuter>
  )
}

const ProgressBarOuter = styled(GBox)`
  margin-top: 8px;
  background-color: tomato;
  background: url(${progressBarOuterImage});
  background-size: cover;
  border: 4px solid var(--color-secondary);
  border-radius: 40px;
`

const ProgressBarInner = styled(GBox)`
  width: ${props => `${props.percentage}%`};
  background: url(${progressBarInnerImage});
  background-size: cover;
  border-radius: ${props => props.percentage === 100 ? '40px' : '8px'};
  transition: width 1000ms;
`
