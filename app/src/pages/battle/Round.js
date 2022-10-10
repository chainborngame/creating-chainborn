import styled from 'styled-components'
import { Box } from 'components'
import vsImage from 'images/vs.webp'

export default function Round({ round, isMyTurn, challenger, challenged, isChallengerTurn, isChallengedTurn, isRoundVisible }) {
  return (
    <Root fill>
      <Title color='accent'>
        { isRoundVisible && `ROUND ${round}` }
      </Title>
      <Img src={vsImage} alt='vs' />
      { /*isRoundVisible && <>
          <Title color='accent' margin='24px'>
            { isMyTurn
              ? `YOUR`
              : isChallengerTurn
              ? `${challenger?.name.toUpperCase()}`
              : isChallengedTurn
              ? `${challenged?.name.toUpperCase()}`
              : null
            }
          </Title>
          <Title color='accent' margin='0px'>
            TURN
          </Title>
        </>*/
      }
    </Root>
  )
}

const Root = styled(Box)`
  justify-content: center;
  align-items: center;
  margin-top: 32px;
`

const Title = styled.p`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  padding: 0 8px;
  font-style: italic;
  font-size: 45px;
  font-weight: bold;
  color: var(--color-accent);
  margin: ${props => props.margin || 'inherit'} 0px;
  /* fixes small screens */
  text-align: center;
  line-height: 1;
`

const Img = styled.img`
  max-height: 7rem;
`
